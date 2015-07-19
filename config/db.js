'use strict';

var mongoose = require('mongoose'),
	config = require('./config.js');

exports.mongoose = mongoose;
exports.db = mongoose.connect(config.db, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + config.db + '. ' + err);
  } else {
    console.log ('Successfully connected to: ' + config.db);
  }
});