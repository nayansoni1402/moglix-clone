const { createStrapi, compileStrapi } = require('@strapi/strapi');

async function seed() {
  try {
    console.log('Starting Strapi...');
    const appContext = await compileStrapi();
    const app = await createStrapi(appContext).load();

    console.log('Seeding data...');

    // 1. Create categories
    const parentCategory = await app.documents('api::category.category').create({
      data: {
        name: 'Plumbing & Bathroom Fittings',
        slug: 'plumbing-and-bathroom-fittings'
      }
    });

    const childCategory = await app.documents('api::category.category').create({
      data: {
        name: 'Faucets',
        slug: 'faucets',
        parent: parentCategory.documentId
      }
    });

    const grandChildCategory = await app.documents('api::category.category').create({
      data: {
        name: 'Bathroom Taps',
        slug: 'bathroom-taps',
        parent: childCategory.documentId
      }
    });

    // 2. Create Brand
    const brand = await app.documents('api::brand.brand').create({
      data: {
        name: 'Fastgear',
        slug: 'fastgear'
      }
    });

    // 3. Create Product
    const product = await app.documents('api::product.product').create({
      data: {
        name: 'Fastgear Fusion Stainless Steel Long Body Tap (Pack of 8)',
        slug: 'fastgear-fusion-stainless-steel-long-body-tap-pack-of-8',
        description: `
          <p>The Fastgear Fusion bathroom tap is a perfect combination of style, functionality, and durability. Crafted with high-quality stainless steel material, this wall-mounted tap is designed to last for years to come. The sleek chrome finish adds a touch of modern elegance to any bathroom decor. The Fusion tap by Fastgear not only looks great but also offers exceptional performance.</p>
          <p>Its wall-mounted installation type ensures a clutter-free countertop and provides easy access to the tap. The ergonomically designed handle allows for smooth operation and precise control of water flow. With its high-quality construction and superior craftsmanship, the Fastgear Fusion bathroom tap is worth every penny.</p>
        `,
        price: 809,
        mrp: 3299,
        discount: 75,
        rating: 4.7,
        reviewCount: 24,
        brand: brand.documentId,
        category: grandChildCategory.documentId,
        features: `
          <ul>
            <li>Low Maintenance Build Resists Corrosion & Staining for Easy Everyday Care.</li>
            <li>Smooth Operation Ensures Effortless Water Flow Control with Reliable Functionality.</li>
            <li>Easy to Install Design Allows Quick Fitting on Standard Plumbing Setups without Hassle.</li>
            <li>Great Quality Stainless Steel Construction Offers Durability & Long-lasting Performance.</li>
            <li>Stylish Design Enhances the Look of Bathrooms, Kitchens, or Utility Areas with a Sleek Finish.</li>
          </ul>
        `,
        seo: {
          metaTitle: 'Buy Fastgear Fusion Stainless Steel Long Body Tap (Pack of 8) Online At Price ₹809',
          metaDescription: 'Buy Fastgear Fusion Stainless Steel Long Body Tap (Pack of 8) at best prices on Moglix. Explore wide range of Fastgear Bathroom Taps online.'
        },
        variants: [
          { name: 'Pack of 7', url: 'fastgear-fusion-stainless-steel-long-body-tap-pack-of-7', price: 809, mrp: 3299, discount: 75 },
          { name: 'Pack of 8', url: 'fastgear-fusion-stainless-steel-long-body-tap-pack-of-8', price: 809, mrp: 3299, discount: 75 },
          { name: 'Pack of 5', url: 'fastgear-fusion-stainless-steel-long-body-tap-pack-of-5', price: 809, mrp: 3299, discount: 75 }
        ],
        publishedAt: Date.now() // to make sure it's published
      }
    });

    console.log('Seeding successful!');
    
    await app.destroy();
  } catch (error) {
    console.error('Error during seeding:', error);
  }

  process.exit(0);
}

seed();
