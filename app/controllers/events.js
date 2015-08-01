'use strict';

var mongoose = require('mongoose'),
  passport = require('passport'),
  jwt  = require('jwt-simple'),
  moment = require('moment'),
  config = require('./config.js'),
  EventModel = mongoose.model('Event');


exports.create = function (req, res) {

  //////////////////////////////////////////////////////// DEBUG zone
    console.log('app/controller/event.js');
    console.log('function create event', req.body);
  //////////////////////////////////////////////////////// DEBUG zone
    
  var success = function(){

    return res.status(200).json({
            payload: newUser.user_info,
            message: "Evento creado con éxito"});
  };

  var error = function(err){

    console.log(err);

    return res.status(400).json({
          payload: err.errors,
          message: err.message.message});
  };

  var newEvent = new EventModel(req.body);

  newEvent.save(function(err) {
    if(err)
      error(err);
    else
      success();
  });
  
};