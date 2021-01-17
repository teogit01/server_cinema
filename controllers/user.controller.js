let User = require('../models/user.model')
var shortid = require('shortid');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

const methods = {
	index: async (req, res)=>{
		const users = await User.find({role:1}).populate({
			'path':'tickets',
			'model':'Ticket',
				populate:{
					path:'showtime',
					model:'Showtime',
						populate:{
							'path':'film',
							'model':'Film'
						}
					}
				})
		res.send({users:users})
	},
	// add user 
	register: async (req, res)=>{				
		try{
			const { name, phone, email, pass } = req.body

			const user = new User({
				code: shortid.generate(),			
				name: name,			
				birthday : '',
				phone: phone,
				avatar: '',
				email: email,
				address: '',
				point: 0,
				role: 1, //1_ thanh vien, 0_admmin
			})
			bcrypt.hash(pass, saltRounds, function(err, hash) {
    			if (hash){
    				user.password = hash
    				user.save().then((response)=>{
    					res.send({result:true,user:response})
    				})
    			}
			});										

		} catch(err){
			res.send({result:false})
		}
	},
	login : async (req,res)=>{
		try{	
			const {email, pass}=req.body			
			const user = await User.find().or([{email:email},{phone:email}])
			if(user && user.length>0){				
				bcrypt.compare(pass, user[0].password, function(err, result) {
				    if(result === true){
				    	res.send({result:true,user:user})
				    }else {
				    	res.send({result:false})
				    }
				});
			} else {
				res.send({result:false})
			}			
		} catch(err){
			res.send(err)
		}
	},
	adminLogin : async (req,res)=>{
		try{
			const {username, password}=req.body
			const user = await User.find({email:username})
			console.log(user)
			if (user){
				if(user[0].password === password){
					console.log('true')
					res.send({result:true, user:user})
				} else {
					console.log('tfasle')
					res.send({result:false})
				}
			}
		} catch{
			res.send(err)
		}
	},
	detail : async (req,res)=>{
		try{
			const {_iduser} = req.params
			const user = await User.findById(_iduser).populate({
				path:'tickets',
				model:'Ticket',
				populate:{
					path:'showtime',
					model:'Showtime',
					populate:{
						path:'tickets',
						model:'Ticket'
					}					
				}
			}).populate({
				path:'tickets',
				model:'Ticket',
				populate:{
					path:'showtime',
					model:'Showtime',
					populate:{
						path:'film',
						model:'Film'
					}
				}
			})
			res.send({user:user})
		} catch(err){
			res.send(err)
		}
	},
	// delete user (id)
	destroy: async (req, res)=>{
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