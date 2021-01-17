let Theater = require('../models/theater.model')
let Branch = require('../models/branch.model')
let Film = require('../models/film.model')
let Room = require('../models/room.model')
var shortid = require('shortid');

const methods = {
	index: async (req,res)=>{
		const theaters = await Theater.find().populate('branch')
		res.send(theaters) 
		//console.log(shortid.generate())
	},	
	index2: async (req, res)=>{
		const theaters = await Theater.find()
		res.send({theaters:theaters})
	},
	detailTheater : async (req,res)=>{		
		try{						
			const _idtheater = req.params._idtheater			
			const theater = await Theater.findById(_idtheater)									
			res.send(theater)
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
			res.send(err)
		}
		
		//console.log(shortid.generate())
	},	
	// add film into theater
	addFilm : async (req, res)=>{		
		try{
			// films {label:'name', value:'_id'}
			const {_idtheater, films} = req.body
			const theater = await Theater.findById(_idtheater)				
			const arr = []
				if(films.length>0){					
					films.forEach(async (film, idx)=>{
						arr.push(film.value)
						const p_film = await Film.findById(film.value)
							p_film.theaters.push(_idtheater)
							p_film.save()
						if (idx === films.length-1){
							theater.films = theater.films.concat(arr)
							theater.save().then(async response=>{
								const result = await Theater.findById(_idtheater).populate('films').populate('rooms')
								res.send({theater:result})
							})							
						}						
					})
				}													
		}catch(err){
			res.send(err)
		}	
	},
	// addRoom : async (req, res)=>{		
	// 	try{
	// 		const {_idtheater, name, capacity}= req.body
	// 		//const theater = await Theater.findById(_idtheater)
	// 		const room = new 

															
	// 	}catch(err){
	// 		res.send(err)
	// 	}	
	// },
	addNewTheater : async (req, res)=>{
		try{
			const { name, address, hotline, branch, email } = req.body		
			const theater = await new Theater({
				code: shortid.generate(),
				name: name,
				address: address,
				hotline: hotline,
				branch: branch,
				status:true,
			})	

			theater.save().then(async response=>{
				const p_branch = await Branch.findById(branch)
					p_branch.theaters.unshift(response._id)
					p_branch.save().then( async ()=>{
						const result = await Branch.findById(branch).populate('theaters')
						res.send({branch:result})
					})	
			})

		} catch(err){
			res.send(err)
		}				
	},
	// delete theater
	destroy: async (req, res)=>{				
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
			res.send('ok')
			// .then(()=>{
			// 	res.json({
			// 		result : "Delete Successfully",
			// 		_id: id
			// 	})
			// })
			// .catch(()=>{
			// 	res.json({
			// 		result : "fail"				
			// 	})
			// })

		} catch(err){
			res.send(err)
		}			
	},
	//client ////////////---------------////////////---------------////////////---------------////////////---------------
	getTheater : async (req, res) => {			
		try{
			const {_idbranch, _idfilm} = req.query
			if (_idbranch && _idfilm){				
				let result = []
				const theaters = await Theater.find({branch:_idbranch})
				if(theaters.length > 0){
					theaters.forEach( (theater, idx)=>{
						theater.films.forEach( film =>{
							if (`${film}` === _idfilm){
								result.push(theater)
							}
						})

						if(idx === theaters.length -1){
							res.send(result)
						}
					})						
				}					
			}						
			res.send([])
		} catch(err){
			res.send(err)
		}		
	},
	theaterRoom : async (req, res)=>{
		try{
			const {_idroom} = req.params			
			const room = await Room.findById(_idroom)
			const theater = await Theater.findById(room.theater)
			res.send(theater)
		} catch(err){
			res.send(err)
		}
	},
	removeTheater : async (req, res)=>{
		try{
			const {_idtheater, _idbranch} = req.body						
			const theater = await Theater.findByIdAndDelete(_idtheater)
			const branch = await Branch.findById(_idbranch)	
				const newTheaters = branch.theaters.filter(x=> `${x}` !== _idtheater)
				branch.theaters = newTheaters					
				branch.save().then(async ()=>{
					const result = await Branch.findById(_idbranch).populate('theaters')					
					res.send({branch:result})
				})			
		} catch(err){
			res.send(err)
		}
	},
	removeFilm : async (req, res)=>{
		try{
			const {_idtheater, _idfilm} = req.body
			const film = await Film.findById(_idfilm)
				const newTheaters = film.theaters.filter(x=>`${x}` !== `${_idtheater}`)
				film.theaters = newTheaters
				film.save()
			const theater = await Theater.findById(_idtheater)
				const newFilms = theater.films.filter(x=> `${x}` !== `${_idfilm}`)
				theater.films = newFilms
				theater.save().then(async ()=>{
					const result = await Theater.findById(_idtheater).populate({
						path:'films',
						model:'Film'
					}).populate({
						path:'rooms',
						model:'Room'
					})
					res.send({theater: result})
				})
		} catch(err){
			res.send(err)
		}
	}
}	

module.exports = methods