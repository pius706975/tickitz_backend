const db = require('../../database/config/config')
const models = {}

models.addMovie = ({title, release_date, directed_by, duration, casts, genre, synopsis, image, user_id})=>{

    return new Promise((resolve, reject)=>{
        db.query('INSERT INTO movies (title, release_date, directed_by, duration, casts, genre, synopsis, image, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;', [title, release_date, directed_by, duration, casts, genre, synopsis, image, user_id])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.updateMovie = ({movie_id, title, release_date, directed_by, duration, casts, genre, synopsis, image, user_id})=>{

    return new Promise((resolve, reject)=>{
        db.query('SELECT * FROM movies WHERE movie_id=$1', [movie_id])
        .then((res)=>{
            const movie = res.rows[0]

            if (!movie) {
                reject(new Error('Movie not found'))
            }else {
                const mTitle = title ? title : movie.title
                const releaseDate = release_date ? release_date : movie.release_date
                const directedBY = directed_by ? directed_by : movie.directed_by
                const mDuration = duration ? duration : movie.duration
                const mCasts = casts ? casts : movie.casts
                const mGenre = genre ? genre : movie.genre
                const mSynopsis = synopsis ? synopsis : movie.synopsis
                const mImage = image ? image : movie.image
                const userID = user_id ? user_id : movie.user_id
                
                const query = 'UPDATE movies SET title=$1, release_date=$2, directed_by=$3, duration=$4, casts=$5, genre=$6, synopsis=$7, image=$8, user_id=$9, updated_at=now() WHERE movie_id=$10 RETURNING *'

                db.query(query, [mTitle, releaseDate, directedBY, mDuration, mCasts, mGenre, mSynopsis, mImage, userID, movie_id])
                .then((res)=>{
                    resolve(res.rows[0])
                }).catch((err)=>{
                    reject(err)
                })
            }
        })
    })
}

models.deleteMovie = ({movie_id})=>{

    return new Promise((resolve, reject)=>{
        db.query('DELETE FROM movies WHERE movie_id=$1;', [movie_id])
        .then((res)=>{
            if (res.rowCount == 0) {
                reject(new Error('Movie not found'))
            }else {
                db.query('DELETE FROM movies WHERE movie_id=$1', [movie_id])
                .then((res)=>{
                    resolve(res.rows)
                }).catch((err)=>{
                    reject(err)
                })
            }
        })
    })
}

models.movieExists = ({title})=>{

    return new Promise((resolve, reject)=>{
        db.query('SELECT * FROM movies WHERE title ILIKE $1;', [title])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.getAllMovie = ({limit, offset})=>{

    return new Promise((resolve, reject)=>{
        db.query(`SELECT * FROM movies ORDER BY release_date DESC LIMIT ${limit} OFFSET ${offset}`)
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.getMovieByID = ({movie_id})=>{

    return new Promise((resolve, reject)=>{
        db.query('SELECT * FROM movies WHERE movie_id=$1;', [movie_id])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.getMovieByTitle = ({limit, offset}, title)=>{

    return new Promise((resolve, reject)=>{
        let query = 'SELECT * FROM movies WHERE title ILIKE $1 ORDER BY title '

        db.query(query, [`%${title}%`])
        .then((res)=>{
            if (res.rowCount == 0) {
                reject(new Error('Movie not found'))
            } else {
                db.query(query + `LIMIT ${limit} OFFSET ${offset};`, [`%${title}%`])
                .then((res)=>{
                    resolve(res.rows)
                }).catch((err)=>{
                    reject(err)
                })
            }
        })
    })
}

module.exports = models