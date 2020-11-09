var mongoose = require('mongoose')

var Schema = mongoose.Schema

var schema = new Schema({
	//seats: Array,
	code: String,
	name: String,
	row: String,
	column: String,
	status: Boolean,

	rooms:[{
		type: Schema.Types.ObjectId,
		ref: "Room"
	}],
	
	create_at: {
		type: Date,
		default: Date.now
	}
})

var Seat = mongoose.model('Seat', schema)

module.exports = Seat