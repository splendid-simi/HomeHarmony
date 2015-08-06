var express = require('express');
var mongoose = require('mongoose');

var app = express;

mongoose.connect('mongod://localhost/homeHarmony');

require('./util/middleware.js');

module.exports = app;
