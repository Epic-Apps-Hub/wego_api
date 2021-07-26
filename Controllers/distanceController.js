const asyncHandler = require('../utils/asynchandler')
var distance = require('google-distance')
distance.apiKey = 'AIzaSyAHFcmgCyZoYYILOigaYE8G7FQCAA8vB80'
const ErrorResponse = require('../utils/errorResponse')


exports.getDistance = asyncHandler(async(req, res, next) => {

    const data = await distance.get({
            origin: req.params.latlng1,
            destination: req.params.latlng2
        },
        function(err, data) {
            if (err) return console.log(err)

            console.log(data)
            res.status(200).send(data)

        }
    )

})