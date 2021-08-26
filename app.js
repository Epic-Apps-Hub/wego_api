//const express = require('express')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const morgan = require('morgan')
const itemsRouter = require('./Routers/itemsRouter')
const bodyParser = require('body-parser');

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

const port = process.env.PORT
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

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
mongoose
    .connect("mongodb+srv://mahmoud:krMlPuh0eSLL26gf@cluster0.wshxs.mongodb.net/WegoDatabase?retryWrites=true&w=majority", {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(() => {
        console.log('connected successfully')
    })
    .catch(err => {
        console.log(err)
    })

app.use('/items', itemsRouter)
app.use('/orders', Order1Router)
app.use('/vehicles', vehicleRouter)
app.use('/users', userRouter)
app.use('/captains', captainRouter)

app.use('/distance', distanceRoute)
app.use('/notification', notificationRoute)

app.get('/', (req, res) => res.send('Hello World!'))
app.use(errorHandler)
    //const server = require('http').createServer(app)

app.listen(5000, () => console.log(`Example app listening on port 5000!`))