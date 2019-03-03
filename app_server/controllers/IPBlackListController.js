var path = require('path');
var DB = require('../models/ipblacklist.js');

module.exports.getipblacklist = function(req,res){
    DB.find({},function(e,docs){
        res.json(docs);
    });
}

module.exports.ipblacklist = function(req,res){
    res.render("ipblacklist",{user:req.user});
}
