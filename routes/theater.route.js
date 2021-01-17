const express = require('express')

const router = express.Router()

const controllers = require('../controllers/theater.controller')

router.get('/', controllers.index)

// detail theater 
router.get('/detail/:_idtheater', controllers.detailTheater)
router.get('/get2', controllers.index2)
// theater of branch
router.get('/branch/:_idbranch', controllers.theaterOfBranch)
// add new role
router.post('/add-new-theater', controllers.addNewTheater)

// edit add film into theater
router.post('/add-film', controllers.addFilm)
// router.post('/add-room', controllers.addRoom)
router.post('/remove-film', controllers.removeFilm)

router.post('/remove', controllers.removeTheater)
// detroy 
router.delete('/:id', controllers.destroy)

// client
router.get('/get', controllers.getTheater)
// client get theater theo _idroom
router.get('/room/:_idroom', controllers.theaterRoom)
module.exports = router
