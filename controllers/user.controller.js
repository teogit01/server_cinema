let User = require('../models/user.model')
var shortid = require('shortid');

const methods = {
	index: async(req, res)=>{
		const users = await User.find()
		res.send(users)
	},
	// add user 
	post: async(req, res)=>{
		let { username, password, name } = req.body

		const user = new User({
			username,
			password,
			name,
			code: shortid.generate(),
			birthday : '',
			phone: '',
			avatar: '',
			email: '',
			address: '',
			point: 0,
			id_role : "5f56eb558dac8855fbb7d19e"
		})
		try{
			const saveUser = await user.save()
			res.json({
				result : "success" 
			})
		} catch(err){
			res.json({
				error : error 
			})
		}
	},
	// delete user (id)
	destroy: async(req, res)=>{
		let id = req.params.id
		//let user = await User.findById(id)
		let user = await User.deleteOne({_id: id}).then(()=>{
			res.json({
				result: "delete sucessfully"
			})
		}).catch(err => res.json({
			error: err
		}))
		//res.send(user)
	}
}

module.exports = methods