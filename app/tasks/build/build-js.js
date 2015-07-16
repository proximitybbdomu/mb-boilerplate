'use strict';

module.exports = function (gulp, $, gutil, opt) {

  return function () {

    return gulp.src(opt.build.jsLibs)
      .pipe($.newer(opt.dev.jsbundle))
      .pipe($.concat('plugins.js'))
      .pipe($.sourcemaps.init())
      .pipe($.uglify())
      .pipe($.rename({suffix:".min"}))
      .pipe($.sourcemaps.write('./')) // Write sourcemaps for CSS in the same folde
      .pipe($.size({title:'js'}))
      .pipe(gulp.dest(opt.dev.jsbundle));

  };
};
