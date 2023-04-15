const ctrl = {}
const models = require('./auth.models')
const response = require('../../libs/response')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const sendEmail = require('../../libs/mailer')
const crypto = require('crypto')
const validator = require('validator')

ctrl.register = async (req, res)=>{
    try {
        const saltRounds = 10
        const hashPass = await bcrypt.hashSync(req.body.password, saltRounds)
        const tokenVerify = await crypto.randomBytes(16).toString('hex')
        const emailExist = await models.login({email: req.body.email})
        const image = req.file ? req.file.filename : 'image-default.jpeg'

        if (!req.body.email || !req.body.password) {
            if (image !== 'image-default.jpeg') fs.unlinkSync(`public/${image}`)
            return response(res, 401, {message: 'email or password cannot be empty'})
        }else if (!validator.isEmail(req.body.email)) {
            if (image !== 'image-default.jpeg') fs.unlinkSync(`public/${image}`)
            return response(res, 400, {message: 'email is invalid'})
        }else if (emailExist.length > 0) {
            if (image !== 'image-default.jpeg') fs.unlinkSync(`public/${image}`)
            return response(res, 400, {message: 'email already exists'})
        }

        const queries = {
            username: req.body.username,
            email: req.body.email,
            password: hashPass,
            image: image,
            role: req.body.role ? req.body.role : 0,
            token_verify: tokenVerify,
            is_verified: false, 
        }

        const confirmLink = `${process.env.BASE_URL}/auth/confirm?token=${tokenVerify}`
        const resendConfirm = `${process.env.BASE_URL}/auth/resend/username=${queries.username}`
        await sendEmail(queries.email, 'Email verification\n', confirmLink)
        const result = await models.register(queries)
        return response(res, 200, {users: result, status: 'Verify email resent', resend: resendConfirm})
    } catch (error) {
        console.log(error); 
        return response(res, 500, error)
    }
}

ctrl.login = async (req, res)=>{

    try {
        const {email, password} = req.body
        const result = await models.login({email: email})
        const user = result[0]
        if (!user) {
            return response(res, 401, {message: 'email is inccorect'})
        }

        const compared = await bcrypt.compareSync(password, user.password)
        if (!compared) {
            return response(res, 401, {message: 'password is incorrect'})
        }else if (user.is_verified === false) {
            return response(res, 401, {message: 'You need to verify your account'})
        }

        delete user.password
        const token = `Bearer ${jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '1d'})}`
        const dataRespond = {token}

        return response(res, 200, dataRespond)
    } catch (error) {
        console.log(error);
        return response(res, 500, error)
    }
}

ctrl.verifyEmail = async (req, res)=>{

    try {
        const token = {token_verify: req.query.token}
        const result = await models.tokenVerify(token)
        
        if (result.length <= 0) {
            return response(res, 401, {message: 'Your account is not verified yet'})
        }

        const user = result[0]

        if (user.token_verify !== token.token_verify) {
            return response(res, 401, {message: 'Email verify failed'})
        }else if (user.is_verified === true) {
            return response(res, 401, {message: 'Email has been verified'})
        }

        const queries = {
            is_verified: true,
            username: user.username
        }

        const verifyEmail = await models.verifyEmail(queries)
        
        return response(res, 200, {user: verifyEmail, message: 'Email is verified'})
    } catch (error) {
        return response(res, 500, error)
    }
}



module.exports = ctrl