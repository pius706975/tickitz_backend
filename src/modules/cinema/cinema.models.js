const db = require('../../database/config')
const models = {}

models.addCinema = ({cinema_name, cinema_location})=>{

    return new Promise((resolve, reject)=>{
        db.query('INSERT INTO cinema (cinema_name, cinema_location) VALUES ($1, $2) RETURNING *', [cinema_name, cinema_location])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.updateCinema = ({cinema_name, cinema_location, cinema_id})=>{

    return new Promise((resolve, reject)=>{
        db.query('SELECT * FROM cinema WHERE cinema_id=$1', [cinema_id])
        .then((res)=>{
            const cinema = res.rows[0]

            if (!cinema) {
                reject(new Error('Cinema not found'))
            }else {
                const cinemaName = cinema_name ? cinema_name : cinema.cinema_name
                const cinemaLocation = cinema_location ? cinema_location : cinema.cinema_location
                
                const query = 'UPDATE cinema SET cinema_name=$1, cinema_location=$2, updated_at=now() WHERE cinema_id=$3 RETURNING *'

                db.query(query, [cinemaName, cinemaLocation, cinema_id])
                .then((res)=>{
                    resolve(res.rows[0])
                }).catch((err)=>{
                    reject(err)
                })
            }
        })
    })
}

models.deleteCinema = ({cinema_id})=>{

    return new Promise((resolve, reject)=>{
        db.query('DELETE FROM cinema WHERE cinema_id=$1', [cinema_id])
        .then((res)=>{
            if (res.rowCount == 0) {
                reject(new Error('Movie not found'))
            }else {
                db.query('DELETE FROM cinema WHERE cinema_id=$1', [cinema_id])
                .then((res)=>{
                    resolve(res.rows)
                }).catch((err)=>{
                    reject(err)
                })
            }
        })
    })
}

models.cinemaExists = ({cinema_name})=>{

    return new Promise((resolve, reject)=>{
        db.query('SELECT * FROM cinema WHERE cinema_name ILIKE $1', [cinema_name])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.getCinemaByLocation = ({cinema_location})=>{

    return new Promise((resolve, reject)=>{
        let query = 'SELECT * FROM cinema WHERE cinema_location ILIKE $1 ORDER BY cinema_id'

        db.query(query, [`%${cinema_location}%`])
        .then((res)=>{
            if (res.rowCount === 0) {
                reject(new Error('Cinema not found'))
            }else {
                db.query(query, [`%${cinema_location}%`])
                .then((res)=>{
                    resolve(res.rows)
                }).catch((err)=>{
                    reject(err)
                })
            }
        })
    })
}

models.getCinemaByID = ({cinema_id})=>{

    return new Promise((resolve, reject)=>{
        db.query('SELECT * FROM cinema WHERE cinema_id=$1', [cinema_id])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

module.exports = models