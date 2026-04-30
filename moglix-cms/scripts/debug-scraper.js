const { chromium } = require('playwright');
const { createStrapi, compileStrapi } = require('@strapi/strapi');
const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');

// Base URLs
const CATEGORY_API = "https://api-gt.moglix.com/api/cms/getParentCategoryJsonBody?requestType=flyout_d";

async function scrapeProductsFromPage(page, categoryUrl) {
  console.log(`Navigating to ${categoryUrl}`);
  try {
    await page.goto(categoryUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000); // Wait for JS to run
    
    // Check if we are on a 404 page
    const is404 = await page.evaluate(() => document.title.includes('404') || document.body.innerText.includes('Page Not Found'));
    if (is404) {
      console.log('404 Page detected');
      return [];
    }

    const products = await page.evaluate(() => {
      // Try multiple selectors
      const cards = Array.from(document.querySelectorAll('.product-card, [class*="ProductCard"], .product-item'));
      return cards.map(card => {
        const titleEl = card.querySelector('.product-name, [class*="productName"], h2, h3');
        const priceEl = card.querySelector('.product-price, [class*="price"], .price');
        const imgEl = card.querySelector('img');
        const linkEl = card.querySelector('a');

        return {
          productName: titleEl?.innerText.trim(),
          salesPrice: priceEl?.innerText.replace(/[^0-9.]/g, ''),
          mainImageLink: imgEl?.src || imgEl?.dataset?.src,
          msn: linkEl?.href.split('/').filter(p => p).pop()
        };
      }).filter(p => p.productName && p.msn);
    });
    return products;
  } catch (error) {
    console.error(`Error scraping products from ${categoryUrl}:`, error.message);
    return [];
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
    // Let's try a known working category URL first
    const testUrl = "https://www.moglix.com/safety/safety-shoes/211010000";
    const products = await scrapeProductsFromPage(page, testUrl);
    console.log(`Found ${products.length} products on test page.`);
    
    if (products.length > 0) {
      console.log('Sample product:', products[0]);
    } else {
      // Save screenshot for debugging
      await page.screenshot({ path: 'debug.png' });
      console.log('Screenshot saved to debug.png');
    }

  } catch (error) {
    console.error('Scraping failed:', error);
  } finally {
    await browser.close();
    await strapi.destroy();
    process.exit(0);
  }
}

main();
