var mongoose = require('mongoose')

// create schema 
var theloaiSchema = new mongoose.Schema({
	thethao: Array,
	giaitri: Array,
	vanhoa: Array,
	giaoduc: Array,
	kinhte: Array,
	xahoi: Array,
	thegioi: Array,
	phapluat: Array
})

var Theloai = mongoose.model('Theloai', theloaiSchema, 'theloai')

module.exports = Theloai;	