const express = require('express')

const router = express.Router()

const controllers = require('../controllers/showtime.controller')

router.get('/', controllers.index)

// get showtime depent theter, date, film
router.get('/theater', controllers.showOfTheater)
// add new role
router.post('/', controllers.post)
// detroy 
router.delete('/:id', controllers.destroy)

module.exports = router
