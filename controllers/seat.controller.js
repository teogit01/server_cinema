let Seat = require('../models/seat.model')
let Room = require('../models/room.model')
var shortid = require('shortid');

const methods = {
	index: async (req,res)=>{
	const seats = await Seat.find().limit(2)
	res.send(seats) 
	//console.log(shortid.generate())
	},
	// seat of room
	seatOfRoom : async (req, res) => {
		const {_idroom} = req.params		
		try{
			const rooms = await Room.findById(_idroom).populate('seats')
			res.send(rooms)
		} catch(err){
			res.send(err)
		}
	},

	post: async(req, res)=>{

		//const { name, row, column, status, id_room } = req.body		
		try{
			const ROW = ['A','B','C','D','E','F','G','H']		
			const COLUMN = [1,2,3,4,5,6,7,8,9,10,11,12]	
			// create seat
			ROW.forEach(async (row)=>{
				COLUMN.forEach(async (column)=>{
					let seat = await new Seat({
						code: shortid.generate(),
						name:`${row}${column}`,
						row: row,
						column:column,
						status:1,		
					})
					seat.save()
				})
			})
			res.send('ok')								
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
		let seat = Seat.deleteOne({_id: id})
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