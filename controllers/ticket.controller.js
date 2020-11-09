let Ticket = require('../models/ticket.model')
var shortid = require('shortid');

const methods = {
	index: async (req,res)=>{
	const tickets = await Ticket.find()
	res.send(tickets) 
	//console.log(shortid.generate())
	},

	post: async(req, res)=>{

		const { price, id_user, id_showtime, id_seat } = req.body
		const ticket = await new Ticket({
			code: shortid.generate(),
			price,
			id_user,
			id_showtime,
			id_seat
		})
		try{
			ticket.save()
			.then(()=>{
				res.json({
					result : "success"
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
		let ticket = Ticket.deleteOne({_id: id})
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