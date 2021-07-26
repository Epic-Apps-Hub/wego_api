const userModel = require('../Models/user')
const asyncHandler = require('../utils/asynchandler')
const ErrorResponse = require('../utils/errorResponse')
const errorResponse = require('../utils/errorResponse')

exports.addUser = asyncHandler(async(req, res, next) => {
    const user = await userModel.findOne({
        firebaseId: req.body.firebaseId
    })

    if (!user) {
        await userModel.create(req.body)
    }

    res.status(200).send(user)
})

exports.getUserData = asyncHandler(async(req, res, next) => {
    const user = await userModel.findOne({
        firebaseId: req.params.id
    })
    if (!user) {
        res.json({
            success: false,
            data: null
        })
    }


    res.status(200).json({ success: true, data: user })

})


exports.updateUserData = asyncHandler(async(req, res, next) => {
    const user = await userModel.findOne({
        firebaseId: req.params.id
    })

    if (!user) {
        return next(new errorResponse("coudn't get user", 401))
    }
    user.update(req.body)
    user.save()
    res.status(200).send(user)
})