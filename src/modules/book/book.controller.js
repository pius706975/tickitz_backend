const response = require('../../libs/response')
const models = require('../book/book.models')
const ctrl = {}

ctrl.addBooking = async (req, res)=>{

    try {
        const userLogin = req.userData

        if (!userLogin) {
            return response(res, 401, 'You need to login first')
        }

        const schedule = req.body.schedule_id
        const price = await models.getPrice({schedule_id: schedule})
        const date = await models.getDate({schedule_id: schedule})
        const bookingDate = await models.getBookingDate({schedule_id: schedule})

        if (price.length <= 0 && date.length <= 0) {
            return response(res, 404, 'Data not found')
        }

        const queries = {
            seat: req.body.seat,
            booking_date: req.body.booking_date,
            total: req.body.seat.length * price[0].price,
            schedule_id: req.body.schedule_id,
            user_id: userLogin.user_id
        }

        const dateTime = new Date(queries.booking_date).toLocaleString('en', {timeZone: 'Asia/Hong_Kong'})
        const seat = await models.getSeat({schedule_id: schedule})

        if (seat.length > 0) {
            for (let a=0; a<seat.length; a++) {
                for (let b=0; b<seat[a].seat.length; b++) {
                    for (let c=0; c<queries.seat.length; c++) {
                        if (seat[a].seat[b] === queries.seat[c] && new Date(bookingDate[a].booking_date).toLocaleString('en', {timeZone: 'Asia/Hong_Kong'}) === dateTime) {
                            return response(res, 400, `this seat is booked`)
                        }
                    }
                }
            }
        }

        if (!queries.seat) {
            return response(res, 400, 'Seat cannot be empty')
        }else if (!queries.booking_date) {
            return response(res, 400, 'You have to choose the booking date')
        }

        const result = await models.addBooking(queries)

        return response(res, 200, result)
    } catch (error) {
        console.log(error);
        return response(res, 500, error)
    }
}

ctrl.cancelBooking = async (req, res)=>{

    try {
        const result = await models.cancelBooking({booking_id: req.params.booking_id})

        return response(res, 200, 'Booking is cancelled')
    } catch (error) {
        if (error.message === 'Data not found') {
            return response(res, 404, error.message)
        }
        return response(res, 500, error)
    }
}

ctrl.getAllBooking = async (req, res)=>{

    try {
        const result = await models.getAllBooking()

        return response(res, 200, result)
    } catch (error) {
        return response(res, 500, error)
    }
}

module.exports = ctrl