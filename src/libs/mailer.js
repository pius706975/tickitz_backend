const response = require('../libs/response')
const mailer = require('nodemailer')
require('dotenv').config()

const sendEmail = async (email, subject, link)=>{
    try {
        const transporter = mailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
        }) 
        
        await transporter.sendMail({
            from: 'piusrestiantoro02@gmail.com',
            to: email,
            subject: subject,
            text: 'Please verify your email\n' + link,
            html: `<a href="${link}">Click this link</a>`
        })
    } catch (error) {
        return response(res, 500, error)
    }
}

module.exports = sendEmail