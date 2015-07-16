'use strict';

module.exports = function (gulp, $, gutil, opt) {

  return function () {
    opt.browserSync.init(null, {
      logPrefix: opt.project.port, // Tells BrowserSync on where the express app is running
      proxy: opt.opts.browserSync.proxy,
      port: opt.opts.browserSync.port, // This port should be different from the express app port
      logFileChanges: true,
      logConnections: false,
      logLevel: opt.opts.browserSync.loglevel,  // loglevel: "info", // Enable to see with ports are used + external UI
      open: opt.opts.browserSync.open,
      injectChanges: true,
      timestamps: false,
      ui: {
        port: 8085,
        weinre: {
          port: 9090
        }
      },
      ghostMode: {
        clicks: true,
        forms: true,
        scroll: false
      }
    });
  };

};
