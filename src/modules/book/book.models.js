const db = require('../../database/config/config')
const models = {}

models.addBooking = ({seat, booking_date, total, schedule_id, user_id})=>{

    return new Promise((resolve, reject)=>{
        db.query('INSERT INTO booking (seat, booking_date, total, schedule_id, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', [seat, booking_date, total, schedule_id, user_id])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.bookingExists = ({booking_id})=>{

    return new Promise((resolve, reject)=>{
        db.query('SELECT * FROM booking WHERE booking_id=$1', [booking_id])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.cancelBooking = ({booking_id})=>{

    return new Promise((resolve, reject)=>{
        db.query('DELETE FROM booking WHERE booking_id=$1', [booking_id])
        .then((res)=>{
            if (res.rowCount == 0) {
                reject(new Error('Data not found'))
            }else {
                db.query('DELETE FROM booking WHERE booking_id=$1', [booking_id])
                .then((res)=>{
                    resolve(res.rows)
                }).catch((err)=>{
                    reject(err)
                })
            }
        })
    })
}

models.getAllBooking = ()=>{

    return new Promise((resolve, reject)=>{
        db.query('SELECT * FROM booking')
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.getPrice = ({schedule_id})=>{

    return new Promise((resolve, reject)=>{
        db.query('SELECT price from booking RIGHT JOIN schedules USING (schedule_id) WHERE schedule_id=$1', [schedule_id])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.getDate = ({schedule_id})=>{

    return new Promise((resolve, reject)=>{
        db.query('SELECT start_date, end_date FROM booking RIGHT JOIN schedules USING (schedule_id) WHERE schedule_id=$1', [schedule_id])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.getBookingDate = ({schedule_id})=>{

    return new Promise((resolve, reject)=>{
        db.query('SELECT booking_date FROM booking WHERE schedule_id=$1', [schedule_id])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.getSeat = ({schedule_id})=>{

    return new Promise((resolve, reject)=>{
        db.query('SELECT seat FROM booking WHERE schedule_id=$1', [schedule_id])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

module.exports = models