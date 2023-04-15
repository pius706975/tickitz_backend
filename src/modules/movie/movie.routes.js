const express = require('express')
const movieRouters = express.Router()
const {authentication, isAdmin, isUser} = require('../../middleware/auth.middleware')
const {uploadFile} = require('../../middleware/upload.middleware')
const ctrl = require('../movie/movie.controllers')

movieRouters.get('', ctrl.getAllMovie)
movieRouters.get('/search/:title', ctrl.getMovieByTitle)

movieRouters.post('/add', authentication, isAdmin, uploadFile, ctrl.addMovie)

movieRouters.put('/update/:movie_id', authentication, isAdmin, uploadFile, ctrl.updateMovie)

movieRouters.delete('/delete/:movie_id', authentication, isAdmin, ctrl.deleteMovie)

module.exports = movieRouters