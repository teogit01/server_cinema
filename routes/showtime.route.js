const express = require('express')

const router = express.Router()

const controllers = require('../controllers/showtime.controller')

router.get('/', controllers.index)

// get showtime depent theter, date, film
router.get('/theater', controllers.showOfTheater)

// get room avaliable set showtime
router.post('/getroom', controllers.getRoom)
// add new role
router.post('/add', controllers.addShowtime)

// detroy 
router.delete('/:_idshowtime', controllers.destroy)

// client query _idtheater,_idfilm
router.get('/getdate', controllers.showOfTheaterGetDate)
// client query _idtheater,_idfilm, date
router.get('/getshow', controllers.showOfTheaterGetShow)
// detail client
router.get('/detail/:_idshowtime', controllers.detail)

module.exports = router
