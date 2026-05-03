const { chromium } = require('playwright');
const { createStrapi, compileStrapi } = require('@strapi/strapi');
const fs = require('fs-extra');
const path = require('path');
const slugify = require('slugify');
const { default: PQueue } = require('p-queue');

// Constants
const CATEGORY_API = "https://api-gt.moglix.com/api/cms/getParentCategoryJsonBody?requestType=flyout_d";
const BASE_URL = "https://www.moglix.com";
const CONCURRENCY = 3; 
const PROGRESS_FILE = path.join(__dirname, 'scrape-progress.json');

let queue;
let progress = {
  processedCategories: [],
  totalProductsScraped: 0
};

async function loadProgress() {
  if (await fs.pathExists(PROGRESS_FILE)) {
    progress = await fs.readJson(PROGRESS_FILE);
    console.log(`Loaded progress: ${progress.processedCategories.length} categories.`);
  }
}

async function saveProgress() {
  await fs.writeJson(PROGRESS_FILE, progress, { spaces: 2 });
}

async function scrapeProductUrlsFromPage(page, categoryUrl, pageNum = 1) {
  const urlWithPage = pageNum === 1 ? categoryUrl : `${categoryUrl}?page=${pageNum}`;
  console.log(`  Scraping page ${pageNum}: ${urlWithPage}`);
  
  try {
    await page.goto(urlWithPage, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2000); 

    const data = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.product-card, [class*="ProductCard"], .product-item'));
      const urls = cards.map(card => card.querySelector('a')?.href).filter(Boolean);
      const nextBtn = document.querySelector('.pagination-next, [class*="next"], .next-link');
      return { urls, hasNext: !!nextBtn };
    });

    return data;
  } catch (error) {
    console.error(`Error scraping URLs from ${urlWithPage}:`, error.message);
    return { urls: [], hasNext: false };
  }
}

async function scrapeProductDetail(page, productUrl) {
  console.log(`    Scraping detail: ${productUrl}`);
  try {
    await page.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2000);

    const detail = await page.evaluate(() => {
      const getText = (sel) => document.querySelector(sel)?.innerText.trim();
      
      const extractPrice = (el) => {
        if (!el) return null;
        const text = el.innerText.replace(/,/g, '');
        const match = text.match(/₹\s*(\d+(\.\d+)?)/);
        return match ? match[1] : text.match(/(\d+(\.\d+)?)/)?.[0];
      };

      const name = getText('h1');
      const priceText = extractPrice(document.querySelector('.product-price, [class*="price"]'));
      const mrpText = extractPrice(document.querySelector('.product-mrp, [class*="mrp"]'));
      
      const ratingText = getText('.rating-value, [class*="rating"]');
      const reviewText = getText('.review-count, [class*="reviewCount"]');
      
      const img = document.querySelector('.product-main-image img, .main-image img, [class*="mainImage"] img')?.src;
      const pdf = document.querySelector('a[href$=".pdf"]')?.href;

      // Specifications
      const specs = [];
      const specContainer = document.querySelector('.product-specifications, [class*="specification"]');
      if (specContainer) {
        // Table based specs
        const rows = specContainer.querySelectorAll('table tr, .spec-table tr');
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 2) {
            specs.push({ key: cells[0].innerText.trim().replace(/:$/, ''), value: cells[1].innerText.trim() });
          }
        });

        // Div based specs (Fallback)
        if (specs.length === 0) {
          const items = specContainer.querySelectorAll('.spec-item, [class*="specItem"], .specification-item');
          items.forEach(item => {
            const key = item.querySelector('.spec-key, [class*="Key"], label')?.innerText.trim();
            const value = item.querySelector('.spec-value, [class*="Value"], span')?.innerText.trim();
            if (key && value) specs.push({ key: key.replace(/:$/, ''), value });
          });
        }
        
        // Text based parsing (Last resort structure seen in tests)
        if (specs.length === 0) {
           const lines = specContainer.innerText.split('\n').map(l => l.trim()).filter(Boolean);
           for (let i = 0; i < lines.length - 1; i++) {
             const keys = ['Brand', 'Operating Voltage', 'Power Rating', 'Technology', 'Model'];
             if (keys.some(k => lines[i].startsWith(k))) {
                specs.push({ key: lines[i], value: lines[i+1] });
                i++;
             }
           }
        }
      }

      const features = Array.from(document.querySelectorAll('.key-features ul li, .features-list li'))
        .map(li => li.innerText.trim())
        .filter(Boolean);

      const description = document.querySelector('.product-details-content, .description-content')?.innerHTML.trim();

      const variants = [];
      const variantItems = document.querySelectorAll('.product-variants .variant-item, [class*="variantItem"]');
      variantItems.forEach(item => {
        variants.push({
          name: item.innerText.trim(),
          price: 0, 
          url: item.querySelector('a')?.href || window.location.href
        });
      });

      return {
        name,
        price: priceText,
        mrp: mrpText,
        rating: ratingText,
        reviewCount: reviewText,
        mainImageUrl: img,
        pdfUrl: pdf,
        specifications: specs,
        features: features.length > 0 ? `<ul>${features.map(f => `<li>${f}</li>`).join('')}</ul>` : '',
        description,
        variants
      };
    });

    return detail;
  } catch (error) {
    console.error(`      Error scraping detail for ${productUrl}:`, error.message);
    return null;
  }
}

async function processCategoryProducts(categoryUrl, categoryId, browser) {
  const context = await browser.newContext();
  const page = await context.newPage();
  let pageNum = 1;
  let hasMore = true;

  try {
    while (hasMore) {
      const { urls, hasNext } = await scrapeProductUrlsFromPage(page, categoryUrl, pageNum);
      
      if (urls.length === 0) break;

      for (const url of urls) {
        const msn = url.split('/').filter(p => p).pop();
        
        // Check if product already exists
        let existingProduct = await strapi.documents('api::product.product').findFirst({
          where: { externalId: msn },
          populate: ['categories']
        });

        if (existingProduct) {
          console.log(`    Product ${msn} already exists. Ensuring category association.`);
          const currentCategories = existingProduct.categories || [];
          if (!currentCategories.some(c => c.documentId === categoryId)) {
            await strapi.documents('api::product.product').update({
              documentId: existingProduct.documentId,
              data: {
                categories: [...currentCategories.map(c => c.documentId), categoryId]
              },
              status: 'published'
            });
          }
          continue;
        }

        const detail = await scrapeProductDetail(page, url);
        if (!detail || !detail.name) continue;

        const cleanPrice = (val) => {
          if (typeof val === 'number') return val;
          return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
        };

        const productData = {
          name: detail.name,
          slug: slugify(detail.name, { lower: true, strict: true }) + '-' + msn,
          price: cleanPrice(detail.price),
          mrp: cleanPrice(detail.mrp),
          discount: detail.mrp ? Math.round(((cleanPrice(detail.mrp) - cleanPrice(detail.price)) / cleanPrice(detail.mrp)) * 100) : 0,
          rating: parseFloat(detail.rating) || 0,
          reviewCount: parseInt(String(detail.reviewCount).replace(/[^0-9]/g, '')) || 0,
          externalId: msn,
          url: url,
          mainImageUrl: detail.mainImageUrl,
          pdfUrl: detail.pdfUrl,
          description: detail.description,
          features: detail.features,
          specifications: detail.specifications,
          variants: detail.variants,
          categories: [categoryId],
          publishedAt: new Date(),
        };

        // Handle Brand
        const brandSpec = detail.specifications.find(s => s.key.toLowerCase().includes('brand'));
        const brandName = brandSpec ? brandSpec.value : null;
        
        if (brandName) {
          let brand = await strapi.documents('api::brand.brand').findFirst({
            where: { name: brandName }
          });
          if (!brand) {
            brand = await strapi.documents('api::brand.brand').create({
              data: { name: brandName, slug: slugify(brandName, { lower: true }) }
            });
          }
          productData.brand = brand.documentId;
        }

        try {
          await strapi.documents('api::product.product').create({
            data: productData,
            status: 'published'
          });
          progress.totalProductsScraped++;
        } catch (err) {
          console.error(`      Failed to add product ${msn}:`, err.message);
        }
        await saveProgress();
      }

      if (!hasNext || pageNum >= 20) { 
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
    console.log(`Skipping category: ${catTitle}`);
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

  if (/\/\d+$/.test(catUrl)) {
    const fullUrl = catUrl.startsWith('http') ? catUrl : `${BASE_URL}/${catUrl}`;
    await queue.add(() => processCategoryProducts(fullUrl, category.documentId, browser));
    progress.processedCategories.push(slug);
    await saveProgress();
  }

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
    const response = await fetch(CATEGORY_API);
    const json = await response.json();
    const categoriesData = json.data[0].block_data;
    
    for (const mainCatKey in categoriesData) {
      await walkCategories(categoriesData[mainCatKey], browser);
    }

    await queue.onIdle();
    console.log('Scraping completed!');
    console.log(`Total scraped: ${progress.totalProductsScraped}`);
  } catch (error) {
    console.error('Scraping failed:', error);
  } finally {
    await browser.close();
    await strapi.destroy();
    process.exit(0);
  }
}

main();
