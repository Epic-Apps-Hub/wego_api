//const express = require('express')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')

var express = require('express')

var app = express()

// enable files upload
app.use(
    fileUpload({
        createParentPath: true,
        limits: {
            fileSize: 2 * 1024 * 1024 * 1024 //2MB max file(s) size
        }
    })
)

app.use(express.static('uploads'))
var config = {
    hosts: ['localhost:5000']
        //'log':'trace' //handy for debugging
}

const port = 5000
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))
require('dotenv/config')
const errorHandler = require('./middleware/error')
const Order1Router = require('./Routers/order1Router')
const vehicleRouter = require('./Routers/vehicleRouter')
const userRouter = require('./Routers/usersRouter')
const distanceRoute = require('./Routers/distanceRoute')
const captainRouter = require('./Routers/captainRoute')
const notificationRoute = require('./Routers/notificationRoute')
const itemsRouter = require('./Routers/itemsRouter')
const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')
const user = require('./Models/user')
const captain = require('./Models/captain')
const order = require('./Models/order')
const vehicle = require('./Models/vehicle')
const shop = require('./Models/shop')
const asyncHandler = require('./utils/asynchandler')
const ExpressFormidable = require('express-formidable')

AdminBro.registerAdapter(AdminBroMongoose)

app.use(errorHandler)
app.use('/items', itemsRouter)
app.use('/orders', Order1Router)
app.use('/vehicles', vehicleRouter)
app.use('/users', userRouter)
app.use('/captains', captainRouter)
app.get('/', (req, res) => res.send('Hello World!'))

app.use('/distance', distanceRoute)
app.use('/notification', notificationRoute)

const run = async() => {
    const connection = await mongoose.connect(
        'mongodb+srv://mahmoud:krMlPuh0eSLL26gf@cluster0.wshxs.mongodb.net/WegoDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }
    )

    const adminModel = mongoose.model('admin', {
        email: { type: String, required: true },
        password: { type: String, required: true }
    })
    const contentParent = {
        name: 'content',
        icon: 'Accessibility',
    }
    const userParent = {
        name: 'people',
        icon: 'Person',
    }
    const adminBro = new AdminBro({
        Databases: [connection],
        rootPath: '/admin',
        resources: [{
                resource: adminModel,
                options: {
                    parent: userParent,
                }
            },
            {
                resource: user,
                options: {
                    parent: userParent,
                }
            },
            {
                resource: captain,
                options: {
                    parent: userParent,
                }
            },
            {
                resource: order,
                options: {
                    parent: contentParent,
                }
            },
            {
                resource: vehicle,
                options: {
                    parent: contentParent,
                }
            },
            {
                resource: shop,
                options: {
                    parent: contentParent,
                }
            },
        ],



        // resources: [shop, user, captain, order, vehicle]
    })
    const router = AdminBroExpress.buildRouter(adminBro
        /*, {
                cookiePassword: 'secret',
                cookieName: 'admin-bro',
                authenticate: async(email, password) => {
                    const user = await adminModel.findOne({ email: email })
                    if (user) {
                        if (user.password === password) {
                            return user
                        }
                    }
                    return null
                },
                cookieMaxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
                changePassword: async(email, password) => {
                    const user = await adminModel.findOne({ email: email })
                    if (user) {
                        user.password = password
                        await user.save()
                        return true
                    }
                    return false
                }
            }*/
    )

    app.use(adminBro.options.rootPath, router)
    app.use(
        '/createAdmin',
        asyncHandler(async(req, res) => {
            const { email, password } = req.body
            const user = await adminModel.create({ email, password })
            res.send(user)
        })
    )
    app.use(bodyParser.json({

    }))


    app.use(bodyParser.urlencoded({ extended: false }))
    app.listen(5000, () => {
        console.log('Application is up and running under localhost:3000/admin')
    })
}

run()
    /*mongoose
                        .connect(
                            'mongodb+srv://mahmoud:krMlPuh0eSLL26gf@cluster0.wshxs.mongodb.net/WegoDatabase?retryWrites=true&w=majority', {
                                useUnifiedTopology: true,
                                useNewUrlParser: true
                            }
                        )
                        .then(() => {
                            console.log('connected successfully')
                        })
                        .catch(err => {
                            console.log(err)
                        })




                        //const server = require('http').createServer(app)

                    app.listen(process.env.PORT || 5000, () =>
                        console.log(`app listening on port 5000!`)
                    )*/