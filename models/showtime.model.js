var mongoose = require('mongoose')

var Schema = mongoose.Schema

var schema = new Schema({
	code: String,
	date: String,
	start: String,
	end: String,

	film:{
		type: Schema.Types.ObjectId,
		ref: "Film"
	},
	room:{
		type: Schema.Types.ObjectId,
		ref: "Room"
	},
	
	create_at: {
		type: Date,
		default: Date.now
	}
})

var ShowTime = mongoose.model('ShowTime', schema)

module.exports = ShowTime