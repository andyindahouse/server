'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto');

var EventSchema = new Schema({

  title: {
    type: String,
    unique: false,
    required: true
  },

  privacity: {
    type: String,
    unique: false,
    required: true
  },

  place: {
    type: String,
    unique: false,
    required: false
  },

  date: {
    type: Date,
    unique: false,
    required: true
  },

  description: {
    type: String,
    unique: false,
    required: true
  },

  owner: {
    type: String,
    unique: true,
    required: true
  },

  pic: String,
  maker: String,
  type: String,
  n_assistants: String,

  assistants :[{
    _id: String,
    username: String,
    state: String,
    pic: String,
    email: String
  }]

});