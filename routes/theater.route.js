const express = require('express')

const router = express.Router()

const controllers = require('../controllers/theater.controller')

router.get('/', controllers.index)

// detail theater 
router.get('/:id', controllers.detail)
// theater of branch
router.get('/branch/:_idbranch', controllers.theaterOfBranch)
// add new role
router.post('/', controllers.post)

// edit add film into theater
router.post('/add-film', controllers.addFilm)
// detroy 
router.delete('/:id', controllers.destroy)

module.exports = router
