// find-duplicates.js
const fs = require('fs');
const path = require('path');

console.log("Checking for duplicate slugs...");

const productsPath = path.join(__dirname, '_data', 'products_collection');
if (!fs.existsSync(productsPath)) {
  console.error("Error: The '_data/products_collection' directory does not exist.");
  process.exit(1);
}

const files = fs.readdirSync(productsPath);
const slugs = new Map();
let duplicatesFound = false;

files.forEach(file => {
  if (path.extname(file) === '.json') {
    try {
      const content = fs.readFileSync(path.join(productsPath, file), 'utf8');
      const product = JSON.parse(content);
      const slug = product.slug;

      if (slug) {
        if (slugs.has(slug)) {
          // We found a duplicate!
          duplicatesFound = true;
          const originalFile = slugs.get(slug);
          console.error(`\n[DUPLICATE FOUND]`);
          console.error(`  - Slug: "${slug}"`);
          console.error(`  - Is used in file: "${file}"`);
          console.error(`  - And was already seen in file: "${originalFile}"`);
        } else {
          // This is the first time we've seen this slug, so store it.
          slugs.set(slug, file);
        }
      }
    } catch (e) {
      console.warn(`Warning: Could not parse JSON in file: ${file}`);
    }
  }
});

if (!duplicatesFound) {
  console.log("\nSuccess: No duplicate slugs were found.");
} else {
    console.log("\nAction required: Please edit the duplicate files to give them unique slugs.");
}