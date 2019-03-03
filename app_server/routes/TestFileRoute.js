var express = require('express');
var router = express.Router();
var controller = require('../controllers/TestFileController');
var passport = require('passport');

router.get('/', controller.testfile);

router.post('/', controller.testfilePost);

module.exports = router;
