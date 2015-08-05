'use strict';

var path = require('path');
    

module.exports = function(app) {
	
  //////////////////////////////////////////////////////// Auth & User zone
  var auth = require('./auth');
  app.get('/auth/me', auth.validateToken, auth.ensureAuthenticated, auth.getUser);
  app.post('/auth/register', auth.validateToken, auth.ensureUnauthenticated, auth.createUser);
  app.post('/auth/login', auth.validateToken, auth.ensureUnauthenticated, auth.loginUser);
  app.get('/auth/logout', auth.validateToken, auth.ensureAuthenticated, auth.logoutUser);
  

  

  var user = require('../app/controllers/user');
  // Check if username and email is available (previously at register)
  // todo: probably should be a query on users
  app.get('/auth/check_username/:username', user.exists);
  app.get('/auth/check_email/:email', user.existsEmail);
  app.get('/user/check_update?', user.canUpdate);

  //////////////////////////////////////////////////////// Event zone
  var event = require('../app/controllers/event');

  app.get('/event/:id', auth.validateToken, auth.ensureAuthenticated, event.getEvent);
  app.get('/event/all', auth.validateToken, auth.ensureAuthenticated, event.getEvents);
  app.post('/event/create', auth.validateToken, auth.ensureAuthenticated, event.createEvent);
  app.put('/event/update', auth.validateToken, auth.ensureAuthenticated, event.updateEvent);
  app.delete('/event/delete', auth.validateToken, auth.ensureAuthenticated, event.deleteEvent);





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