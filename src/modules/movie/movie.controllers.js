const multer = require('multer')
const response = require('../../libs/response')
const models = require('../movie/movie.models')
const formData = multer().none()
const uploadFile = require('../../middleware/upload/cloudinary')
const ctrl = {}

ctrl.addMovie = async (req, res)=>{

    try {
        formData(req, res, async (err)=>{
            if (err) {
                return response(res, 500, err)
            }

            const user = req.userData
            if (!user) {
                return response(res, 401, 'You need to login first')
            }

            const queries = {
                title: req.body.title,
                release_date: req.body.release_date,
                directed_by: req.body.directed_by,
                duration: req.body.duration,
                casts: req.body.casts,
                genre: req.body.genre,
                synopsis: req.body.synopsis,
                image: req.body.image ? req.body.image : process.env.DEFAULT_MOVIE_IMAGE,
                user_id: user.user_id
            }

            const movieExists = await models.movieExists(queries)

            if (!req.body.title) {
                return response(res, 400, 'Title cannot be empty')
            } else if (!req.body.release_date) {
                return response(res, 400, 'Release date cannot be empty')
            } else if (!req.body.directed_by) {
                return response(res, 400, 'Directed by cannot be empty')
            } else if (movieExists.length >= 1) {
                return response(res, 400, 'Movie already exists')
            }

            const result = await models.addMovie(queries)

            return response(res, 200, result)
        })
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.updateMovie = async (req, res)=>{

    try {
        formData(req, res, async (err)=>{
            if (err) {
                return response(res, 500, err)
            }

            const user = req.userData
            if (!user) {
                return response(res, 401, "You need to login first")
            }

            const queries = { 
                title: req.body.title, 
                release_date: req.body.release_date, 
                directed_by: req.body.directed_by, 
                duration: req.body.duration, 
                casts: req.body.casts, 
                genre: req.body.genre, 
                synopsis: req.body.synopsis,
                user_id: user.user_id,
                movie_id: req.params.movie_id
            }

            const movieExists = await models.getMovieByID(queries)
            const titleCheck = await models.movieExists(queries)
            if (movieExists.length <= 0) {
                return response(res, 404, 'Movie not found')
            } else if (titleCheck.length >= 1) {
                return response(res, 400, {message: 'Title already used'})
            }
            
            const result = await models.updateMovie(queries)

            return response(res, 200, {
                message: 'Movie updated',
                result: result
            })
        })
    } catch (error) {
        console.log(error);
        return response(res, 500, error)
    }
}

ctrl.updateMoviePicture = async (req, res)=>{
    try {
        const user = req.userData
        if (!user) {
            return response(res, 401, {message: 'You need to login first'})
        }

        const upload = await uploadFile(req.file.path, 'movieTickitz/movieImages')
        const movie_id = req.params.movie_id
        const image = upload.secure_url
        const dataExists = await models.getMovieByID({movie_id})
        if (dataExists.length <= 0) {
            return response(res, 404, {message: 'Movie not found'})
        }

        const result = await models.updateMoviePicture({image, movie_id})

        return response(res, 200, {
            message: 'Movie picture update',
            result: result
        })
    } catch (error) {
        console.log(error)
        return response(res, 500, error)
    }
}

ctrl.deleteMovie = async (req, res)=>{ 

    try {
        const user = req.userData
        if (!user) {
            return response(res, 401, {message: 'You need to login first'})
        }

        const movie_id = req.params.movie_id
        const dataExists = await models.getMovieByID({movie_id})
        if (dataExists <= 0) {
            return response(res, 404, {message: 'Movie not found'})
        }

        await models.deleteMovie({movie_id})

        return response(res, 200, {message: 'Movie has been deleted'})
    } catch (error) {
        console.log(error)
        return response(res, 500, error)
    }
}

ctrl.getAllMovie = async (req, res)=>{

    try {
        const {page, limit} = req.query
        const pagination = page? parseInt(page) : 1
        const limitation = limit? parseInt(limit) : 4
        const offset = pagination === 1 ? 0 : limitation * (pagination - 1)
        const totalMovies = await models.getTotalMovies()

        const result = await models.getAllMovie({limit: limitation, offset})

        const totalPages = Math.ceil(totalMovies / limitation)

        return response(res, 200, {
            result: result,
            totalRows: totalMovies,
            totalPages: totalPages
        })
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.getMovieByTitle = async (req, res)=>{

    try {
        const title = req.query.title
        const {page, limit} = req.query
        const pagination = page ? parseInt(page) : 1
        const limitation = limit ? parseInt(limit) : 5
        const offset = pagination === 1 ? 0 : limitation * (pagination - 1)
        const result = await models.getMovieByTitle({title: title, limit: limitation, offset})
        if (result.length <= 0) {
            return response(res, 404, {message: 'Movie not found'})
        }

        return response(res, 200, result)
    } catch (error) {
        console.log(error)
        return response(res, 500, error)
    }
}

ctrl.getMovieByID = async (req, res)=>{
    try {
        const movie_id = req.params.movie_id
        const result = await models.getMovieByID({movie_id})
        if (result.length <= 0) {
            return response(res, 404, {message: 'Movie not found'})
        }

        return response(res, 200, result)
    } catch (error) {
        console.log(error)

    }
}

module.exports = ctrl