const express = require('express')

const router = express.Router()

const controllers = require('../controllers/genre.controller')

router.get('/', controllers.index)
// add new role
router.post('/', controllers.post)
router.post('/add', controllers.addGenre)
router.post('/remove', controllers.removeGenre)
// detroy 
router.delete('/:id', controllers.destroy)

module.exports = router
