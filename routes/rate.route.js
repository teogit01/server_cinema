const express = require('express')

const router = express.Router()

const controllers = require('../controllers/rate.controller')

router.get('/', controllers.index)
router.get('/film/:_idfilm', controllers.rateFilm)	
router.post('/remove', controllers.remove)	
// add new role
router.post('/add', controllers.rate)	
// detroy 
router.delete('/:id', controllers.destroy)

module.exports = router
