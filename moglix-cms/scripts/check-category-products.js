const { createStrapi, compileStrapi } = require('@strapi/strapi');

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  global.strapi = app;

  console.log('Querying products in category 211196531...');
  const products = await strapi.documents('api::product.product').findMany({
    filters: {
      categories: { slug: '211196531' }
    },
    populate: ['images']
  });

  for (const p of products) {
    console.log(`Product: ID=${p.id}, docId=${p.documentId}, Name=${p.name}`);
    console.log(`  mainImageUrl: ${p.mainImageUrl}`);
    if (p.images && p.images.length > 0) {
      console.log('  Images:');
      for (const img of p.images) {
        console.log(`    - ID=${img.id}, url=${img.url}`);
      }
    } else {
      console.log('  No images linked.');
    }
  }

  await app.destroy();
  process.exit(0);
}

main().catch(console.error);
