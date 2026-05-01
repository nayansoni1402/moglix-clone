const { chromium } = require('playwright');
const { createStrapi, compileStrapi } = require('@strapi/strapi');
const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');
const slugify = require('slugify');

// Base URLs
const CATEGORY_API = "https://api-gt.moglix.com/api/cms/getParentCategoryJsonBody?requestType=flyout_d";
const IMAGE_BASE_URL = "https://static.moglix.com/";

async function uploadFile(fileData, name) {
  try {
    const uploadedFiles = await strapi
      .plugin('upload')
      .service('upload')
      .upload({
        files: fileData,
        data: {
          fileInfo: {
            alternativeText: name,
            caption: name,
            name,
          },
        },
      });
    return uploadedFiles[0];
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}

async function downloadAndUploadImage(url, name) {
  if (!url) return null;
  const fullUrl = url.startsWith('http') ? url : `${IMAGE_BASE_URL}${url}`;
  try {
    const existingFile = await strapi.query('plugin::upload.file').findOne({
      where: { name: name.replace(/\..*$/, '') }
    });
    if (existingFile) return existingFile;

    const response = await fetch(fullUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const buffer = await response.arrayBuffer();
    const fileName = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
    const tempPath = path.join(__dirname, '..', '.tmp', fileName);
    
    await fs.ensureDir(path.dirname(tempPath));
    await fs.writeFile(tempPath, Buffer.from(buffer));

    const stats = fs.statSync(tempPath);
    const fileData = {
      filepath: tempPath,
      originalFileName: fileName,
      size: stats.size,
      mimetype: mime.lookup(fileName) || 'image/jpeg',
    };

    const uploaded = await uploadFile(fileData, name);
    await fs.remove(tempPath);
    return uploaded;
  } catch (error) {
    console.error(`Failed to download/upload image ${fullUrl}:`, error.message);
    return null;
  }
}

async function scrapeProductsFromPage(page, categoryUrl) {
  console.log(`Navigating to ${categoryUrl}`);
  try {
    await page.goto(categoryUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000); // Wait for products to render

    const products = await page.evaluate(() => {
      // Moglix uses complex class names, but often has specific data attributes or common patterns
      const cards = Array.from(document.querySelectorAll('.product-card, [class*="ProductCard"], .product-item'));
      return cards.map(card => {
        const titleEl = card.querySelector('.product-name, [class*="productName"], h2, h3, .name');
        const priceEl = card.querySelector('.product-price, [class*="price"], .price');
        const mrpEl = card.querySelector('.product-mrp, [class*="mrp"], .mrp');
        const imgEl = card.querySelector('img');
        const linkEl = card.querySelector('a');

        return {
          productName: titleEl?.innerText.trim(),
          salesPrice: priceEl?.innerText.replace(/[^0-9.]/g, '').replace(/,/g, ''),
          mrp: mrpEl?.innerText.replace(/[^0-9.]/g, '').replace(/,/g, ''),
          mainImageLink: imgEl?.src || imgEl?.dataset?.src,
          msn: linkEl?.href.split('/').filter(p => p).pop(),
          fullUrl: linkEl?.href, // Capture the full actual URL
          brandName: titleEl?.innerText.trim().split(' ')[0]
        };
      }).filter(p => p.productName && p.msn);
    });
    return products;
  } catch (error) {
    console.error(`Error scraping products from ${categoryUrl}:`, error.message);
    return [];
  }
}

async function processCategory(catData, page, parentId = null) {
  const catTitle = catData.title || catData.image_title || catData.general_text;
  const catUrl = catData.url || catData.image_link || catData.general_url;
  
  if (!catTitle || !catUrl) return;

  console.log(`Processing Category: ${catTitle}`);
  
  const slug = catUrl.split('/').filter(p => p).pop();
  let category;
  
  const existing = await strapi.documents('api::category.category').findFirst({
    where: { slug }
  });

  if (existing) {
    category = existing;
  } else {
    category = await strapi.documents('api::category.category').create({
      data: {
        name: catTitle,
        slug: slug,
        parent: parentId,
        publishedAt: new Date(),
      }
    });
  }

  // Check if it's a searchable category (ends with numeric ID)
  if (/\/\d+$/.test(catUrl)) {
    const fullUrl = catUrl.startsWith('http') ? catUrl : `https://www.moglix.com/${catUrl}`;
    const products = await scrapeProductsFromPage(page, fullUrl);
    console.log(`Found ${products.length} products for ${catTitle}`);

    for (const prod of products.slice(0, 10)) {
      const existingProd = await strapi.documents('api::product.product').findFirst({
        where: { externalId: prod.msn }
      });

      const productData = {
        name: prod.productName,
        slug: slugify(prod.productName, { lower: true, strict: true }),
        price: parseFloat(prod.salesPrice) || 0,
        mrp: parseFloat(prod.mrp) || 0,
        discount: prod.mrp ? Math.round(((prod.mrp - prod.salesPrice) / prod.mrp) * 100) : 0,
        externalId: prod.msn,
        url: prod.fullUrl,
        publishedAt: new Date(),
      };

      if (existingProd) {
        console.log(`  Updating Product: ${prod.productName}`);
        await strapi.documents('api::product.product').update({
          documentId: existingProd.documentId,
          data: productData,
          status: 'published'
        });
        continue;
      }

      console.log(`  Adding Product: ${prod.productName}`);
      const image = await downloadAndUploadImage(prod.mainImageLink, prod.productName);
      if (image) productData.images = [image.id];
      productData.category = category.id;

      // Ensure brand exists
      let brand;
      if (prod.brandName) {
        brand = await strapi.documents('api::brand.brand').findFirst({
          where: { name: prod.brandName }
        });
        if (!brand) {
          brand = await strapi.documents('api::brand.brand').create({
            data: { name: prod.brandName, slug: slugify(prod.brandName, { lower: true }) }
          });
        }
      }
      if (brand) productData.brand = brand.documentId;

      await strapi.documents('api::product.product').create({
        data: productData,
        status: 'published'
      });
    }
  }

  // Handle subcategories
  if (catData.data) {
    for (const subCat of catData.data.slice(0, 1)) { // Extreme limit for demonstration
      await processCategory(subCat, page, category.id);
    }
  }
  if (catData.image_general) {
    for (const leafCat of catData.image_general.slice(0, 1)) {
      await processCategory(leafCat, page, category.id);
    }
  }
}

async function main() {
  const appContext = await compileStrapi();
  global.strapi = await createStrapi(appContext).load();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ 
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    console.log("Fetching categories hierarchy...");
    const response = await fetch(CATEGORY_API);
    const json = await response.json();
    const categoriesData = json.data[0].block_data;
    
    // Process "Safety Supplies"
    const safetyCat = categoriesData["Safety_Supplies"];
    if (safetyCat) {
      await processCategory(safetyCat, page);
    }

    console.log('Scraping completed successfully!');
  } catch (error) {
    console.error('Scraping failed:', error);
  } finally {
    await browser.close();
    await strapi.destroy();
    process.exit(0);
  }
}

main();
