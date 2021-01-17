const express = require('express')

var multer  = require('multer')
var upload = multer({ dest: 'assets/banners' })
const router = express.Router()

const controllers = require('../controllers/banner.controller')

router.get('/', controllers.index)
//banner active
router.get('/active', controllers.bannerActive)
router.get('/', controllers.index)
// add new role
router.post('/', controllers.post)
router.get('/update-status/:_idbanner', controllers.updateStatus)
//upload banner
router.post('/upload', upload.single('banner'), controllers.uploadBanner)
// detroy 
router.delete('/:id', controllers.destroy)

module.exports = router
