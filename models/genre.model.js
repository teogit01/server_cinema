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

var Genre = mongoose.model('Genre', schema)

module.exports = Genre