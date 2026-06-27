const { createStrapi, compileStrapi } = require('@strapi/strapi');

async function main() {
  console.log('Booting Strapi...');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  
  try {
    const documentId = 'bnjw1unojouynvhy1no4vipf';
    console.log(`Deleting product document ${documentId}...`);
    const result = await app.documents('api::product.product').delete({
      documentId: documentId
    });
    console.log('Deleted product successfully:', result);
  } catch (err) {
    console.error('Error deleting product:', err.message);
  } finally {
    await app.destroy();
  }
}

main();
