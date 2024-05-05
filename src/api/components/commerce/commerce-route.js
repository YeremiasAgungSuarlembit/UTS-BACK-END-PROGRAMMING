const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const commerceControllers = require('./commerce-controller');
const commerceValidator = require('./commerce-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/commerce', route);

  // Get list of commerce
  route.get('/', commerceControllers.getProducts);

  // Create Product
  route.post(
    '/',
    celebrate(commerceValidator.createProduct),
    commerceControllers.createProduct
  );

  // Get Product detail
  route.get('/:id', authenticationMiddleware, commerceControllers.getProduct);

  // Update Product
  route.put(
    '/:id',

    celebrate(commerceValidator.updateProduct),
    commerceControllers.updateProduct
  );

  // Delete commerce
  route.delete('/:id', commerceControllers.deleteProduct);
};
