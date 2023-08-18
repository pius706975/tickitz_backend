const db = require('../../database/config/config')
const models = {}

models.addCinema = ({cinema_name, cinema_location})=>{

    return new Promise((resolve, reject)=>{
        db.query(`
            SELECT * FROM cinema
            WHERE cinema_name ILIKE $1`,
            [`%${cinema_name}%`])
        .then((res)=>{
            if (res.rowCount > 0) {
                reject(new Error('Cinema already exists'))
            } else {
                db.query(`
                    INSERT INTO cinema (cinema_name, cinema_location) 
                    VALUES ($1, $2) 
                    RETURNING *`, 
                    [cinema_name, cinema_location])
                .then((res)=>{
                    resolve(res.rows)
                }).catch((err)=>{
                    reject(err)
                })
            }
        })
    })
}

models.updateCinema = ({cinema_name, cinema_location, cinema_id})=>{

    return new Promise((resolve, reject)=>{
        db.query(`
            UPDATE cinema 
            SET cinema_name = COALESCE($1, cinema_name), 
                cinema_location = COALESCE($2, cinema_location)
            WHERE cinema_id = $3 
            RETURNING *`, 
            [cinema_name, cinema_location, cinema_id])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.deleteCinema = ({cinema_id})=>{

    return new Promise((resolve, reject)=>{
        db.query(`
            DELETE FROM cinema 
            WHERE cinema_id = $1`, 
            [cinema_id])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
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
        db.query(`
            SELECT * FROM cinema 
            WHERE cinema_location ILIKE $1 
            ORDER BY cinema_id`, 
            [`%${cinema_location}%`])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
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