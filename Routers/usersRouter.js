const express = require('express');
const { addUser, getUserData, updateUserData } = require("../Controllers/usersController")
const userRouter = express.Router();

userRouter.route('/').post(addUser);


userRouter.route('/:id').get(getUserData).post(updateUserData)


module.exports = userRouter;