var mongoose = require('mongoose')

// create schema 
var theloaiSchema = new mongoose.Schema({
	title: String,
	trangthai: String,
	id: String,
	theloai: String,
	content: String,
	thoigian: String,
	ngaygio: String,
	hashtag: String,
	firstNews: String,
	image: String,
	video: String,
	thoigian: String,
	ngaythang: String,
	source: String,
	chinhsua: Array,
	comment: Array
})

var Tinmoi = mongoose.model('Tinmoi', theloaiSchema, 'tinmoi')

module.exports = Tinmoi;	