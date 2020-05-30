var express = require('express');
var multer = require('multer')
var router = express.Router();
var controller = require('../controllers/admin.controller.js');
var authMiddleware = require("../middleware/auth.middleware.js");
	
var image = multer({ dest: './public/image/'});

router.get('/', authMiddleware.requireAuth , controller.getIndex);

router.get('/createNews', controller.createNews)

router.get('/login', controller.getLogin)

router.post('/login', controller.postLogin)

router.get('/logout', controller.getLogout)

router.post('/addNews',
	image.array('image', 12),
	controller.postNews)

router.get('/delete-demo', controller.deleteDemo)

module.exports = router;