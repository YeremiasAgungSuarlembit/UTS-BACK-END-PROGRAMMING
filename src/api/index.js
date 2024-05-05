const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const commerce = require('./components/commerce/commerce-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  commerce(app);

  return app;
};
