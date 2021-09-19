const mongoose = require('mongoose')
const asyncHandler = require('../utils/asynchandler')
var FCM = require('fcm-node')
const notification = require('../Models/notification')
const serverKey =
    'AAAAEF7IeAI:APA91bES-M5i8WZncE8iXenYSGQygMkoIuzGnatTb0fFuRSOmXPWcxG2EeMauZcKQ7xl333F2B-qiXFyU37Es0MVQwGf9jOwKqLVtRcbAE2S98KzYVHggEFmOvRK3zRA_Ffh237vZUaK'
var fcm = new FCM(serverKey)

const orderSchema = mongoose.Schema({
        recieverPhone: {
            type: Number,
            default: 0
        },
        recieverLat: {
            type: Number,

            default: 0.0
        },
        recieverLng: {
            type: Number,
            default: 0.0
        },
        shopName: {
            type: String,
            default: ''
        },
        shopLat: {
            type: Number,
            default: 0.0
        },
        shopLng: { type: Number, default: 0 },
        orderType: {
            type: String,
            required: true,
            enum: ['fromUserToPerson', 'fromShopToUser']
        },
        userId: {
            type: String
        },
        userName: {
            type: String
        },
        description: {
            type: String,
            required: true
        },
        captainName: {
            type: String,
            default: ''
        },
        captainPhone: {
            type: Number,
            default: null
        },
        captainId: {
            type: String,
            default: null
        },
        userLat: {
            type: Number,
            required: true
        },
        userLng: {
            type: Number,
            required: true
        },
        userPhone: {
            type: Number,
            required: true
        },
        distance: {
            type: Number,
            default: 0.0
        },
        photos: [String],

        price: {
            type: Number,
            //    min: 100
        },
        condition: {
            type: String,

            enum: ['requested', 'accepted', 'handed', 'delivering', 'delivered'],
            default: 'requested'
        },
        vehicle: {
            type: String
        },
        requestTime: {
            type: Date,
            default: Date.now
        },
        recievingTime: {
            type: Date,
            default: null
        },
        fcm: {
            type: String,
            default: ''
        }
    })
    /*
        orderSchema.pre('save', async function(next) {
            var message = {
                //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                to: this.fcm,
                collapse_key: 'your_collapse_key',

                notification: {
                    title: 'تم طلب الاوردر',
                    body: this.description
                },

                data: {
                    //you can send only notification or only data(or include both)
                    my_key: 'my value',
                    my_another_key: 'my another value'
                }
            }
            await notification.create({
                fcm: this.fcm,
                userId: this.userId,
                title: 'تم طلب الاوردر',
                message: this.description
            })
            try {
                fcm.send(message, function(err, response) {
                    if (err) {
                        console.log('Something has gone wrong!')
                    } else {
                        console.log('Successfully sent with response: ', response)
                    }
                })
            } catch (error) {
                console.log(error)
            }
            ////add send notification using fcm messaging
        })
        */
module.exports = mongoose.model('Order', orderSchema)