const express = require('express')
const router = express.Router()

import controllers from '../controllers/user.controller'

router.get('/', controllers.index)
// add user
router.post('/register', controllers.register)
router.post('/login', controllers.login)
router.post('/admin-login', controllers.adminLogin)
router.get('/detail/:_iduser', controllers.detail)
// delete user
router.delete('/:id', controllers.destroy)

module.exports = router