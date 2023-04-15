const models = {}
const db = require('../../database/config')

models.register = ({username, email, password, image, is_verified, token_verify,})=>{
    
    return new Promise((resolve, reject)=>{
    
        db.query('SELECT * FROM users WHERE email ILIKE $1', [`%${email}%`])
        .then((res)=>{
            if (res.rowCount > 0) {
                reject(new Error('Email already exists'))
            }else {
                db.query(`INSERT INTO users (username, email, password,image, is_verified, token_verify) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`, [username, email, password, image, is_verified, token_verify])
                .then((result)=>{
                    resolve(result.rows)
                }).catch((err)=>{
                    reject(err)
                })
            }
        })
    })
}

models.login = ({email})=>{

    return new Promise((resolve, reject)=>{
        db.query(`SELECT * FROM users WHERE email = $1`, [email])
        .then((result)=>{
            resolve(result.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.tokenVerify = ({token_verify})=>{

    return new Promise((resolve, reject)=>{
        db.query(`SELECT * FROM users WHERE token_verify=$1;`, [token_verify])
        .then((result)=>{
            resolve(result.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.verifyEmail = ({is_verified, username})=>{

    return new Promise((resolve, reject)=>{
        db.query(`UPDATE users SET is_verified=$1 WHERE username=$2 RETURNING email, username;`, [is_verified, username])
        .then((result)=>{
            resolve(result.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.resendTokenVerify = ({token_verify, username})=>{
    
    return new Promise((resolve, reject)=>{
        db.query(`UPDATE users SET token_verify=$1 WHERE username=$2 RETURNING email, username, token_verify;`, [token_verify, username])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

module.exports = models