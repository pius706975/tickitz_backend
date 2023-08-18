
const ctrl = require('../user/user.controller')
const express = require('express')
const middleware = require('../../middleware/auth.middleware')
const userRouters = express.Router()
const upload = require('../../middleware/upload/multer.middleware')

userRouters.get('/profile', middleware.authentication, ctrl.getUserProfile)

userRouters.put('/profile/update', middleware.authentication, ctrl.updateProfile) 
userRouters.put('/profile-picture', middleware.authentication, upload.single('image'), ctrl.updateProfilePicture)

userRouters.delete('/delete', middleware.authentication, ctrl.removeUser)

module.exports = userRouters