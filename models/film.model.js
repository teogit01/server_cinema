var mongoose = require('mongoose')

var Schema = mongoose.Schema

var schema = new Schema({
	code: String,
	name: String,
	runtime: Number,
	director: String,
	cast: String,
	trailer: String,
	poster: String,
	openday:String,
	status: Number,
	description: String,
	
	genres:[{
		type:Schema.Types.ObjectId,
		ref:"Genre"
	}],

	countrys:[{
		type:Schema.Types.ObjectId,
		ref:"Country"
	}],

	showtimes:[{
		type:Schema.Types.ObjectId,
		ref:"ShowTime"
	}],

	theaters:[{
		type:Schema.Types.ObjectId,
		ref:"Theater"
	}],

	id_banner: String,
	
	create_at: {
		type: Date,
		default: Date.now
	}
})

var Film = mongoose.model('Film', schema)

module.exports = Film