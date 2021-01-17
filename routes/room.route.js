const express = require('express')

const router = express.Router()

const controllers = require('../controllers/room.controller')

router.get('/', controllers.index)
router.get('/detail/:_idroom', controllers.detail)

router.get('/get', controllers.get)

router.get('/theater', controllers.getTheater)
// add new role
router.post('/add', controllers.addRoom)
router.post('/remove', controllers.removeRoom)

module.exports = router
