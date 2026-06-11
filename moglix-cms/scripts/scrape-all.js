const { createStrapi, compileStrapi } = require('@strapi/strapi');
const fs = require('fs-extra');
const path = require('path');

async function main() {
  console.log('🏗️  Compiling and booting Strapi v5 environment...');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  
  app.log.level = 'error';
  global.strapi = app;

  const args = process.argv.slice(2);
  let skus = [];

  if (args.length > 0) {
    skus = args;
  } else {
    const listPath = path.join(__dirname, 'scrape-list.txt');
    if (await fs.pathExists(listPath)) {
      const content = await fs.readFile(listPath, 'utf8');
      skus = content.split('\n').map(line => line.trim()).filter(line => line.length > 0 && !line.startsWith('#'));
      console.log(`Loaded ${skus.length} SKUs from scripts/scrape-list.txt`);
    } else {
      console.log('No SKUs provided as CLI arguments, and scripts/scrape-list.txt not found.');
      console.log('Please provide SKUs as arguments: npm run scrape:all msnv5oo7jwpd56 msng9vn28dmpkp');
      console.log('Or create a scripts/scrape-list.txt file with one SKU per line.');
      await app.destroy();
      process.exit(0);
    }
  }

  const results = [];
  const processed = new Set();
  
  console.log(`Starting scraper for ${skus.length} SKUs...`);
  
  for (const sku of skus) {
    try {
      const result = await strapi.service('api::product.product').scrapeAndSaveProduct(sku, { scrapeVariants: true }, processed);
      results.push(result);
      if (result.success) {
        console.log(`✅ [${result.status ? result.status.toUpperCase() : 'SUCCESS'}] ${result.msn}: ${result.name}`);
      } else {
        console.log(`❌ [FAILED] ${result.msn}: ${result.error}`);
      }
    } catch (err) {
      console.error(`❌ Unexpected error for SKU ${sku}:`, err.message);
    }
  }

  console.log('\n✨ Scraping summary:');
  console.log(`Total: ${skus.length}`);
  console.log(`Success: ${results.filter(r => r.success && r.status !== 'skipped').length}`);
  console.log(`Skipped: ${results.filter(r => r.success && r.status === 'skipped').length}`);
  console.log(`Failed: ${results.filter(r => !r.success).length}`);

  await app.destroy();
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Root error:', error);
  process.exit(1);
});
