var mongoose = require('mongoose')

var Schema = mongoose.Schema

var schema = new Schema({
	code: String,
	name: String,
	type: String
})

var Role = mongoose.model('Role', schema)

module.exports = Role