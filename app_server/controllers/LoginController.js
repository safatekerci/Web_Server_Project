var path = require('path');
var passport = require('passport');

module.exports.login = function(req,res){
    res.render('login.ejs', { message: req.flash('loginMessage') });
}

module.exports.loginPost = function(req,res,next){
	 passport.authenticate('local-login', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	})(req,res,next);
}

