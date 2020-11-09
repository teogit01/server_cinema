let Role = require('../models/role.model')
var shortid = require('shortid');

const methods = {
	index: async (req,res)=>{
	const roles = await Role.find()
	res.send(roles) 
	//console.log(shortid.generate())
	},

	post: async(req, res)=>{
		let { name, type } = req.body
		const role = await new Role({
			code: shortid.generate(),
			name,
			type
		})
		try{
			role.save()
			.then(()=>{
				res.json({
					result : "success"
				})	
			})
			.catch(()=>{
				res.json({
					result: "fail"
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
		let role = Role.deleteOne({_id: id})
		.then(()=>{
			res.json({
				result : "Delete Successfully"
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