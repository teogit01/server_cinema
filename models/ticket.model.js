var mongoose = require('mongoose')

var Schema = mongoose.Schema

var schema = new Schema({
	code: String,	
	price: Number,
	total:Number,
	name: String,
	status: Boolean,
	
	user:{
		type:Schema.Types.ObjectId,
		ref:"User"
	},
	showtime:{
		type:Schema.Types.ObjectId,
		ref:"Showtime"
	},	
	discount:{
		type:Schema.Types.ObjectId,
		ref:"Discount"
	},
})

var Ticket = mongoose.model('Ticket', schema)

module.exports = Ticket