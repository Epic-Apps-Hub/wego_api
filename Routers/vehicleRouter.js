const express = require('express')
const { getAllVehicles, editVehicle, addVehicle } = require('../Controllers/vehicleController')
const vehicleRouter = express.Router();


vehicleRouter.route('/').get(getAllVehicles).post(addVehicle);

vehicleRouter.route('/:vehicleId').put(editVehicle);

module.exports = vehicleRouter;