const multer = require('multer')
const response = require("../libs/response")
const middleware = {}

middleware.uploadFile = (req, res, next)=>{
    
    const storage = multer.diskStorage({
        destination: (req, file, callback)=>{
            callback(null, 'public/')
        },

        filename: (req, file, callback)=>{
            const fileExtention = file.mimetype.split('/')[1]
            if (fileExtention !== 'png' && fileExtention !== 'jpg' && fileExtention !== 'jpeg') {
                callback(new Error('The file must be png, jpg, or jpeg'), null)
            }else {
                callback(null, `${Date.now()}.${fileExtention}`)
            }
        }
    })

    const maxSize = {fileSize: 5 * 1024 * 1024}

    const upload = multer({storage, maxSize}).single('image')

    upload(req, res, (error)=>{
        if (error instanceof multer.MulterError){
            return response(res, 500, error.message)
        }else if (error) {
            return response(res, 500, error.message)
        }
        next()
    })
}

module.exports = middleware