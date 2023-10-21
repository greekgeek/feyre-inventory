// product configuration
exports = function product_config() {
  // TODO fetch from config collections.
  return {
    sellers: ['flipkart', 'meesho', 'ajio', 'amazon'],
    sizes: ["m", "xl", "s", "l"],
    status: {
      DRAFT: 0,
      CREATED: 1,
      DELETED: 2,
    }
  }
};