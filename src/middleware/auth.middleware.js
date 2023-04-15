const response = require('../libs/response')
const jwt = require('jsonwebtoken')
const middleware = {}

middleware.authentication = async(req, res, next)=>{
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return response(res, 400, {message: "You need to login first"})
        }

        const token = authHeader.split(' ')[1]
        if (!token) {
            return response(res, 400, {message: "Token is required"})
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET)

        req.userData = decoded
        console.log(decoded)
 
        next()
    } catch (error) {
        console.log(error);
        return response(res, 500, error)
    }
}

middleware.isAdmin = async(req, res, next)=>{
    try {
        const user = req.userData
        if (user.role === 1) {
            next()
        } else {
            return response(res, 500, "You do not have permission")
        }
    } catch (error) {
        return response(res, 500, error)
    }
}

middleware.isUser = async(req, res, next)=>{
    try {
        const user = req.userData
        if (user.role === 0) {
            next()
        }else {
            return response(res, 400, "You do not have permission")
        }
    } catch (error) {
        return response(res, 500, error)
    }
}

module.exports = middleware