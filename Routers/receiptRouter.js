const express = require('express')
const Receipt = require('../Models/receipt')
const asyncHandler = require('../utils/asynchandler')
const receiptRotuer = express.Router()

receiptRotuer.get(
    '/:orderId',
    asyncHandler(async(req, res, next) => {
        const orderId = req.params.orderId
        const receipt = await Receipt.findOne({
            orderId: orderId
        })
        res.json({
            receipt: receipt
        })
    })
)


receiptRotuer.post(
        '/',
        asyncHandler(async(req, res, next) => {
            const receipt = await Receipt.create(req.body)
            res.json({
                receipt: receipt
            })
        })


        module.exports = receiptRotuer