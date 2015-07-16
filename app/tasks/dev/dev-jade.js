'use strict';

module.exports = function (gulp, $, gutil, opt) {

  return function () {

    if (opt.argv.l !== undefined) {
       // If -l is specified
      return gulp.src(opt.dev.jade)
        .pipe($.plumber({
          errorHandler: function(err) {
            opt.notifier.notify.onError({
              title: "JADE",
              subtitle: 'error',
              message: "<%= error.message %>"
            })(err);
            opt.beep([1000, 500]);
            console.log('[JADE]'.bold.yellow + ' There was an issue compiling Jade\n'.bold.red);
          }
        }))
        .pipe(opt.reload({ stream: true }));
    }
  };
};
