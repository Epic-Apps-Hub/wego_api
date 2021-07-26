const express = require('express')

const Order1Router = express.Router()

const {
    addOrder,
    getUserToPerson,
    getShopToUser,
    getCaptainOrders
} = require('../Controllers/order1Controller')
Order1Router.route('/add').post(addOrder)

Order1Router.route('/getUTP/:id').get(getUserToPerson)
Order1Router.route('/getSTU/:id').get(getShopToUser)
Order1Router.route('/captainOrders').post(getCaptainOrders)
module.exports = Order1Router