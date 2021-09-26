const mongoose = require('mongoose')
const receiptSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true,
        required: true
    },
    deliveryCost: {
        type: Number,
        required: true
    },
    totalCost: {
        type: Number,
        required: true
    },
    requestCost: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('Receipt', receiptSchema)