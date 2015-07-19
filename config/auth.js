'use strict';

var mongoose = require('mongoose'),
  passport = require('passport'),
  jwt  = require('jwt-simple'),
  moment = require('moment'),
  config = require('./config.js'),
  UserModel = mongoose.model('User');

// MIDDLEWARES zone ////////////////////////////////////////////////////// 

// Validamos si el "token" está presente o si se cerro sesión.
exports.validateToken = function validateToken(req, res, next){

	//////////////////////////////////////////////////////// DEBUG zone
	console.log('config/auth.js');
	console.log('middleware validateToken');
  //////////////////////////////////////////////////////// DEBUG zone
	var token = req.params["x-access-token"] || req.query["x-access-token"] || req.headers["x-access-token"];

  if(token){

    console.log(token);

    var success = function(){
      console.log('auth.validateToken>>success');
      console.log(req.user);
      next();
    };

    var error = function(){
      console.log('auth.validateToken>>error');
      return res.status(400).json({
        payload : {error: ''}, 
        message : 'Tu sesión ha expirado. Vuelve a loguearte.'
      });

    };

    UserModel.findOne({'hashedToken': token}
      , function(err, user) {
          if(err)
            return next(); // No encuentra token y no está auth. Lo tratamos en el siguiente mddlwr

          //Comprobamos que el token no ha expirado
          var decoded = jwt.decode(user.hashedToken, config.session.secret);
          if(decoded.exp <= Date.now()) 
            error();
          else {
            //req.logIn se está ejecutando en cualquier ruta siempre... :()
            console.log(user);
            req.logIn(user, function(err){
              if(err)
                return next();                                            
              success();
            }); 
          }                              
    });
  } else {
    next();
  }
}

// Validamos si el usuario esta autenticado.
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  console.log(req.user);

  if (!req.isAuthenticated()) { 
  	return res.status(401).json({
  		payload : {}, 
  		message : "Acceso no-autorizado"});
  }
  next();
}

// Nos aseguramos de no mostrar las vistas de login y signup para autenticados.
exports.ensureUnauthenticated = function ensureNoAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
  	return res.status(401).json({
  		payload : {}, 
  		message : "Ya estás logueado"});
  }
  next();
}

// MIDDLEWARES zone //////////////////////////////////////////////////////

// Auth zone ////////////////////////////////////////////////////////

// funcion privada. Creamos o actualizamos el token.
var _updateAuthToken = function (user, req, res) {

  //////////////////////////////////////////////////////// DEBUG zone
    console.log('config/auth.js');
    console.log('Funcion _updateAuthToken');
    console.log('User recibido:');
    console.log(user);
  //////////////////////////////////////////////////////// DEBUG zone  

  var expires = moment().add(30,'days').valueOf();        
  var _token = jwt.encode({
      iss: user._id,
      exp: expires
  }, config.session.secret);

  var success = function(){
    console.log('auth.updateAuthToken>>success');    

    return res.status(200).json({
            payload: {
              user: user.user_info,
              token: user.hashedToken           
            },
            message: "Acceso a cuenta con éxito"});
  };

  var error = function(err){
    console.log('auth.updateAuthToken>>error'); 

    return res.status(400).json({
          payload: err.errors,
          message: err.message.message});
  };

  user.hashedToken = _token;
  UserModel.update({'_id':user._id}, {'hashedToken': user.hashedToken}
    , function(err, num, rawres){
      if (err) 
        error(err);
      
      success();
        
  });
};

exports.loginUser = function (req, res) {

  
  //////////////////////////////////////////////////////// DEBUG zone
    console.log('config/auth.js');
    console.log('Funcion loginUser');
    console.log('User recibido:');
    console.log(req.body);
  //////////////////////////////////////////////////////// DEBUG zone  
    
  var success = function(user){
    console.log('auth.loginUser>>success');
    _updateAuthToken(user, req, res);
  };

  var error = function(err){
    console.log('auth.loginUser>>error');
    console.log(err);
    return res.status(400).json({
          payload: err.errors,
          message: err});
  };

  passport.authenticate('local', function(err,user, info){
    console.log('err' + err);
    console.log('info' + info);
    var err2 = err || info;

    if(err2)
      error(err2);
    else {
      if(!user)
        error(err2);
      else
       success(user);
    }
    
  })(req, res);

    //req.logIn(req.body, error, success);

};

exports.createUser = function (req, res) {

	//////////////////////////////////////////////////////// DEBUG zone
    console.log('config/auth.js');
    console.log('Funcion createUser');
    console.log('User recibido:');
    console.log(req.body);
  //////////////////////////////////////////////////////// DEBUG zone  
    
  var success = function(){

    return res.status(200).json({
            payload: newUser.user_info,
            message: "Cuenta creada con éxito"});
  };

  var error = function(err){

    console.log(err);

  	return res.status(400).json({
          payload: err.errors,
          message: err.message.message});
  };

  var newUser = new UserModel(req.body);
  newUser.save(function(err) {
    if(err)
      error(err);
    else
      success();
  });
};

exports.logoutUser = function (req, res) {

  
  //////////////////////////////////////////////////////// DEBUG zone
    console.log('config/auth.js');
    console.log('Funcion logout');
    console.log(req.user);
  //////////////////////////////////////////////////////// DEBUG zone  
    
  var success = function(){

    return res.json({
            payload: {},
            message: "Logout ejecutado con éxito."});
  };

  var error = function(err){

    return res.json({
            payload: {},
            message: "Logout ejecutado sin éxito."});
  };

  UserModel.update({'_id':req.user._id}, {'hashedToken': ""}
  , function(err, num, rawres){
    if (err) 
      error(err);
    
    success();
      
  });

};

exports.getUser = function (req, res) {

  //////////////////////////////////////////////////////// DEBUG zone
    console.log('config/auth.js');
    console.log('Funcion getUser');
    console.log('User:');
    console.log(req.user);
  //////////////////////////////////////////////////////// DEBUG zone  
    
    return res.json({
        payload: req.user,
        message: "ping successful"
    });
};

// Auth zone ////////////////////////////////////////////////////////