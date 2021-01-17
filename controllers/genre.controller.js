let Genre = require('../models/genre.model')
var shortid = require('shortid');

const methods = {
	index: async (req,res)=>{
	const genres = await Genre.find()
	res.send({genres:genres}) 
	//console.log(shortid.generate())
	},

	post: async (req, res)=>{
		try{
			const { name } = req.body			
			const genre = await new Genre({
				code: shortid.generate(),
				name
			})	
			genre.save().then(response=>{
				res.send({genre: response})
			})			
		} catch(err){
			res.send(err)
		}
	},
	// delete
	destroy: async (req, res)=>{
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
	},
	addGenre : async (req, res)=>{
		try{
			const {name} = req.body			
			const genre = await new Genre({
				code: shortid.generate(),
				name: name
			})
			genre.save().then(response=>{
				res.send({genre: response})
			})
		} catch(err){
			res.send(err)
		}
	},
	removeGenre : async (req, res)=>{
		try{
			const {_id} = req.body
			const genre = await Genre.findById(_id)
				if (genre.films.length>0){
					genre.films.forEach(async (item,idx)=>{
						const film = await Film.findById(item)
							const newGenres = film.genres.filter(x=> `${x}`!== `${_id}`)
							film.genres = newGenres
							film.save().then( async ()=>{
								if (idx === genre.films.length-1){
									const d_genre = await Genre.findByIdAndDelete(_id)
									res.end()
								}
							})
					})
				} else {
					const d_genre = await Genre.findByIdAndDelete(_id)
					res.end()
				}
		} catch(err){
			res.send(err)
		}
	}
}

module.exports = methods