'use strict';

module.exports = function (gulp, $, gutil, opt) {

  return function () {

    // Watch SASS files
    gulp.watch(opt.watch.sassWatch, ['sass', 'scsslint', 'sassdoc']);

    // Watch JS files
    gulp.watch(opt.watch.jsWatch, ['js', 'eslint', 'jsdoc']);

    // Watch JADE files
    gulp.watch(opt.watch.jadeWatch, ['jade']);

    // Watch IMG files
    gulp.watch(opt.watch.imgWatch, ['img']);

    // Watch JSON files in config
    gulp.watch(opt.watch.db, ['config']);

    // Watch JS libs files
    gulp.watch(opt.build.jsLibs, ['b-js']);


  };
};
