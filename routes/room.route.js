const express = require('express')

const router = express.Router()

const controllers = require('../controllers/room.controller')

router.get('/', controllers.index)

router.get('/get', controllers.get)

router.get('/theater', controllers.getTheater)
// add new role
router.post('/', controllers.post)
// detroy 
router.delete('/:id', controllers.destroy)

module.exports = router
