const response = require('../../libs/response')
const models = require('../cinema/cinema.models')
const ctrl = {}

ctrl.addCinema = async (req, res)=>{

    try {
        const userLogin = req.userData

        if (!userLogin) {
            return response(res, 401, 'You need to login first')
        }

        const queries = {
            cinema_name: req.body.cinema_name,
            cinema_location: req.body.cinema_location
        }

        const cinemaExists = await models.cinemaExists(queries)

        if (!req.body.cinema_name) {
            return response(res, 400, 'Cinema name cannot be empty')
        }else if (!req.body.cinema_location) {
            return response(res, 400, 'Cinema location is required')
        }else if (cinemaExists.length >= 1) {
            return response(res, 400, 'Cinema already exists')
        }

        const result = await models.addCinema(queries)

        return response(res, 200, result)
    } catch (error) {
        console.log(error);
        return response(res, 500, error) 
    }
}

ctrl.updateCinema = async (req, res)=>{

    try {
        const userLogin = req.userData
        if (!userLogin) {
            return response(res, 401, 'You need to login first')
        }
        
        const cinema_id = req.params.cinema_id
        const {cinema_name, cinema_location} = req.body

        const cinemaExists = await models.getCinemaByID({cinema_id})
        if (cinemaExists.length <= 0) {
            return response(res, 404, 'Cinema not found')
        }

        const nameUsed = await models.cinemaExists({cinema_name})
        if (nameUsed.length >= 1 && nameUsed[0].cinema_id !== cinema_id) {
            return response(res, 400, 'Cinema name is used')
        }

        const result = await models.updateCinema({cinema_id, cinema_name, cinema_location})

        return response(res, 200, result)
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.deleteCinema = async (req, res)=>{

    try {
        const result = await models.deleteCinema({cinema_id: req.params.cinema_id})

        return response(res, 200, 'Cinema has been deleted')
    } catch (error) {
        if (error.message === 'Cinema not found') {
            return response(res, 404, error.message)
        }
        return response(res, 500, error)
    }
}

ctrl.getCinemaByLocation = async (req, res)=>{

    try {
        const result = await models.getCinemaByLocation({cinema_location: req.params.cinema_location})

        return response(res, 200, result)
    } catch (error) {
        if (error.message === 'Cinema not found') {
            return response(res, 404, error.mesage)
        }
        return response(res, 500, error)
    }
}

module.exports = ctrl