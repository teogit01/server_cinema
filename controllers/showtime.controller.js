let Showtime = require('../models/showtime.model')
let Branch = require('../models/branch.model')
let Theater = require('../models/theater.model')
let Film = require('../models/film.model')
let Room = require('../models/room.model')
let Seat = require('../models/seat.model')
var shortid = require('shortid');

const methods = {
	index: async (req,res)=>{
	//const showtimes = await Showtime.find()
	const showtimes = await Showtime.find().populate('tickets')
	res.send({showtimes:showtimes})
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
	// get room availiale
	getRoom : async (req, res) => {
		try{
			const {_idfilm, _date, _idtheater, start, end} = req.body
			//const showtimes = await Showtime.find(date:_date})

			const roomOfTheater = await Room.find({theater:_idtheater}).select('name')
						
			let roomResult = []
			if (roomOfTheater.length > 0){				
				roomOfTheater.forEach( async (room, idx) => {					
					let approved = true					
					let showtimes = await Showtime.find({room:room._id, date:_date})
						if (showtimes.length > 0){
							showtimes.forEach( show => {
								if(approved){
									// time start of showtime in database
									let timeStart = show.start								
									let H_start = parseInt(timeStart.slice(0,2))
									let M_start = parseInt(timeStart.slice(3,5))
									// time end of showtime in database
									let timeEnd = show.end
									let H_end = parseInt(timeEnd.slice(0,2))
									let M_end = parseInt(timeEnd.slice(3,5))
									// time start param compare
									let H_start_param = parseInt(start.slice(0,2))
									let M_start_param = parseInt(start.slice(3,5))
									// time end param compare
									let H_end_param = parseInt(end.slice(0,2))
									let M_end_param = parseInt(end.slice(3,5))

									
									if ((H_start_param >= H_start) && (H_start_param <= H_end)) {
										approved = false
									}
									if ((H_start_param<= H_start) && (H_end_param > H_start)){
										approved = false	
									}
									//console.log('start',H_start, M_start)								
									//console.log('start',H_end, M_end)	
									// console.log('params',H_start_param,M_start_param)
									// console.log('params',H_end_param,M_end_param)									
								}													
								//console.log(show)										
							})
						}				
						roomResult.push({value:room._id,label:room.name, approved:approved})		
						//console.log(roomResult)						
						if (roomResult.length === roomOfTheater.length){
							res.send(roomResult)
						}
					})															
				}				
			//res.send({roomResult:roomResult})
		}catch(err){
			res.send(err)
		}		
	},

	addShowtime : async (req, res)=>{		
		// film ={_id: film._id, name: film.name, time: film.runtime, price: film.price}	
		// theater = {theater}
		// room = {label, value}
		// date : string
		try{
			const { date, price, _idtheater, _idroom, _idfilm, start, end } = req.body					
			console.log(req.body)
			const showtime = await new Showtime({
				code: shortid.generate(),			
				date: date,
				price:price,
				start:start,
				end:end,
				film:_idfilm,
				room:_idroom,
			})		
			showtime.save()
			.then(async (respone)=>{
				// push film, push room
				//push showrime into film
				let push_film = await Film.findById(_idfilm)
					push_film.showtimes.push(respone._id)
					push_film.save()

				//push showrime into room
				let push_room = await Room.findById(_idroom)
					push_room.showtimes.push(respone._id)
					push_room.save()	
				
					const theater = await Theater.findById(_idtheater).populate({
						path:'rooms',
						model:'Room',
						populate:{
							path:'showtimes',
							model:'Showtime'
						}
						}).populate({
							path:'films',
							model:'Film',
							populate:{
								path:'showtimes',
								model:'Showtime',
								populate:{
									path:'room',
									model:'Room'
								}
							}
						})
					res.send({theater:theater})
				
			})			
		}
		catch(error){
			res.json({
				err : error
			})
		}
	},
	// delete showtime
	destroy: async(req, res)=>{
		// room, film
		try{
			const {_idshowtime} = req.params			
			const showtime = await Showtime.findById(_idshowtime)
			const film = await Film.findById(showtime.film)
				let newShowtimes_film = film.showtimes.filter(x=> `${x}`!= _idshowtime)
				film.showtimes = newShowtimes_film
				film.save()

			const room = await Room.findById(showtime.room)
				let newShowTimes_room = room.showtimes.filter(x=> `${x}`!= _idshowtime)
				room.showtimes = newShowTimes_room
				room.save()					

			const d_showtime = await Showtime.findOneAndDelete({_id:_idshowtime})
			res.send('Delete successfully!')			
		} catch(err){
			res.send(err)
		}
	},
	//client
	showOfTheaterGetDate : async (req, res)=>{				
		try{											
			const {_idtheater, _idfilm} = req.query			
			if (_idtheater && _idfilm){								
					const showtimes = await Showtime.find({film:_idfilm}).populate({
					path:'room',
					model:'Room'
				})										
			
				let newDate = []
				let resultFilter =[]
				let final = []
				let result = []
				
				if(showtimes.length>0){					
					showtimes.forEach( async (showtime, idx)=>{
						if(`${showtime.room.theater}` === _idtheater){
							result.push(showtime.date)
						}										
						if (idx===showtimes.length-1){							
							if(result.length>0){
								resultFilter = result.filter((item, index)=>{
									return result.indexOf(`${item}`) === index
								})									
								if (resultFilter.length > 0){									
									resultFilter.forEach(async (date, idx)=>{
										let day = `${date}`.slice(0,2)
										let month = `${date}`.slice(3,5)
										let year = `${date}`.slice(6,10)
										// newDate.push(`${year}/${month}/${day}`)
										newDate.push(year+'/'+month+'/'+day)
										if (idx===resultFilter.length-1){
																					
											newDate.sort().forEach(date=>{
												let year = `${date}`.slice(0,4)
												let month = `${date}`.slice(5,7)
												let day = `${date}`.slice(8,10)

												final.push(`${day}/${month}/${year}`)
											})
											res.send({newDate, resultFilter, final, showtimes})
										}
									})		
								}																				
							} else {
								res.send({newDate, resultFilter, final, showtimes})
							}	
							//res.send({newDate, resultFilter, final, showtimes})					
						}
					})
				} 
			} else {
				res.send("kh co")
			}
		// console.log('k co')
		//res.send('ok')		

		} catch(err){
			res.send(err)
		}		
	},
	showOfTheaterGetShow: async (req, res)=>{
		const {_idtheater, _idfilm, _date} = req.query		

		try{			
			//console.log(_idtheater, _idfilm, _date)			
			if (_idtheater && _idfilm && _date){							
				// const theater = await Theater.findById(_idtheater).populate({
				// 	path:'films',
				// 	match:{_id:_idfilm},
				// 	populate:{
				// 		path:'showtimes',						
						//model:'Showtime',
				// 		match:{date:_date}
				// 	}					
				// })	
				const theater = await Theater.findById(_idtheater).populate({
					path:'rooms',					
					//model:'Room',
					populate:{
						path:'showtimes',
						model:'Showtime',
						match:{film:_idfilm,date:_date}
						//match:{film:_idfilm, date:_date}
					}						
				})				
				// result showtimes
				//if (theater.films[0].showtimes > 0)				
				let showtimes = []
				theater.rooms.forEach(room=>{
					if (room.showtimes.length>0){
						room.showtimes.forEach(showtime=>{
							showtimes.push(showtime)
						})
					}
				})
				res.send(showtimes)
				//res.send(theater.rooms)
				//res.send(theater.films[0].showtimes)
			} else {
				res.send('fail')
			}	
		} catch(err){
			res.send(err)
		}
	},
	// detail
	detail : async (req, res)=>{
		try{
			const {_idshowtime} = req.params			
			const showtime = await Showtime.findById(_idshowtime).populate({
				path:'film',
				model:'Film'
			}).populate({
				path:'room',
				model:'Room',
				populate:{
					path:'seats',
					model:'Seat'
				}
			}).populate({
				path:'room',
				model:'Room',
				populate:{
					path:'theater',
					model:'Theater',
					populate:{
						path:'branch',
						model:'Branch'
					}
				}
			}).populate({
				path:'tickets',
				model:'Ticket'
			})
			const seats = await Seat.find({room:showtime.room}).sort('row').sort('column')
			// res.send(showtime)
			res.send({showtime:showtime, seats:seats})
		} catch(err){
			res.send(err)
		}
	}	
}

module.exports = methods