'use strict';

var mongoose = require('mongoose'),
  passport = require('passport');


var session = {


  createTokenJWT: function(req, res, next){

      var expires = moment().add(30,'days').valueOf();        
      var _token = jwt.encode({
          iss: user.id,
          exp: expires,
          parseSession: user._sessionToken
        }, config.session.secret);

      var success = function (response){
          return res.json({
            payload : {
              user : user,
              token : _token
            },
              message : "Authentication successfull"
        });
      }

      var error = function(error){
        return res.status(400).json({payload : {error: error}, message : error.message});
      }


      db.tokenRequest.get(user,'user').then(function(token){
        //if successfull update the token using save on the token obj
        if(!token){
          db.tokenRequest.create({
            'token': _token,
            'user': user
              }).then(success, error);
            }else{
              token.save({'token': _token},{
              success: success,
              error: error
            });
            }
      },error);

  },

  /**
   * Session
   * returns info on authenticated user
   */
  session: function (req, res) {
    res.json(req.user.user_info);
  },

  /**
   * Logout
   * returns nothing
   */
   logout: function (req, res) {
    if(req.user) {
      req.logout();
      res.send(200);
    } else {
      res.send(400, "Not logged in");
    }
  },

  /**
   *  Login
   *  requires: {email, password}
   */
  login: function (req, res, next) {

    var user = req.body.user;
    console.log(user);

    passport.authenticate('local', function(err, user, info) {

      if (err) { 
        return res.status(400).json({
          payload : {error: err}, 
          message : info.message});
      }

      console.log(user)
      
      return res.json({
          payload: newUser.user_info,
          message: "Login success"});

    })(req, res, next);
  }
}

module.exports = session;