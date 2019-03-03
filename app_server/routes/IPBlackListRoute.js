var express = require('express');
var router = express.Router();
var controller = require('../controllers/IPBlackListController');
var passport = require('passport');

router.get('/', controller.ipblacklist);

router.get('/get', controller.getipblacklist);

module.exports = router;
