const fs = require('fs');
const path = require('path');

const htmlPath = 'C:\\Users\\admin\\Downloads\\youtube\\MRO_Punchout_Catalog_Interactive.html';

try {
  console.log(`🔍 Reading local catalog file: ${htmlPath}...`);
  const content = fs.readFileSync(htmlPath, 'utf8');
  
  // Extract the CATALOG array using regex
  const match = content.match(/const CATALOG\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) {
    console.error("❌ Could not find CATALOG array in the HTML file.");
    process.exit(1);
  }
  
  const catalog = JSON.parse(match[1]);
  console.log(`✅ Successfully loaded ${catalog.length} items from catalog!`);
  
  // Gather stats
  const categories = new Set();
  const subcategories = new Set();
  const brands = new Set();
  let hazardousCount = 0;
  
  catalog.forEach(item => {
    if (item.category) categories.add(item.category);
    if (item.subcategory) subcategories.add(item.subcategory);
    if (item.make) brands.add(item.make);
    if (item.hazardous === 'Y') hazardousCount++;
  });
  
  console.log("\n=============================================");
  console.log("📊 CATALOG OVERVIEW & STATS");
  console.log("=============================================");
  console.log(`📂 Total Categories:      ${categories.size}`);
  console.log(`🌿 Total Sub-Categories:  ${subcategories.size}`);
  console.log(`🏷️  Total Brands (Makes):   ${brands.size}`);
  console.log(`📦 Total Products:        ${catalog.length}`);
  console.log(`⚠️  Hazardous Products:    ${hazardousCount}`);
  console.log("=============================================\n");

  console.log("👀 SAMPLE PRODUCT DETAILS (FIRST 5 ITEMS):");
  console.log("---------------------------------------------");
  catalog.slice(0, 5).forEach((item, idx) => {
    console.log(`[Product #${idx + 1}]`);
    console.log(`  🔹 Name (Desc):  ${item.description}`);
    console.log(`  🔹 Part Number:  ${item.partno}`);
    console.log(`  🔹 Brand (Make): ${item.make}`);
    console.log(`  🔹 Category:     ${item.category} -> ${item.subcategory}`);
    console.log(`  🔹 Unit Price:   $${item.price} (${item.uom})`);
    console.log(`  🔹 MOQ / Lead:   ${item.moq} / ${item.lead} days`);
    console.log(`  🔹 Image URL:    ${item.image}`);
    console.log(`  🔹 Datasheet:    ${item.datasheet}`);
    console.log(`  🔹 Hazardous:    ${item.hazardous === 'Y' ? '⚠️ Yes' : '✅ No'}`);
    console.log("---------------------------------------------");
  });

  // Group by category and subcategory structure
  const structure = {};
  catalog.forEach(item => {
    const cat = item.category;
    const sub = item.subcategory;
    if (!structure[cat]) structure[cat] = new Set();
    if (sub) structure[cat].add(sub);
  });
  
  console.log("\n📂 UNIQUE CATEGORY -> SUBCATEGORY STRUCTURE:");
  console.log("---------------------------------------------");
  Object.keys(structure).sort().forEach(cat => {
    console.log(`📁 ${cat} (${structure[cat].size} sub-categories)`);
    [...structure[cat]].sort().forEach(sub => {
      console.log(`   ├── ${sub}`);
    });
  });

} catch (err) {
  console.error("❌ Error reading or parsing file:", err.message);
}
