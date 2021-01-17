var mongoose = require('mongoose')

var Schema = mongoose.Schema

var schema = new Schema({
	code: String,	
	name: String,
	percent: Number,
	date: String,
	start: String,
	end: String,
	status: Number, // 0_off ,1_actived, 2_used, 3_expired, 

	ticket:{
		type:Schema.Types.ObjectId,
		ref:"Ticket"
	},	
})

var Discount = mongoose.model('Discount', schema)

module.exports = Discount