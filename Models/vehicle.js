const mongoose = require('mongoose')

const vehicleSchema = mongoose.Schema({
    name: {
        type: String
    },
    price: {
        type: Number
    }
})

module.exports = mongoose.model('Vehicle', vehicleSchema)