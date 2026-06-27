const { createStrapi, compileStrapi } = require('@strapi/strapi');
const slugify = require('slugify');

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  global.strapi = app;

  console.log('Fetching all categories...');
  const categories = await strapi.documents('api::category.category').findMany({
    populate: ['parent']
  });
  
  console.log(`Found ${categories.length} categories.`);

  // Create a fast lookup map of categories by document ID
  const categoriesMap = new Map();
  for (const cat of categories) {
    categoriesMap.set(cat.documentId, cat);
  }

  // Calculate the depth of a category to process L1 -> L2 -> L3 sequentially
  const getDepth = (cat, map) => {
    let depth = 0;
    let curr = cat;
    while (curr && curr.parent) {
      depth++;
      const parentId = curr.parent.documentId || curr.parent.id;
      curr = map.get(parentId);
    }
    return depth;
  };

  // Sort categories by depth, so parent nodes are processed before child nodes
  const sortedCategories = [...categories].map(cat => ({
    cat,
    depth: getDepth(cat, categoriesMap)
  })).sort((a, b) => a.depth - b.depth);

  const usedSlugs = new Set();

  for (const { cat, depth } of sortedCategories) {
    const baseSlug = slugify(cat.name, { lower: true, strict: true });
    let slug = baseSlug;

    // Resolve duplicate slugs by prepending the parent slug if a collision occurs
    if (usedSlugs.has(slug)) {
      if (cat.parent) {
        const parentId = cat.parent.documentId || cat.parent.id;
        const parent = categoriesMap.get(parentId);
        if (parent) {
          const parentSlug = parent.resolvedSlug || slugify(parent.name, { lower: true, strict: true });
          if (parentSlug !== baseSlug) {
            slug = `${parentSlug}-${baseSlug}`;
          } else {
            slug = `${baseSlug}-sub`;
          }
        }
      }
    }

    // Fallback: If still duplicated, append sequential count
    let counter = 1;
    let finalSlug = slug;
    while (usedSlugs.has(finalSlug)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    usedSlugs.add(finalSlug);
    // Cache the final slug back onto the reference so descendants can access it
    cat.resolvedSlug = finalSlug;

    if (cat.slug !== finalSlug) {
      console.log(`Updating "${cat.name}" (depth ${depth}): "${cat.slug}" -> "${finalSlug}"`);
      await strapi.documents('api::category.category').update({
        documentId: cat.documentId,
        data: { slug: finalSlug },
        status: 'published'
      });
    } else {
      console.log(`"${cat.name}" slug already correct: "${finalSlug}"`);
    }
  }

  console.log('All category slugs successfully fixed.');
  await app.destroy();
  process.exit(0);
}

main().catch(console.error);
