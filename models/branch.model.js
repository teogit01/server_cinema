var mongoose = require('mongoose')
//let Theater = require('./theater.model')

var Schema = mongoose.Schema

var schema = new Schema({
	code: String,
	name: String,
	email: String,
	hotline: String,
	city: String,
	province: String,
	district: String,
	village: String,
	address: String,

	theaters:[{
		type: Schema.Types.ObjectId,					 
		ref: "Theater"
	}]
})

var Branch = mongoose.model('Branch', schema)

module.exports = Branch





