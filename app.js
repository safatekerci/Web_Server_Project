var express      = require('express');
var path         = require('path');
var app          = express();
var db           = require('./app_server/models/db');
var passport     = require('passport');
var flash        = require('connect-flash');
var morgan       = require('morgan');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var formidable   = require('formidable');
var favicon      = require('serve-favicon');

var server       = require('http').Server(app);
var io           = require('socket.io').listen(server);
var ip           = require('ip');

require('./app_server/config/passport')(passport); 

app.set('view engine','ejs'); 
//app.use(ejsLayouts);
app.set('views', path.join(__dirname, './app_server/views')); 
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/img/logo.ico'));
app.use(morgan('dev')); 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser()); 
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); 
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash()); 

require('./app_server/routes/RouteManager')(app,passport);

//app.listen(8080);

server.listen(8080,function(){
    console.log("Web Server => listening on http://"+ip.address()+":8080");
});


