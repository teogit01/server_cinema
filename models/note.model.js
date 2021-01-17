var mongoose = require('mongoose')

var Schema = mongoose.Schema

var schema = new Schema({
	type: String,
	price: String,
	color: String,
})

var Note = mongoose.model('Note', schema)

module.exports = Note