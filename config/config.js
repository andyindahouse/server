'use strict';

var config = {};
config.session = {};

config.port = process.env.PORT || 8080;
config.db = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/tldb';
config.session.secret = process.env.EXPRESS_SECRET || 'Cadena-para-crear-hash-TL-rules';

module.exports = config;
