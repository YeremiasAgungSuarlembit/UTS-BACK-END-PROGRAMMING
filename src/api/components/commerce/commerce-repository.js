const { Product } = require('../../../models');

/**
 * Get a list of products
 * @returns {Promise}
 */
async function getProducts() {
  return Product.find({});
}

/**
 * Get product detail
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function getProduct(id) {
  return Product.findById(id);
}

/**
 * Create new product
 * @param {string} product - Product name
 * @param {number} price - Product price
 * @param {number} quantity - Product quantity
 * @returns {Promise}
 */
async function createProduct(product, price, quantity) {
  return Product.create({
    product,
    price,
    quantity,
  });
}

/**
 * Update existing product
 * @param {string} id - Product ID
 * @param {string} product - Product name
 * @param {number} price - Product price
 * @param {number} quantity - Product quantity
 * @returns {Promise}
 */
async function updateProduct(id, product, price, quantity) {
  return Product.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        product,
        price,
        quantity,
      },
    }
  );
}

/**
 * Delete a product
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function deleteProduct(id) {
  return Product.deleteOne({ _id: id });
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
