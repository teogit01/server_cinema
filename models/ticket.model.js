var mongoose = require('mongoose')

var Schema = mongoose.Schema

var schema = new Schema({
	code: String,
	name: String,
	Price: String,

	id_user: String,
	id_showtime: String,
	id_seat: String,
	
	create_at: {
		type: Date,
		default: Date.now
	}
})

var Ticket = mongoose.model('Ticket', schema)

module.exports = Ticket