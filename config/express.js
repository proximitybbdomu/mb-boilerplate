/**
 * Module dependencies.
 */
var env = process.env.NODE_ENV || 'development';

var pkg = require('../package.json');

var path = require('path');
var util = require('util');

var express = require('express');
var session = require('express-session');
var helpers = require('view-helpers');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash    = require('connect-flash');
var csrf = require('csurf');
var logger = require('morgan');

var colors = require('colors');
var argv = require('yargs').argv;

var rootPath = path.normalize(__dirname + '/../');

var configJSON = require('../db/program/config-en.json');
var oneDay = 86400000;

module.exports = function(app, config) {

  app.set('port', configJSON.project.node.port || 4000);
  app.set('views', './app/views/');
  app.set('view engine', 'jade');

  app.use(logger('dev', {
    skip: function (req, res) { return res.statusCode < 400 }
  }));
  app.use(methodOverride());

  app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
  app.use(bodyParser.json());                                     // parse application/json
  app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(helpers(configJSON.project.name));

  app.use(compression({
    memLevel: 9,
    level: 9
  }));

  /* =================================================
   Session Storage (need cookieParser and session)
  =================================================== */

  // cookieParser is required by session() middleware
  // pass the secret for signed cookies These two *must*
  // be placed in the order shown.

  app.use(cookieParser(configJSON.project.cookie.secret));

  var store = new session.MemoryStore();
  app.use(session({
    secret: configJSON.project.sess.secret,
    store : store,
    resave: true,
    saveUninitialized: true,
    key: configJSON.project.sess.key,
    cookie : {
      maxAge : 604800 // one week,
    }
  }));
  app.use(flash());

  /* =================================================
   Application Routing (and error handling)
  =================================================== */

  // "app.router" positions our routes above the middleware defined below,
  // this means that Express will attempt to match & call routes *before*
  // continuing on, at which point we assume it's a 404 because no route
  // has handled the request.
  app.use('/images', express.static('./public/images'));

  app.locals.config = configJSON;

  if (app.get('env') === 'development') {
    app.locals.pretty = true;
  }


};
