var mongoose = require('mongoose')

var Schema = mongoose.Schema

var schema = new Schema({
	comment: String,
	star: Number,

	id_film: String,
	
	create_at: {
		type: Date,
		default: Date.now
	}
})

var Rate = mongoose.model('Rate', schema)

module.exports = Rate