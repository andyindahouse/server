'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var maxlegth = function (num) {
  // Funcion para reutilizar el mensaje de error de maxlength.
  // Formato : var maxlegth = [40, 'El nº de caracteres de `{PATH}` (`{VALUE}`) no puede superar los `{MAXLENGTH}`.'];
  var array = [];
  array.push(num);
  array.push('El nº de caracteres de `{PATH}` (`{VALUE}`) no puede superar los `{MAXLENGTH}`.');
  return array;
};

var mindate = function () {  
  var array = [];
  console.log(Date());
  array.push(Date());
  array.push('La fecha `{PATH}` (`{VALUE}`) no puede superar los `{MAXLENGTH}`.');
  return array;
};

var EventSchema = new Schema({

  title: {
    type: String,
    unique: false,
    required: true,
    maxlegth: maxlegth(40)
  },

  privacity: {
    type: Number,
    unique: false,
    required: true
  },

  place: {
    type: String,
    unique: false,
    required: false,
    maxlegth: maxlegth(40)
  },

  date: {
    type: Date,
    unique: false,
    required: true,
    min: Date('2015-08-01')
  },

  createAt: {
    type: Date,
    unique: false,
    required: true,
  },

  description: {
    type: String,
    unique: false,
    required: false,
    maxlegth: maxlegth(400)
  },

  owner: {
    type: String,
    unique: false,
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

mongoose.model('Event', EventSchema);