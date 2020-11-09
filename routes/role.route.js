const express = require('express')

const router = express.Router()

const controllers = require('../controllers/role.controller')

router.get('/', controllers.index)
// add new role
router.post('/', controllers.post)
// detroy 
router.delete('/:id', controllers.destroy)

module.exports = router
