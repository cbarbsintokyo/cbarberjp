var gulp = require('gulp');

const argv = require('minimist')(process.argv);
const browserSync = require('browser-sync').create();
const cache = require('gulp-cache');
const cleanCSS = require('gulp-clean-css');
const compiler = require('google-closure-compiler-js').gulp();
const del = require('del');
const gulpIf = require('gulp-if');
const gutil = require('gulp-util');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const prompt = require('gulp-prompt');
const rename = require('gulp-rename');
const rsync = require('gulp-rsync');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const svgSprite = require('gulp-svg-sprite');
const uglify = require('gulp-uglify');
const usemin = require('gulp-usemin');
const useref = require('gulp-useref');

var config = {
  "log": "debug",
  "shape": {
      "spacing": {
          "padding": 5
      }
  },
  "mode": {
    "symbol": {
      "dest": "./",
      "sprite": "svg/sprite.svg"
    }
  }
};


gulp.task('hello', function() {
  // Default runners.
  console.log('Hey there Craig!');
});

// Create SVG sprite.
gulp.task('svgsprite', function() {
  return gulp.src('**/*.svg', {cwd: 'app/images'})
    .pipe(plumber())
    .pipe(svgSprite(config)).on('error', function(error){ console.log(error); })
    .pipe(gulp.dest('dist'))
    .pipe(gulp.dest('dist'))
    .on("finish", function() {
      gutil.log('finished svgsprite')
    })
});

// Move the fonts over.
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

// Image optimization with caching.
gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg|ico)')
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

// Compile sass into css and reload browser.
gulp.task('sass', function() {
  return gulp.src('app/scss/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Minify CSS.
gulp.task('minify-css', function() {
  return gulp.src('app/css/main.css')
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/css/'));
});

// Cleaning.
gulp.task('clean', function() {
  return del.sync('dist');
});

// Shift the files over
gulp.task('useref', function() {
  return gulp.src('app/*.php')
    .pipe(useref())
    .pipe(gulpIf('*.css', cleanCSS()))
    .pipe(gulp.dest('dist'));
});

// BrowserSync.
gulp.task('browserSync', function() {
  browserSync.init({
    open: 'local',
    host: 'localhost/cbarber/app/',
    proxy: 'localhost/cbarber/app/',
    port: 8080
  })
});

// Closure Compiler
gulp.task('closure', function() {
  return gulp.src('dist/js/main.min.js')
    .pipe(compiler({
      compilationLevel: 'SIMPLE',
      warningLevel: 'VERBOSE',
      outputWrapper: '(function(){\n%main%\n}).call(this)',
      jsOutputFile: 'js/main.min.js',  // outputs single file
      createSourceMap: true,
    }))
    .pipe(gulp.dest('dist'));
});



/*
 * Combined tasks.
 */

// Watching for changes and reload browser.
gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/*.php', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

// Default.
gulp.task('default', function(callback) {
  runSequence('clean',
    ['sass', 'useref', 'images', 'svgsprite', 'fonts', 'closure'], callback);
});

// Deploy
gulp.task('deploy', function() {

  // Default options for rsync.
  rsyncConf = {
    args: ["--chmod=ug=rwX,o=rxX"],
    progress: true,
    incremental: true,
    relative: true,
    emptyDirectories: true,
    recursive: true,
    clean: true,
    exclude: [],
  };

  // Staging.
  if (argv.staging) {

    rsyncConf.hostname = ''; // hostname
    rsyncConf.username = ''; // ssh username
    rsyncConf.destination = ''; // path where uploaded files go

  // Production.
  } else if (argv.production) {

    rsyncConf.hostname = '119.81.131.166'; // hostname
    rsyncConf.username = 'cbarberj'; // ssh username
    rsyncConf.root = 'dist'; // ssh username
    rsyncConf.destination = 'public_html'; // path where uploaded files go


  // Missing/Invalid Target.
  } else {
    throwError('deploy', gutil.colors.red('Missing or invalid target'));
  }

  // Use gulp-rsync to sync the files.
  return gulp.src('dist/**')
  .pipe(gulpIf(
      argv.production,
      prompt.confirm({
        message: 'Heads Up! Are you SURE you want to push to PRODUCTION?',
        default: false
      })
  ))
  .pipe(rsync(rsyncConf));

});
