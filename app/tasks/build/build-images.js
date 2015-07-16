'use strict';

var mozjpeg        = require('imagemin-mozjpeg');
var pngquant       = require('imagemin-pngquant');
// var optipng        = require('imagemin-optipng');

module.exports = function (gulp, $, gutil, opt) {

  return function () {

    if (opt.argv.l !== undefined) {
       // If -l is specified
      return gulp.src(opt.build.img)
        .pipe($.confirm({
          question: function() {
            var files = require('glob').sync(opt.build.img);
            return !files.length ? false : // No file. And do nothing.
              files.length + ' images will be optimized. Do you want to proceed?';
          },
          input: '_key:y' // Continue the flow if `Y` key is pressed.
        }))
        .pipe($.plumber({
          errorHandler: function(err) {
            console.log('[IMAGES]'.bold.blue + ' There was an issue optimizing Images\n'.bold.red);
          }
        }))
        .pipe($.newer(opt.build.imgProd))
        .pipe($.imagemin({
          progressive: true,
          optimizationLevel: 4,
          use: [
            pngquant({
              quality: '80',
              speed: 4
            }),
            mozjpeg({
              quality: 80
            })
          ]
        }))
        .pipe(gulp.dest(opt.build.imgProd))
        .pipe(opt.notifier.notify({
           title: 'IMAGES',
           subtitle: 'success',
           message: 'Images for '+ opt.argv.p + ' ' + opt.argv.l +' optimized with success !',
           onLast: true
        }))
        .pipe(opt.reload({
          stream: true
        }));
    }
    else {
       // If -l is not specified
      return gulp.src(opt.build.imgEach)
        .pipe($.confirm({
          question: function() {
            var files = require('glob').sync(opt.build.imgEach);
            return !files.length ? false : // No file. And do nothing.
              files.length + ' images will be optimized. If you want to minify for a particular project, please specify -l language. Do you want to proceed?';
          },
          input: '_key:y' // Continue the flow if `Y` key is pressed.
        }))
        .pipe($.foreach(function(stream, file){
          return stream
            .pipe($.plumber({
              errorHandler: function(err) {
                console.log('[IMAGES]'.bold.blue + ' There was an issue optimizing Images\n'.bold.red);
              }
            }))
            .pipe($.newer(opt.build.imgProdEach))
            .pipe($.imagemin({
              progressive: true,
              optimizationLevel: 4,
              use: [
                pngquant({
                  quality: '65-80',
                  speed: 4
                }),
                mozjpeg({
                  quality: 70
                })
              ]
            }))
            .pipe(gulp.dest(opt.build.imgProdEach))
        }))
        .pipe(opt.reload({
          stream: true
        }));

    }

  };
};


