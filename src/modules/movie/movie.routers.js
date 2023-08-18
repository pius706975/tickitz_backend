const express = require('express')
const movieRouters = express.Router()
const {authentication, isAdmin, isUser} = require('../../middleware/auth.middleware')
const ctrl = require('./movie.controllers')
const upload = require('../../middleware/upload/multer.middleware')

movieRouters.get('', ctrl.getAllMovie)
movieRouters.get('/search', ctrl.getMovieByTitle)
movieRouters.get('/id=:movie_id', ctrl.getMovieByID)

movieRouters.post('/add', authentication, isAdmin, ctrl.addMovie)

movieRouters.put('/update/:movie_id', authentication, isAdmin, ctrl.updateMovie)
movieRouters.put('/picture/:movie_id', authentication, isAdmin, upload.single('image'), ctrl.updateMoviePicture)

movieRouters.delete('/delete/:movie_id', authentication, isAdmin, ctrl.deleteMovie)

module.exports = movieRouters 