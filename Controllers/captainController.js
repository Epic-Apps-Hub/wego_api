const Captain = require('../Models/captain')
const asyncHandler = require('../utils/asynchandler')
const ErrorResponse = require('../utils/errorResponse')

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
        res.status(200).send(cap)
    }
})