var express = require('express');
var router = express.Router();
var controller = require('../controllers/AuthenticationController');

router.get('/', controller.authentication);

module.exports = router;