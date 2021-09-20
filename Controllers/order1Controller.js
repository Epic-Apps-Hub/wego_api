const Order = require('../Models/order')
const asyncHandler = require('../utils/asynchandler')
const ErrorResponse = require('../utils/errorResponse')
var FCM = require('fcm-node')
const notification = require('../Models/notification')
const serverKey =
    'AAAAEF7IeAI:APA91bES-M5i8WZncE8iXenYSGQygMkoIuzGnatTb0fFuRSOmXPWcxG2EeMauZcKQ7xl333F2B-qiXFyU37Es0MVQwGf9jOwKqLVtRcbAE2S98KzYVHggEFmOvRK3zRA_Ffh237vZUaK'
var fcm = new FCM(serverKey)
var geodist = require('geodist')
var distance = require('google-distance')
distance.apiKey = 'AIzaSyAHFcmgCyZoYYILOigaYE8G7FQCAA8vB80'
const GoogleDistanceApi = require('google-distance-api');

const util = require('util')
const captain = require('../Models/captain')
const distancePromise = options =>
    new Promise((resolve, reject) => {

        GoogleDistanceApi.distance(
                options,
                (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        console.log(result)
                        resolve(result)
                    }
                }
            )
            /*distance.get(options, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })*/

    })
    //const distancePromise = util.promisify(distance.get)

exports.addOrder = asyncHandler(async(req, res, next) => {
    const orderr = await Order.create(req.body)
    if (!orderr) {
        return next(ErrorResponse('an error occured', 401))
    }

    let data = []
    if (req.files) {
        if (req.files.photos !== null) {
            if (req.files.photos.length > 1) {
                try {
                    req.files.photos.forEach(element => {
                            element.mv('./uploads/' + element.name)

                            data.push(req.originalUrl + element.name)
                        })
                        //loop all files
                        /*  forEach(keysIn(req.files.photos), key => {
            let photo = req.files.photos[key]
            console.log(photo)

            //move photo to uploads directory
            photo.mv('./uploads/' + photo.name)

            //push file details
            data.push(photo.name)
        })*/
                } catch (err) {
                    console.log(err)
                }
            } else {
                let photo = req.files.photos
                photo.mv('./uploads/' + photo.name)
                data.push(req.originalUrl + photo.name)
            }
        }
    }

    await orderr.update({
            $push: { photos: { $each: data } }
        }) //   { $addToSet: { tags: { $each: [ "camera", "accessories" ] } } }

    await orderr.save()
    var message = {
        //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: orderr.fcm,
        collapse_key: 'your_collapse_key',

        notification: {
            title: 'تم طلب الاوردر',
            body: orderr.description
        },

        data: {
            //you can send only notification or only data(or include both)
            my_key: 'my value',
            my_another_key: 'my another value'
        }
    }
    await notification.create({
        fcm: orderr.fcm,
        userId: orderr.userId,
        title: 'تم طلب الاوردر',
        message: orderr.description
    })
    try {
        fcm.send(message, function(err, response) {
            if (err) {
                console.log('Something has gone wrong!')
            } else {
                console.log('Successfully sent with response: ', response)
            }
        })
    } catch (error) {
        console.log(error)
    }


    const captains = await captain.find({
        location: {
            $geoWithin: {
                $centerSphere: [
                    [orderr.userLat, orderr.userLng], 60000 / 3963
                ]
            }
        }
    })

    ///impliment sending message to each captain 










    res.contentType('application/json')

    res.status(200).json({
        success: true,
        data: orderr
    })
})

exports.getUserToPerson = asyncHandler(async(req, res) => {
    const orders = await Order.find({
        userId: req.params.id,
        orderType: 'fromUserToPerson'
    })
    if (!orders) {
        return next(new ErrorResponse(`coudn't get orders for this user`, 402))
    }

    res.status(200).send(orders)
})

exports.getShopToUser = asyncHandler(async(req, res, next) => {
    const orders = await Order.find({
        userId: req.params.id,
        orderType: 'fromShopToUser'
    })
    if (!orders) {
        return next(new ErrorResponse(`coudn't get orders for this user`, 402))
    }

    res.status(200).send(orders)
})

exports.updateOrder = asyncHandler(async(req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(new ErrorResponse('order not found', 404))
    }
    const newOrder = await order.update(req.body)
    if (!newOrder) {
        return next(new ErrorResponse('an error occured', 401))
    }
    res.status(200).json({
        success: true,
        data: newOrder
    })
})

/**
 * refactored code
 */
const resolveData = async(data, order, origin) => {
    const lat2 = order.userLat
    const lang2 = order.userLng

    const subData = await distancePromise(
        /*{
                origin,
                destination: `${lat2},${lang2}`
            }*/
        {
            key: 'AIzaSyAHFcmgCyZoYYILOigaYE8G7FQCAA8vB80',
            origins: [origin],
            destinations: [`${lat2},${lang2}`]
        })


    if (((subData[0].distanceValue / 1000) + (data[0].distanceValue / 1000)) < 60) {
        return {
            distanceToUser: subData[0].distanceValue,
            distanceToShop: data[0].distanceValue,
            duration: subData[0].durationValue + data[0].durationValue,
            order: order
        }
    }
}

const resolveOrder1 = async(order, origin) => {
    const lat = order.recieverLat
    const lang = order.recieverLng
    const data = await distancePromise(
        /*{
                origin: origin,
                destination: `${lat},${lang}`
            }*/
        {
            key: 'AIzaSyAHFcmgCyZoYYILOigaYE8G7FQCAA8vB80',
            origins: [origin],
            destinations: [`${lat},${lang}`]
        })
    console.log(data[0].distanceValue)
    console.log((data[0].distanceValue / 1000) < 60)
    if (data[0].distanceValue / 1000 < 60) {
        return await resolveData(data, order, origin)
    }
}

const resolveOrder2 = async(order, origin) => {
    const lat = order.shopLat
    const lang = order.shopLng

    const data = await distancePromise(
        /*{
                origin: origin,
                destination: `${lat},${lang}`,
            }*/
        {
            key: 'AIzaSyAHFcmgCyZoYYILOigaYE8G7FQCAA8vB80',
            origins: [origin],
            destinations: [`${lat},${lang}`]
        })
    console.log(data)
    if ((data[0].distanceValue / 1000) < 60) {
        return await resolveData(data, order, origin)
    }
}

exports.getCaptainOrders = asyncHandler(async(req, res, next) => {
    const origin = `${req.body.lat},${req.body.lng}`
    console.log(origin)
    const filteredOrders = []
    const orders = await Order.find({ condition: 'requested' }).sort({
        requestTime: -1
    })
    await Promise.all(
        orders.map(async order => {
            if (order.orderType == 'fromUserToPerson') {
                const validOrder = await resolveOrder1(order, origin)
                    //console.log(validOrder || 'notValid order')
                if (validOrder) filteredOrders.push(validOrder)
            } else if (order.orderType == 'fromShopToUser') {
                const validOrder = await resolveOrder2(order, origin)
                    // console.log(validOrder || 'notValid order')
                if (validOrder) filteredOrders.push(validOrder)
            }
        })
    )
    res.status(200).send(filteredOrders)
})

// exports.getCaptainOrders = asyncHandler(async (req, res, next) => {
//   const orders = await Order.find({ condition: "requested" });
//   var filtered = new Array({
//     distanceToUser: 22,
//     distanceToShop: 21,
//     duration: 2442,
//     order: orders[0],
//   });
//   await Promise.all(
//     orders.map(async (order) => {
//       if (order.orderType == "fromUserToPerson") {
//         const lat = order.recieverLat;
//         const lang = order.recieverLng;
//         const lat2 = order.userLat;
//         const lang2 = order.userLng;

//         await distance.get(
//           {
//             origin: `${req.body.lat},${req.body.lng}`,
//             destination: `${lat},${lang}`,
//           },
//           async function (err, data) {
//             let ord;
//             if (err) return console.log(err);
//             if (data.distanceValue / 1000 < 60) {
//               await distance.get(
//                 {
//                   origin: `${req.body.lat},${req.body.lng}`,
//                   destination: `${lat2},${lang2}`,
//                 },
//                 function (err, datta) {
//                   if (err) return console.log(err);
//                   console.log(
//                     datta.distanceValue / 1000 + data.distanceValue / 1000
//                   );
//                   if (
//                     datta.distanceValue / 1000 + data.distanceValue / 1000 <
//                     60
//                   ) {
//                     ord = {
//                       distanceToUser: datta.distanceValue,
//                       distanceToShop: data.distanceValue,
//                       duration: datta.durationValue + data.durationValue,
//                       order: order,
//                     };
//                     console.log(ord);

//                     filtered.push(ord);
//                   }
//                 }
//               );
//             }
//           }
//         );
//       }
//     })
//   )
//     .then((va) => {
//       res.status(200).send(filtered);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

/**/
/* else if (order.orderType == 'fromShopToUser') {
            const lat = order.shopLat
            const lang = order.shopLng
            const lat2 = order.userLat
            const lang2 = order.userLng
            let ord
            const data = await distance.get(
              {
                origin: `${req.body.lat},${req.body.lng}`,
                destination: `${lat},${lang}`
              },
              async function (err, data) {
                if (err) return console.log(err)
                if (data.distanceValue / 1000 < 60) {
                  const datta = await distance.get(
                    {
                      origin: `${req.body.lat},${req.body.lng}`,
                      destination: `${lat2},${lang2}`
                    },
                    function (err, datta) {
                      if (err) return console.log(err)
                      if (
                        datta.distanceValue / 1000 + data.distanceValue / 1000 <
                        60
                      ) {
                        ord = {
                          distanceToUser: datta.distanceValue,
                          distanceToShop: data.distanceValue,
                          duration: datta.durationValue + data.durationValue,
                          order: order
                        }
                        console.log('fromShopToUser ')
                        console.log(ord)
                        filtered.push(ord)
                      }
                    }
                  )
                }
              }
            )
          }*/