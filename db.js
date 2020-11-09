const mongoose = require('mongoose')

const connect = mongoose.connect('mongodb://localhost/cinema_2020', {useNewUrlParser: true})
.then(()=>console.log("connect"))

module.exports = connect
