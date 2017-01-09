var path = require('path');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite');
var routes = require('./routes');
var pkg = require('./package');

var app = express();

// var bodyParser = require("body-parser");
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));

//views dir
app.set('views', path.join(__dirname, 'views'));
/*
if use html,add this   
*/
app.engine('html', require('ejs').__express);
// set ejs or html
app.set('view engine', 'html');
// app.set('view engine', 'ejs'); 

// set public
app.use(express.static(path.join(__dirname, 'public')));
// session middle
app.use(session({
	name: config.session.key,
	secret: config.session.secret,
	cookie: {
		maxAge: config.session.maxAge
	},
	store: new MongoStore({
		url: config.mongodb
	})
}));
//flash
app.use(flash());
// deal form
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'),
  keepExtensions: true
}));
// add template constant
app.locals.blog = {
	title: pkg.name,
	description: pkg.	description
};

// add template variable
app.use(function (req, res, next) {
	res.locals.user = req.session.user;
	res.locals.success = req.flash('success').toString();
	res.locals.error = req.flash('error').toString();
	next();
});

//router
routes(app);

//listen
app.listen(config.port, function () {
	console.log(`${pkg.name} listening on port ${config.port}`);
});