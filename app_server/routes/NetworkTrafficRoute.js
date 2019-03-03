var express = require('express');
var router = express.Router();
var controller = require('../controllers/NetworkTrafficController');


router.get('/', controller.networktraffic);

module.exports = router;