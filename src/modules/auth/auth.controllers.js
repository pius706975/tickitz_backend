const ctrl = {}
const models = require('./auth.models')
const response = require('../../libs/response')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendEmail = require('../../libs/mailer')
const crypto = require('crypto')
const validator = require('validator')

ctrl.register = async (req, res)=>{
    try {
        const isPasswordValid = (password)=>{
            const lengthRegex = /.{8,}/
            const uppercaseRegex = /[A-Z]/
            const symbolRegex = /[\W_]/
            const numberRegex = /\d/

            const hasLength = lengthRegex.test(password)
            const hasUppercase = uppercaseRegex.test(password)
            const hasSymbol = symbolRegex.test(password)
            const hasNumber = numberRegex.test(password)

            return hasLength && hasUppercase && hasSymbol && hasNumber
        }

        const saltRounds = 10
        const hashPass = await bcrypt.hashSync(req.body.password, saltRounds)
        const tokenVerify = await crypto.randomBytes(16).toString('hex')
        const expiredToken = new Date(Date.now() + 20000 * 60)
        const emailExist = await models.login({email: req.body.email})

        if (!req.body.email || !req.body.password) {
            return response(res, 401, {message: 'email or password cannot be empty'})
        } else if (!isPasswordValid(req.body.password)) {
            return response(res, 400, {message: 'Password must contain at least 8 characters, 1 uppercase letter, 1 symbol, and 1 number'})
        } else if (!validator.isEmail(req.body.email)) {
            return response(res, 400, {message: 'Email format is invalid'})
        }else if (emailExist.length > 0) {
            return response(res, 400, {message: 'email already exists'})
        }

        const queries = {
            username: req.body.username,
            email: req.body.email,
            password: hashPass,
            image: req.body.image ? req.body.image : process.env.DEFAULT_PICTURE,
            role: req.body.role ? req.body.role : 0,
            token_verify: tokenVerify,
            token_expire: expiredToken,
            is_verified: false, 
        }

        const confirmLink = `${process.env.BASE_URL}/auth/confirm?token=${tokenVerify}`
        const resendConfirm = `${process.env.BASE_URL}/auth/resend?email=${queries.email}`

        await sendEmail(queries.email, 'Email verification\n', confirmLink) 
        
        const result = await models.register(queries)

        return response(res, 200, {
            users: result,
            status: 'Check your email! We have sent you a confirmation link.',
            resend: resendConfirm
        })
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

ctrl.resendVerification = async (req, res)=>{
    try {
        const email = {email: req.query.email}
        const checkUser = await models.login(email)
        const user = checkUser[0]

        if (checkUser.length <= 0) {
            return response(res, 401, {message: 'Resend verification failed'})
        } else if (user.is_verified === true) {
            return response(res, 401, {message: 'Email has been verified'})
        }

        const token_verify = await crypto.randomBytes(16).toString('hex')
        const expiredAt = new Date(Date.now() + 20000 * 60)

        const queries = {
            token_verify: token_verify,
            token_expire: expiredAt,
            email: req.query.email
        }

        const confirmLink = `${process.env.BASE_URL}/auth/confirm?token=${token_verify}`

        await sendEmail(queries.email, 'Email verification\n', confirmLink) 

        const result = await models.resendVerification(queries)

        return response(res, 200, {
            user: result,
            message: 'Confirmation link is resent'
        })
    } catch (error) {
        console.log(error)
        return response(res, 500, error)
    }
}


module.exports = ctrl