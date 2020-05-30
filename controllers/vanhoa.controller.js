var Tinmoi = require('../models/tinmoi.model.js')
var Theloai = require('../models/theloai.model.js')

module.exports.getIndex = async function (req, res) {
	var tinmoi = await Tinmoi.find();
	var theloai = await Theloai.findOne({_id: "5ed0800351510d27826764b4"})
	res.render('theloai/vanhoa.pug', {
		tinmois: tinmoi,
		theloais: theloai
	})
}