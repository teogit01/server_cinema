const Ticket = require('../models/ticket.model')
const User = require('../models/user.model')
const Showtime = require('../models/showtime.model')
const Seat = require('../models/seat.model')
const Film = require('../models/film.model')

var shortid = require('shortid');

const methods = {
	index: async (req,res)=>{
	const tickets = await Ticket.find()
		res.send({tickets, tickets}) 		
	},
	buyTicket : async (req, res)=>{
		try{			
			const {_idfilm, _idshowtime, _iduser, seatMax, total, seats} = req.body
			const user = await User.findById(_iduser)
			const film = await Film.findById(_idfilm)
			const showtime = await Showtime.findById(_idshowtime) 
			let ticket_user = user.tickets
			let ticket_showtime = showtime.tickets

			if(seats && seats.length>0){
				console.log('ok')

				seats.forEach(async (item, idx)=>{
					const seat = await Seat.findById(item._id)
					let price = film.price
					if(seatMax.row === item.row){
						price+= 10
					} else {
						if (item.type ==='normal')
							price+= 5
					}
					const ticket = await new Ticket({
						code: shortid.generate(),						
						name: item.name,
						price: film.price,
						total: price,
						user: _iduser,
						showtime:_idshowtime,
						status:true,						
					})					
					ticket.save().then(async ticketResult=>{
						ticket_user.push(ticketResult)
						ticket_showtime.push(ticketResult)
						if (idx === seats.length-1){
							user.tickets = ticket_user							
							showtime.tickets = ticket_showtime
							user.save()
							showtime.save()
							res.send({result: true})
						}
					})
				})
			}else {
				console.log('no')
			}

		} catch(err){
			res.send(err)
		}
	},
	print : async (req, res)=>{
		try{
			const {tickets}=req.body
			//console.log(tickets)
			tickets.forEach(async (tick, idx)=>{
				const ticket = await Ticket.findById(tick._id)
					if (ticket.status === false){
						res.send({result:false})
					} else {
						ticket.status = false
						ticket.save()
					}
					if (idx === tickets.length-1){
						res.send({result:true})
					}
			})
		} catch(err){
			res.send(err)
		}
	},
	film : async (req, res)=>{
		try{	
			const _idfilm = req.params
			const tickets = await Ticket.find({film:_idfilm})
			res.send({tickets:tickets})
		} catch(err){
			res.send(err)
		}
	},
	total : async (req, res)=>{
		try{
			const {tickets}=req.body
			if(tickets.length>0){				
				let result = 0
				tickets.forEach(async (item, idx)=>{
					const tick = await Ticket.findById(item)
						result += tick.total
					if (idx=== tickets.length-1){
						res.send({result:result})
					}
				})
			}
		} catch(err){
			res.send(err)
		}
	}
}

module.exports = methods