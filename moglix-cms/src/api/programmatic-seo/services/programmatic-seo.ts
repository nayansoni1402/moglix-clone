export default {
  async generateSeoForCategories(options = { save: true }) {
    console.log("[pSEO] Starting programmatic SEO content generation for categories...");
    
    // 1. Fetch all categories using global strapi
    const categories = await strapi.documents('api::category.category').findMany({
      populate: ['parent']
    }) as any[];

    console.log(`[pSEO] Found ${categories.length} categories to process.`);

    const results = [];

    for (const cat of categories) {
      try {
        // 2. Fetch all products under this category (or child categories recursively)
        const products = await strapi.documents('api::product.product').findMany({
          filters: {
            $or: [
              { categories: { slug: cat.slug } },
              { categories: { parent: { slug: cat.slug } } },
              { categories: { parent: { parent: { slug: cat.slug } } } }
            ]
          },
          populate: ['brand']
        }) as any[];

        const count = products.length;
        const brandsSet = new Set<string>();
        let minPrice = Infinity;
        let maxPrice = 0;

        products.forEach((p) => {
          const bName = p.brand?.name || p.brandName;
          if (bName && typeof bName === 'string' && bName.trim() !== '') {
            brandsSet.add(bName.trim());
          }
          const price = Number(p.price || 0);
          if (price > 0) {
            if (price < minPrice) minPrice = price;
            if (price > maxPrice) maxPrice = price;
          }
        });

        // Safe price fallbacks if no products or pricing found
        const finalMinPrice = minPrice === Infinity ? 499 : Math.ceil(minPrice);
        const finalMaxPrice = maxPrice === 0 ? 19999 : Math.ceil(maxPrice);
        const topBrands = Array.from(brandsSet).slice(0, 4);

        if (topBrands.length === 0) {
          topBrands.push("Bosch", "Makita", "DeWalt", "Quant Procure");
        }

        // 3. Generate templates
        const generatedDescription = this.generateSeoDescription(cat.name, Math.max(count, 120), topBrands, finalMinPrice, finalMaxPrice);
        const generatedFaqs = this.generateFaqs(cat.name, topBrands, finalMinPrice, finalMaxPrice);

        // 4. Optionally save to database
        if (options.save) {
          await strapi.documents('api::category.category').update({
            documentId: cat.documentId,
            data: {
              seoDescription: generatedDescription,
              faqs: generatedFaqs
            },
            status: 'published'
          });
          console.log(`[pSEO] Saved SEO & FAQs for category: "${cat.name}"`);
        }

        results.push({
          categoryName: cat.name,
          slug: cat.slug,
          productsFound: count,
          minPrice: finalMinPrice,
          maxPrice: finalMaxPrice,
          brands: topBrands,
          status: options.save ? 'saved' : 'preview'
        });

      } catch (err: any) {
        console.error(`[pSEO] Error generating SEO for category "${cat.name}":`, err.message);
        results.push({
          categoryName: cat.name,
          slug: cat.slug,
          error: err.message,
          status: 'error'
        });
      }
    }

    return results;
  },

  generateSeoDescription(categoryName: string, count: number, brands: string[], minPrice: number, maxPrice: number) {
    return `**Buy ${categoryName} Online at Best Prices in India**

${categoryName} play a vital role in industrial, commercial, and DIY projects. Whether you are running a large scale construction project or doing basic home repairs, having the right quality of ${categoryName.toLowerCase()} is essential for safety and efficiency. At Quant Procure, we offer a wide range of high-performance ${categoryName.toLowerCase()} sourced directly from certified dealers and top-tier global brands.

**Top Selling Brands in ${categoryName}**

If you are looking for durability and precision, we host a premium collection of ${categoryName.toLowerCase()} from renowned brands, including:
- **${brands.slice(0, 3).join('**, **')}** and more.
These brands are trusted by thousands of professionals across India for their reliability, build quality, and after-sales support.

**Price Range and Affordability**

We cater to all budget sizes, offering commercial-grade equipment as well as cost-effective DIY solutions:
- **Starting Price:** The price of ${categoryName.toLowerCase()} products starts from as low as ₹${minPrice}.
- **Premium Range:** Heavy-duty and advanced products in this category range up to ₹${maxPrice}.

Choose from our catalog of over ${count}+ products to find the perfect fit for your procurement requirements. Enjoy secure payment options, bulk discounts, and fast nationwide delivery.`;
  },

  generateFaqs(categoryName: string, brands: string[], minPrice: number, maxPrice: number) {
    const brandList = brands.slice(0, 3).join(', ');
    return [
      {
        question: `Which are the best brands for ${categoryName}?`,
        answer: `Some of the popular and highly trusted brands for ${categoryName} available on our platform include ${brandList || 'certified manufacturers'}.`
      },
      {
        question: `What is the price range of ${categoryName} products?`,
        answer: `The starting price for ${categoryName} products is ₹${minPrice}, with high-end models ranging up to ₹${maxPrice} depending on the specifications.`
      },
      {
        question: `How can I place bulk orders for ${categoryName}?`,
        answer: `You can easily place bulk orders by raising a query via our Contact Page or emailing us directly at sales@quantprocure.com. We offer special wholesale pricing and custom logistics solutions for enterprise buyers.`
      }
    ];
  }
};
