var shortid = require('shortid')
// var db = require('../db.js')
var Session = require('../models/session.model.js')

module.exports = function (req, res, next) {

	if (!req.signedCookies.sessionId) {
		var d = new Date();
		var date = d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
		var time = d.getHours() + ":" + d.getMinutes();

		var sessionId = shortid.generate();
		res.cookie('sessionId', sessionId, {
			signed: true
		});

		var session = new Session({
			sessionId: sessionId,
			date: date,
			time: time 

		});

		session.save(function (err, session) {
			if (err) return console.error(err);
	      	console.log(session.sessionId + " saved to session collection.");

	      	
		})
		// db.get('session').push({ id: sessionId}).write();
		// }
		// next();
	}
	next();
}