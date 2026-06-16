const { createStrapi, compileStrapi } = require('@strapi/strapi');

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  global.strapi = app;

  const msn = 'msno5wnjeg8w51';
  console.log(`Querying product ${msn}...`);
  const p = await strapi.documents('api::product.product').findFirst({
    filters: { externalId: msn },
    populate: ['categories']
  });

  if (p) {
    console.log(`Product found: ID=${p.id}, docId=${p.documentId}, Name=${p.name}`);
    console.log('Categories linked to product:');
    if (p.categories) {
      for (const cat of p.categories) {
        console.log(`  - ID=${cat.id}, docId=${cat.documentId}, Name=${cat.name}, Slug=${cat.slug}`);
      }
    } else {
      console.log('  No categories relation linked.');
    }
  } else {
    console.log(`Product with SKU/MSN ${msn} not found.`);
  }

  await app.destroy();
  process.exit(0);
}

main().catch(console.error);
