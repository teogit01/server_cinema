var mongoose = require('mongoose')

var Schema = mongoose.Schema

var schema = new Schema({
	id_film: String,
	id_genre: String,
})

var FilmGenre = mongoose.model('film-genre', schema)

module.exports = FilmGenre