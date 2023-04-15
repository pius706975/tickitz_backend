const express = require('express')
const bookRouters = express.Router()
const {authentication, isUser} = require('../../middleware/auth.middleware')
const ctrl = require('../book/book.controller')

bookRouters.get('/', authentication, isUser, ctrl.getAllBooking)

bookRouters.post('/add', authentication, isUser, ctrl.addBooking)

bookRouters.delete('/cancel/:booking_id', authentication, isUser, ctrl.cancelBooking)

module.exports = bookRouters 