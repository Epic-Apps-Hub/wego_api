const shop = require('../Models/shop')
const asyncHandler = require('../utils/asynchandler')
const underscore = require('underscore')
const ErrorResponse = require('../utils/errorResponse')
exports.getAllItems = asyncHandler(async(req, res, next) => {
        const items = await shop.find({
            cat: req.params.type
        })
        if (!items) {
            return next(new ErrorResponse(`coudn't load data`, 500))
        }
        res.status(200).send(items)
    })
    /*//get bootcamps within a radius
                                                    //post api/v1/bootcamps/radius/:zipcode/:distance
                                                    //access: private
                                                    exports.getBootcampsInRadius = asyncHandler(async(req, res, next) => {
                                                        const { zipcode, distance } = req.params
                                                            ///get lat and  lang from geoCoder
                                                        const loc = await geocoder.geocode(zipcode)
                                                        const lat = loc[0].latitude
                                                        const lang = loc[0].longitude

                                                        ///calc radius using radians
                                                        /// divide distance by the radius of earth
                                                        /// earth radius is: 3963 miles / 6378.1
                                                        const radius = distance / 3963
                                                        const bootcamps = await Bootcamps.find({
                                                            location: {
                                                                $geoWithin: {
                                                                    $centerSphere: [
                                                                        [lang, lat], radius
                                                                    ]
                                                                }
                                                            }
                                                        })

                                                        res.status(200).json({
                                                            success: true,
                                                            count: bootcamps.length,
                                                            data: bootcamps
                                                        })
                                                    })*/
exports.search = asyncHandler(async(req, res, next) => {
    let items
    var regex = new RegExp(req.params.q, 'i')
    var lang = Number.parseFloat(req.query.lang)
    var lat = Number.parseFloat(req.query.lat)
    var distance = Number.parseInt(req.query.maxDistance)
    console.log(req.query)
    try {
        console.log(
            underscore.isUndefined(req.query.category) +
            '+' +
            underscore.isUndefined(req.query.maxDistance)
        )
        if (
            underscore.isUndefined(req.query.category) &&
            underscore.isUndefined(req.query.maxDistance)
        ) {
            items = await shop.find({
                name: regex,
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            [lang, lat], 60000 / 3963
                        ]
                    }
                }
            })
        } else if (
            underscore.isUndefined(req.query.category) &&
            !underscore.isUndefined(req.query.maxDistance)
        ) {
            const radius = distance / 3963

            items = await shop.find({
                name: regex,
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            [lang, lat], radius
                        ]
                    }
                }
            })
        } else if (!underscore.isUndefined(req.query.category) &&
            !underscore.isUndefined(req.query.maxDistance)
        ) {
            const radius = distance / 3963
            items = await shop.find({
                cat: req.query.category,
                name: regex,
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            [lang, lat], radius
                        ]
                    }
                }
            })
        } else if (!underscore.isUndefined(req.query.category) &&
            underscore.isUndefined(req.query.maxDistance)
        ) {
            items = await shop.find({
                cat: req.query.category,
                name: regex,
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            [lang, lat], 6000 / 3963
                        ]
                    }
                }
            })
        }
    } catch (error) {
        console.log(error)
    }

    if (!items) {
        return next(new ErrorResponse('error', 404))
    }

    res.status(200).send(items)
})
exports.addItem = asyncHandler(async(req, res, next) => {
    const item = await shop.create(req.body)
    if (!item) {
        return next(new ErrorResponse(`coudn't create the item`, 400))
    }

    item.save()
    res.status(200).send(item)
})

exports.deleteItem = asyncHandler(async(req, res, next) => {
    const item = await shop.findById(req.params.id)
    if (!item) {
        return next(new ErrorResponse(`coudn't find that item`, 403))
    }

    shop.remove()
    res.status(200).json({
        success: true,
        body: {}
    })
})

exports.addCoverPhoto = asyncHandler(async(req, res, next) => {
    const item = await shop.findById(req.params.id)
    if (!item) {
        return next(
            new ErrorResponse(`boot camp not found with id : ${req.params.id}`, 404)
        )
    }
    if (!req.files) {
        return next(new ErrorResponse('please upload a file ', 404))
    }
    //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
    let photo = req.files.photo
    let logoPhoto = req.files.logoPhoto
        //Use the mv() method to place the file in upload directory (i.e. "uploads")
    photo.mv('./uploads/' + photo.name)
    logoPhoto.mv('./uploads/' + logoPhoto.name)

    await shop.findByIdAndUpdate(req.params.id, {
        coverPhotoUrl: photo.name,
        logoPhotoUrl: logoPhoto.name
    })

    res.status(200).json({
        success: true,
        data: shop
    })
})

exports.getitems = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResult)
})