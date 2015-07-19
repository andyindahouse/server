'use strict';

var mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    UserModel = mongoose.model('User');

  // Serialize sessions
  passport.serializeUser(function(user, done) {
    console.log('serializar user' + user._id);
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    console.log('desserializar user');
    UserModel.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // Use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(value, password, next) {
      //////////////////////////////////////////////////////// DEBUG zone
        console.log('config/pass.js');
        console.log('Funcion passport-localStrategy');
        console.log('Email & password recibido:');
        console.log(value);
        console.log(password);
      //////////////////////////////////////////////////////// DEBUG zone  

      var success = function(user){
        console.log('passport>>success');
        return next(null, user);        
      };

      var error = function(err){
        console.log('passport>>error');
        console.log('passport>>errorDB');
        console.log(err);
        return next(err);
      };

      UserModel.findOne({'email': value}, 
        function(err, user) {
          console.log(err);
          console.log(user);

          if(err)
            error(err);
          
          if(!user){
            console.log('user no existe');
            return next(null, false, {
              'errors': {
                'email': { 
                  message: 'Este correo eléctronico no está registrado.'}
            }});
          } else {
            if(!user.authenticate(password))
              return next(null, false, {
                'errors': {
                  'password': { 
                    message: 'La contraseña no es correcta.'}
               }});
            else
              success(user);
          }
      });
    }
  ));