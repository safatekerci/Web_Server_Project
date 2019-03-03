var mongoose = require('mongoose');

mongoose.Promise = require('bluebird');

var mongoDB = 'mongodb://localhost:27017/DB';

mongoose.connect(mongoDB,function(err,err){
    if(err){
        console.log('mongoose error: '+ err);
    }
    else{
        console.log('mongoose connected : ' + mongoDB);
    }
});