var express = require('express');
var router = express.Router();
var controller = require('../controllers/SignUpController');


router.get('/', controller.signup);

router.post('/', controller.signupPost);

module.exports = router;