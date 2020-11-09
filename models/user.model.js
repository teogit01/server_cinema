var mongoose = require('mongoose')

var Schema = mongoose.Schema

var schema = new Schema({
	username: String,
	password: String,
	
	code: String,
	name: String,
	birthday: Date,
	phone: String,
	avatar: String,
	email: String,
	address: String,
	point: Number,

	id_role: String,
	
	create_at: {
		type: Date,
		default: Date.now
	},
	update_at: Date
})

var User = mongoose.model('User', schema)

module.exports = User