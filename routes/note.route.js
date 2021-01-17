const express = require('express')

const router = express.Router()

const controllers = require('../controllers/note.controller')

router.get('/', controllers.index)

module.exports = router
