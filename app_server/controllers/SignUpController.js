var path = require('path');
var passport = require('passport');

module.exports.signup = function(req,res){
    res.render('signup.ejs', { message: req.flash('signupMessage') });
}

module.exports.signupPost = function(req,res,next){
    
     passport.authenticate('local-signup', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	})(req,res,next);
}