var express = require('express');
var router = express.Router();
var controller = require('../controllers/HomeController');
var passport = require('passport');

router.get('/', controller.home);

module.exports = router;
