const express = require('express')
const router = express.Router()

import controllers from '../controllers/user.controller'

router.get('/', controllers.index)
// add user
router.post('/', controllers.post)
// delete user
router.delete('/:id', controllers.destroy)

module.exports = router