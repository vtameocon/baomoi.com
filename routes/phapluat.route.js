var express = require('express');
var multer = require('multer')
var router = express.Router();
var controller = require('../controllers/phapluat.controller.js');
var indexController = require('../controllers/index.controller.js');

var image = multer({ dest: './public/image/'});

router.get('/', controller.getIndex)

router.get('/news/:id', indexController.getNews)

router.post('/comment/:id', indexController.postComment)

router.post('/newComment/:id', indexController.postNewComment)

router.post('/deleteComment/:id', indexController.deleteComment)

router.post('/updateNews/:id', 
	image.array('image', 12),
	indexController.updateNews
)


module.exports = router