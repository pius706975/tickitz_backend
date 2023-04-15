
const ctrl = require('../user/user.controller')
const express = require('express')
const middleware = require('../../middleware/auth.middleware')
const upload = require('../../middleware/upload.middleware')
const userRouters = express.Router()

userRouters.get('/profile', middleware.authentication, ctrl.getUserProfile)
userRouters.put('/profile/update', middleware.authentication, upload.uploadFile, ctrl.updateProfile) 
userRouters.delete('/delete', middleware.authentication, ctrl.removeUser)

module.exports = userRouters