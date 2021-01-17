let Note = require('../models/genre.model')
var shortid = require('shortid');

const methods = {
	index: async (req,res)=>{
		const notes = await Note.find()
		res.send({notes:notes})
	}
}

module.exports = methods