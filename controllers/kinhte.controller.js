var Tinmoi = require('../models/tinmoi.model.js')
var Theloai = require('../models/theloai.model.js')

module.exports.getIndex = async function (req, res) {
	var tinmoi = await Tinmoi.find();
	var theloai = await Theloai.findOne({_id: "5ed51a3a31739358f02d0178"})
	res.render('theloai/kinhte.pug', {
		tinmois: tinmoi,
		theloais: theloai
	})
}