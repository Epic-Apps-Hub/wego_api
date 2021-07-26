const express = require('express')
const asyncHandler = require('../utils/asynchandler')
var FCM = require('fcm-node')
const notification = require('../Models/notification')
const ErrorResponse = require('../utils/errorResponse')
const serverKey =
    'AAAAEF7IeAI:APA91bES-M5i8WZncE8iXenYSGQygMkoIuzGnatTb0fFuRSOmXPWcxG2EeMauZcKQ7xl333F2B-qiXFyU37Es0MVQwGf9jOwKqLVtRcbAE2S98KzYVHggEFmOvRK3zRA_Ffh237vZUaK'
var fcm = new FCM(serverKey)

const notificationRoute = express.Router()

notificationRoute.route('/:token/:uid/:title/:body').post(
    asyncHandler(async(req, res, next) => {
        var message = {
            //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: req.params.token,
            collapse_key: 'your_collapse_key',

            notification: {
                title: req.params.title,
                body: req.params.body
            },

            data: {
                //you can send only notification or only data(or include both)
                my_key: 'my value',
                my_another_key: 'my another value'
            }
        }
        await notification.create({
            fcm: req.params.token,
            userId: req.params.uid,
            title: req.params.title,
            message: req.params.body
        })
        try {
            fcm.send(message, function(err, response) {
                if (err) {
                    console.log('Something has gone wrong!')
                } else {
                    console.log('Successfully sent with response: ', response)
                }
            })
            res.status(200).send('Successfully sent push notification')
        } catch (error) {
            console.log(error)
            res.status(500).send('Something has gone wrong!')
        }
    })
)

//get user notifs
notificationRoute.route('/:token/:uid').get(
    asyncHandler(async(req, res, next) => {
        var userNotifs = await notification.find({
            fcm: req.params.token,
            userId: req.params.uid
        })
        if (!userNotifs) {
            return next(new ErrorResponse('Not found', 404))
        }
        res.status(200).send(userNotifs)
    })
)

module.exports = notificationRoute