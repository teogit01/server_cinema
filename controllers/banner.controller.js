let Banner = require('../models/banner.model')
var shortid = require('shortid');

var fs = require ('fs')

const methods = {
	index: async (req,res)=>{
	const banners = await Banner.find()
	res.send(banners) 
	//console.log(shortid.generate())
	},
	uploadBanner : async(req, res) => {
		const processedFile = req.file || {}; // MULTER xử lý và gắn đối tượng FILE vào req		
	    let orgName = processedFile.originalname || ''; // Tên gốc trong máy tính của người upload    
	    orgName = orgName.trim().replace(/ /g, "-")
	    const fullPathInServ = processedFile.path; // Đường dẫn đầy đủ của file vừa đc upload lên server
	    // Đổi tên của file vừa upload lên, vì multer đang đặt default ko có đuôi file
	    const newFullPath = `${fullPathInServ}-${orgName}`;
	    fs.renameSync(fullPathInServ, newFullPath);		
		
		res.send(newFullPath)
	},
	updateStatus : async (req, res)=>{
		const {_idbanner} = req.params
		try{
			const banner = await Banner.findById(_idbanner)
				banner.status = !banner.status
				banner.save()
				res.send('success!')
		} catch(err){
			re.send(err)
		}
	},
	bannerActive : async (req, res) => {
		try{	
			const banners = await Banner.find({status:true})
			res.send(banners)
		} catch(err){
			res.send(err)
		}
	},

	post: async(req, res)=>{

		const { name, image } = req.body
		const banner = await new Banner({
			code: shortid.generate(),
			name: name,
			banner: image,
			status: false
		})	
		try{
			banner.save()
			.then((respone)=>{
				res.json({
					result : "success",
					banner : respone
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
		// delete
	destroy: async(req, res)=>{
		let id = res.params.id
		let banner = Banner.deleteOne({_id: id})
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