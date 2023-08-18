require('dotenv').config()
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

const UploadFile = (file, folder)=>{
    
    return new Promise((resolve, reject)=>{
        cloudinary.uploader.upload(file, {folder}, (err, result)=>{
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

module.exports = UploadFile