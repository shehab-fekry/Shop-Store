const Product = require('../Models/productM');

exports.getAddProduct = (req, res, next) => {
    res.render('Admin/edit-product', {
        pageTitle: 'Add Product', 
        path: '/admin/add-product',
        editMode: false,
        product: {},
        isAuthenticated: req.session.isLoggedin,
    })
}

exports.postAddProduct = (req, res, next) => {
    const {title, imageURL, price, description} = req.body;
    product = new Product({
        title: title,
        price: price,
        description: description,
        imageURL: imageURL,
        userId: req.user._id,
    });
    
    product.save()
    .then(result => {
        res.redirect('/')
    })
    .catch(err => err)
}

exports.getEditProduct = (req, res, next) => {
    let editMode = req.query.editing;
    let productID = req.params.id;

    Product.findById(productID)
    .then(product => {
        res.render('Admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '',
            editMode: Boolean(editMode),
            product: product,
            isAuthenticated: req.session.isLoggedin,
        })
    })
    .catch(err => err)
}

exports.postEditProduct = (req, res, next) => {
    const {title, imageURL, price, description, id} = req.body;
    Product.findById(id)
    .then(product => {
        product.title = title;
        product.price = price;
        product.description = description;
        product.imageURL = imageURL;
        return product.save()
    })
    .then(result => {
        res.redirect('/admin/products');
    })
    .catch(err => err)
}

exports.postDeleteProduct = (req, res, next) => {
    let productID = req.body.id;
    Product.findByIdAndDelete(productID)
    .then(result => {
        res.redirect('/admin/products');
    })
    .catch(err => err)
}

exports.getProducts = (req, res, next) => {
    Product.find({userId: req.user._id})
    .then(products => {
        res.render('Admin/products', {
            pageTitle: 'Admin Products',
            path: '/admin/products', 
            prods: products,
            isAuthenticated: req.session.isLoggedin,
        })
    })
    .catch(err => err)
}
