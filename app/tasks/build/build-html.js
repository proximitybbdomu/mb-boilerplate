'use strict';

module.exports = function (gulp, $, gutil, opt) {

  return function () {

    if (opt.argv.l !== undefined) {
       // If -l is specified
      return  gulp.src(opt.dev.jade)
        .pipe($.confirm({
          question: function() {
            var files = require('glob').sync(opt.dev.allJade);
            return !files.length ? false : // No file. And do nothing.
              files.length + ' files will be convert to HTML. Do you want to proceed?';
          },
          input: '_key:y' // Continue the flow if `Y` key is pressed.
        }))
        .pipe($.plumber({
          errorHandler: function(err) {
            console.log('[JADE]'.bold.yellow + ' There was an issue compiling Jade\n'.bold.red);
          }
        }))
        // .pipe($.cached('Jade'))
        .pipe($.data(function(file) {
          return require(opt.build.jadeConfig);
        }))
        .pipe($.changed(opt.build.html, {
          extension: '.html'
        }))
        .pipe($.jade({
          pretty: true
        }))
        .pipe($.replace(opt.build.regexImagesMin, opt.build.cssMin))
        .pipe($.replace(opt.build.regexFontsMin, opt.build.fontMin))
        .pipe(gulp.dest(opt.build.html));
    }
    else {


    }

  };

};
