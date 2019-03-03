var path = require('path');
var DB = require('../models/fileanalysis.js');

module.exports.getfileanalysiscompleted = function(req,res){
     DB.find({},function(e,docs){
        res.json(docs);
    });
}

module.exports.fileanalysiscompleted = function(req,res){
    res.render('fileanalysiscompleted.ejs', { user : req.user });
}

