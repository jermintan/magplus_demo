const fs = require('fs');
const path = require('path');

module.exports = () => {
  const productsPath = path.join(__dirname, 'products_collection');
  const files = fs.readdirSync(productsPath);
  
  const allProducts = [];

  files.forEach(file => {
    if (path.extname(file) === '.json') {
      const content = fs.readFileSync(path.join(productsPath, file), 'utf8');
      const data = JSON.parse(content);

      // Ensure we are only processing single product objects, not arrays of products.
      if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        allProducts.push(data);
      } else {
        console.warn(`[Data Warning] Skipping file '${file}' because it is not a single JSON object.`);
      }
    }
  });

  // Sort products by SKU to ensure a consistent order
  allProducts.sort((a, b) => (a.sku || '').localeCompare(b.sku || ''));

  // ✅ Filter out products missing a slug to prevent Eleventy build errors
  const filteredProducts = allProducts.filter(p => p.slug);

  return filteredProducts;
};
