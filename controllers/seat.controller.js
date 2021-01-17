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
			//const seats = await Room.findById(_idroom).populate('seats').select('seats')
			const seats = await Seat.find({room:_idroom}).sort('row').sort('column')
			res.send({seats:seats})
		} catch(err){
			res.send(err)
		}
	},
	// update 
	updateSeatOfRoom : async (req, res) => {
		const {rowWillUpdate, seatDamaged, rowAdd, columnAdd} = req.body
		const {_idroom} = req.params
		// update type
		if (rowWillUpdate.length > 0){
			rowWillUpdate.forEach(async item=>{				
				let seats = await Seat.find({room:_idroom, row:item.row})
					seats.forEach( async (seat) => {
						seat.type = item.type
						seat.save()
					})					
			})
		}
		if (seatDamaged.length > 0){
			seatDamaged.forEach( async item => {
				let seats = await Seat.find({room:_idroom, row:item.row, column:item.column})
					//console.log(seats)					
						seats[0].status = !seats[0].status
						seats[0].save()						
			})
		}
		if (rowAdd.length > 0){
			let room = await Room.findById(_idroom)
			rowAdd.forEach( async item => {
				// create seat
				item.seats.forEach( async (seat, idx) => {
					let newSeat = await new Seat({
						code: shortid.generate(),
						name:`${item.row}${idx+1}`,
						row: `${item.row}`,
						column:`${idx+1}`,
						type: 'default',
						room:_idroom,
						status:1,							
					})
					newSeat.save().then(async respone=>{
						room.seats.push(respone._id)
						room.save()
					})
				})
			})			
		}
		// add column
		if (columnAdd.length > 0){
			let room = await Room.findById(_idroom)
			columnAdd.forEach( async item => {
				// item -> {row, column, type, name, isDamaged: false}
				let newSeat = await new Seat({
					code: shortid.generate(),
					name: item.name,
					row: item.row,
					column: item.column,
					type: item.type,
					room: _idroom,
					status:1,							
				})
				newSeat.save().then(async respone => {
					room.seats.push(respone._id)
					room.save()
				})
			})
		}

		const seatOfRoom = await Seat.find({room:_idroom})

		res.send(seatOfRoom)
	},

	post: async (req, res)=>{

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
						type: 'default',
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
	destroy: async (req, res)=>{
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
	},
	updateSeat : async (req, res)=>{
		try{			
			const ROW = ['A','B','C','D','E','F','G','H','I','J','K','L','M']
			//_add {row:arr, col: arr}
			// _type: { type: typeseat, row:arr}
			const {_add, _type, _idroom} = req.body
			// if (_add !== ''){		
			if(_add.row.length !== 0 || _add.col.length !== 0){
				// console.log('add')						
				// const seat = await Seat.find({'room':_idroom,row:'A'})
				const seats = await Seat.find({'room':_idroom}).sort('row').sort('column')
					const last_column = seats[seats.length-1].column					
					//const last_row = seats[seats.length-1].row
					const num_row = seats.length/last_column+_add.row.length
					//console.log('last',ROW[num_row])
					//console.log(column)
					
					if (_add.row.length>0){
						_add.row.forEach(async r=>{
							for(let i = 1; i<= last_column; i++){
								//console.log('add',r,i)
								//console.log('t',seats[seats.length-1-last_column].type)
								const newSeat = await new Seat({
									code: shortid.generate(),
									name:`${r}${i}`,
									row: r,
									column:i,
									type: (_type.row.length>0 && _type.row.indexOf(`${r}`)!== -1 ? _type.type : seats[seats.length-1-last_column].type),
									status:1,
									room:_idroom,									
								})
								newSeat.save().then(async response=>{
									const room = await Room.findById(_idroom)
										room.seats.push(response._id)
										room.save()
								})
							}
						})
					}					
					if (_add.col.length>0){
						for(let i = 0; i<num_row; i++){
							_add.col.forEach( async c=>{
								//console.log('d',seats[i*(last_column-(last_column/2))].type)
								//console.log('add',ROW[i],c)
								const newSeat = await new Seat({
									code: shortid.generate(),
									name:`${ROW[i]}${c}`,
									row: ROW[i],
									column:c,
									type:(_type.row.length>0 && _type.row.indexOf(`${ROW[i]}`)!== -1 ? _type.type : seats[i*(last_column-(last_column/2))].type),
									//type: seats[i*(last_column-(last_column/2))].type,
									status:1,
									room:_idroom,
								})
								newSeat.save().then(async response=>{
									const room = await Room.findById(_idroom)
										room.seats.push(response._id)
										room.save()
								})
							})
						}
					}					
				}					
				
				if (_type.type === ''|| _type.row.length === 0){
						console.log('return')
				} else {
					const seats = await Seat.find({room:_idroom})
						seats.forEach((seat,idx)=>{
							if(_type.row.indexOf(`${seat.row}`) !== -1){
								seats[idx].type = _type.type
								seats[idx].save()
							}
						})
				}
						
		} catch(err){
			res.send(err)
		}
	}
}

module.exports = methods