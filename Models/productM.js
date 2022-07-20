const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageURL: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    }
})

module.exports = mongoose.model('Product', productSchema)