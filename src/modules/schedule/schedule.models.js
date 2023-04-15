const db = require('../../database/config')
const models = {}

models.addSchedule = ({start_date, end_date, cinema_id, movie_id, user_id, price})=>{
    
    return new Promise((resolve, reject)=>{
        db.query('INSERT INTO schedules (start_date, end_date, cinema_id, movie_id, user_id, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [start_date, end_date, cinema_id, movie_id, user_id, price])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.updateSchedule = ({start_date, end_date, cinema_id, movie_id, user_id, price, schedule_id})=>{

    return new Promise((resolve, reject)=>{
        db.query('SELECT * FROM schedules WHERE schedule_id=$1', [schedule_id])
        .then((res)=>{
            const schedule = res.rows[0]

            if (!schedule) {
                reject(new Error('Schedule not found'))
            }else {
                const startDate = start_date ? start_date : schedule.start_date
                const endDate = end_date ? end_date : schedule.end_date
                const cinemaID = cinema_id ? cinema_id : schedule.cinema_id
                const movieID = movie_id ? movie_id : schedule.movie_id
                const userID = user_id ? user_id : schedule.user_id
                const thePrice = price ? price : schedule.price

                const query = 'UPDATE schedules SET start_date=$1, end_date=$2, cinema_id=$3, movie_id=$4, user_id=$5, price=$6, updated_at=now() WHERE schedule_id=$7 RETURNING *'

                db.query(query, [startDate, endDate, cinemaID, movieID, userID, thePrice, schedule_id])
                .then((res)=>{
                    resolve(res.rows)
                }).catch((err)=>{
                    reject(err)
                })
            }
        })
    })
}

models.deleteSchedule = ({schedule_id})=>{

    return new Promise((resolve, reject)=>{
        db.query('DELETE FROM schedules WHERE schedule_id=$1', [schedule_id])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.getAllSchedule = ()=>{

    return new Promise((resolve, reject)=>{
        db.query('SELECT schedule_id, title, duration, cinema_name, cinema_location, start_date, end_date, price FROM schedules LEFT JOIN movies USING (movie_id) LEFT JOIN cinema USING (cinema_id)')
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.getScheduleByName = ({cinema_name})=>{

    return new Promise((resolve, reject)=>{
        let query = 'SELECT schedule_id, title, duration, cinema_name, cinema_location, start_date, end_date, price FROM schedules LEFT JOIN movies USING (movie_id) LEFT JOIN cinema USING (cinema_id) WHERE cinema_name ILIKE $1'

        db.query(query, [`%${cinema_name}%`])
        .then((res)=>{
            if (res.rowCount == 0) {
                reject(new Error('Schedule not found'))
            }else {
                db.query(query, [`%${cinema_name}%`])
                .then((res)=>{
                    resolve(res.rows)
                }).catch((err)=>{
                    reject(err)
                })
            }
        })
    })
}

models.getScheduleByID = ({schedule_id})=>{

    return new Promise((resolve, reject)=>{
        db.query('SELECT * FROM schedules WHERE schedule_id=$1', [schedule_id])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.getMovieData = ({movie_id})=>{

    return new Promise((resolve, reject)=>{
        db.query('SELECT * FROM schedules RIGHT JOIN movies USING (movie_id) WHERE movie_id=$1', [movie_id])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.getScheduleData = ({cinema_id, movie_id})=>{

    return new Promise((resolve, reject)=>{
        db.query('SELECT * FROM schedules WHERE cinema_id=$1 AND movie_id=$2', [cinema_id, movie_id])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

module.exports = models