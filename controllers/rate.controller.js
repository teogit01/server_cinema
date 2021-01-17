let Rate = require('../models/rate.model')
let Film = require('../models/film.model')
let User = require('../models/user.model')
var shortid = require('shortid');

const methods = {
	index: async (req,res)=>{
		try {
			const rates = await Rate.find()
			res.send(rates) 
		} catch(err){
			res.send(err)
		}
	},
	rate: async (req, res)=>{
		try{
			const { comment, star, _idfilm, _iduser } = req.body
			const rate = await new Rate({				
				comment,
				star,
				user:_iduser,
				film:_idfilm
			})
			rate.save().then(async response=>{
				const user = await User.findById(_iduser)
				const film = await Film.findById(_idfilm)
				user.rates.push(response._id)
				film.rates.push(response._id)
				user.save()
				film.save()
				const rates = await Rate.find({film:_id}).sort('_id')
				res.send({rates: rates})
			})
		}catch(err){
			res.send(err)
		}
	},
	rateFilm : async (req, res)=>{
		try{
			const {_idfilm} = req.params
			const rates = await Rate.find({film:_idfilm}).populate({
				'path':'film',
				'modal':'Film'
			}).populate({
				'path':'user',
				'model':'User'
			})
			res.send({rates})
		} catch(err){
			res.send(err)
		}
	},
	remove : async (req, res)=>{
		try{
			const {rate}=req.body					
			const rateItem = await Rate.findOneAndDelete(rate._id)
			const film = await Film.findById(rate.film._id)
			const user = await User.findById(rate.user._id)
				const newRateFilm = film.rates.filter(x=>`${x}` !== `${rate._id}`)
				film.rates = newRateFilm
				film.save()
				const newRateUser = user.rates.filter(x=> `${x}` !== `${rate._id}`)
				user.rates = newRateUser
				user.save()
			
			res.end()
		} catch(err){
			res.send(err)
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