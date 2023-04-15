const response = require('../../libs/response')
const models = require('../schedule/schedule.models')
const ctrl = {}

ctrl.addSchedule = async (req, res)=>{

    try {
        const userLogin = req.userData

        if (!userLogin) {
            return response(res, 401, 'You need to login first')
        }

        const queries = {
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            cinema_id: req.body.cinema_id,
            movie_id: req.body.movie_id,
            user_id: userLogin.user_id,
            price: req.body.price

        }

        const movieExists = await models.getMovieData(queries)
        const scheduleExists = await models.getScheduleData(queries)

        if (movieExists <= 0) {
            return response(res, 404, 'Movie not found')
        }else if (!req.body.cinema_id) {
            return response(res, 400, 'Cinema ID is required')
        }else if (!req.body.movie_id) {
            return response(res, 400, 'Movie ID is required')
        }else if (scheduleExists.length >= 1) {
            return response(res, 400, 'Schedule already exists')
        }

        const result = await models.addSchedule(queries)

        return response(res, 200, result)
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.updateSchedule = async (req, res)=>{

    try {
        const userLogin = req.userData

        if (!userLogin) {
            return response(res, 401, 'you need to login first')
        }

        const schedule_id = req.params.schedule_id
        const {start_date, end_date, cinema_id, movie_id, price} = req.body
        const user_id = userLogin.user_id

        const scheduleExists = await models.getScheduleByID({schedule_id})

        if (scheduleExists.length <= 0) {
            return response(res, 404, 'Schedule not found')
        }

        const result = await models.updateSchedule({schedule_id, start_date, end_date, cinema_id, movie_id, price, user_id})

        return response(res, 200, result)
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.deleteSchedule = async (req, res)=>{

    try {
        const scheduleID = req.params.schedule_id

        const scheduleExists = await models.getScheduleByID({schedule_id: scheduleID})
        
        if (scheduleExists.length <= 0) {
            return response(res, 404, 'Schedule not found')
        }

        const isDeleted = await models.deleteSchedule({schedule_id: scheduleID})

        return response(res, 200, 'Schedule has been deleted')
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.getAllSchedule = async (req, res)=>{

    try {
        const result = await models.getAllSchedule()
        
        if (result.length <= 0) {
            return response(res, 404, 'Schedule not found')
        }

        return response(res, 200, result)
    } catch (error) {
        console.log(error);
        return response(res, 500, error)
    }
}

ctrl.getScheduleByName = async (req, res)=>{

    try {
        const result = await models.getScheduleByName({cinema_name: req.params.cinema_name})

        return response(res, 200, result)
    } catch (error) {
        if (error.message === 'Schedule not found') {
            return response(res, 404, error.message)
        }
        return response(res, 500, error)
    }
}

module.exports = ctrl