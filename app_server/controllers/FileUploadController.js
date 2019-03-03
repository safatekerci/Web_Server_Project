var path = require('path');
var dl = require('delivery');
var formidable = require('formidable');
var dateFormat = require('dateformat');

var esetSocketPath = "";
var avgSocketPath = "";
var processNetworkSocketPath = "";
var registryPath = "";
var clientSocketID = "";

var DB = require('../models/fileanalysis.js');

var fileInfoHeader = 
{
    fileName : "",
    analysisTimestamp :  "",
    fileSHA256 : ""
};

var ioClient = require('socket.io').listen(5050);

ioClient.sockets.on('connection', function(socket){
    clientSocketID = socket.id;
    console.log("Web Server => listening on http://localhost:5050");
});

module.exports.fileupload = function (req, res) {
     res.render('fileupload.ejs', { user : req.user});
}

module.exports.fileuploadPost = function (req, res) {

    var form = new formidable.IncomingForm();
    
    form.on('file', function (name, file) {
        
        fncGetFileInfoHeader(file, (data) => {
            var now = new Date();
            dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
            fileInfoHeader = 
            {
                fileName : file.name,
                analysisTimestamp :  now.toString(),
                fileSHA256 : data
            };
            DB.findOne({ 'fileUID' : fileInfoHeader.fileSHA256, 'fileName': fileInfoHeader.fileName }, function (err, data) {
                
                if (err)
                    console.log(err);

                if (data) {
                    //result.fileInfo = JSON.stringify(data.fileInfo);
                } else {

                    var newDB = new DB();
                    newDB.user = "";
                    newDB.analysisDate = fileInfoHeader.analysisTimestamp;
                    newDB.fileUID = fileInfoHeader.fileSHA256;
                    newDB.fileName = fileInfoHeader.fileName;
                    newDB.fileInfo = { "" : "" };
                    newDB.avResult.avName = "";
                    newDB.avResult.scanResult = "";
                    newDB.processResult = [];
                    // newDB.processResult.pID = "";
                    // newDB.processResult.processName = "";
                    // newDB.processResult.processStatus = "";
                    // newDB.processResult.processExePath = "";
                    // newDB.processResult.processWorkPath = "";
                    newDB.networkResult = [];
                    // newDB.networkResult.family = "";
                    // newDB.networkResult.localAddress = "";
                    // newDB.networkResult.localPort = "";
                    // newDB.networkResult.remoteAddress = "";
                    // newDB.networkResult.remotePort = "";
                    // newDB.networkResult.status = "";
                    // newDB.networkResult.fileDescriptor = "";
                    // newDB.networkResult.ipReputationResult = "";
                    newDB.registryResult.deletedResult.HKEY_CLASSES_ROOT = "";
                    newDB.registryResult.deletedResult.HKEY_CURRENT_USER = "";
                    newDB.registryResult.deletedResult.HKEY_LOCAL_MACHINE = "";
                    newDB.registryResult.deletedResult.HKEY_USERS = "";
                    newDB.registryResult.deletedResult.HKEY_CURRENT_CONFIG = "";
                    newDB.registryResult.insertedResult.HKEY_CLASSES_ROOT = "";
                    newDB.registryResult.insertedResult.HKEY_CURRENT_USER = "";
                    newDB.registryResult.insertedResult.HKEY_LOCAL_MACHINE = "";
                    newDB.registryResult.insertedResult.HKEY_USERS = "";
                    newDB.registryResult.insertedResult.HKEY_CURRENT_CONFIG = "";
                    newDB.save(function (err) {
                        if (err)
                            throw err;
                    });
                }
            });
            ioClient.to(clientSocketID).emit("clientFileInfoHeader",JSON.stringify(fileInfoHeader));
        });

        fncGetFileInfoDetail(file, (data) => {
            var fileInfoDetail = JSON.stringify(data); 
            DB.findOne({ 'fileUID' : fileInfoHeader.fileSHA256, 'fileName': fileInfoHeader.fileName }, function (err, data) {
                
                if (err)
                    console.log(err);

                var obj = {};
                var jsonData = JSON.parse(fileInfoDetail);
                var jsonFileInfo = jsonData.data;

                jsonFileInfo.forEach(function (e) {
                    Object.keys(e).forEach(function (key) {
                        var value = e[key];
                        obj[key] = value;
                    });
                });

                DB.findOne({ fileName: fileInfoHeader.fileName }, function (err, doc) {
                    doc.fileInfo = obj;
                    doc.save();
                });
            }); 
            ioClient.to(clientSocketID).emit("clientFileInfo",fileInfoDetail);
        });
        
        esetSocketPath = "http://192.168.175.158:5001/";
        avgSocketPath = "http://192.168.151.180:5001/";

        fncGetScanResult(file, esetSocketPath, data => {
            var fileScanResult = JSON.stringify(data);  
            DB.findOne({ 'fileUID' : fileInfoHeader.fileSHA256, 'fileName': fileInfoHeader.fileName }, function (err, data) {
                
                if (err)
                    console.log(err);

                DB.findOne({ fileName: fileInfoHeader.fileName }, function (err, doc) {
                    doc.avResult.avName = "Eset";
                    doc.avResult.scanResult = fileScanResult;
                    doc.save();
                });
            }); 
            ioClient.to(clientSocketID).emit("clientScanResult", fileScanResult);
        });

        processNetworkSocketPath = "http://192.168.175.131:5001/";

        fncGetProcessNetworkResult(file, processNetworkSocketPath, data => {
            var processNetworkResult = JSON.stringify(data); 

            var stringData = JSON.parse(processNetworkResult);
            var splitData = stringData.split('$');

            var processData = splitData[0];
            var networkData = splitData[1];
                            
            var processArray = processData.split('#').map(function(n) {
                return String(n);
            });
            var networkArray = networkData.split('#').map(function(n) {
                return String(n);
            });
            
            for(var i=0; i<processArray.length; i++)
            {
                var jsonData = JSON.parse(processArray[i]);
                var query = {fileName: fileInfoHeader.fileName };
                var doc = {
                    $push: { 
                        processResult: {
                            processID : jsonData.processID,
                            processName : jsonData.processName,
                            processStatus : jsonData.processStatus,
                            processExePath : jsonData.processWorkPath,
                            processWorkPath : jsonData.processExePath
                        }
                    }
                }
                var options = {upsert: false};
                DB.findOneAndUpdate(query, doc, options, function(err){
                    if(err) 
                        console.log(err);
                });
            }
            for(var i=0; i<networkArray.length; i++)
            {
                var jsonData = JSON.parse(networkArray[i]);
                var query = {fileName: fileInfoHeader.fileName };
                var doc = {
                    $push: {
                        networkResult : {
                            processID : jsonData.processID,
                            processName : jsonData.processName,
                            family : jsonData.family,
                            localAddress : jsonData.localAddress,
                            localPort : jsonData.localPort,
                            remoteAddress : jsonData.remoteAddress,
                            remotePort : jsonData.remotePort,
                            status : jsonData.status,
                            fileDescriptor : jsonData.fileDescriptor,
                            ipReputationResult : jsonData.ipReputation
                        }
                    }
                };
                var options = {upsert: false};
                DB.findOneAndUpdate(query, doc, options, function(err){
                    if(err) 
                        console.log(err);
                });
            }
            ioClient.to(clientSocketID).emit("clientProcessNetwork", processNetworkResult);
        });

        registryPath = "http://192.168.175.155:5001/";

        fncGetRegistryResult(file, registryPath, data => {
            var registryResult = JSON.stringify(data);
            DB.findOne({ fileName: fileInfoHeader.fileName }, function (err, doc) {
                doc.registryResult.deletedResult.HKEY_CLASSES_ROOT = data.deletedResults.HKEY_CLASSES_ROOT
                doc.registryResult.deletedResult.HKEY_CURRENT_USER = data.deletedResults.HKEY_CURRENT_USER;
                doc.registryResult.deletedResult.HKEY_LOCAL_MACHINE = data.deletedResults.HKEY_LOCAL_MACHINE;
                doc.registryResult.deletedResult.HKEY_USERS = data.deletedResults.HKEY_USERS;
                doc.registryResult.deletedResult.HKEY_CURRENT_CONFIG = data.deletedResults.HKEY_CURRENT_CONFIG;
                doc.registryResult.insertedResult.HKEY_CLASSES_ROOT = data.insertedResults.HKEY_CLASSES_ROOT;
                doc.registryResult.insertedResult.HKEY_CURRENT_USER = data.insertedResults.HKEY_CURRENT_USER;
                doc.registryResult.insertedResult.HKEY_LOCAL_MACHINE = data.insertedResults.HKEY_LOCAL_MACHINE;
                doc.registryResult.insertedResult.HKEY_USERS = data.insertedResults.HKEY_USERS;
                doc.registryResult.insertedResult.HKEY_CURRENT_CONFIG = data.insertedResults.HKEY_CURRENT_CONFIG;
                doc.save();
            });
            ioClient.to(clientSocketID).emit("clientRegistry",registryResult);
        });
    });

    form.on('error', function(err) {
        console.log('Error occurred during processing - ' + err);
    });

    form.on('end', function() {
        console.log('All the request fields have been processed.');

    });

    form.parse(req, function (err, fields, files) {
        res.status(200).json("result"); 
        /*
        setTimeout(function(){ 
            result.fileInfo = JSON.stringify(fileInfo);
            result.fileSHA256 = fileSHA256;
            res.status(200).json(result); 
            result = {
                fileName : "",
                fileSHA256 : "",
                fileInfo : {},
                analysisTimestamp : "",
                esetScanResult : "",
                avgScanResult : "",
            };
        }, 20000);
        */
    });

    var fncGetFileInfoHeader = function(file,lambda){
        const crypto = require('crypto');
        const fs = require('fs');
        var key = 'mysecret key';
        
        function getFileIdentification(hashType, filePath) {

            var fstream = fs.createReadStream(filePath);
            var hash = crypto.createHash(hashType, key);
            hash.setEncoding('hex');

            fstream.on('end', function () {
                hash.end();
                lambda(hash.read());
            });
            fstream.pipe(hash);
        }
        getFileIdentification('sha256', file.path);
    };

    var fncGetFileInfoDetail = function(file,lambda){
        const exiftool = require('node-exiftool');
        const exiftoolBin = require('dist-exiftool');
        const ep = new exiftool.ExiftoolProcess(exiftoolBin);
       
        ep
        .open()
        .then(() => {return ep.readMetadata(file.path)})
        .then((metadata) => {lambda(metadata)})
        .then(() => {ep.close()});
    };

    var fncGetScanResult = function(file,socketPath,lambda) {
        var io = require('socket.io-client');
        // göndereceğimiz yerin socket adresi...
        var socket = io.connect(socketPath);
        // socketi açtık...
        socket.on('connect', function () {
            // her iki tarafıda server yaptık karşıdan dönecek sonuçları alabilmek için...
            delivery = dl.listen(socket);
            delivery.connect();
            
            // dosya göndermek için...
            delivery.on('delivery.connect', function (delivery) {
                delivery.send(file);
            });

            // dosya gönderme başarılı ise.. 
            delivery.on('send.success', function (fileUID) {
                console.log('Web Server => ' + file.name + " dosyası başarıyla gönderildi...");
            });
        });
        
        socket.on ('scanResult', function (result) {
            if(socketPath == "http://192.168.175.158:5001/"){
                var fileScanResult = result;
                console.log('Web Server => scan result : ' + fileScanResult);
                lambda(fileScanResult);
            }
            else{
                result.avgScanResult = msg;
                console.log('Web Server => scan result : ' + "Fake Alert");
            }
        });
    };

    var fncGetProcessNetworkResult = function(file,socketPath,lambda){
        var io = require('socket.io-client');
        var socket = io.connect(socketPath);
        
        socket.on('connect', function () {

            delivery = dl.listen(socket);
            delivery.connect();
            
            delivery.on('delivery.connect', function (delivery) {
                delivery.send(file);
            });

            delivery.on('send.success', function (fileUID) {
                console.log('Web Server => ' + file.name + " dosyası başarıyla gönderildi...");
            });
        });
        
        socket.on ('processNetworkResult', function (result) {
            if(socketPath == "http://192.168.175.131:5001/"){
                var fileProcessNetworkResult = result;
                console.log('Web Server => result : ' + fileProcessNetworkResult);
                lambda(fileProcessNetworkResult);
            }
            else{
                result.avgScanResult = msg;
                console.log('Web Server => result : ' + "Fake Alert");
            }
        });
    };

    var fncGetRegistryResult = function (file, socketPath, lambda) {
        var io = require('socket.io-client');
        var socket = io.connect(socketPath);

        socket.on('connect', function () {

            delivery = dl.listen(socket);
            delivery.connect();

            delivery.on('delivery.connect', function (delivery) {
                delivery.send(file);
            });

            delivery.on('send.success', function (fileUID) {
                console.log('Web Server => ' + file.name + " dosyası başarıyla gönderildi...");
            });
        });

        socket.on('registryResult', function (result) {
            if (socketPath == socketPath) { //"http://192.168.175.131:5001/") {
                var fileRegistryResult = result;
                //console.log('Web Server => result : ' + fileRegistryResult);
                lambda(fileRegistryResult);
            }
            else {
                //result.avgScanResult = msg;
                console.log('Web Server => result : ' + "Fake Alert");
            }
        });
    };
}