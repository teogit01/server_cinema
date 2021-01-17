var mongoose = require('mongoose')

var Schema = mongoose.Schema

var schema = new Schema({
	code: String,
	name: String,
	runtime: Number,
	price: Number,
	director: String,
	cast: String,
	trailer: String,
	poster: String,
	openday:String,
	status: Boolean, // 0_off, 1_actived
	description: String,
	type: Number, // 1_now, 2_soon, 3_special, -1_removed
	
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
		ref:"Showtime"
	}],

	theaters:[{
		type:Schema.Types.ObjectId,
		ref:"Theater"
	}],

	rates:[{
		type:Schema.Types.ObjectId,
		ref:"Rate"
	}],

	id_banner: String,
	
})

var Film = mongoose.model('Film', schema)

module.exports = Film