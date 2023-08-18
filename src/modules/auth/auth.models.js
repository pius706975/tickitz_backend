const models = {}
const db = require('../../database/config/config')

models.register = ({username, email, password, role, image, is_verified, token_verify, token_expire})=>{
    
    return new Promise((resolve, reject)=>{
    
        db.query(`
            SELECT * FROM users 
            WHERE email ILIKE $1`, 
            [`%${email}%`])
        .then((res)=>{
            if (res.rowCount > 0) {
                reject(new Error('Email already exists'))
            }else {
                db.query(`
                    INSERT INTO users (username, email, password, role, image, is_verified, token_verify, token_expire) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
                    RETURNING *;`, 
                    [username, email, password, role, image, is_verified, token_verify, token_expire])
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
        db.query(`
            SELECT * FROM users 
            WHERE email = $1`, 
            [email])
        .then((result)=>{
            resolve(result.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.tokenVerify = ({token_verify})=>{

    return new Promise((resolve, reject)=>{
        db.query(`
            SELECT * FROM users 
            WHERE token_verify=$1;`, 
            [token_verify])
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

models.resendVerification = ({token_verify, token_expire, email})=>{
    
    return new Promise((resolve, reject)=>{
        db.query(`
            UPDATE users 
            SET token_verify = $1, token_expire = $2 
            WHERE email = $3 
            RETURNING username`, 
            [token_verify, token_expire, email])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

module.exports = models