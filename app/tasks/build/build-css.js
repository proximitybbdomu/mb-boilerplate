'use strict';

module.exports = function (gulp, $, gutil, opt) {

  return function () {

    // Remove .min and .map before to re-generate .min and .map
    opt.del(opt.build.cssEach);

    if (opt.argv.l !== undefined) {
       // If -l is specified
      return gulp.src(opt.build.cssLgSpecified)
        // .pipe($.shorthand())
        .pipe($.base64(opt.opts.base64.options))
        .pipe($.cmq({ log: false }))
        .pipe($.minify())
        .pipe($.rename({ suffix: '.min' }))
        .pipe($.size({ showFiles: true, gzip: true }))
        .pipe(gulp.dest(opt.dev.css));
    }
    else {
       // If -l is not specified
      return gulp.src(opt.build.cssNoSpecified)
        .pipe($.foreach(function(stream, file){
          return stream
            // .pipe($.shorthand())
            .pipe($.base64(opt.opts.base64.options))
            .pipe($.cmq({ log: false }))
            .pipe($.minify())
            .pipe($.rename({ suffix: '.min' }))
            .pipe($.sourcemaps.write('/')) // Write sourcemaps for CSS in the same folde
            .pipe($.size({ showFiles: true, gzip: true }))
            .pipe(gulp.dest(opt.build.cssProgram))
        }));
    }
  };

};



