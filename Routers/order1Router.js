const express = require('express')

const Order1Router = express.Router()

const {
    addOrder,
    getUserToPerson,
    getShopToUser,
    getCaptainOrders,
    updateOrder,
    getInProgressOrders
} = require('../Controllers/order1Controller')
Order1Router.route('/add').post(addOrder)


Order1Router.route('/getUTP/:id').get(getUserToPerson)
Order1Router.route('/getSTU/:id').get(getShopToUser)
Order1Router.route('/captainOrders').post(getCaptainOrders)
Order1Router.route('/:id').put(updateOrder)
Order1Router.route('/captainOrders/:id').get(getInProgressOrders)
module.exports = Order1Router