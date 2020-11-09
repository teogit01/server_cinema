const express = require('express')

var multer  = require('multer')
var upload = multer({ dest: 'assets/posters' })

const router = express.Router()

const controllers = require('../controllers/film.controller')

router.get('/', controllers.index)
//detail
router.get('/detail/:id', controllers.detail)
// add new role
//router.get('/add', controllers.index)
// router.post('/', upload.single('poster'), controllers.post)
router.post('/', controllers.post)
router.post('/poster', upload.single('poster'), controllers.uploadPoster)
// detroy 
router.delete('/:id', controllers.destroy)

//edit theater film 
router.post('/add/theater', controllers.addTheater)
router.post('/remove/theater', controllers.removeTheater)

// get film of theater
router.get('/theater/:_idtheater', controllers.filmOfTheater)
//

module.exports = router
