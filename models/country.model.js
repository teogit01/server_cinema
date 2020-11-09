var mongoose = require('mongoose')

var Schema = mongoose.Schema

var schema = new Schema({
	code: String,
	name: String,

	films:[{
		type:Schema.Types.ObjectId,
		ref:"Film"
	}],
})

var Country = mongoose.model('Country', schema)

module.exports = Country