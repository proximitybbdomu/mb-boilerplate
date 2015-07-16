'use strict';

module.exports = function (gulp, $, gutil, opt) {

  return function () {

    return gulp.src(opt.jsConcat)
      .pipe($.plumber({
        errorHandler: function(err) {
          console.log('[JS]'.bold.blue + ' There was an issue in your JavaScript file\n'.bold.red);
          console.log(err.message.red);
          console.log('line: '+err.lineNumber);
        }
      }))
      .pipe($.newer(opt.dev.jsbundle))
      .pipe($.concat('all.js'))
      .pipe($.sourcemaps.init())
      .pipe($.gulpif(opt.argv.debug, $.stripDebug()))
      .pipe($.uglify())
      .pipe($.rename({suffix:".min"}))
      .pipe($.sourcemaps.write('./')) // Write sourcemaps for CSS in the same folde
      .pipe($.size({title:'js'}))
      .pipe(gulp.dest(opt.dev.jsbundle));

  };
};
