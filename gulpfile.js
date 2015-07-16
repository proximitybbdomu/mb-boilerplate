#!/usr/bin/env node
'use strict';

var env = process.env.NODE_ENV || 'development';

var gulp           = require('gulp');
var path           = require('path');
var fs             = require('fs');
var argv           = require('yargs').argv;
var es             = require('event-stream');
var shell          = require('shelljs');
var gutil          = require('gulp-util');
var browserSync    = require('browser-sync');
var reload         = browserSync.reload;
var bowerResolve   = require('bower-resolve');
var source         = require('vinyl-source-stream2');
var buffer         = require('vinyl-buffer');
var console        = require('better-console');
var colors         = require('colors');
var beep           = require('beepbeep');
var mainBowerFiles = require('main-bower-files');
var confirm        = require('gulp-confirm');
var runSequence    = require('run-sequence');
var del            = require('del');
var vinylPaths     = require('vinyl-paths');
var assign         = require('lodash.assign');
var notifier       = require('node-notifier');

var pkg            = require('./package.json');
var version        = pkg.version;
var gConfig        = require('./gulp-config');
var pluginOpts     = gConfig.pluginOpts;
var $              = require('gulp-load-plugins')(pluginOpts.load);
var notifier       = require('node-notifier');

var moment         = require('moment');
var now            = moment().format('YYYY-MM-DD');
var os             = require('os');

var opt = {
  "shell": shell,
  "config": gConfig,
  "opts": gConfig.pluginOpts,
  "watch": gConfig.watch,
  "project": gConfig.app,
  "build": gConfig.paths.build,
  "dev": gConfig.paths.dev,
  "docs": gConfig.paths.docs,
  "jsConcat": gConfig.paths.jsConcat,
  "prod": gConfig.paths.prod,
  "argv": argv,
  "fs": fs,
  "path": path,
  "console": console,
  "colors": colors,
  "beep": beep,
  "reload": reload,
  "browserSync": browserSync,
  "source": source,
  "mainBowerFiles": mainBowerFiles,
  "del": del,
  "buffer": buffer,
  "vinylPaths": vinylPaths,
  "moment": moment,
  "now": now,
  "assign":  assign,
  "bowerResolve": bowerResolve,
  "notifier": notifier
};

// require('gulp-stats')(gulp);

function getTask(task) {
  return require('./app/tasks/' + task)(gulp, $, gutil, opt);
}

gulp.task('config', getTask('dev/dev-json'));
gulp.task('sass', getTask('dev/dev-sass'));
gulp.task('jade', getTask('dev/dev-jade'));
gulp.task('js', getTask('dev/dev-js'));
gulp.task('reload', getTask('dev/dev-reload'));
gulp.task('server', getTask('dev/dev-server'));
gulp.task('watch', getTask('dev/dev-watch'));

gulp.task('scsslint', getTask('debug/debug-scsslint'));
gulp.task('eslint', getTask('debug/debug-eslint'));
gulp.task('w3c', getTask('debug/debug-w3c'));

gulp.task('fonts', getTask('build/build-fonts'));
gulp.task('html', getTask('build/build-html'));
gulp.task('css', getTask('build/build-css'));
gulp.task('b-js', getTask('build/build-js'));
gulp.task('img', getTask('build/build-images'));
gulp.task('ftp', getTask('build/build-ftp'));
gulp.task('critical', getTask('build/build-critical'));
gulp.task('browserify', getTask('build/build-browserify'));

var defaultTasks = [
  'config',
  'sass',
  'js',
  'b-js',
  'server',
  'reload',
  'watch'
];

var devTasks = [
  'config',
  'sass',
  'server',
  'reload',
  'watch'
];

var buildTasks = [
  'fonts',
  'css',
  'critical',
  'html',
  'js',
  'img'
];

var deployTasks = [
  'ftp'
];


// 1/ Defaults tasks for the dev mode (with --debug for correction mode)
gulp.task('default', function(callback) {
  runSequence(
    defaultTasks,
    callback
  );
  // To clear your console when you kill gulp
  process.on('exit', function () {
    console.clear();
  });
});

// 1/ Defaults tasks for the dev mode (with --debug for correction mode)
gulp.task('dev', function(callback) {
  runSequence(devTasks, callback);
  // To clear your console when you kill gulp
  process.on('exit', function () {
    console.clear();
  });
});

// 2/ Generate all files for FTP
gulp.task('build', function(callback) {
  runSequence(
    'config',
    buildTasks,
    callback
  );
});

// 3/ To create reports and deploy on FTP
gulp.task('deploy', function(callback) {
  runSequence(
    deployTasks,
    callback
  );
});
