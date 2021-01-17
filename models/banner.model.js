var mongoose = require('mongoose')

var Schema = mongoose.Schema

var schema = new Schema({
	code: String,
	name: String,
	banner: String,
	status: Boolean
})

var Banner = mongoose.model('Banner', schema)

module.exports = Banner