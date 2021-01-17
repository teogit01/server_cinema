var mongoose = require('mongoose')

var Schema = mongoose.Schema

var schema = new Schema({
	code: String,
	name: String,
	capacity:Number,
	status: Boolean,
	
	theater:{
		type: Schema.Types.ObjectId,
		ref: "Theater"
	},
	showtimes:[{
		type:Schema.Types.ObjectId,
		ref:"Showtime"
	}],
	seats:[{
		type:Schema.Types.ObjectId,
		ref:"Seat"
	}],	
})

var Room = mongoose.model('Room', schema)

module.exports = Room