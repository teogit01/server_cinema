let Banner = require('../models/banner.model')
var shortid = require('shortid');

const methods = {
	index: async (req,res)=>{
	const banners = await Banner.find()
	res.send(banners) 
	//console.log(shortid.generate())
	},

	post: async(req, res)=>{

		const { image } = req.body
		const banner = await new Banner({
			//code: shortid.generate(),
			image
		})	
		try{
			banner.save()
			.then(()=>{
				res.json({
					result : "success"
				})
			})
			.catch(err=>{
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
		let id = res.params.id
		let banner = Banner.deleteOne({_id: id})
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