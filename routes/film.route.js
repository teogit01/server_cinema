const express = require('express')

var multer  = require('multer')
var upload = multer({ dest: 'assets/posters' })

const router = express.Router()

const controllers = require('../controllers/film.controller')

router.get('/', controllers.index)
//detail
router.get('/detail/:_idfilm', controllers.detail)
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

router.post('/delete', controllers.deleteFilm)
router.post('/move', controllers.moveFilm)
router.post('/move/multiple', controllers.moveFilmMultiple)
router.post('/edit-status', controllers.editStatus)

router.post('/edit-detail', controllers.editDetail)

/////////--------------/////////--------------/////////--------------/////////--------------/////////--------------
// client
router.get('/client', controllers.C_getFilm)
// get film of branch
router.get('/branch/:_idbranch', controllers.filmOfBranch)


module.exports = router
