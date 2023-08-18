const db = require('../../database/config/config')
const models = {}

models.addMovie = ({title, release_date, directed_by, duration, casts, genre, synopsis, image, user_id})=>{

    return new Promise((resolve, reject)=>{
        db.query(`
            SELECT * FROM movies
            WHERE title ILIKE $1`,
            [`%${title}%`])
        .then((res)=>{
            if (res.rowCount > 0) {
                reject(new Error('Movie already exists'))
            } else {
                db.query(`
                    INSERT INTO movies (title, release_date, directed_by, duration, casts, genre, synopsis, image, user_id) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
                    RETURNING *`, 
                    [title, release_date, directed_by, duration, casts, genre, synopsis, image, user_id])
                .then((res)=>{
                    resolve(res.rows)
                }).catch((err)=>{
                    reject(err)
                })
            }
        })
    })
}

models.updateMovie = ({title, release_date, directed_by, duration, casts, genre, synopsis, user_id, movie_id})=>{

    return new Promise((resolve, reject)=>{
        db.query(`
            UPDATE movies
            SET title = COALESCE($1, title), 
                release_date = COALESCE($2, release_date), 
                directed_by = COALESCE($3, directed_by), 
                duration = COALESCE($4, duration), 
                casts = COALESCE($5, casts), 
                genre = COALESCE($6, genre), 
                synopsis = COALESCE($7, synopsis), 
                user_id = COALESCE($8, user_id)
            WHERE movie_id = $9
            RETURNING *`, 
            [title, release_date, directed_by, duration, casts, genre, synopsis, user_id, movie_id])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.updateMoviePicture = ({image, movie_id})=>{

    return new Promise((resolve, reject)=>{
        db.query(`
            UPDATE movies
            SET image = COALESCE($1, image)
            WHERE movie_id = $2
            RETURNING *`,
            [image, movie_id])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.deleteMovie = ({movie_id})=>{

    return new Promise((resolve, reject)=>{
        db.query(`
            DELETE FROM movies 
            WHERE movie_id = $1`, 
            [movie_id])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
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
        db.query(`
            SELECT * FROM movies 
            ORDER BY release_date DESC 
            LIMIT $1 OFFSET $2`,
            [limit, offset])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.getMovieByTitle = ({title, limit, offset})=>{

    return new Promise((resolve, reject)=>{
        db.query(`
            SELECT * FROM movies 
            WHERE title ILIKE $1 
            ORDER BY title ASC
            LIMIT $2 OFFSET $3`, 
            [`%${title}%`, limit, offset])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.getMovieByID = ({movie_id})=>{

    return new Promise((resolve, reject)=>{
        db.query(`
            SELECT * FROM movies 
            WHERE movie_id=$1`, 
            [movie_id])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.getTotalMovies = ()=>{

    return new Promise((resolve, reject)=>{
        db.query(`
            SELECT COUNT(*) FROM movies`)
        .then((res)=>{
            resolve(res.rows[0].count)
        }).catch((err)=>{
            reject(err)
        })
    })
}

module.exports = models