const Captain = require('../Models/captain')
const asyncHandler = require('../utils/asynchandler')
const ErrorResponse = require('../utils/errorResponse')
var FCM = require('fcm-node')
const notification = require('../Models/notification')
const serverKey =
    'AAAAEF7IeAI:APA91bES-M5i8WZncE8iXenYSGQygMkoIuzGnatTb0fFuRSOmXPWcxG2EeMauZcKQ7xl333F2B-qiXFyU37Es0MVQwGf9jOwKqLVtRcbAE2S98KzYVHggEFmOvRK3zRA_Ffh237vZUaK'
var fcm = new FCM(serverKey)
exports.createCaptin = asyncHandler(async(req, res, next) => {
    let cap
    console.log(req.body)
    const captin = await Captain.findOne({ id: req.body.id })
    if (!captin) {
        const captain = await Captain.create({
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            email: req.body.email,
            fcm: req.body.fcm,
            identityCard: req.body.identityCard,
            vehicleType: req.body.vehicleType,
            vehicleNumber: req.body.vehicleNumber,
            fullName: req.body.fullName,
            phoneNumber: req.body.phoneNumber,
            location: {
                type: 'Point',
                coordinates: [req.body.latitude, req.body.longitude]
            }
        })

        let photo
        if (req.files) {
            if (req.files.photo !== null) {
                photo = req.files.photo
                photo.mv('./uploads/' + photo.name)
                await captain.update({ photoUrl: photo.name })
                captain.save()
                cap = captain
            }
        }
    } else {
        return next(new ErrorResponse('user already exists', 500))
    }

    res.status(200).send(cap)
})

exports.getCaptain = asyncHandler(async(req, res, next) => {
    const cap = await Captain.findOne({
        id: req.params.id
    })

    if (!cap) {
        res.json({
            success: false,
            data: null
        })
    } else {
        res.status(200).json({ success: true, data: cap })
    }
})

exports.updateCaptain = asyncHandler(async(req, res, next) => {
    const cap = await Captain.findOne({
        id: req.params.id
    })

    if (!cap) {
        return next(new ErrorResponse("coudn't find user", 403))
    } else {
        await cap.update(req.body)
        await cap.save()
        if (req.body.credit) {
            var message = {
                //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                to: cap.fcm,
                collapse_key: 'your_collapse_key',

                notification: {
                    title: "تحديث الرصيد",
                    body: `تم تغيير الرصيد\nرصيدك الحالي ${req.body.credit} MRU`
                },

                data: {
                    //you can send only notification or only data(or include both)
                    my_key: 'my value',
                    my_another_key: 'my another value'
                }
            }
            await notification.create({
                fcm: cap.fcm,
                userId: cap.id,
                title: "تحديث الرصيد",
                message: `تم تغيير الرصيد\nرصيدك الحالي ${req.body.credit} MRU`
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
        }
        res.status(200).send(cap)
    }
})



exports.updateCredit = asyncHandler(async(req, res, next) => {
    var number = req.body.number

    const cap = await Captain.findOne({
        id: req.params.id
    })


    if (!cap) {
        return next(new ErrorResponse("coudn't find user", 403))
    } else {
        await cap.update({
            credit: cap.credit + number
        })
        await cap.save()
        res.status(200).send(cap)
    }
})