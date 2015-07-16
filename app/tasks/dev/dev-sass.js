'use strict';

module.exports = function (gulp, $, gutil, opt) {

    return function () {

        var sassOptions = {
            errLogToConsole: true,
            outputStyle: 'expanded'
        };

        if (opt.argv.l === undefined) {
            console.log('[SASS]'.bold.magenta + ' You need to specify the language to generate Sass file (-l en)\n'.bold.red);
            process.exit();
        }
        else {
            gulp.src(opt.dev.sass)
                // .pipe($.newer(opt.dev.css))
                .pipe($.ignore.exclude('app/sass/base/_icons-list.{sass,scss}'))
                .pipe($.plumber({
                    errorHandler: function(err) {
                        if (err.plugin !== '' || undefined ) {
                            console.log('[SASS]'.bold.magenta + ' There was an issue with the plugin '.bold.red + err.plugin.bold.red + err);
                        }
                        else {
                            console.log('[SASS]'.bold.magenta + ' There was an issue with compiling Sass\n'.bold.red);
                        }
                    }
                }))
                .pipe($.sourcemaps.init())
                .pipe($.sass(sassOptions))
                .pipe($.sourcemaps.write('/'))
                .pipe($.prefix({ browsers: opt.opts.prefix }))
                .pipe($.gulpif(opt.argv.l === 'ar', $.rtlcss({'options':{'autoRename':false}})))
                .pipe(gulp.dest(opt.dev.css))
                .pipe(opt.reload({ stream:true }));
        }

    };
};
//

