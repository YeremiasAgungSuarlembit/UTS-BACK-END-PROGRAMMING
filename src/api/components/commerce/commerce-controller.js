const productsService = require('./commerce-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProducts(request, response, next) {
  try {
    const { page_number, page_size, sort, search } = request.query;
    const products = await productsService.getProducts();

    var results = products;
    //Search
    if (search) {
      // Split search key
      const searchKey = search.toLowerCase().split(':');

      // Filter hasil pencarian
      const searchResults = products.filter((item) => {
        return (
          item.product.toLowerCase().includes(searchKey[1]) ||
          item.price.toLowerCase().includes(searchKey[1])
        );
      });

      // Assign hasil pencarian ke results
      results = searchResults;
    }

    //Sort
    if (sort) {
      // Split sort key
      const sortKey = sort.toLowerCase().split(':');

      // Check sort key kalau ascending atau descending
      if (sortKey[1] == 'asc') {
        results = results.sort();
      }
      if (sortKey[1] == 'desc') {
        results = results.reverse();
      }
    }

    // Pagination
    if (page_number && page_size) {
      // Hitung start dan end index
      const start = (page_number - 1) * page_size;
      const end = page_number * page_size;

      // Ambil data sesuai start dan end index
      const pagedProducts = results.slice(start, end);
      const total_pages = Math.ceil(products.length / page_size);

      // Check halaman pertama
      var has_previous_page = true;
      if (page_number == 1 || page_number >= total_pages) {
        has_previous_page = false;
      }
      //Check  halaman terakhir
      var has_next_page = true;
      if (page_number >= total_pages) {
        has_next_page = false;
      }

      // Return hasil pagination
      return response.status(200).json({
        page_number: page_number,
        page_size: page_size,
        count: results.length,
        total_pages: total_pages,
        has_previous_page: has_previous_page,
        has_next_page: has_next_page,
        data: pagedProducts,
      });
    } else {
      return response.status(200).json(products);
    }
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get product detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProduct(request, response, next) {
  try {
    const product = await productsService.getProduct(request.params.id);

    if (!product) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown product');
    }

    return response.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createProduct(request, response, next) {
  try {
    const product = request.body.product;
    const price = request.body.price;
    const quantity = request.body.quantity;

    const success = await productsService.createProduct(
      product,
      price,
      quantity
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create product'
      );
    }

    return response.status(200).json({ product, price, quantity });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateProduct(request, response, next) {
  try {
    const id = request.params.id;
    const product = request.body.product;
    const price = request.body.price;
    const quantity = request.body.quantity;

    const success = await productsService.updateProduct(
      id,
      product,
      price,
      quantity
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update product'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteProduct(request, response, next) {
  try {
    const id = request.params.id;

    const success = await productsService.deleteProduct(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete product'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
