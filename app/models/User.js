'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto');

var UserSchema = new Schema({

  avatar: {
    type: String,
    unique: false,
    required: false
  },

  picbg: {
    type: String,
    unique: false,
    required: false
  },

  state: {
    type: String,
    unique: false,
    required: false
  },

  email: {
    type: String,
    unique: true,
    required: true
  },

  username: {
    type: String,
    unique: true,
    required: true
  },

  hashedPassword: String,
  salt: String,
  provider: String,
  hashedToken: String,

  events    :[{
    _id: String,
    title: String,    
    place: String,
    date: Date,
    pic: String
  }],

  contacts  :[{
    _id: String,
    username: String,
    state: String,
    pic: String,
    email: String
  }],

  notifys   : [{
    _id: String,
    type: String,
    event : {
      _id: String,
      title: String,
    },
    actor: {
      _id: String,
      username: String
    }
  }]

});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });


UserSchema
  .virtual('user_info')
  .get(function () {
    return { 
      '_id': this._id, 
      'username': this.username, 
      'email': this.email,
      'state': this.state,
      'avatar': this.avatar,
      'picbg': this.picbg,
      'events': this.events,
      'contacts': this.contacts
      };
  });

/**
 * Validations
 */

var validatePresenceOf = function (value) {
  return value && value.length;
};

UserSchema.path('email').validate(
  function (email) {
    console.log('es nuevo?' + this.isNew);
    console.log('validando mail...' + email);
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    console.log(emailRegex.test(email));
    return emailRegex.test(email);
  }
  , 'El correo electronico no es válido.');

UserSchema.path('email').validate(
  function(value, respond) {
    console.log('validando mail...2');
    mongoose.models["User"].findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) return respond(false);
      respond(true);
    });
  }, 'Este correo eléctronico ya está registrado.');

UserSchema.path('username').validate(
  function(value, respond) {
    console.log('validando username...');
    mongoose.models["User"].findOne({username: value}, function(err, user) {
      if(err) throw err;
      if(user) return respond(false);
      respond(true);
    });
  }, 'El nombre de usuario ya está cogido.');

/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {

  console.log('es nuevo?' + this.isNew);

  if (!this.isNew) {
    return next();
  }

  if (!validatePresenceOf(this.password)) {
    next(new Error('Invalid password'));
  }
  else {
    next();
  }
});

/**
 * Methods
 */

UserSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   */

  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   */

  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   */

  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

mongoose.model('User', UserSchema);