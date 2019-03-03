var path = require('path');

module.exports.networktraffic = function(req,res){
    res.render('networktraffic.ejs', {
            user : req.user // get the user out of session and pass to template
        });
}
