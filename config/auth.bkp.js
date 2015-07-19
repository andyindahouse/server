'use strict';

var mongoose = require('mongoose'),
  Q = require('q'),
  Promise = require('mpromise'),
  passport = require('passport'),
  ObjectId = mongoose.Types.ObjectId,
  UserModel = mongoose.model('User');
  //User = 
  //user = require('../app/controllers/user.js');


/**
 *  Validamos si el "token" esta presente o si se cerro sesión.
 *	
 */
exports.validateToken = function validateToken(req, res, next){

	//////////////////////////////////////////////////////// DEBUG zone
	    console.log('config/auth.js');
	    console.log('middleware validateToken');
    //////////////////////////////////////////////////////// DEBUG zone
	
	next();
}

/**
 *  Route middleware to ensure user is authenticated.
 */
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) { 
  	return res.status(401).json({
  		payload : {}, 
  		message : "Acceso no-autorizado"});
  }
  next();
}

/**
 *  Route middleware to ensure user is no authenticated.
 *  Nos aseguramos de no mostrar las vistas de login y singup para autenticados.
 */
exports.ensureNoAuthenticated = function ensureNoAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
  	return res.status(401).json({
  		payload : {}, 
  		message : "Ya estás logueado"});
  }
  next();
}

/**
 * Create user
 * requires: {username, password, email}
 * returns: {email, password}
 */

exports.createUser = function (req, res) {

  
	//////////////////////////////////////////////////////// DEBUG zone
	    console.log('config/auth.js');
	    console.log('Funcion createUser');
	    console.log('User recibido:');
	    console.log(req.body);
    //////////////////////////////////////////////////////// DEBUG zone  

    
    var newUser = new UserModel(req.body);

    //console.log(newUser);

	/*

		//Q.fcall(newUser.validateAndAddUser()).fail(error).done(success);
	
	newUser.validateAndAddUser()
	.onFulFill(success)
	.onReject(error);









	newUser.save()
		.exec()
		.onResolve(function(){
	    	console.log(newUser);
	    	res.status(200).json({
		            payload: 'lololo',
		            message: "Cuenta creada con éxito"});
    	})
	    .onReject(function(err){
	    	res.status(400).json({
		          payload: err.code,
		          message: err});
	    });*/

	/*
	console.log(newUser);
	// Promise
	newUser.validateAndAddUser(req, res).fulfill();*/

    /*
    var success = function(user){
    	res.status(200).json({
	            payload: newUser.user_info,
	            message: "Cuenta creada con éxito"});
    };

    var error = function(err){
    	res.status(400).json({
	          payload: err.code,
	          message: err});
    };

    user.create(req.body).then(success, error);


	/*




	newUser.save(function(err) {

	    if (err) {
	      console.log(err)
	      return res.status(400).json({
	          payload: err.code,
	          message: err});
	    }

	    console.log(newUser);
	    
	    return  res.status(200).json({
	            payload: newUser.user_info,
	            message: "Account successfully created"});

	    	/*
	    	req.logIn(newUser, function(err) {
		      if (err){
		        console.log('error req.logIn' + err);
		        return next(err);     
		      } 
		      return res.json({
		          payload: newUser.user_info,
		          message: "Account successfully created and logged"
		     });

	}).exec();*/

};