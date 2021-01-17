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
	detail : async (req,res)=>{
		const {_idroom} = req.params		
		try{	
			
			const room = await Room.findById(_idroom)			
			res.send(room) 

		} catch(err){
			res.send(err) 
		}				
	},
	get: async (req,res)=>{		
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

	addRoom: async (req, res)=>{
			
		try{
			const { name, _idtheater, capacity } = req.body
			const room = await new Room({
				code: shortid.generate(),
				name: name,
				theater:_idtheater,
				capacity: 96
			})	
			room.save().then(async (respone)=>{
				//push id room into theater
				let theater = await Theater.findById(_idtheater).populate({
					path:'films',
					model:'Film'
				}).populate({
					path:'rooms',
					model:'Room'
				})
					theater.rooms.push(respone._id)
					theater.save()							

				// push seat
				const ROW = ['A','B','C','D','E','F','G','H']		
				const COLUMN = [1,2,3,4,5,6,7,8,9,10,11,12]	
				// create seat
				ROW.forEach(async (row, idx_r)=>{
					COLUMN.forEach(async (column,idx_c)=>{
						let seat = await new Seat({
							code: shortid.generate(),
							name:`${row}${column}`,
							row: row,
							column:column,
							type: 'default',
							room:respone._id,
							status:1,							
						})
						seat.save().then(async (seat)=>{
							let p_room = await Room.findById(respone._id)
							p_room.seats.push(seat._id)
							p_room.save().then(async ()=>{
								if (idx_r === 7 && idx_c === 11){						
									const result = await Theater.findById(_idtheater).populate({
										path:'films',
										model:'Film'
									}).populate({
										path:'rooms',
										model:'Room'
									})
									res.send({theater: result})
								}
							})
						})						
					})					
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
	removeRoom : async (req, res)=>{
		try{
			const {_idtheater, _idroom} = req.body						
			
			// uptheater
			const theater = await Theater.findById(_idtheater)
				const newRooms = theater.rooms.filter(x=>`${x}` != `${_idroom}`)
				theater.rooms = newRooms								
				theater.save()
					// update seats
				const seat = await Seat.deleteMany({room:_idroom})			
					
				const d_room = await Room.findByIdAndDelete(_idroom)

					const result = await Theater.findById(_idtheater).populate({
						path:'films',
						model:'Film'
					}).populate({
						path:'rooms',
						model:'Room'
					})
					res.send({theater: result})
		} catch(error){
			res.json({
				err : error
			})
		}	
	}
	
}

module.exports = methods