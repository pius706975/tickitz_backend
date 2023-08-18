const express = require('express')
const routers = express.Router()
const auth = require('../modules/auth/auth.routers')
const user = require('../modules/user/user.router')
const movie = require('../modules/movie/movie.routers')
const cinema = require('../modules/cinema/cinema.routers')
const schedule = require('../modules/schedule/schedule.routers')
const booking = require('../modules/book/book.routers')

routers.use('/auth', auth)
routers.use('/user', user)
routers.use('/movie', movie)
routers.use('/cinema', cinema)
routers.use('/schedule', schedule)
routers.use('/book', booking)

module.exports = routers