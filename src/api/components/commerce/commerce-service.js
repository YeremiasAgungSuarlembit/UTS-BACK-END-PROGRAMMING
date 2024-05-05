const commerceRepository = require('./commerce-repository');

/**
 * Get list of products
 * @returns {Array}
 */
async function getProducts() {
  const products = await commerceRepository.getProducts();

  const results = [];
  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    results.push({
      id: product.id,
      product: product.product,
      price: product.price,
      quantity: product.quantity,
    });
  }

  return results;
}

/**
 * Get product detail
 * @param {string} id - Product ID
 * @returns {Object}
 */
async function getProduct(id) {
  const product = await commerceRepository.getProduct(id);

  // Product not found
  if (!product) {
    return null;
  }

  return {
    id: product.id,
    product: product.product,
    price: product.price,
    quantity: product.quantity,
  };
}

/**
 * Create new product
 * @param {string} product - Product name
 * @param {string} price - Product price
 * @param {string} quantity - Product quantity
 * @returns {boolean}
 */
async function createProduct(product, price, quantity) {
  try {
    await commerceRepository.createProduct(product, price, quantity);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing product
 * @param {string} id - Product ID
 * @param {string} product - Product name
 * @param {string} price - Product price
 * @param {string} quantity - Product quantity
 * @returns {boolean}
 */
async function updateProduct(id, product, price, quantity) {
  const existingProduct = await commerceRepository.getProduct(id);

  // Product not found
  if (!existingProduct) {
    return null;
  }

  try {
    await commerceRepository.updateProduct(id, product, price, quantity);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete product
 * @param {string} id - Product ID
 * @returns {boolean}
 */
async function deleteProduct(id) {
  const existingProduct = await commerceRepository.getProduct(id);

  // Product not found
  if (!existingProduct) {
    return null;
  }

  try {
    await commerceRepository.deleteProduct(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
