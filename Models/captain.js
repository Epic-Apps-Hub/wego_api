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
const captainSchema = mongoose.Schema({
        phoneNumber: {
            type: Number,
            required: true
        },
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        photoUrl: { type: String },
        vehicleNumber: {
            type: String
        },
        identityCard: {
            type: String
        },
        vehicleType: {
            type: String
        },
        id: {
            type: String,
            unique: true,
            required: true
        },
        isActive: {
            type: Boolean,
            default: false
        },
        credit: {
            type: Number,
            default: 0
        },
        location: {
            type: pointSchema, // Point is a Mongoose model
            required: true
        },
        fcm: {
            type: String
        }
    })
    /* location: {
                            $geoWithin: {
                                $centerSphere: [
                                    [lang, lat], radius
                                ]
                            }
                        }*/
module.exports = mongoose.model('Captain', captainSchema)