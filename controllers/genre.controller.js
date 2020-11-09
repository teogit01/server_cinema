let Genre = require('../models/genre.model')
var shortid = require('shortid');

const methods = {
	index: async (req,res)=>{
	const genres = await Genre.find()
	res.send(genres) 
	//console.log(shortid.generate())
	},

	post: async(req, res)=>{
		const { name } = req.body
		const genre = await new Genre({
			code: shortid.generate(),
			name
		})

		try{
			genre.save()
			.then((respone)=>{
				res.json({
					result : "success",
					genre: respone
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
		let genre = Genre.deleteOne({_id: id})
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