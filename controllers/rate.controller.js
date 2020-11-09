let Rate = require('../models/rate.model')
var shortid = require('shortid');

const methods = {
	index: async (req,res)=>{
	const rates = await Rate.find()
	res.send(rates) 
	//console.log(shortid.generate())
	},
	post: async(req, res)=>{
		const { comment, start, id_film } = req.body
		const rate = await new Rate({
			code: shortid.generate(),
			comment,
			start,
			id_film
		})
		try{
			rate.save()
			.then(()=>{
				res.json({
					result : "success"
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
		let id = res.params.id
		let rate = Rate.deleteOne({_id: id})
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