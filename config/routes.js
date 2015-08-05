'use strict';

var path = require('path');
    

module.exports = function(app) {
	
  //////////////////////////////////////////////////////// Auth zone
  var auth = require('./auth');
  app.get('/auth/me', auth.validateToken, auth.ensureAuthenticated, auth.getUser);
  app.post('/auth/register', auth.validateToken, auth.ensureUnauthenticated, auth.createUser);
  app.post('/auth/login', auth.validateToken, auth.ensureUnauthenticated, auth.loginUser);
  app.get('/auth/logout', auth.validateToken, auth.ensureAuthenticated, auth.logoutUser);
  //////////////////////////////////////////////////////// Auth zone

  

  var user = require('../app/controllers/user');
  // Check if username and email is available (previously at register)
  // todo: probably should be a query on users
  app.get('/auth/check_username/:username', user.exists);
  app.get('/auth/check_email/:email', user.existsEmail);
  app.get('/user/check_update?', user.canUpdate);


  





  // Session Routes
  var session = require('./session');
  app.get('/auth/session', auth.ensureAuthenticated, session.session);
  app.post('/auth/session', session.login);
  app.delete('/auth/session', session.logout);

  
  // ANGULAR ROUTES
  app.get('*', function(req, res) {
    console.log('routes *');
    res.send('../www/index.html'); // load the single view file (angular will handle the page changes on the front-end)
  });
}