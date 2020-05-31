var express = require('express');
var multer = require('multer')
var router = express.Router();
var controller = require('../controllers/index.controller.js');

router.get('/', controller.getIndex)

router.get('/tin-tuc-hot/:id', controller.getNews)

router.get('/tin-the-gioi/:id', controller.getNews)

router.get('/tin-moi/:id', controller.getNews)

router.get('/tin-lien-quan/:id', controller.getNews)

router.get('/tin-noi-bat/:id', controller.getNews)

router.get('/video/:id', controller.getNews)



// router.post('/tin-tuc-hot/comment/:id', controller.postComment)

// router.post('/tin-tuc-hot/newComment/:id', controller.postNewComment)

// router.post('/tin-tuc-hot/deleteComment/:id', controller.deleteComment)



module.exports = router