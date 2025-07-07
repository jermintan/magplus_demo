// .eleventy.js

module.exports = function(eleventyConfig) {
  // Tell Eleventy to copy the 'public' directory to the output folder
  eleventyConfig.addPassthroughCopy("public");

  // Helper filter to get unique categories from the products
  eleventyConfig.addFilter("getUniqueCategories", function(products) {
    const categories = new Set();
    for (const product of products) {
      if (product.category) {
        categories.add(product.category);
      }
    }
    return [...categories].sort();
  });

  // Helper filter to convert a string into a URL-friendly slug
  eleventyConfig.addFilter("slugify", function(str) {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};