'use strict';

module.exports = function (gulp, $, gutil, opt) {

  var validReporter = function (file) {
      gutil.log('File ' + file.path + ' is not valid JSON.');
  };

  return function () {

    if (opt.argv.l === undefined) {
        console.log('[CONFIG]'.bold.magenta + ' You need to specify the language to generate Config file (example: -l en)\n'.bold.red);
        process.exit();
    }
    else {
      return gulp.src(opt.dev.db)
        .pipe($.jsonlint())
        .pipe($.jsonlint.reporter(validReporter))
        .pipe($.jsoncombine('config-'+opt.argv.l+'.json',function(data){
          return new Buffer(JSON.stringify(data));
        }))
        .pipe($.plumber({
          errorHandler: function(err) {
            process.exit();
          }
        }))
        .pipe(gulp.dest(opt.dev.dbProgram));
    }

  };

};

