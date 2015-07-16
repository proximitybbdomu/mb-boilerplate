'use strict';

var env = process.env.NODE_ENV || 'development';

// set up ======================================================================
var express     = require('express');
var fs          = require('fs');
var http        = require('http');
var path        = require('path');
var colors      = require('colors');
var console     = require('better-console');
var packageJSON = require('./package.json');
var argv        = require('yargs').argv;

var app = module.exports.app = exports.app = express();

var configJSON = require('./db/'+ argv.p +'/config-'+argv.l.substring(0, 2)+'.json');
var projectName = configJSON.project.name;
var projectCulture = configJSON.project.culture || 'blank';

var models_path = __dirname + '/app/models/'
fs.readdirSync(models_path).forEach(function(file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
})

// express settings ============================================================
require('./config/express')(app, configJSON)


var requireFiles = function (directory, app) {
  fs.readdirSync(directory).forEach(function (fileName) {
    // Recurse if directory
    if(fs.lstatSync(directory + '/' + fileName).isDirectory()) {
      requireFiles(directory + '/' + fileName, app);
    } else {

      // Skip this file
      if(fileName === 'index.js' && directory === __dirname) return;

      // // Skip unknown filetypes
      // if(validFileTypes.indexOf(fileName.split('.').pop()) === -1) return;

      // Require the file.
      require(directory + '/' + fileName)(app);
    }
  })
}

requireFiles('./app/routes/landing', app);


var port = process.env.PORT || 4000 || 2455;

http.createServer(app).listen(port, function() {
  console.warn("## The server is ready! Let's change the world! ##".magenta.bold);
  console.table([ [projectName, packageJSON.version, projectCulture, app.get('port')] ]);
});
