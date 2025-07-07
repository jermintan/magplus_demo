// _data/products.js
const fs = require('fs');
const path = require('path');

module.exports = () => {
  const productsPath = path.join(__dirname, 'products_collection');
  const files = fs.readdirSync(productsPath);
  
  const products = files.map(file => {
    if (path.extname(file) === '.json') {
      const content = fs.readFileSync(path.join(productsPath, file), 'utf8');
      return JSON.parse(content);
    }
  }).filter(Boolean); // Filter out any non-JSON files or undefined results

  return products;
};