const express = require('express')

const router = express.Router()

const controllers = require('../controllers/seat.controller')

router.get('/', controllers.index)

//seat of room
router.get('/room/:_idroom', controllers.seatOfRoom)

// update seat add row, add column, update type
router.post('/edit/room/:_idroom', controllers.updateSeatOfRoom)
router.post('/edit', controllers.updateSeat)
// add new role
router.post('/', controllers.post)
// detroy 
router.delete('/:id', controllers.destroy)

module.exports = router
