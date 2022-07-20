const Product = require('../Models/productM');

exports.getIndex = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render('Shop/index', {
            pageTitle: 'Shop',
            path: '/',
            prods: products,
            isAuthenticated: req.session.isLoggedin,
        })
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render('Shop/products', {
            pageTitle: 'All products',
            path: '/products', 
            prods: products,
            isAuthenticated: req.session.isLoggedin,
        })
    })
    .catch(err => err)
}

// SINGEL PRODUCT
exports.getProduct = (req, res, next) => {
    let productID = req.params.productID; 
    Product.findById(productID)
    .then(product => {
        res.render('Shop/product-details', {
            pageTitle: product.title, 
            path: '/products',
            product: product,
            isAuthenticated: req.session.isLoggedin,
        }); 
    })
    .catch(err => err)
}


exports.getCart = (req, res, next) => {
    req.user.getCart()
    .then(cart => {
        res.render('Shop/cart', {
            pageTitle: 'Cart',
            path: '/cart',
            cartProducts: cart.items,
            totalPrice: cart.totalPrice,
            isAuthenticated: req.session.isLoggedin,
        })
    })
}

exports.postCart = (req, res, next) => {
    let productID = req.body.productID;

    Product.findById(productID)
    .then(product => {
        req.user.addToCart(product)
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

// Cart
exports.postDeleteProduct = (req, res, next) => {
    let productID = req.body.productID;
    
    req.user.deleteFromCart(productID)
    .then(result => {
        // console.log(result)
        res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders()
    .then(orders => {
        res.render('Shop/orders', {
            orders: orders,
            pageTitle: 'Orders',
            path: '/orders',
            isAuthenticated: req.session.isLoggedin,
        })
    })
    .catch()
}

exports.postOrder = (req, res, next) => {
    req.user.addOrder()
    .then(result => {
        res.redirect('/orders')
    })
    .catch(err => console.log(err))
}

// exports.getCheckout = (req, res, next) => {
//     res.render('Shop/checkout', {
//         pageTitle: 'Checkout',
//         path: '/checkout'
//     })
// }