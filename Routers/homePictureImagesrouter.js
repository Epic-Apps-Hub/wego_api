const express = require('express');
const homePictures = require('../Models/homePictures');
const asyncHandler = require('../utils/asynchandler');

const homePicturesRouter = express.Router();

homePicturesRouter.get('/', asyncHandler(async(req, res) => {
    const homePicturesUrls = await homePictures.find({});
    res.json(homePicturesUrls);
}))


module.exports = homePicturesRouter;