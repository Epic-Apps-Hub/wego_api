const express = require('express')
const {
    getAllItems,
    addItem,
    addCoverPhoto,
    deleteItem,

    getitems,

    search
} = require('../Controllers/itemController')
const advancedResult = require('../middleware/advancedResults')
const shop = require('../Models/shop')

const itemsRouter = express.Router({ mergeParams: true })
itemsRouter.route('/:q').get(search)
itemsRouter
    .route('/')
    .post(addItem)
    .get(advancedResult(shop), getitems)
itemsRouter.route('/category/:type').get(getAllItems)
itemsRouter
    .route('/id/:id')
    .post(addCoverPhoto)
    .delete(deleteItem)

module.exports = itemsRouter