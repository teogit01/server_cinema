let Film = require('../models/film.model')
let Genre = require('../models/genre.model')
let Country = require('../models/country.model')
let Theater = require('../models/theater.model')
let ShowTime = require('../models/showtime.model')

var shortid = require('shortid');
var fs = require ('fs')

const methods = {
	index: async (req,res)=>{
	const films = await Film.find()
	res.send(films) 
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
	uploadPoster: async(req, res)=>{
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
		const { name, runtime, director, cast, trailer, genre, country, openday, description, posterName } = req.body

		const film = await new Film({
			code: shortid.generate(),
			name,
			runtime,
			director,
			cast,
			trailer,
			poster:posterName,
			openday,
			status:1,
			description
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
	destroy: async(req, res)=>{

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
		let _id = req.params.id
		let film = await Film.findById(_id).populate('countrys').populate('genres')		
		res.send(film)
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
	}
}
module.exports = methods