require('dotenv').config();

const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')

//connect db
const connect_db = require('./db')

// import Route ------------------------------------------------------------------------
const rootRouter = require('./routes/index.route')

const app = express()
app.use(cors())
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var path = require('path')
const port = process.env.PORT

// congifg ------------------------------------------------------------------------------
app.set('view engine', 'pug')
app.set('views', './views')

// Route --------------------------------------------------------------------------------
app.use('/', rootRouter)

app.get('/api/poster/:name',function(req, res){
	let fileName = req.params.name
	res.sendFile(path.resolve(`./assets/posters/${fileName}`));
})
app.get('/api/banner/:name',function(req, res){
	let fileName = req.params.name
	res.sendFile(path.resolve(`./assets/banners/${fileName}`));
})
app.listen(port,()=>{
	console.log('Start server port = ', port)
})