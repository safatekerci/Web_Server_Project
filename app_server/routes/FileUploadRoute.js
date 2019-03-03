var express = require('express');
var router = express.Router();
var controller = require('../controllers/FileUploadController');
var passport = require('passport');

router.get('/', controller.fileupload);

router.post('/', controller.fileuploadPost);

module.exports = router;
