let Film = require('../models/film.model')
let Genre = require('../models/genre.model')
let Country = require('../models/country.model')
let Theater = require('../models/theater.model')
let ShowTime = require('../models/showtime.model')
let Branch = require('../models/branch.model')

var shortid = require('shortid');
var fs = require ('fs')

const methods = {
	
	index: async (req,res)=>{
		const films = await Film.find().populate('countrys').populate('genres')
		res.send({films:films}) 
		//console.log(shortid.generate())
	},	
	filmOfTheater : async (req, res)=>{		
		const _idtheater = req.params._idtheater
		//const _idtheater = req.query._idtheater		
		try{			
			//let films = []				
			let films = await Theater.findById(_idtheater).populate({
				path:'films',
				model:'Film',
				populate:{
					path:'showtimes',
					model:'ShowTime'					
				}				
			})
			res.send(films)		
		} catch(err){
			res.send('err')
		}
	},
	uploadPoster: async (req, res)=>{
		//res.send(req.file)
		const processedFile = req.file || {}; // MULTER xử lý và gắn đối tượng FILE vào req		
	    let orgName = processedFile.originalname || ''; // Tên gốc trong máy tính của người upload    
	    orgName = orgName.trim().replace(/ /g, "-")
	    const fullPathInServ = processedFile.path; // Đường dẫn đầy đủ của file vừa đc upload lên server
	    // Đổi tên của file vừa upload lên, vì multer đang đặt default ko có đuôi file
	    const newFullPath = `${fullPathInServ}-${orgName}`;
	    fs.renameSync(fullPathInServ, newFullPath);		
		
		res.send(newFullPath)
	},	
	post: async (req, res)=>{	
		const { name, price,runtime, director, cast, trailer, genre, country, openday, description, posterName } = req.body

		const film = await new Film({
			code: shortid.generate(),
			name,
			runtime,
			price,
			director,
			cast,
			trailer,
			poster:posterName,
			openday,
			status:0,
			description,
			type: 1, // 1_now, 2_soon, 3_special, -1_removed
			//id_banner
		})		
		//res.send(genre)			
		try{
			film.save()
			.then(async respone=>{				
				//push genre into genres
				genre.forEach(async _id=>{
					// push into film
					let film = await Film.findById(respone._id)										
					//res.send(film)					
					film.genres.push(_id)
					film.save()

					//update genre
					let genre = await Genre.findById(_id)
					genre.films.push(respone._id)
					genre.save()
				})		
				//push country into genres
					country.forEach(async _id=>{
					// push into film
					let film = await Film.findById(respone._id)										
					//res.send(film)					
					film.countrys.push(_id)
					film.save()

					//update country
					let country = await Country.findById(_id)
					country.films.push(respone._id)
					country.save()
				})											

				// result
				res.json({
					result : 'success',
					film : respone
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
	destroy: async (req, res)=>{

		let id = req.params.id		
		let genre = FilmGenre.deleteMany({id_film:id}).exec()
		let film = Film.deleteOne({_id: id})		
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
	},

	detail: async (req, res)=>{
		// prams _id:Film
		let {_idfilm} = req.params
		let film = await Film.findById(_idfilm).populate('countrys').populate('genres').populate({
			path:'showtimes',
			model:'Showtime'
		})
		res.send({film:film})
	},
	// edit theater film ------------------------------------------------
	addTheater: async (req, res)=>{
		//let _idfilm = req.data
		let {_idfilm, _idtheater} = req.body.data
		
		let film = await Film.findById(_idfilm)
		film.theaters.push(_idtheater)
		film.save()
		let theater = await Theater.findById(_idtheater)
		theater.films.push(_idfilm)
		theater.save().then(async ()=>{
			let theaters = await Theater.find().populate('films')
			// result
			res.json({
				result : 'success',
				theaters : theaters,
				film : film
			})
		})
				
	},
	// edit theater film
	removeTheater: async (req, res)=>{
		//let _idfilm = req.data
		let {_idfilm, _idtheater} = req.body.data		
		let film = await Film.findById(_idfilm)			
		let theater = await Theater.findById(_idtheater)
		try{
			if (film){
				let idx = film.theaters.indexOf(_idtheater)
				if (idx != -1){
					film.theaters.splice(idx,1)
					film.save()
				}				
			}
			if (theater){
				let idx = theater.films.indexOf(_idfilm)
				if (idx != -1){
					theater.films.splice(idx,1)
					theater.save().then(async () =>{
						let theaters = await Theater.find().populate('films')

						// send result on deleted
						res.json({
							result : "Delete Successfully",				
							film : film,							
						})
					})
				}
			}
			
		} catch(error){
			res.json({
				err : error
			})
		}
		
		// // result
		// res.json({
		// 	result : 'success',			
		// })
	},

	// client ------------------------------------------------------------------------
	C_getFilm : async (req, res)=>{
		try{			
			const films = await Film.find()
			res.send(films)
		} catch(err){
			res.send(err)
		}
	},
	filmOfBranch : async (req, res) => {
		try{
			const {_idbranch} = req.params
			const branch = await  Branch.findById(_idbranch).populate({
				path:'theaters',
				model: 'Theater',
				populate:{
					path:'films',
					model:'Film'
				}
			}).select('theaters')
			res.send(branch)
		} catch(err){
			res.send(err)
		}
	},
	deleteFilm : async (req, res)=>{
		try{
			// film -> genres, countrys, showtimes, theaters
			const {_idfilm} = req.body			
			const film = await Film.findById(_idfilm)			
				// if(film.theaters.length>0){
				// 	film.theaters.forEach(async (theaterItem) => {
				// 		const theater = await Theater.findById(theaterItem)
				// 			const newFilms = theater.films.filter(x=> `${x}` !== `${_idfilm}`)
				// 			theater.films = newFilms
				// 			theater.save()
				// 	})
				// }
				// if(film.genres.length>0){
				// 	film.genres.forEach(async (genreItem)=>{
				// 		const genre = await Genre.findById(genreItem)
				// 			const newFilms = genre.films.filter(x=> `${x}` !== `${_idfilm}`)
				// 			genre.films = newFilms
				// 			genre.save()
				// 	})
				// }
				// if(film.countrys.length>0){
				// 	film.countrys.forEach(async (countryItem)=>{
				// 		const country = await Country.findById(countryItem)
				// 			const newFilms = country.films.filter(x=> `${x}` !== `${_idfilm}`)
				// 			country.films = newFilms
				// 			country.save()
				// 	})
				// }
				// if (film.showtimes.length>0){
				// 	film.showtumes.forEach(async (showtimeItem)=>{
				// 		const showtime = await ShowTime.findById(showtimeItem)
				// 			const newFilms = showtime.films.filter(x=> `${x}` !== `${_idfilm}`)
				// 			showtime.films = newFilms
				// 			showtime.save()
				// 	})
				// }
				film.type = -1
				film.status = 0
				film.save()				
				res.end()

		} catch(err){
			res.send(err)
		}
	},
	moveFilm : async (req, res)=>{
		try{
			const {start, end, film} = req.body
			console.log({start,end,film})
			const f_film = await Film.findById(film._id)
				if (end === 'now'){
					f_film.type = 1  
					f_film.save()
				}
				if(end === 'soon'){
					f_film.type = 2
					f_film.save()
				}
				if(end === 'special'){
					f_film.type = 3
					f_film.save()
				}
			res.end()
		} catch(err){
			res.send(err)
		}
	},
	moveFilmMultiple : async (req, res)=>{
		try{
			//selectedNows =array [ {value, label} ]
			const {filmTo, selectedNows, selectedSoons, selectedSpecials} = req.body
			let type = 0
			if (filmTo === 'now'){
				type = 1
			}
			if (filmTo ==='special'){
				type = 3
			}
			if (filmTo === 'soon'){
				type = 2
			}
			if(selectedNows.length>0){			

				selectedNows.forEach(async item=>{					
					const film = await Film.findById(item.value)
						film.type = type
						film.save()
				})
			}
			if(selectedSoons.length>0){				
				selectedSoons.forEach(async item=>{
					const film = await Film.findById(item.value)
						film.type = type
						film.save()
				})
			}
			if(selectedSpecials.length>0){				
				selectedSpecials.forEach(async item=>{						
					const film = await Film.findById(item.value)
						film.type = type
						film.save()
				})
			}
		} catch(err){
			res.send(err)
		}
	},
	editStatus : async (req, res) =>{
		try{
			const {_idfilm} = req.body					
			const film = await Film.findById(_idfilm)
				film.status = !film.status
				film.save()				
			res.end()
		} catch(err){
			res.send(err)
		}
	},
	editDetail : async (req, res)=>{
		try{
			const {_id, name, runtime, price, openday} = req.body
			const film = await Film.findById(_id)
				film.name = name ? name : film.name
				film.price = price ? price : film.price
				film.runtime = runtime ? runtime : film.runtime
				film.openday = openday ? openday : film.openday
				film.save(async response =>{
					res.send({film:film})
				})
		} catch(err){
			res.send(err)
		}
	}
}
module.exports = methods