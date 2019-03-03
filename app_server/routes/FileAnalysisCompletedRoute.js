var express = require('express');
var router = express.Router();
var controller = require('../controllers/FileAnalysisCompletedController');
var passport = require('passport');

router.get('/', controller.fileanalysiscompleted);

router.get('/get', controller.getfileanalysiscompleted);

module.exports = router;
