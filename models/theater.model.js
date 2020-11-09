var mongoose = require('mongoose')
//let Branch = require('./branch.model')

var Schema = mongoose.Schema

var schema = new Schema({
	code: String,
	name: String,	
	address:String,
	hotline: String,
	
	films:[{
		type:Schema.Types.ObjectId,
		ref:"Film"
	}],

	rooms:[{
		type:Schema.Types.ObjectId,
		ref:"Room"
	}],

	branch:{
		type: Schema.Types.ObjectId,
		ref: "Branch"
	},

	create_at: {
		type: Date,
		default: Date.now
	}
})

var Theater = mongoose.model('Theater', schema)

module.exports = Theater