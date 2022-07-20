const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let orderSchema = new Schema({
    items: [],
    user: {
        _id: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        email: {
            type: String,
            required: true,
        }
    }
})

module.exports = mongoose.model('Order', orderSchema)