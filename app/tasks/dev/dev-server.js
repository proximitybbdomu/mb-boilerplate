'use strict';

module.exports = function (gulp, $, gutil, opt) {

  return function () {

    if (opt.argv.l === undefined) {
        console.log('[SERVER]'.bold.magenta + ' The server will not launch because you didn\'t specify the language (example: -l en)\n'.bold.red);
    }
    else {
      $.nodemon({
        script: 'app.js',
        args: [' -p ' + opt.argv.p + ' -l ' +opt.argv.l],
        watch: opt.dev.server
      })
      .on('start', function onStart() {
        // disable the console.clear when in production mode
        if (!opt.argv.production && !opt.argv.debug) {
          opt.console.clear();
        }

        // ensure start only got called once
        if (!called) {
          cb();
          console.log('[SERVER]'.bold.magenta + ' The server is probably launched more than one time, please kill the other process'.bold.red);
        }
        called = true;
      })
      .on('change', ['server'])
      .on('restart', function onRestart() {
        if (!opt.argv.production && !opt.argv.debug) {
          opt.console.clear();
        }
        // reload connected browsers after a slight delay
        setTimeout(function reload() {
          opt.reload({
            stream: true   //
          });
        }, 200);
      });
    }
  };
};
