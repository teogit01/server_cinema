let Country = require('../models/country.model')
var shortid = require('shortid');

const methods = {
	index: async (req,res)=>{
	const countrys = await Country.find()
	res.send({countrys:countrys}) 
	//console.log(shortid.generate())
	},

	post: async(req, res)=>{

		try{
			const { name } = req.body
			const country = await new Country({
				code: shortid.generate(),
				name
			})
			conuntry.save().then(response=>{
				res.send({country: response})
			})			
		}catch(err){
			res.send(err)
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
	},
	addCountry : async (req, res)=>{
		try{
			const {name} = req.body
			const country = await new Country({
				code: shortid.generate(),
				name: name
			})
			country.save().then(response=>{
				res.send({country: response})
			})
			
		} catch(err){
			res.send(err)
		}
	},
	removeCountry : async (req, res)=>{
		try{
			const {_id} = req.body
			const country = await Country.findById(_id)
				if (contry.films.length>0){
					country.films.forEach(async (item,idx)=>{
						const film = await Film.findById(item)
							const newCountrys = film.countrys.filter(x=> `${x}`!== `${_id}`)
							film.countrys = newCountrys
							film.save().then( async ()=>{
								if (idx === country.films.length-1){
									const d_country = await Country.findByIdAndDelete(_id)
									res.end()
								}
							})
					})
				} else {
					const d_country = await Country.findByIdAndDelete(_id)
					res.end()
				}
		} catch(err){
			res.send(err)
		}
	}
}

module.exports = methods