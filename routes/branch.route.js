const express = require('express')

const router = express.Router()

const controllers = require('../controllers/branch.controller')

router.get('/', controllers.index)

// get branch cover theaters
router.get('/get', controllers.getBranch)
// add new role
router.post('/', controllers.post)

// detroy 
router.delete('/:id', controllers.destroy)

module.exports = router
