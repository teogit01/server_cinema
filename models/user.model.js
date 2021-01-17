var mongoose = require('mongoose')

var Schema = mongoose.Schema

var schema = new Schema({	
	code: String,
	password: String,	
	name: String,
	birthday: Date,
	phone: String,
	avatar: String,
	email: String,
	address: String,
	point: Number,

	role: Number,
	
	tickets:[{
		type:Schema.Types.ObjectId,
		ref:"Ticket"
	}],
	rates:[{
		type:Schema.Types.ObjectId,
		ref:"Rate"
	}],
})

var User = mongoose.model('User', schema)

module.exports = User