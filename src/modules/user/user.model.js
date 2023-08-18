const models = {}
const db = require('../../database/config/config')

models.updateProfile = ({username, email, image})=>{

    return new Promise((resolve, reject)=>{
        db.query(`
            UPDATE users 
            SET username=COALESCE($1, username), email=COALESCE($2, email), image=COALESCE($3, image), updated_at=now() 
            WHERE email=$2 
            RETURNING username, email, image`, 
            [username, email, image])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err) 
        })
    })
}

models.updateProfilePicture = ({image, email})=>{

    return new Promise((resolve, reject)=>{
        db.query(`
            UPDATE users
            SET image = COALESCE($1, image)
            WHERE email = $2
            RETURNING username, email, image`,
            [image, email])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err) 
        })
    })
}

models.removeUser = ({user_id})=>{

    return new Promise((resolve, reject)=>{
        db.query(`
            DELETE FROM users 
            WHERE user_id=$1`, 
            [user_id])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

models.getUserProfile = ({user_id})=>{

    return new Promise((resolve, reject)=>{
        db.query(`
            SELECT username, email, password, image 
            FROM users 
            WHERE user_id=$1`, 
            [user_id])
        .then((res)=>{
            resolve(res.rows)
        }).catch((err)=>{
            reject(err)
        })
    })
}

module.exports = models