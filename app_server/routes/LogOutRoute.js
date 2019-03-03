var express = require('express');
var router = express.Router();
var controller = require('../controllers/LogOutController');

router.get('/', controller.logout);

module.exports = router;