let Room = require('../models/room.model')
let Theater = require('../models/theater.model')
let Seat = require('../models/seat.model')
var shortid = require('shortid');

const methods = {
	index: async (req,res)=>{
		const rooms = await Room.find().sort({code_theater:1,name:1 })
		res.send(rooms) 
		//console.log(shortid.generate())
	},
	get: async (req,res)=>{
		// const rooms = await Room.find().populate({
		// 	path: 'theater',
  //   		model: 'Room'
		// }).populate({
		// 	path: 'theater',
  //   		model: 'Theater',
  //   		populate:{
  //   			path: 'branch',
  //   			model: 'Branch'
  //   		}
		// })

		try{
			const rooms = await Room.find().populate({
				path:'theater',
				model:'Theater',			
				populate:{
					path:'branch',
					model:'Branch'
				}
			})
		res.send(rooms) 
		//console.log(shortid.generate())
		} catch(err){
			res.send(err)
		}		
	},
	getTheater: async (req,res)=>{
		try{
			const {_idtheater} = req.query
			//res.send(_idtheater)		
			const rooms = await Room.find({theater:_idtheater})
			res.send(rooms) 
			//console.log(shortid.generate())
		} catch(err){
			res.send(err)
		}		
	},

	post: async(req, res)=>{

		const { name, _idtheater, capacity } = req.body
		const room = await new Room({
			code: shortid.generate(),
			name: name,
			theater:_idtheater,
			capacity: 96
		})		
		try{
			room.save()
			.then(async (respone)=>{

				//push id room into theater
				let theater = await Theater.findById(_idtheater).populate('branch')
					theater.rooms.push(respone._id)
					theater.save()				

				// push seat
				let p_room = await Room.findById(respone._id)
				let seats = await Seat.find().limit(96)
					seats.forEach(async (seat)=>{
						p_room.seats.push(seat._id)
						p_room.save()
						seat.rooms.push(respone._id)
						seat.save()
						//console.log(seat)
					})
				res.json({
					result : "success",
					room: respone,
					theater: theater	
				})	
			})
			.catch((err)=>{
				res.json({
					result: "fail",
					err: err
				})
			})
		}
		catch(error){
			res.json({
				err : error
			})
		}
	},
	//delete
	destroy: async(req, res)=>{
		let id = req.params.id
		
		let room = await Room.findById({_id: id})
		let theater = await Theater.findById(room.theater)

		try{
			if (theater){
				let idx = theater.rooms.indexOf(id)	
				if (idx != -1){
					// have room of theater => delete theater->room
					theater.rooms.splice(idx,1)
					theater.save()
				}
			
			}	
			room.deleteOne({_id: id})
			.then(()=>{
				res.json({
					result : "Delete Successfully",
					_id: id
				})
			})
			.catch(()=>{
				res.json({
					result : "fail"				
				})
			})

		} catch(error){
			res.json({
				err : error
			})
		}	
	}
	
}

module.exports = methods