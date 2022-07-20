const express = require('express');
const shopControllers = require('../Controllers/Shop');
const isAuth = require('../middleware/isAuthenticated').isAuth;

const routes = express.Router();

routes.get('/', shopControllers.getIndex)

routes.get('/products', shopControllers.getProducts)

routes.get('/products/:productID', isAuth, shopControllers.getProduct)

routes.get('/cart', isAuth, shopControllers.getCart)

routes.get('/orders', isAuth, shopControllers.getOrders)

routes.post('/cart', isAuth, shopControllers.postCart)

routes.post('/delete-product', isAuth, shopControllers.postDeleteProduct)

routes.post('/create-order', isAuth, shopControllers.postOrder)

// routes.get('/checkout', shopControllers.getCheckout)

module.exports = routes;