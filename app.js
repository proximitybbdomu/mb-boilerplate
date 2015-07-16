'use strict';

var env = process.env.NODE_ENV || 'development';

// set up ======================================================================
var express     = require('express');
var fs          = require('fs');
var http        = require('http');
var path        = require('path');
var colors      = require('colors');
var console     = require('better-console');
var argv        = require('yargs').argv;

var app = module.exports.app = exports.app = express();

var configJSON = require('./db/program/config-en.json');
var packageJSON = require('./package.json');
var port = process.env.PORT || 4000 || 2455;

require('./config/express')(app, configJSON)


var models_path = './app/models/'
fs.readdirSync(models_path).forEach(function(file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
})

var models_path = './app/routes/page/'
fs.readdirSync(models_path).forEach(function(file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
})

http.createServer(app).listen(port, function() {
  console.warn("## The server is ready! Let's change the world! ##".magenta.bold);
  console.table([ [configJSON.project.name, packageJSON.version, configJSON.project.culture, app.get('port')] ]);
});
