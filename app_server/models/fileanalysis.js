var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var fileAnalysisSchema = mongoose.Schema({
        username      : String,
        analysisDate  : String,
        fileUID       : String,
        fileName      : String,
        fileInfo      : Object,
        avResult      : {
            avName     : String,
            scanResult : String, 
        },
        processResult : [{
            processID       : String,
            processName     : String,
            processStatus   : String,
            processExePath  : String,
            processWorkPath : String
        }],
        networkResult : [{
            family              : String,
            localAddress        : String,
            localPort           : String,
            remoteAddress       : String,
            remotePort          : String,
            status              : String,
            fileDescriptor      : String,
            ipReputationResult  : String
        }],
        registryResult: {
            deletedResult : {
                HKEY_CLASSES_ROOT   : String,
                HKEY_CURRENT_USER   : String,
                HKEY_LOCAL_MACHINE  : String,
                HKEY_USERS          : String,
                HKEY_CURRENT_CONFIG : String
            },
            insertedResult : {
                HKEY_CLASSES_ROOT   : String,
                HKEY_CURRENT_USER   : String,
                HKEY_LOCAL_MACHINE  : String,
                HKEY_USERS          : String,
                HKEY_CURRENT_CONFIG : String
            }
        }
},{strict: false});

// methods ======================
// generating a hash
fileAnalysisSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
fileAnalysisSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('fileAnalysisColl', fileAnalysisSchema);
