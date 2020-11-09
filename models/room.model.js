var mongoose = require('mongoose')

var Schema = mongoose.Schema

var schema = new Schema({
	code: String,
	name: String,
	capacity:Number,
	
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
	
	create_at: {
		type: Date,
		default: Date.now
	}
})

var Room = mongoose.model('Room', schema)

module.exports = Room