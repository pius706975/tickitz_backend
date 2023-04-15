const ctrl = {}
const response = require('../../libs/response')
const models = require('../user/user.model')
const fs = require('fs')

ctrl.updateProfile = async (req, res)=>{

    try {
        const user = req.userData
        const userProfile = await models.getUserProfile({user_id: user.user_id})

        const image = req.file ? req.file.filename : userProfile[0].image

        if (req.file && userProfile[0].image !== 'image-default.jpeg') {
            fs.unlinkSync(`./public/${userProfile[0].image}`)
        }
 
        const queries = {
            image: req.file ? image : null,
            email: user.email,
            username: req.body.username ? req.body.username : null
        }

        const profile = await models.updateProfile(queries)

        const imageLink = `${process.env.BASE_URL}/public/${profile[0].image}`

        return response(res, 200, {profile, image: imageLink})
    } catch (error) {
        console.log(error);
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
        
        const imageLink = `${process.env.BASE_URL}/public/${userProfile[0].image}`

        return response(res, 200, {userProfile, image: imageLink})
    } catch (error) {
        return response(res, 500, error)
    }
}

module.exports = ctrl