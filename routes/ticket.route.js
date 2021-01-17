const express = require('express')

const router = express.Router()

const controllers = require('../controllers/ticket.controller')

router.get('/', controllers.index)

router.post('/buy',controllers.buyTicket)
router.post('/print',controllers.print)
router.post('/total',controllers.total)
router.get('/film/:_idfilm',controllers.film)


module.exports = router
