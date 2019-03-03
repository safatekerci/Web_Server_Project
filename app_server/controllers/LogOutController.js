var path = require('path');

module.exports.logout = function(req,res){
    req.logout();
	res.redirect('/');
}
