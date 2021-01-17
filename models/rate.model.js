var mongoose = require('mongoose')

var Schema = mongoose.Schema

var schema = new Schema({
	comment: String,
	star: Number,

	film:{
		type:Schema.Types.ObjectId,
		ref:"Film"
	},
	user:{
		type:Schema.Types.ObjectId,
		ref:"User"
	},
		
})

var Rate = mongoose.model('Rate', schema)

module.exports = Rate