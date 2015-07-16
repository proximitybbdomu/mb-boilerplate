'use strict';

module.exports = function (gulp, $, gutil, opt) {

  return function () {

    var critical = require('critical');

    critical.generate({
        base: './',
        src: opt.build.criticalHtmlFile,
        css: opt.reports.cssGlobal,
        dest: opt.dev.css + '/global-init.min.css',
        width: 1024,
        height: 768,
        minify: true,
        ignore: [ /url\(/ ,'@font-face', /print/ ]
    });

  };
};
