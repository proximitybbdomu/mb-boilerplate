var pkg    = require('./package.json');
var colors = require('colors');
var argv   = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('-p', 'Put the name of your project')
  .command('-l', 'Specify the language (en, ru, jp)')
  .help('h')
  .argv;

var argProgram = argv.p;
var argLanguage = argv.l;
var argDebug = argv.debug;
var version = pkg.version;
var moment = require('moment');
var now = moment().format('YYYY-MM-DD');

if (argProgram === undefined && argLanguage === undefined) {
  console.log('[GULP] Please specify the name of your project and your language (gulp -h for more information)!'.bold.red);
  process.exit();
}

if (argDebug === undefined) {
  var browserSyncOpen = true;
}
else {
  var browserSyncOpen = false;
}

var project = {
  program: argProgram,
  sassdir: argLanguage,
  isDev: true,
  isProd: false,
  isStyleguiding: true
};

var bases = {
  app: './app/',
  dist: './public/',
  docs: './docs/',
  reps: './reports/'
};

module.exports = {
  app: {
    port: 4000,
    version: version,
    program: argProgram,
    sassdir: argLanguage,
    ftpHost: '',
    ftpUser: '',
    ftpPassword: '',
    globs: [
      './public/fonts/' + argProgram + '/' +argLanguage + '/**',
      './public/html/' + argProgram + '/' +argLanguage + '/**',
      './public/images/' + argProgram + '/' +argLanguage + '/**',
      './public/scripts/' + argProgram + '/' +argLanguage + '/**',
      './public/styles/' + argProgram + '/' +argLanguage + '/**'
    ]
  },
  pluginOpts: {
    load: {
      pattern: ['gulp-*', 'gulp.*'],
      // config: './package.json',
      // scope: ['devDependencies'],
      replaceString: /\bgulp[\-.]/,
      rename: {
        'gulp-util'                  : 'gUtil',
        'gulp-minify-css'            : 'minify',
        'gulp-autoprefixer'          : 'prefix',
        'gulp-combine-media-queries' : 'cmq',
        'gulp-if'                    : 'gulpif',
        'gulp-iconfont-css'          : 'iconScss',
        'gulp-jsbeautifier'          : 'prettify',
        'gulp-bower-normalize'       : 'bowerNorm',
        'vinyl-source-stream'        : 'source',
        'lodash.template'            : 'template ',
        'sc5-styleguide'             : 'styleguide',
        'through2'                   : 'through',
        'gulp-header'                : 'addHeader',
        'gulp-check-unused-css'      : 'checkCSS',
        'gulp-compile-handlebars'    : 'handlebars',
        'gulp-sass-graph'            : 'sassGraph',
        'gulp-check-gems'            : 'checkGems',
      }
    },
    font: {
      fontName: 'Icons'
    },
    jade: {
      pretty: true
    },
    gSize: {
      showFiles: true
    },
    browserSync: {
      port   : 4001,
      proxy: 'http://localhost:4000',
      loglevel: 'silent',
      open: browserSyncOpen
    },
    prefix: [
      '> 1%',
      'last 2 versions',
      'firefox >= 4',
      'safari 7',
      'safari 8',
      'IE 10',
      'IE 11'
    ],
    wrap: '(function() { <%= contents %> }());',
    base64: {
      options: {
        baseDir: './public',
        extensions: ['png'],
        maxImageSize: 10 * 1024,// 10ko bytes
        debug: false
      }
    },
    jsbeautifyrc: {
      path: './.jsbeautifyrc'
    }
  },
  watch: {
    sassWatch: bases.app + 'sass/**/*.scss',
    jadeWatch: bases.app + 'views/**/*.jade',
    imgWatch: bases.dist + 'images/' + project.program + '/' + project.sassdir + '/**/*.{png,gif,jpeg,jpg}',
    jsWatch: [
      bases.app + 'scripts/classes/**/*.js',
      bases.app + 'scripts/controllers/**/*.js',
      bases.app + 'scripts/init/**/*.js',
      bases.app + 'scripts/ie/**/*.js',
      bases.app + 'scripts/*.js',
      './.jshintrc',
      './.jsbeautifyrc'
    ],
    dbWatch: './db/' + project.program + '/' + project.sassdir + '/*.json'
  },
  paths: {
    docs: {
      jsdoc: './_frontadmin/modules/jsdoc',
      sassdoc: './_frontadmin/modules/sassdoc',
      styleguide: './_frontadmin/modules/styleguide/' + project.program
    },
    jsConcat: [
      bases.app + 'scripts/namespaces.js',
      bases.app + 'scripts/helpers.js',
      bases.app + 'scripts/init.js',
      bases.app + 'scripts/debugger.js',
      bases.app + 'scripts/webservices-'+ project.program +'.js',
      bases.app + 'scripts/ie/*.js',
      bases.app + 'scripts/classes/*.js',
      bases.app + 'scripts/classes/'+ project.program +'/*.js',
      bases.app + 'scripts/controllers/*.js',
      bases.app + 'scripts/controllers/'+ project.program +'/*.js',
      bases.app + 'scripts/init/*.js'
    ],
    build: {

      regexImagesMin: /(global.)[css]\w+/g,
      regexFontsMin: /(font.)[css]\w+/g,
      cssMin: 'global.min.css',
      fontMin: 'font.min.css',

      cssSrc: [
        bases.dist + 'styles/' + project.program + '/' + project.sassdir + '/*.min.css',
        bases.dist + 'styles/' + project.program + '/' + project.sassdir + '/*.min.map'
      ],
      cssProd     : bases.dist + 'styles-prod/' + project.program + '/' + project.sassdir,
      cssEach: [
        bases.dist + 'styles/' + project.program + '/**/*.min.css',
        bases.dist + 'styles/' + project.program + '/**/*.map'
      ],
      cssLgSpecified: [
        bases.dist + 'styles/' + project.program + '/' + project.sassdir +'/*.css',
        '!' + bases.dist + 'styles/' + project.program + '/' + project.sassdir +'/*.min.css'
      ],
      cssNoSpecified: [
        bases.dist + 'styles/' + project.program + '/**/*.css',
        '!' + bases.dist + 'styles/' + project.program + '/**/*.min.css'
      ],
      cssProgram: bases.dist + 'styles/' + project.program + '/' + project.sassdir,

      svgFont     : bases.dist + 'images/' + project.program + '/' + project.sassdir + '/Layout/Icons/Font/**/*.svg',
      fontIcon    : bases.dist + 'fonts/' + project.program + '/' + project.sassdir + '/Icons',
      iconTpl     : bases.app + 'sass/helpers/_icons-list.scss',
      iconFolder  : bases.app + 'sass/base',

      ftpDest     : project.program + '/www/' + project.sassdir + '/' + version,
      jadeConfig  : '../../../db/'+ argv.p + '/config-'+ argv.l +'.json',
      html        : bases.dist + 'html/' + project.program + '/' + project.sassdir,
      htmlFiles   : bases.dist + 'html/**/*.html',
      htmlIndex   :  bases.dist + 'html/' + project.program + '/' + project.sassdir + '/landings/landing/',

      img         : bases.dist + 'images/' + project.program + '/' + project.sassdir + '/**/*.{png,gif,jpeg,jpg}',
      imgEach     : bases.dist + 'images/' + project.program + '/**/**/*.{png,gif,jpeg,jpg}',
      imgProd     : bases.dist + 'images-prod/' + project.program + '/' + project.sassdir,
      imgProdEach : bases.dist + 'images-prod/' + project.program,

      js : [
        bases.app + 'tasks/**/*.js',
        !bases.dist + 'scripts/bundle/**/*.js',
        !bases.dist + 'scripts/libs/**/*.js'
      ],
      jsLibs: './app/scripts/libs/**/*.js',
      ieFiles : bases.app + 'scripts/ie/*.js',

      criticalHtmlFile: 'public/html/' + project.program + '/' + project.sassdir + '/landings/landing/landing-home.html'
    },
    dev: {
      db: './db/' + project.program + '/' + project.sassdir + '/*.json',
      dbProgram: './db/' + project.program,

      jade: [
        bases.app + 'views/**/*.jade',
        '!' + bases.app + 'views/**/_*.jade',
        '!' + bases.app + 'views/_*/**/*.jade',
        '!' + bases.app + 'views/**/**/_*/*.jade'
      ],
      allJade: bases.app + 'views/**/*.jade',

      sass: bases.app + 'sass/theme/' + project.program + '/' + project.sassdir + '/**/*.{sass,scss}',

      css: bases.dist + 'styles/' + project.program + '/' + project.sassdir,

      jsbundle: bases.dist + 'scripts/build/' + project.program,
      server: [
        './app/controllers/*.js',
        './app/routes/*.js',
        './app.js',
        './gulp-config.js',
        './gulpfile.js',
        './config/express.js',
        './app/tasks/**/*.js'
      ]
    },
    prod: {
      cssExclude: bases.dist + 'styles/' + project.program + '/' + project.sassdir +'/*.map',
      regexImages: /\..\/..\/..\/Images\/[a-zA-Z]+\/[a-zA-Z]+\//g,
      regexFonts: /\..\/..\/..\/Fonts\/[a-zA-Z]+\/[a-zA-Z]+\//g,
      // regexSource: # sourceMappingURL=/,
      cssSitecore: '/' + project.sassdir +'/~/media/'+ project.program + '/System/Images/',
      fontSitecore: '/' + project.sassdir +'/~/media/'+ project.program + '/System/Fonts/',
      dirProdDest: './public/export/' + now,
      dirTmp : bases.dist + 'images-prod/' + project.program + '/**/Tmp',
      dirProd: [
        bases.dist + 'images-prod/**',
        bases.dist + 'styles-prod/**',
        bases.dist + 'scripts/build/**'
      ]
    }
  }
};
