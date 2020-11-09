let Theater = require('../models/theater.model')
let Branch = require('../models/branch.model')
let Film = require('../models/film.model')
var shortid = require('shortid');

const methods = {
	index: async (req,res)=>{
		const theaters = await Theater.find().populate('branch')
		res.send(theaters) 
		//console.log(shortid.generate())
	},	
	detail : async (req,res)=>{
		const _id = req.params.id
		try{
			//get room
			const theater= await Theater.findById(_id).populate('rooms').populate('films')
			const rooms = theater.rooms
			const films = theater.films
			//const films = await Theater.findById(_id).populate('films').select('films')
			res.send({rooms, films}) 
		} catch(err){
			res.send(err)
		}		
		//console.log(shortid.generate())
	},	
	// theater of branch
	theaterOfBranch : async (req,res)=>{		
		//const _idbranch = req.query
		const _idbranch = req.params._idbranch		
		try{
			let theaters = []		
			if (_idbranch){
				theaters = await Theater.find({'branch':_idbranch})
				res.send(theaters) 	
			}				
		}catch(err){
			res.send('err',err)
		}
		
		//console.log(shortid.generate())
	},	
	// add film into theater
	addFilm : async (req, res)=>{
		const {_idtheater} = req.body
		const {_films} = req.body
		try{
			const theater = await Theater.findById(_idtheater)
			if(_films){
				_films.forEach(async _idfilm=>{
					theater.films.push(_idfilm)		
					theater.save()

					let film = await Film.findById(_idfilm)
					film.theaters.push(_idtheater)
					film.save()
					//console.log(film)

				})					
			}			
			
			res.send(theater)
		}catch(err){
			res.send(err)
		}	
	},
	post: async(req, res)=>{

		const { name, address, hotline, branch } = req.body		
		const theater = await new Theater({
			code: shortid.generate(),
			name,
			address,
			hotline,
			branch
		})				
		try{			
			theater.save()
				.then( async(respone)=>{
					// push theater in branch
					let branch_item = await Branch.findById(branch)
					branch_item.theaters.push(respone._id)
					branch_item.save()		

					res.json({
						result : "success",
						theatter: respone
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
	// delete theater
	destroy: async(req, res)=>{				
		let id = req.params.id	// _id theater

		let theater = await Theater.findById(id)		
		let branch = await Branch.findById(theater.branch) // branch have theater
								
		try{

			if (branch){
				let idx = branch.theaters.indexOf(id)	
				if (idx != -1){
					// have theater of branch => delete branch->theaters
					branch.theaters.splice(idx,1)
					branch.save()
				}
			}						 	

			theater.deleteOne({_id: id})
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