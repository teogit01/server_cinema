var mongoose = require('mongoose')

var Schema = mongoose.Schema

var schema = new Schema({
	code: String,
	date: String,
	start: String,
	end: String,
	price: Number,

	film:{
		type: Schema.Types.ObjectId,
		ref: "Film"
	},
	room:{
		type: Schema.Types.ObjectId,
		ref: "Room"
	},
	tickets:[{
		type: Schema.Types.ObjectId,
		ref: "Ticket"
	}],

})

var Showtime = mongoose.model('Showtime', schema)

module.exports = Showtime