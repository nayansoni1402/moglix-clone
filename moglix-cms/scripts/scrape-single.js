const { chromium } = require('playwright');
const { createStrapi, compileStrapi } = require('@strapi/strapi');
const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');

const IMAGE_BASE_URL = "https://static.moglix.com/";

async function uploadFile(fileData, name) {
  try {
    const uploadedFiles = await strapi.plugin('upload').service('upload').upload({
      files: fileData,
      data: { fileInfo: { name } },
    });
    return uploadedFiles[0];
  } catch (error) {
    return null;
  }
}

async function downloadAndUploadImage(url, name) {
  if (!url) return null;
  const fullUrl = url.startsWith('http') ? url : `${IMAGE_BASE_URL}${url}`;
  try {
    const response = await fetch(fullUrl);
    const buffer = await response.arrayBuffer();
    const fileName = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
    const tempPath = path.join(__dirname, '..', '.tmp', fileName);
    await fs.ensureDir(path.dirname(tempPath));
    await fs.writeFile(tempPath, Buffer.from(buffer));
    const stats = fs.statSync(tempPath);
    const fileData = { filepath: tempPath, originalFileName: fileName, size: stats.size, mimetype: mime.lookup(fileName) || 'image/jpeg' };
    const uploaded = await uploadFile(fileData, name);
    await fs.remove(tempPath);
    return uploaded;
  } catch (error) {
    return null;
  }
}

async function scrapeSingleProduct(targetUrl) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  console.log(`Scraping single product: ${targetUrl}`);
  
  await page.goto(targetUrl, { waitUntil: 'networkidle' });
  
  const prod = await page.evaluate(() => {
    const title = document.querySelector('h1')?.innerText.trim();
    const price = document.querySelector('.product-price, [class*="price"]')?.innerText.replace(/[^0-9.]/g, '');
    const mrp = document.querySelector('.product-mrp, [class*="mrp"]')?.innerText.replace(/[^0-9.]/g, '');
    const img = document.querySelector('.product-main-image img, [class*="mainImage"] img')?.src;
    const msn = window.location.href.split('/').pop();
    const brand = title?.split(' ')[0];

    return { productName: title, salesPrice: price, mrp, mainImageLink: img, msn, brandName: brand, fullUrl: window.location.href };
  });

  if (!prod.productName) {
    console.log("Failed to scrape product details.");
    await browser.close();
    return;
  }

  // Handle Brand
  let brandId = null;
  const existingBrand = await strapi.documents('api::brand.brand').findFirst({ where: { name: prod.brandName } });
  if (existingBrand) {
    brandId = existingBrand.id;
  } else {
    const newBrand = await strapi.documents('api::brand.brand').create({
      data: { name: prod.brandName, slug: prod.brandName.toLowerCase(), publishedAt: new Date() }
    });
    brandId = newBrand.id;
  }

  const image = await downloadAndUploadImage(prod.mainImageLink, prod.productName);

  await strapi.documents('api::product.product').create({
    data: {
      name: prod.productName,
      slug: prod.msn,
      price: parseFloat(prod.salesPrice) || 0,
      mrp: parseFloat(prod.mrp) || 0,
      images: image ? [image.id] : [],
      brand: brandId,
      externalId: prod.msn,
      url: prod.fullUrl,
      publishedAt: new Date(),
    }
  });

  console.log(`Successfully added: ${prod.productName}`);
  await browser.close();
}

async function main() {
  const appContext = await compileStrapi();
  global.strapi = await createStrapi(appContext).load();
  const url = "https://www.moglix.com/hikvision-ds-k1t320efwx-value-series-face-access-terminal/mp/msn858080y2492";
  await scrapeSingleProduct(url);
  await strapi.destroy();
  process.exit(0);
}

main();
