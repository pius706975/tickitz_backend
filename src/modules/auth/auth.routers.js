const express = require('express')
const authRouters = express.Router()
const ctrl = require('./auth.controllers')

authRouters.post('/register', ctrl.register)
authRouters.post('/login', ctrl.login)

authRouters.get('/confirm', ctrl.verifyEmail)
authRouters.get('/resend', ctrl.resendVerification)


module.exports = authRouters