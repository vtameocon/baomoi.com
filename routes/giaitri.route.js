var express = require('express');
var multer = require('multer')
var router = express.Router();
var controller = require('../controllers/giaitri.controller.js');
var indexController = require('../controllers/index.controller.js');


router.get('/', controller.getIndex)

router.get('/news/:id', indexController.getNews)

router.post('/comment/:id', indexController.postComment)

router.post('/newComment/:id', indexController.postNewComment)

router.post('/deleteComment/:id', indexController.deleteComment)



module.exports = router