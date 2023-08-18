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
        const userLogin = req.userData
        if (!userLogin) {
            return response(res, 401, "You need to login first")
        }


        let image
        
        if (req.file) {
            image = req.file.filename
        }else {
            const movieData = await models.getMovieByID({movie_id})
            image = movieData[0].image 
        }
        
        const movie_id = req.params.movie_id
        const { title, release_date, directed_by, duration, casts, genre, synopsis} = req.body
        const user_id = userLogin.user_id

        const movieExists = await models.getMovieByID({movie_id})
        if (movieExists.length <= 0) {
            if (req.file) fs.unlinkSync(`public/${image}`)
            return response(res, 404, 'Movie not found')
        }

        const titleUsed = await models.movieExists({title})
        if (titleUsed.length >= 1 && titleUsed[0].movie_id !== movie_id) {
            if (req.file) fs.unlinkSync(`public/${image}`)
            return response(res, 400, 'Title is used')
        }
        
        const result = await models.updateMovie({movie_id, title, release_date, directed_by, duration, casts, genre, synopsis, image, user_id})

        return response(res, 200, result)
    } catch (error) {
        console.log(error);
        return response(res, 500, error)
    }
}

ctrl.deleteMovie = async (req, res)=>{ 

    try {
        const result = await models.deleteMovie({movie_id: req.params.movie_id})

        return response(res, 200, 'Movie has been deleted')
    } catch (error) {
        if (error.message === 'Movie not found') {
            return response(res, 404, error.message)
        }
        return response(res, 500, error)
    }
}

ctrl.getAllMovie = async (req, res)=>{

    try {
        const {page, limit} = req.query
        const pagination = page? parseInt(page) : 1
        const limitation = limit? parseInt(limit) : 4
        const offset = pagination === 1 ? 0 : limitation * (pagination - 1)

        const result = await models.getAllMovie({limit: limitation, offset})

        return response(res, 200, result)
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.getMovieByTitle = async (req, res)=>{

    try {
        const title = req.params.title
        const {page, limit} = req.query
        const pagination = page? parseInt(page) : 1
        const limitation = limit? parseInt(limit) : 4
        const offset = pagination === 1 ? 0 : limitation * (pagination - 1)

        const result = await models.getMovieByTitle({limit: limitation, offset}, title)

        return response(res, 200, result)
    } catch (error) {
        if (error.message === 'Movie not found') {
            return response(res, 404, error.message)
        }
        return response(res, 500, error)
    }
}

module.exports = ctrl