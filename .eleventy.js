// .eleventy.js

module.exports = function(eleventyConfig) {
  // Tell Eleventy to copy the 'public' directory to the output folder
  eleventyConfig.addPassthroughCopy("public");

  // === THIS IS THE ONLY CHANGE NEEDED ===
  // We've renamed 'admin' to 'cms', so we update the passthrough copy instruction.
  eleventyConfig.addPassthroughCopy("cms");

  // Helper filter to get unique categories from the products
  eleventyConfig.addFilter("getUniqueCategories", function(products) {
    const categories = new Set();
    // Add a check to ensure 'products' exists and is an array before looping
    if (products && Array.isArray(products)) {
      for (const product of products) {
        if (product.category) {
          categories.add(product.category);
        }
      }
    }
    return [...categories].sort();
  });

  // Helper filter to convert a string into a URL-friendly slug
  eleventyConfig.addFilter("slugify", function(str) {
    if (!str || typeof str !== 'string') {
      return '';
    }
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  });

  eleventyConfig.addFilter("hasSlug", function(arr) {
    // Add a check to ensure 'arr' exists and is an array
    if (!arr || !Array.isArray(arr)) {
      return [];
    }
    return arr.filter(item => item.slug);
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