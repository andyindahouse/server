'use strict';

var mongoose = require('mongoose'),
  Promise = require('mpromise'),
  passport = require('passport'),
  ObjectId = mongoose.Types.ObjectId,
  UserModel = mongoose.model('User');
  //User = require('../models/User');


/**
 *  Show profile
 *  returns {username, profile}
 */
exports.show = function (req, res, next) {
  var userId = req.params.userId;

  User.findById(ObjectId(userId), function (err, user) {
    if (err) {
      return next(new Error('Failed to load User'));
    }
    if (user) {
      res.send({username: user.username, profile: user.profile });
    } else {
      res.send(404, 'USER_NOT_FOUND')
    }
  });
};


// CHECKS FOR REGISTER

/**
 *  Username exists
 *  returns {exists}
 */
exports.exists = function (req, res, next) {
  var username = req.params.username;

  UserModel.findOne({ username : username }, function (err, user) {
    if (err) {
      return next(new Error('Failed to load User ' + username));
    }

    if(user) {
      console.log('existe');
      res.json({exists: true});
    } else {
      console.log('no existe');
      res.json({exists: false});
    }
  });
}

/**
 *  Email exists
 *  returns {exists}
 */

exports.existsEmail = function (req, res, next) {
  var email = req.params.email;
  
  UserModel.findOne({ email : email }, function (err, user) {
    if (err) {
      return next(new Error('Failed to load User ' + username));
    }

    if(user) {
      console.log('existe');
      res.json({exists: true});
    } else {
      console.log('no existe');
      res.json({exists: false});
    }
  });
}
