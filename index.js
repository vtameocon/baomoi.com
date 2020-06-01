var express = require('express')
var adminRoute = require('./routes/admin.route.js')
var indexRoute = require('./routes/index.route.js')
var giaitriRoute = require('./routes/giaitri.route.js')
var giaoducRoute = require('./routes/giaoduc.route.js')
var kinhteRoute = require('./routes/kinhte.route.js')
var phapluatRoute = require('./routes/phapluat.route.js')
var thegioiRoute = require('./routes/thegioi.route.js')
var thethaoRoute = require('./routes/thethao.route.js')
var vanhoaRoute = require('./routes/vanhoa.route.js')
var xahoiRoute = require('./routes/xahoi.route.js')
var sessionMiddleware = require('./middleware/session.middleware.js')

var mongoose = require('mongoose')
var cookieParser = require('cookie-parser')


mongoose.connect('mongodb://localhost/baomoi-demo')
var port = 3000;

var app = express()

app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser('asglasdfl'))

app.use(express.static('public'))
app.use(sessionMiddleware)

app.use('/admin', adminRoute)
app.use('/trangchu', indexRoute)
app.use('/xahoi', xahoiRoute)
app.use('/thegioi', thegioiRoute)
app.use('/vanhoa', vanhoaRoute)
app.use('/kinhte', kinhteRoute)
app.use('/giaoduc', giaoducRoute)
app.use('/thethao', thethaoRoute)
app.use('/giaitri', giaitriRoute)
app.use('/phapluat', phapluatRoute)

app.use('/', function (req, res) {
	res.redirect('/trangchu')
})

app.listen(port, function() {
	console.log('server listening on port ' + port);
})