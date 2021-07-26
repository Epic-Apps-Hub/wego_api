const asyncHandler = require('../utils/asynchandler')
const ErrorResponse = require('../utils/errorResponse')

const vehicleModel = require('../Models/vehicle')

exports.getAllVehicles = asyncHandler(async(req, res, next) => {
    const vehicles = await vehicleModel.find({})
    if (!vehicles) {
        return next(new ErrorResponse('an error occured', 401))
    }

    res.status(200).send(vehicles)
})

exports.addVehicle = asyncHandler(async(req, res, next) => {
    const vehicle = await vehicleModel.create(req.body)
    if (!vehicle) {
        return next(new ErrorResponse('an error happened', 401))
    }

    res.status(200).send(vehicle)
})
exports.editVehicle = asyncHandler(async(req, res, next) => {
    const vehicle = await vehicleModel.findByIdAndUpdate(req.params.id, req.body)
    if (!vehicle) {
        return next(new ErrorResponse('no item with the same if were found', 404))
    }

    res.status(200).send(vehicle)
})