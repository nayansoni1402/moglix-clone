'use strict';

const fs = require('fs');
const path = require('path');

const slugify = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

async function importMroCatalog() {
  const htmlPath = 'C:\\Users\\admin\\Downloads\\youtube\\MRO_Punchout_Catalog_Interactive.html';
  
  console.log(`\n📖 Reading and parsing local MRO Catalog HTML from: ${htmlPath}`);
  if (!fs.existsSync(htmlPath)) {
    console.error(`❌ HTML Catalog file not found at: ${htmlPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(htmlPath, 'utf8');
  const match = content.match(/const CATALOG\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) {
    console.error("❌ Could not find CATALOG array in the HTML file.");
    process.exit(1);
  }

  const catalog = JSON.parse(match[1]);
  console.log(`✅ Loaded ${catalog.length} items from HTML Catalog.`);

  console.log('🔄 Cleaning up existing catalog, products, and brands databases to avoid duplicates...');
  
  // Clean products
  const existingProds = await strapi.documents('api::product.product').findMany({ limit: 10000 });
  console.log(`🗑️ Deleting ${existingProds.length} existing products...`);
  for (const p of existingProds) {
    await strapi.documents('api::product.product').delete({ documentId: p.documentId });
  }

  // Clean categories
  const existingCats = await strapi.documents('api::category.category').findMany({ limit: 10000 });
  console.log(`🗑️ Deleting ${existingCats.length} existing categories...`);
  for (const c of existingCats) {
    await strapi.documents('api::category.category').delete({ documentId: c.documentId });
  }

  // Clean brands
  const existingBrands = await strapi.documents('api::brand.brand').findMany({ limit: 10000 });
  console.log(`🗑️ Deleting ${existingBrands.length} existing brands...`);
  for (const b of existingBrands) {
    await strapi.documents('api::brand.brand').delete({ documentId: b.documentId });
  }

  const brandsMap = new Map(); // brandName -> documentId
  const parentCatsMap = new Map(); // catName -> documentId
  const subCatsMap = new Map(); // "parentCat::subCat" -> documentId

  console.log('\n🚀 Phase 1: Importing Unique Brands (Makes)...');
  const uniqueBrands = [...new Set(catalog.map(item => item.make).filter(Boolean))];
  
  for (const brandName of uniqueBrands) {
    const brandDoc = await strapi.documents('api::brand.brand').create({
      data: {
        name: brandName,
        slug: slugify(brandName),
      },
      status: 'published'
    });
    brandsMap.set(brandName, brandDoc.documentId);
  }
  console.log(`✅ Imported ${brandsMap.size} Brands successfully.`);

  console.log('\n🚀 Phase 2: Importing Categories & Subcategories tree...');
  const usedSlugs = new Set();
  const getUniqueSlug = (base) => {
    let slug = slugify(base);
    let counter = 1;
    while (usedSlugs.has(slug)) {
      slug = `${slugify(base)}-${counter}`;
      counter++;
    }
    usedSlugs.add(slug);
    return slug;
  };

  const categoryToDepartment = {
    "Bearings": "Power Transmission",
    "Power Transmission": "Power Transmission",
    "Motors & Drives": "Motors & Drives",
    "Electrical - Motors": "Motors & Drives",
    "Pipe & Fittings": "Pumps, Pipes & Valves",
    "Pumps": "Pumps, Pipes & Valves",
    "Valves": "Pumps, Pipes & Valves",
    "Pneumatics": "Pneumatics & Hydraulics",
    "Hydraulics": "Pneumatics & Hydraulics",
    "Electrical": "Electricals & Lighting",
    "Electrical - Lighting": "Electricals & Lighting",
    "Electrical - Switchgear": "Electricals & Lighting",
    "Electrical - Wiring": "Electricals & Lighting",
    "Electrical - Cables": "Electricals & Lighting",
    "Electrical - Power": "Electricals & Lighting",
    "Electrical - Earthing": "Electricals & Lighting",
    "Electrical - Instruments": "Electricals & Lighting",
    "Electrical - Panels": "Electricals & Lighting",
    "Hand Tools": "Tools & Hardware",
    "Fasteners": "Tools & Hardware",
    "Welding Supplies": "Welding Supplies",
    "Safety": "Safety & PPE",
    "Lubricants": "Industrial Supplies",
    "Filters": "Industrial Supplies",
    "Cleaning Supplies": "Industrial Supplies",
    "Instrumentation": "Industrial Supplies"
  };

  const departmentsMap = new Map();

  for (const item of catalog) {
    const parentName = item.category;
    const subName = item.subcategory;

    if (!parentName) continue;

    const deptName = categoryToDepartment[parentName] || "Industrial Supplies";

    // 1. Ensure top-level Department is created (parent = null)
    let deptDocId = departmentsMap.get(deptName);
    if (!deptDocId) {
      console.log(`🏢 Creating Department Category: "${deptName}"`);
      const deptDoc = await strapi.documents('api::category.category').create({
        data: {
          name: deptName,
          slug: getUniqueSlug(deptName),
          showOnHomepage: true,
        },
        status: 'published'
      });
      deptDocId = deptDoc.documentId;
      departmentsMap.set(deptName, deptDocId);
    }

    // 2. Ensure middle-level Category is created under the Department
    let parentDocId = parentCatsMap.get(parentName);
    if (!parentDocId) {
      console.log(`📁 Creating Category: "${parentName}" under "${deptName}"`);
      const parentDoc = await strapi.documents('api::category.category').create({
        data: {
          name: parentName,
          slug: getUniqueSlug(parentName),
          parent: deptDocId,
          showOnHomepage: false,
        },
        status: 'published'
      });
      parentDocId = parentDoc.documentId;
      parentCatsMap.set(parentName, parentDocId);
    }

    // 3. Ensure subcategory is created under the Category
    if (subName) {
      const subKey = `${parentName}::${subName}`;
      let subDocId = subCatsMap.get(subKey);
      if (!subDocId) {
        const subDoc = await strapi.documents('api::category.category').create({
          data: {
            name: subName,
            slug: getUniqueSlug(`${parentName}-${subName}`),
            parent: parentDocId,
            showOnHomepage: false,
          },
          status: 'published'
        });
        subDocId = subDoc.documentId;
        subCatsMap.set(subKey, subDocId);
      }
    }
  }
  console.log(`✅ Imported ${departmentsMap.size} Departments, ${parentCatsMap.size} Categories, and ${subCatsMap.size} Subcategories successfully.`);

  console.log('\n🚀 Phase 3: Seeding 1,161 Products with full details & relations...');
  let productCount = 0;
  
  for (const item of catalog) {
    const brandId = brandsMap.get(item.make);
    const subKey = `${item.category}::${item.subcategory}`;
    const subCatId = subCatsMap.get(subKey);
    const parentCatId = parentCatsMap.get(item.category);

    const targetCategoryId = subCatId || parentCatId; // link to subcategory if exists, else parent

    if (!targetCategoryId) continue;

    const discountVal = 20;
    const mrpVal = Math.round(item.price * 1.25);
    const ratVal = 4.0 + Math.random(); // dynamic rating 4.0-5.0

    const prodData = {
      name: item.description,
      slug: slugify(`${item.description}-${item.partno}`),
      description: `**${item.description}**\n\nHigh-quality commercial grade item designed for industrial operations. Highly reliable, certified and safe for heavy industrial environments.\n\n### Specifications\n- **Part Number:** ${item.partno}\n- **Manufacturer (Make):** ${item.make}\n- **Unit of Measure (UOM):** ${item.uom}\n- **Minimum Order Quantity (MOQ):** ${item.moq}\n- **Delivery Lead Time:** ${item.lead} Days\n- **Hazardous Material:** ${item.hazardous === 'Y' ? 'Yes (Requires special handling)' : 'No'}\n- **UNSPSC Code:** ${item.unspsc || 'N/A'}\n- **Certification:** ANSI/ISO Compliant`,
      price: item.price,
      mrp: mrpVal,
      discount: discountVal,
      rating: parseFloat(ratVal.toFixed(1)),
      reviewCount: Math.floor(Math.random() * 20) + 5,
      mainImageUrl: item.image,
      pdfUrl: item.datasheet,
      externalId: item.partno,
      brand: brandId,
      categories: [targetCategoryId],
    };

    await strapi.documents('api::product.product').create({
      data: prodData,
      status: 'published'
    });

    productCount++;
    if (productCount % 100 === 0) {
      console.log(`   📦 Seeded ${productCount}/${catalog.length} products...`);
    }
  }

  console.log(`\n🎉 SUCCESS! Fully seeded the MRO catalog!`);
  console.log(`⭐ Seeded ${brandsMap.size} Brands.`);
  console.log(`⭐ Seeded ${parentCatsMap.size} Parent Categories.`);
  console.log(`⭐ Seeded ${subCatsMap.size} Subcategories.`);
  console.log(`⭐ Seeded ${productCount} Products.`);
  console.log(`🚀 Your Moglix clone categories, subcategories, and products are now 100% dynamic!`);
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  console.log('🏗️  Compiling and booting Strapi v5 environment...');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = 'error';

  try {
    await importMroCatalog();
  } catch (error) {
    console.error('❌ Seeding process failed:', error);
    if (error.details) {
      console.error('🔍 Error Details:', JSON.stringify(error.details, null, 2));
    }
  } finally {
    await app.destroy();
    process.exit(0);
  }
}

main().catch((error) => {
  console.error('❌ Root error:', error);
  process.exit(1);
});
