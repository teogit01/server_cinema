let Country = require('../models/country.model')
var shortid = require('shortid');

const methods = {
	index: async (req,res)=>{
	const countrys = await Country.find()
	res.send(countrys) 
	//console.log(shortid.generate())
	},

	post: async(req, res)=>{

		const { name } = req.body
		const country = await new Country({
			code: shortid.generate(),
			name
		})
		try{
			country.save()
			.then((respone)=>{
				res.json({
					result : "success",
					country: respone
				})
			})
			.catch(()=>{
				res.json({
					result : "fail"
				})
			})
		}
		catch(error){
			res.json({
				err : error
			})
		}
	},
	// delete
	destroy: async(req, res)=>{
		let id = req.params.id
		let country = await Country.deleteOne({_id: id})
		.then(()=>{
			res.json({
				result : "Delete Successfully",
				_id : id
			})
		})
		.catch(()=>{
			res.json({
				result : "fail"
			})
		})
	}
}

module.exports = methods