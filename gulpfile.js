var gulp = require('gulp');

const browserSync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const compiler = require('google-closure-compiler-js').gulp();
const del = require('del');
const gulpIf = require('gulp-if');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const usemin = require('gulp-usemin');
const useref = require('gulp-useref');


gulp.task('hello', function() {
  // Default runners.
  console.log('Hey there Craig!');
});

// Move the fonts over
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

// Compile sass into css and reload browser.
gulp.task('sass', function() {
  return gulp.src('app/scss/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'))
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
  return gulp.src('app/*.html')
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
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

// Default.
gulp.task('default', function(callback) {
  runSequence('clean',
    ['sass', 'useref', 'fonts', 'closure'], callback);
});
