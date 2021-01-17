const express = require('express')

const router = express.Router()

const controllers = require('../controllers/country.controller')

router.get('/', controllers.index)
// add new role
router.post('/', controllers.post)

router.post('/add', controllers.addCountry)
router.post('/remove', controllers.removeCountry)

// delete
router.delete('/:id', controllers.destroy)

module.exports = router
