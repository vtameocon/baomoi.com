var express = require('express');
var multer = require('multer')
var router = express.Router();
var searchController = require('../controllers/timkiem.controller.js');
var indexController = require('../controllers/index.controller.js');

router.get('/', searchController.getSearch)

module.exports = router