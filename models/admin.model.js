var mongoose = require('mongoose')

// create schema 
var theloaiSchema = new mongoose.Schema({
	name: String,
	password: String
})

var Admin = mongoose.model('Admin', theloaiSchema, 'admin')

module.exports = Admin;