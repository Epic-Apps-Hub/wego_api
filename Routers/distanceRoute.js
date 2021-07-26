var distance = require('google-distance')
const express = require('express')
const { getDistance } = require('../Controllers/distanceController')

const distanceRoute = express.Router()

distanceRoute.route('/:latlng1/:latlng2').get(getDistance)


module.exports = distanceRoute;