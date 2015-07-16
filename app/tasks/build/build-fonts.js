'use strict';

module.exports = function (gulp, $, gutil, opt) {

  return function () {
    return gulp.src(opt.build.svgFont)
      .pipe($.plumber({
          errorHandler: function(err) {
            console.log('[FONTS]'.bold.magenta + ' There was an issue compiling Fonts\n'.bold.red);
          }
      }))
      .pipe($.iconfont({
        fontName: opt.opts.font.fontName,
        centerHorizontally: true,
        fixedWidth: true,
        normalize: true,
        appendCodepoints: true // recommended option
      }))
      .on('codepoints', function(codepoints, options) {
        gulp.src(opt.build.iconTpl)
          .pipe($.consolidate('lodash', {
            glyphs: codepoints,
            fontName: opt.opts.font.fontName,
            className: 'icon'
          }))
          .pipe(gulp.dest(opt.build.iconFolder));
      })
      .pipe(gulp.dest(opt.build.fontIcon));
  };

};
