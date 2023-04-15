const express = require('express')
const cinemaRouters = express.Router()
const {authentication, isAdmin} = require('../../middleware/auth.middleware')
const ctrl = require('../cinema/cinema.controller')

cinemaRouters.get('/:cinema_location', ctrl.getCinemaByLocation)

cinemaRouters.post('/add', authentication, isAdmin, ctrl.addCinema)

cinemaRouters.put('/update/:cinema_id', authentication, isAdmin, ctrl.updateCinema)

cinemaRouters.delete('/delete/:cinema_id', authentication, isAdmin, ctrl.deleteCinema)

module.exports = cinemaRouters