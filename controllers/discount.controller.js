let Discount = require('../models/discount.model')
var shortid = require('shortid');

const methods = {
	index: async (req,res)=>{
	const discount = await Discount.find()
		res.send({discount}) 		
	},
}

module.exports = methods