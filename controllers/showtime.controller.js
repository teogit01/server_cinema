let Showtime = require('../models/showtime.model')
let Branch = require('../models/branch.model')
let Theater = require('../models/theater.model')
let Film = require('../models/film.model')
let Room = require('../models/room.model')
var shortid = require('shortid');

const methods = {
	index: async (req,res)=>{
	//const showtimes = await Showtime.find()
	const showtimes = await Showtime.find()
	//const theaters = await Theater.find()

	// res.send(showtimes) 
	// //console.log(shortid.generate())
	// },

	res.send(showtimes) 
		//console.log(shortid.generate())
	},
	showOfTheater : async (req, res)=>{
		const {_idtheater, _date} = req.query
		try{			
			const showtimes = await Showtime.find({date:_date})
			res.send(showtimes)
			//const showtimes = await Theater.findById(_idtheater).select('rooms').populate('rooms')
			const rooms = await Room.find({theater:_idtheater})										
			res.send(rooms)
		}catch(err){
			res.send(err)
		}

	},
	post: async(req, res)=>{

		const { date, start, end, film, room } = req.body
		const showtime = await new Showtime({
			code: shortid.generate(),			
			date,
			start,
			end,
			film,
			room,
		})		
		try{
			showtime.save()
			.then(async (respone)=>{
				//push showrime into film
				let push_film = await Film.findById(film)
				push_film.showtimes.push(respone._id)
				push_film.save()

				//push showrime into room
				let push_room = await Room.findById(room)
				push_room.showtimes.push(respone._id)
				push_room.save()	

				res.json({
					result : "success",
					showtime: respone
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
		let showtime = Showtime.deleteOne({_id: id})
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