var express = require('express');
var router = express.Router();
var controller = require('../controllers/LoginController');

router.get('/', controller.login);

router.post('/',controller.loginPost);

module.exports = router;