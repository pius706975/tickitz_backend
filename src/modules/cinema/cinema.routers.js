const express = require('express')
const cinemaRouters = express.Router()
const {authentication, isAdmin, isUser} = require('../../middleware/auth.middleware')
const ctrl = require('../cinema/cinema.controller')

cinemaRouters.get('/location', ctrl.getCinemaByLocation)

cinemaRouters.post('/add', authentication, isAdmin, ctrl.addCinema)

cinemaRouters.put('/update/:cinema_id', authentication, isAdmin, ctrl.updateCinema)

cinemaRouters.delete('/:cinema_id', authentication, isAdmin, ctrl.deleteCinema)

module.exports = cinemaRouters