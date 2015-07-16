'use strict';

var ftp            = require('vinyl-ftp');

module.exports = function (gulp, $, gutil, opt) {

  var conn = ftp.create({
    host: opt.project.ftpHost,
    user: opt.project.ftpUser,
    password: opt.project.ftpPassword,
    parallel: 10,
    log: gutil.log
  });

  return function () {

    if (opt.argv.l === undefined) {
      console.log('[FTP]'.bold.red + ' Task aborted, please specify the name and language of the project\n'.bold.red),
      process.exit();
    }
    else {
      return gulp.src(opt.project.globs, {
          base: './public/',
          buffer: false
        })
        .pipe(conn.newer(opt.build.ftpDest))
        .pipe(conn.dest(opt.build.ftpDest));
    };
  };
};
