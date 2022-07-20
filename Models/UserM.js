const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./productM')
const Order = require('./OrderM')

let userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        items: [{
            productID: {type: mongoose.Types.ObjectId, ref: 'Product', required: true}, 
            quantity: {type: Number, required: true}
        }],
        totalPrice: {
            type: Number,
        },
    },
    token: String,
    tokenExpirationDate: Date,
})

userSchema.methods.addToCart = function (product) {
    let updatedCart;
    updatedCart = {
        items: this.cart.items ? this.cart.items : [], 
        totalPrice: this.cart.totalPrice ? this.cart.totalPrice : 0
    }

    let product_index = updatedCart.items.findIndex(cp => {
        return cp.productID.toString() == product._id.toString()
    })

    if(product_index >= 0)
    updatedCart.items[product_index].quantity += 1
    else
    updatedCart.items.push({productID: product._id, quantity: 1})
    
    updatedCart.totalPrice += Number(product.price)
    this.cart = updatedCart;
    return this.save()
}

userSchema.methods.getCart = function () {
    let cart = {items:[], totalPrice: 0}

    return Product.find()
    .then(products => {
        this.cart.items.map(item => {
            products.forEach(product => {
                if(item.productID.toString() == product._id.toString())
                {
                    cart.items.push({...product._doc, quantity: item.quantity})
                    cart.totalPrice += parseInt(product.price) * item.quantity
                }
            });
        })
        // console.log(cart)
        return cart
    })
    .catch(err => console.log(err))
}

userSchema.methods.deleteFromCart = function(id) {
    let updatedCartItems = this.cart.items.filter(item => {return item.productID.toString() !== id.toString()})
    this.cart = {items: [], totalPrice: 0}

    return Product.find()
    .then(products => {
        updatedCartItems.forEach(item => {
            products.forEach(product => {
                if(item.productID.toString() == product._id.toString())
                {
                    this.cart.items.push(item)
                    this.cart.totalPrice += parseInt(product.price) * item.quantity
                }
            })
        })
        return this.save()
    })
    .catch(err => console.log(err))
}

userSchema.methods.addOrder = function () {
    let orderProducts = []

    return Product.find()
    .then(products => {
        this.cart.items.forEach(item => {
            products.forEach(product => {
                if(item.productID.toString() == product._id.toString()){
                    orderProducts.push({...product._doc, quantity: item.quantity})
                }
            })
        })

        let order = {
            items: orderProducts,
            user:{
                _id: this._id,
                email: this.email,
            },
        }

        this.cart = {items:[], totalPrice: 0}
        this.save()
        return Order.create(order)
    })
}

userSchema.methods.getOrders = function () {
    return Order.find({'user._id': this._id})
}

module.exports = mongoose.model('User', userSchema)