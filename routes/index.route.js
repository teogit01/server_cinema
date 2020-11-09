
const express = require('express')
const rootRouter = express.Router()

const banner = require('./banner.route')
const branch = require('./branch.route')
const country = require('./country.route')
const rate = require('./rate.route')
const film = require('./film.route')
const genre = require('./genre.route')
const role = require('./role.route')
const room = require('./room.route')
const seat = require('./seat.route')
const showtime = require('./showtime.route')
const theater = require('./theater.route')
const ticket = require('./ticket.route')
const user = require('./user.route')

rootRouter.use('/api/role', role)
rootRouter.use('/api/branch', branch)
rootRouter.use('/api/country', country)
rootRouter.use('/api/rate', rate)
rootRouter.use('/api/film', film)
rootRouter.use('/api/genre', genre)
rootRouter.use('/api/room', room)
rootRouter.use('/api/seat', seat)
rootRouter.use('/api/showtime', showtime)
rootRouter.use('/api/theater', theater)
rootRouter.use('/api/ticket', ticket)
rootRouter.use('/api/user', user)

module.exports = rootRouter

