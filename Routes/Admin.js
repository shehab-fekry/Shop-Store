const express = require('express');
const adminController = require('../Controllers/Admin');
const isAuth = require('../middleware/isAuthenticated').isAuth;

const routes = express.Router();

routes.get('/add-product', isAuth, adminController.getAddProduct)

routes.post('/add-product', isAuth, adminController.postAddProduct)

routes.get('/edit-product/:id', isAuth, adminController.getEditProduct)

routes.post('/edit-product', isAuth, adminController.postEditProduct)

routes.get('/products', isAuth, adminController.getProducts)

routes.post('/delete-product', isAuth, adminController.postDeleteProduct)


 
module.exports = routes;