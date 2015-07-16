'use strict';

module.exports = function (gulp, $, gutil, opt) {

  return function () {

    var scsslint = require('gulp-scss-lint');

    return gulp.src(['./app/sass/layout/static/*.scss'])
        .pipe($.gulpif(opt.argv.debug, $.cached('scsslint')))
        .pipe($.gulpif(opt.argv.debug, scsslint({
            'config': './.scss-lint.yml',
            'maxBuffer': 3007200
        })));

  }
}
