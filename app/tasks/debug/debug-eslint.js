'use strict';

module.exports = function (gulp, $, gutil, opt) {

  return function () {

    return gulp.src(opt.jsConcat)
      .pipe($.gulpif(opt.argv.debug, $.cached('scripts')))
      .pipe($.gulpif(opt.argv.debug, $.eslint({
        useEslintrc: true,
        configFile: './.eslintrc'
      })))
      .pipe($.gulpif(opt.argv.debug, $.eslint.formatEach()));

  }
}
