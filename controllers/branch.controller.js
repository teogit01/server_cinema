let Branch = require('../models/branch.model')
let Theater = require('../models/theater.model')
var shortid = require('shortid');

const methods = {
	index: async (req,res)=>{				
		const branchs = await Branch.find()	
		res.send(branchs)	
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
	post: async (req, res)=>{
		const { name, email, hotline, city, province, district, village, address } = req.body		
		const branch = await new Branch({
			code: shortid.generate(),
			name: name,
			email: email,	
			hotline: hotline,
			city:city,
			address: address,
			province: province,
			district: district,
			village: village
		})		

		try{
			branch.save()
			.then((respone)=>{
				res.json({
					result : "success",
					branch: respone
				})
			})
			.catch(err=>{
				res.json({
					result : "fail"
				})
			})
		}
		catch(error){
			res.json({
				err : error
			})
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
}

module.exports = methods