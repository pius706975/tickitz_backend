const ctrl = {}
const multer = require('multer')
const response = require('../../libs/response')
const models = require('../user/user.model')
const formData = multer().none()
const uploadFile = require('../../middleware/upload/cloudinary')
const bcrypt = require('bcrypt')

ctrl.updateProfile = async (req, res)=>{
    try {
        formData(req, res, async (err)=>{
            if (err) {
                return response(res, 500, err)
            }

            const user = req.userData
            const userProfile = await models.getUserProfile({user_id: user.user_id})
    
            const queries = {
                email: user.email, //email doesn't need to be changed to keep data secure
                username: req.body.username ? req.body.username : 'user'
            }

            const profile = await models.updateProfile(queries)

            return response(res, 200, {message: 'Profile updated', result: profile})
        })
    } catch (error) {
        console.log(error)
        return response(res, 500, error) 
    }
}

ctrl.updateProfilePicture = async (req, res)=>{
    try {
        const result = await uploadFile(req.file.path, 'movieTickitz/userImages')
        const email = req.userData.email
        const image = result.secure_url
        const updatedData = await models.updateProfilePicture({image, email})

        return response(res, 200, {
            message: 'Profile picture updated',
            data: updatedData
        })
    } catch (error) {
        console.log(error)
        return response(res, 500, error)
    }
}

ctrl.removeUser = async (req, res)=>{

    try {
        const {user_id} = req.userData
        await models.removeUser({user_id})
        return response(res, 200, 'Account has been deleted')
    } catch (error) {
        return response(res, 500, error)
    }
}

ctrl.getUserProfile = async (req, res)=>{

    try {
        const user = req.userData
        const userProfile = await models.getUserProfile({user_id: user.user_id})

        return response(res, 200, userProfile)
    } catch (error) {
        return response(res, 500, error)
    }
}

module.exports = ctrl