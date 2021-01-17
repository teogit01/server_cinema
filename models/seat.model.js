var mongoose = require('mongoose')

var Schema = mongoose.Schema

var schema = new Schema({
	//seats: Array,
	code: String,
	name: String,
	row: String,
	column: Number,
	status: Boolean,
	type: String,

	room:{
		type: Schema.Types.ObjectId,
		ref: "Room"
	},
	
	tickets:[{
		type: Schema.Types.ObjectId,
		ref: "Ticket"
	}],
})

var Seat = mongoose.model('Seat', schema)

module.exports = Seat