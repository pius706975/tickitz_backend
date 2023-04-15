const express = require('express')
const scheduleRouters = express.Router()
const {authentication, isAdmin} = require('../../middleware/auth.middleware')
const ctrl = require('../schedule/schedule.controller')

scheduleRouters.get('/', ctrl.getAllSchedule)
scheduleRouters.get('/:cinema_name', ctrl.getScheduleByName)

scheduleRouters.post('/add', authentication, isAdmin, ctrl.addSchedule)

scheduleRouters.put('/update/:schedule_id', authentication, isAdmin, ctrl.updateSchedule)

scheduleRouters.delete('/delete/:schedule_id', authentication, isAdmin, ctrl.deleteSchedule)

module.exports = scheduleRouters