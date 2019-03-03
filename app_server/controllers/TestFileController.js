var path = require('path');

module.exports.testfile = function (req, res) {
     res.render('testFile.ejs', { user : req.user});
}

module.exports.testfilePost = function (req, res) {
    console.log("post oldu");
    
}

