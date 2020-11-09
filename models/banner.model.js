var mongoose = require('mongoose')

var Schema = mongoose.Schema

var schema = new Schema({
	code: String,
	image: String,
	id_film: String
})

var Banner = mongoose.model('Banner', schema)

module.exports = Banner