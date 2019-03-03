var path = require('path');

module.exports.home = function(req,res){
    res.render('home.ejs', {
            user : req.user // get the user out of session and pass to template
        });
}