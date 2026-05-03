const { chromium } = require('playwright');
const { createStrapi, compileStrapi } = require('@strapi/strapi');
const fs = require('fs-extra');
const path = require('path');
const slugify = require('slugify');
const { default: PQueue } = require('p-queue');

// Constants
const CATEGORY_API = "https://api-gt.moglix.com/api/cms/getParentCategoryJsonBody?requestType=flyout_d";
const BASE_URL = "https://www.moglix.com";
const CONCURRENCY = 5; // Adjust based on system resources
const PROGRESS_FILE = path.join(__dirname, 'scrape-progress.json');

let queue;
let progress = {
  processedCategories: [],
  processedProducts: [],
  totalProductsScraped: 0
};

async function loadProgress() {
  if (await fs.pathExists(PROGRESS_FILE)) {
    progress = await fs.readJson(PROGRESS_FILE);
    console.log(`Loaded progress: ${progress.processedCategories.length} categories, ${progress.processedProducts.length} products.`);
  }
}

async function saveProgress() {
  await fs.writeJson(PROGRESS_FILE, progress, { spaces: 2 });
}

async function scrapeProductsFromPage(page, categoryUrl, pageNum = 1) {
  const urlWithPage = pageNum === 1 ? categoryUrl : `${categoryUrl}?page=${pageNum}`;
  console.log(`  Scraping page ${pageNum}: ${urlWithPage}`);
  
  try {
    await page.goto(urlWithPage, { waitUntil: 'domcontentloaded', timeout: 60000 });
    // Wait for either products to load or "no products" message
    await page.waitForTimeout(3000); 

    const data = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.product-card, [class*="ProductCard"], .product-item'));
      const products = cards.map(card => {
        const titleEl = card.querySelector('.product-name, [class*="productName"], h2, h3, .name');
        const priceEl = card.querySelector('.product-price, [class*="price"], .price');
        const mrpEl = card.querySelector('.product-mrp, [class*="mrp"], .mrp');
        const imgEl = card.querySelector('img');
        const linkEl = card.querySelector('a');

        // Robust price extraction: take only the first match to avoid concatenating multiple prices
        const extractPrice = (el) => {
          if (!el) return null;
          const text = el.innerText.replace(/,/g, '');
          const match = text.match(/\d+(\.\d+)?/);
          return match ? match[0] : null;
        };

        return {
          productName: titleEl?.innerText.trim(),
          salesPrice: extractPrice(priceEl),
          mrp: extractPrice(mrpEl),
          mainImageLink: imgEl?.src || imgEl?.dataset?.src,
          msn: linkEl?.href.split('/').filter(p => p).pop(),
          fullUrl: linkEl?.href,
          brandName: titleEl?.innerText.trim().split(' ')[0]
        };
      }).filter(p => p.productName && p.msn);

      // Check if there's a "Next" button or more pages
      const nextBtn = document.querySelector('.pagination-next, [class*="next"], .next-link');
      const hasNext = !!nextBtn;
      
      return { products, hasNext };
    });

    return data;
  } catch (error) {
    console.error(`Error scraping ${urlWithPage}:`, error.message);
    return { products: [], hasNext: false };
  }
}

async function processCategoryProducts(categoryUrl, categoryId, browser) {
  const context = await browser.newContext();
  const page = await context.newPage();
  let pageNum = 1;
  let hasMore = true;

  try {
    while (hasMore) {
      const { products, hasNext } = await scrapeProductsFromPage(page, categoryUrl, pageNum);
      
      if (products.length === 0) break;

      console.log(`    Found ${products.length} products on page ${pageNum}`);

      for (const prod of products) {
        if (progress.processedProducts.includes(prod.msn)) continue;

        const productData = {
          name: prod.productName,
          slug: slugify(prod.productName, { lower: true, strict: true }) + '-' + prod.msn,
          price: parseFloat(prod.salesPrice) || 0,
          mrp: parseFloat(prod.mrp) || 0,
          discount: prod.mrp ? Math.round(((prod.mrp - prod.salesPrice) / prod.mrp) * 100) : 0,
          externalId: prod.msn,
          url: prod.fullUrl,
          mainImageUrl: prod.mainImageLink,
          category: categoryId,
          publishedAt: new Date(),
        };

        // Handle Brand
        if (prod.brandName) {
          let brand = await strapi.documents('api::brand.brand').findFirst({
            where: { name: prod.brandName }
          });
          if (!brand) {
            brand = await strapi.documents('api::brand.brand').create({
              data: { name: prod.brandName, slug: slugify(prod.brandName, { lower: true }) }
            });
          }
          productData.brand = brand.documentId;
        }

        try {
          await strapi.documents('api::product.product').create({
            data: productData,
            status: 'published'
          });
          progress.processedProducts.push(prod.msn);
          progress.totalProductsScraped++;
        } catch (err) {
          if (err.message.includes('unique constraint')) {
            progress.processedProducts.push(prod.msn);
          } else {
            console.error(`      Failed to add product ${prod.msn}:`, err.message);
          }
        }
      }

      await saveProgress();
      
      if (!hasNext || pageNum >= 50) { // Limit to 50 pages per category to avoid infinite loops
        hasMore = false;
      } else {
        pageNum++;
      }
    }
  } finally {
    await context.close();
  }
}

async function walkCategories(catData, browser, parentId = null) {
  const catTitle = catData.title || catData.image_title || catData.general_text;
  const catUrl = catData.url || catData.image_link || catData.general_url;
  
  if (!catTitle || !catUrl) return;

  const slug = catUrl.split('/').filter(p => p).pop();
  
  if (progress.processedCategories.includes(slug)) {
    console.log(`Skipping already processed category: ${catTitle}`);
    return;
  }

  console.log(`Processing Category: ${catTitle}`);
  
  let category = await strapi.documents('api::category.category').findFirst({
    where: { slug }
  });

  if (!category) {
    category = await strapi.documents('api::category.category').create({
      data: {
        name: catTitle,
        slug: slug,
        parent: parentId,
        publishedAt: new Date(),
      }
    });
  }

  // If it's a leaf category (has numeric ID in URL), scrape products
  if (/\/\d+$/.test(catUrl)) {
    const fullUrl = catUrl.startsWith('http') ? catUrl : `${BASE_URL}/${catUrl}`;
    await queue.add(() => processCategoryProducts(fullUrl, category.documentId, browser));
    progress.processedCategories.push(slug);
    await saveProgress();
  }

  // Subcategories
  if (catData.data) {
    for (const subCat of catData.data) {
      await walkCategories(subCat, browser, category.documentId);
    }
  }
  if (catData.image_general) {
    for (const leafCat of catData.image_general) {
      await walkCategories(leafCat, browser, category.documentId);
    }
  }
}

async function main() {
  const appContext = await compileStrapi();
  global.strapi = await createStrapi(appContext).load();

  await loadProgress();
  
  queue = new PQueue({ concurrency: CONCURRENCY });
  const browser = await chromium.launch({ headless: true });

  try {
    console.log("Fetching categories hierarchy...");
    const response = await fetch(CATEGORY_API);
    const json = await response.json();
    const categoriesData = json.data[0].block_data;
    
    // Process each main category
    for (const mainCatKey in categoriesData) {
      await walkCategories(categoriesData[mainCatKey], browser);
    }

    await queue.onIdle();
    console.log('Scraping completed successfully!');
    console.log(`Total products scraped: ${progress.totalProductsScraped}`);
  } catch (error) {
    console.error('Scraping failed:', error);
  } finally {
    await browser.close();
    await strapi.destroy();
    process.exit(0);
  }
}

main();
