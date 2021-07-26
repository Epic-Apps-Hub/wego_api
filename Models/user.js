const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    firebaseId: {
        type: String,
        required: true
    },
    credit: {
        type: Number,
        default: 0
    },
    fcm: {
        type: String,
        default: ""
    }
})

module.exports = mongoose.model('User', userSchema)