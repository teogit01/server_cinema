let Branch = require('../models/branch.model')
let Theater = require('../models/theater.model')
var shortid = require('shortid');

const methods = {
	index: async (req,res)=>{				
		const branchs = await Branch.find().populate({
			path:'theaters',
			model:'Theater',
			populate:{
				path:'films',
				model:'Film'
			},			
		}).populate({
			path:'theaters',
			model:'Theater',
			populate:{
				path:'rooms',
				model:'Room'
			},
		}).sort({_id:-1})
		res.send(branchs)
	},
	index2: async (req,res)=>{
		const branchs = await Branch.find()
		res.send({branchs:branchs})
	},
	// get branch cover theater
	getBranch: async (req,res)=>{		
		try{
			const branchs = await Branch.find().populate({
				path:'theaters',
				model:'Theater',
				populate:{
					path:'rooms',
					model:'Room',
					// populate:{
					// 	path:'showtimes',
					// 	model:'Showtime'
					// }
				},
				populate:{
					path:'films',
					model:'Film'
				}

			})

			// const rooms = await Room.find().populate('theater').populate({
			// 	path:'theater',
			// 	model:'Theater',			
			// 	populate:{
			// 		path:'branch',
			// 		model:'Branch'
			// 	}
			// })

			res.send(branchs) 	
		}catch(err){
			res.send(err)
		}
	},
	// add branch
	addBranch: async (req, res)=>{			
		try{
			const { name, email, hotline, city } = req.body		
			const branch = await new Branch({
				code: shortid.generate(),
				name: name,
				email: email,	
				hotline: hotline,
				city:city,			
				status:true,
			})	
			branch.save()
			res.send({branch:branch})
		}
		catch(error){
			res.send(err)
		}
	},
	removeBranch : async (req, res)=>{
		try{
			const {_idbranch } = req.body
			const branch = await Branch.findByIdAndDelete(_idbranch)
			const theater = await Theater.deleteMany({branch:_idbranch})
			res.end()

		} catch(err){
			res.send(err)
		}
	},
	// edit branch
	editBranch : async (req, res)=>{
		try{
			const {_idbranch, name, email, hotline} = req.body
			const branch = await Branch.findById(_idbranch).populate('theaters')
				branch.name = name ? name : branch.name
				branch.email = email ? email : branch.email
				branch.hotline = hotline ? hotline : branch.hotline
				branch.save()
				res.send({branch:branch})
		} catch(err){
			res.send(err)
		}
	},
	// delete banch
	destroy: async (req, res)=>{			
		let id = req.params.id		
		let branch = await Branch.findById(id)		
		//let theaters = await Theater.find({'branch':_id})
		// list theater if branch
		try{			
			if(branch.theaters.length>0){			
				branch.theaters.forEach(theater_id=>{
					Theater.deleteOne({_id: theater_id}).exec()				
				})		
			} 
							
			branch.deleteOne({_id: id})		
			.then(()=>{
				res.json({
					result: 'Delete Sucessfully',
					_id: id
				})
			})
			.catch(()=>{
				res.json({
					result: 'fail'				
				})
			})
		}
		catch(error){
			res.json({
				err : error
			})
		} 
	},	
	infoBranch : async (req, res)=>{
		try{
			const branchs = await Branch.find().populate({
				path:'theaters',
				model:'Theater',
				populate:{
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
				}
			}).populate({
				path:'theaters',
				model:'Theater',
				populate:{
					path:'rooms',
					model:'Room',
					populate:{
						path:'showtimes',
						model:'Showtime',
						populate:{
							path:'room',
							model:'Room',
							populate:{
								path:'seats',
								model:'Seat'
							}
						}
					}
				}
			}).populate({
				path:'theaters',
				model:'Theater',
				populate:{
					path:'rooms',
					model:'Room',
					populate:{
						path:'showtimes',
						model:'Showtime',
						populate:{
							path:'tickets',
							model:'Ticket',							
						}
					}
				}
			})
			res.send({branchs:branchs})
		} catch(err){
			res.send(err)
		}
	},


/////////=========== client ////////////////////
	client_infor : async (req, res)=>{
		try{
			const branchs = await Branch.find().populate({
				path:'theaters',
				model:'Theater',
				populate:{
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
				}
			}).populate({
				path:'theaters',
				model:'Theater',
				populate:{
					path:'rooms',
					model:'Room',
					populate:{
						path:'showtimes',
						model:'Showtime',
						populate:{
							path:'room',
							model:'Room',
							populate:{
								path:'seats',
								model:'Seat'
							}
						}
					}
				}
			})
			res.send({branchs:branchs})
		} catch(err){
			res.send(err)
		}
	}
}

module.exports = methods