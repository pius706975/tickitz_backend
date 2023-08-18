const express = require('express')
const movieRouters = express.Router()
const middleware = require('../../middleware/auth.middleware')
const ctrl = require('./movie.controllers')
const upload = require('../../middleware/upload/multer.middleware')

movieRouters.get('', ctrl.getAllMovie)
movieRouters.get('/search', ctrl.getMovieByTitle)
movieRouters.get('/id=:movie_id', ctrl.getMovieByID)

movieRouters.post('/add', middleware.authentication, middleware.isAdmin, ctrl.addMovie)

movieRouters.put('/update/:movie_id', middleware.authentication, middleware.isAdmin, ctrl.updateMovie)
movieRouters.put('/picture/:movie_id', middleware.authentication, middleware.isAdmin, upload.single('image'), ctrl.updateMoviePicture)

movieRouters.delete('/delete/:movie_id', middleware.authentication, middleware.isAdmin, ctrl.deleteMovie)

module.exports = movieRouters 