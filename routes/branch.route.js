const express = require('express')

const router = express.Router()

const controllers = require('../controllers/branch.controller')

router.get('/', controllers.index)

// get branch cover theaters
router.get('/get', controllers.getBranch)
router.get('/get2', controllers.index2)
// add new role
router.post('/add-new-branch', controllers.addBranch)
router.post('/edit', controllers.editBranch)
router.get('/info', controllers.infoBranch)
router.post('/remove', controllers.removeBranch)
// detroy 
router.delete('/:id', controllers.destroy)



//===========// client
router.get('/client/info',controllers.client_infor)

module.exports = router
