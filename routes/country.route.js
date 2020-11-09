const express = require('express')

const router = express.Router()

const controllers = require('../controllers/country.controller')

router.get('/', controllers.index)
// add new role
router.post('/', controllers.post)
// delete
router.delete('/:id', controllers.destroy)

module.exports = router
