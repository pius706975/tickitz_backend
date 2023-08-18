const multer = require('multer')
const response = require('../../libs/response')
const models = require('../cinema/cinema.models')
const ctrl = {}
const formData = multer().none()

ctrl.addCinema = async (req, res)=>{

    try {
        formData(req, res, async (err)=>{
            if (err) {
                return response(res, 500, err)
            }

            const user = req.userData
            if (!user) {
                return response(res, 401, {message: 'You need to login first'})
            }
    
            const queries = {
                cinema_name: req.body.cinema_name,
                cinema_location: req.body.cinema_location
            }
    
            const cinemaExists = await models.cinemaExists(queries)
    
            if (!req.body.cinema_name) {
                return response(res, 400, {message: 'Cinema name cannot be empty'})
            }else if (!req.body.cinema_location) {
                return response(res, 400, {message: 'Cinema location cannot be empty'})
            }else if (cinemaExists.length >= 1) {
                return response(res, 400, {message: 'Cinema already exists'})
            }
    
            const result = await models.addCinema(queries)
    
            return response(res, 200, result)
        })
    } catch (error) {
        console.log(error);
        return response(res, 500, error) 
    }
}

ctrl.updateCinema = async (req, res)=>{

    try {
        formData(req, res, async (err)=>{
            if (err) {
                return response(res, 500, err)
            }

            const user = req.userData
            if (!user) {
                return response(res, 401, {message: 'You need to login first'})
            }

            const queries = {
                cinema_name: req.body.cinema_name,
                cinema_location: req.body.cinema_location,
                cinema_id: req.params.cinema_id
            }

            const nameUsed = await models.cinemaExists(queries)
            const cinemaExists = await models.getCinemaByID(queries)
            if (!req.body.cinema_name) {
                return response(res, 400, {message: 'Cinema name cannot be empty'})
            } else if (nameUsed.length >= 1) {
                return response(res, 400, {message: 'Cinema name is used'})
            } else if (cinemaExists.length <= 0) {
                return response(res, 404, {message: 'Cinema not found'})
            }

            const result = await models.updateCinema(queries)

            return response(res, 200, result)
        })
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.deleteCinema = async (req, res)=>{

    try {
        const user = req.userData
        if (!user) {
            return response(res, 401, {message: 'You need to login first'})
        }

        const cinema_id = req.params.cinema_id
        const result = await models.getCinemaByID({cinema_id})
        if (result.length <= 0) {
            return response(res, 404, {message: 'cinema not found'})
        }

        await models.deleteCinema({cinema_id})

        return response(res, 200, {message: 'Cinema has been deleted'})
    } catch (error) {
        console.log(error)
        return response(res, 500, error)
    }
}

ctrl.getCinemaByLocation = async (req, res)=>{

    try {
        const cinema_location = req.query.cinema_location
        const result = await models.getCinemaByLocation({cinema_location: cinema_location})
        if (result.length <= 0) {
            return response(res, 404, {message: 'Location not found'})
        }

        return response(res, 200, result)
    } catch (error) {
        console.log(error)
        return response(res, 500, error)
    }
}

module.exports = ctrl