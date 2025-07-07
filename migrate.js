// migrate.js

const fs = require('fs');
const path = require('path');

console.log("Starting product migration...");

// 1. Define paths
const sourceFilePath = path.join(__dirname, '_data', 'products.json');
const outputDir = path.join(__dirname, '_data', 'products_collection');

// 2. Check if the source file exists
if (!fs.existsSync(sourceFilePath)) {
  console.error(`Error: Source file not found at ${sourceFilePath}`);
  process.exit(1);
}

// 3. Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created output directory: ${outputDir}`);
}

// 4. Read the large JSON file
const allProducts = JSON.parse(fs.readFileSync(sourceFilePath, 'utf8'));
console.log(`Found ${allProducts.length} products to migrate.`);

// 5. Loop through each product and create a new file for it
let filesCreated = 0;
allProducts.forEach(product => {
  // We need a unique filename. The 'slug' is perfect for this.
  if (!product.slug) {
    console.warn(`Skipping product due to missing slug: ${product.title}`);
    return; // Skip this product if it has no slug
  }

  const fileName = `${product.slug}.json`;
  const filePath = path.join(outputDir, fileName);
  
  // Write the product object to its own file, nicely formatted
  fs.writeFileSync(filePath, JSON.stringify(product, null, 2)); // The '2' adds nice indentation
  filesCreated++;
});

console.log(`\nMigration complete!`);
console.log(`${filesCreated} files were created in the 'products_collection' folder.`);
console.log("\nNext Steps:");
console.log("1. Verify the new files in the '_data/products_collection/' folder.");
console.log("2. You can now safely delete the original '_data/products.json' file.");
console.log("3. You can also delete this 'migrate.js' script.");