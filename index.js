const express = require('express')
const appServer = express()
const cors = require('cors')
const response = require('./src/libs/response')
const router = require('./src/router/routers')
const db = require('./src/database/config')
const port = process.env.APP_PORT

appServer.use(express.json)

db.connect()
.then(()=>{
    console.log("DB connected")
    appServer.listen(port, ()=>{
        console.log(`Server is running on port ${port}`)
    })
}).catch((error)=>{
    console.log(error)
})