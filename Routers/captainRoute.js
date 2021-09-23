const {
    createCaptin,
    getCaptain,
    updateCaptain,
    updateCredit
} = require('../Controllers/captainController')
const express = require('express')

const captainRouter = express.Router()

captainRouter.route('/').post(createCaptin)
captainRouter
    .route('/:id')
    .get(getCaptain)
    .post(updateCaptain)
    .put(updateCredit)
module.exports = captainRouter