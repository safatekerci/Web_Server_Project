var passport = require('passport');

var routeAuthentication = require('./AuthenticationRoute');
var routeLogin          = require('./LoginRoute');
var routeLogOut         = require('./LogOutRoute');
var routeSignUp         = require('./SignUpRoute');
var routeHome           = require('./HomeRoute');
var routeFileUpload     = require('./FileUploadRoute');
var routeFileAnalysisCompleted       = require('./FileAnalysisCompletedRoute');
var routeIPBlackList       = require('./IPBlackListRoute');
var routeNetworkTraffic = require('./NetworkTrafficRoute');
var routeTestFile       = require('./TestFileRoute');

module.exports = function(app,passport){
    app.use('/', routeAuthentication);
    app.use('/login', routeLogin);
    app.use('/logout', routeLogOut);
    app.use('/signup', routeSignUp);
    app.use('/home', isLoggedIn, routeHome);
    app.use('/fileupload', isLoggedIn, routeFileUpload);
    app.use('/fileanalysiscompleted', isLoggedIn, routeFileAnalysisCompleted);
    app.use('/ipblacklist', isLoggedIn, routeIPBlackList);
    app.use('/networktraffic', isLoggedIn, routeNetworkTraffic);
    app.use('/testfile', isLoggedIn, routeTestFile);
};

function isLoggedIn(req, res, next) {

	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}