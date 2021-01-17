var mongoose = require('mongoose')
//let Branch = require('./branch.model')

var Schema = mongoose.Schema

var schema = new Schema({
	code: String,
	name: String,	
	email: String,
	address:String,
	hotline: String,
	status: Boolean,
	
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
})

var Theater = mongoose.model('Theater', schema)

module.exports = Theater