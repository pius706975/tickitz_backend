const response = require('./response')
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
            from: 'crausherpius.17nichi@gmail.com',
            to: email,
            subject: subject,
            text: 'Please verify your email\n' + link,
            html: `
                <html>
                    <head>
                        <style>
                            /* Customize your email styles here */
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f5f5f5;
                                margin: 0;
                                padding: 0;
                            }
                
                            .email-container {
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #ffffff;
                                border-radius: 10px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                                padding: 20px;
                            }
                
                            .email-header {
                                text-align: center;
                            }
                
                            .email-title {
                                color: #7B00FF;
                                margin-bottom: 10px;
                            }
                
                            .email-content {
                                font-size: 18px;
                                color: #333;
                            }

                            span {
                                color: #FFFFFF;
                                
                            }

                            .email-button {
                                display: block;
                                margin-top: 20px;
                                padding: 12px 24px;
                                background-color: #7B00FF;
                                color: #FFFFFF;
                                text-decoration: none;
                                border-radius: 4px;
                                text-align: center;
                            }
                
                            .email-footer {
                                text-align: center;
                                color: #777;
                                margin-top: 20px;
                            }
                        </style>

                    </head>
                    
                    <body>
                        <div class="email-container">
                            <div class="email-header">
                                <h1 class="email-title">Email Verification</h1>
                            </div>
                            
                            <div class="email-content">
                                <p>Please verify your email by clicking the button below:</p>
                                <a class="email-button" href="${link}"><span>Verify Email</span></a>
                            </div>
                            
                            <div class="email-footer">
                                <p>If you didn't request this verification, please ignore this email.</p>
                            </div>
                        </div>
                    </body>
                </html>
            `
        })
    } catch (error) {
        return response(res, 500, error)
    }
}

module.exports = sendEmail