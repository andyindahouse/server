'use strict';

var express = require('express'),
	session = require('express-session'),
	mongoStore = require('connect-mongo')(session),
	path = require('path'),
	passport = require('passport'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	config = require('./config/config.js'),
	app = express();

// Connect to database and passport config
var db = require('./config/db.js');
require('./app/models/User.js');

// App Config..
// Express/mongo session storage
app.use(session({
  secret: config.session.secret,
  /*store: new mongoStore({
    url: config.db,
    collection: 'sessions'
  }),*/
  saveUninitialized: true,
  resave: true
}));

// Use passport session
app.use(passport.initialize());
app.use(passport.session());

// Config app
app.use(morgan('dev')); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Access-Token');    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.header('Access-Control-Allow-Credentials', true);    

    // intercept OPTIONS method
    /*if ('OPTIONS' == req.method) {
      res.status(200);
    }
    else {
      next();
    }*/
    next();
};
app.use(allowCrossDomain);

// Passport Strategy
var pass = require('./config/pass.js');

require('./config/routes.js')(app);

// Start server
//var port = process.env.PORT || 8080;
app.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});