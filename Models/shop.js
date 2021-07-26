const mongoose = require('mongoose')
const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
})
const shopSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: pointSchema,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        max: 5
    },
    logoPhotoUrl: {
        type: String
    },
    coverPhotoUrl: {
        type: String
    },
    isOpen: {
        type: Boolean,
        default: true
    },

    times: {
        type: String
    },
    description: {
        type: String
    },
    cat: {
        type: String,
        required: true,
        enum: ['pharmacy', 'baker', 'supermarket', 'resturant']
    },
    discount: {
        type: String,
        default: '0%'
    }
})

module.exports = mongoose.model('Shop', shopSchema)