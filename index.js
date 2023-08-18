const express = require('express')
const appServer = express()
const cors = require('cors')
const response = require('./src/libs/response')
const router = require('./src/router/routers')
const db = require('./src/database/config/config')
const port = process.env.APP_PORT

const corsOptions = {
    origin: '', // to allow backend service to FE application. Fill with FE url, e.g. react.js url = http://localhost:3000
    optionsSuccessStatus: 200
}

appServer.use(cors(corsOptions))
appServer.options('*', cors(corsOptions)) 

appServer.use(express.json())
appServer.use(express.urlencoded({extended: true}))
// appServer.use('/public', express.static('public'))
appServer.use(router)

appServer.all('*', (req, res, next)=>{
    response(res, 404, 'Sorry! Page not found')
})

db.connect()
.then(()=>{
    console.log("DB connected")
    appServer.listen(port, ()=>{
        console.log(`Server is running on port ${port}`)
    })
}).catch((err)=>{
    console.log(err)
})