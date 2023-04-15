const express = require('express')
const authRouters = express.Router()
const ctrl = require('./auth.controllers')
const middleware = require('../../middleware/auth.middleware')
const upload = require('../../middleware/upload.middleware')

authRouters.post('/register', ctrl.register)
authRouters.post('/login', ctrl.login)
authRouters.get('/confirm', ctrl.verifyEmail)

module.exports = authRouters