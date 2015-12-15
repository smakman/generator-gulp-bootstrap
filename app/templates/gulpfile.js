'use strict';
// generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    del = require('del'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    include = require('gulp-include'),
    ejs = require('gulp-ejs'),
    gutil = require('gulp-util'),
    revall = require('gulp-rev-all'),
    livereload = require('gulp-livereload'),
    gulpif = require('gulp-if'),
    flatten = require('gulp-flatten'),
    iconfont = require('gulp-iconfont'),
    iconfontCss = require('gulp-iconfont-css'),
    sprity = require('sprity');
    
// Define paths
var paths = {  
  scripts:   ['./src/js/*.js'],
  styles:    ['./src/css/*.{scss,sass,css}'],
  images:    ['./src/images/**', '!./src/images/sprite/**', '!./src/images/sprite/'],
  templates: ['./src/templates/*.ejs']
};

// CSS
gulp.task('css', function() {
  return sass(paths.styles, {
    style: 'expanded',
    loadPath: [
      process.cwd() + '/src/css/partials',
      process.cwd() + '/src/vendor'
    ]
  })
  .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
  .pipe(gulp.dest('dist/assets/css'))
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .pipe(gulp.dest('dist/assets/css'))
  .pipe(notify({ message: 'CSS task complete' }));
});

// Javascript
gulp.task('js', function() {
  return gulp.src(paths.scripts)
    .pipe(include().on('error', gutil.log))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(notify({ message: 'JS task complete' }));
});

// Sprite generation
gulp.task('sprites', function(cb) {
  return sprity.src({
    src: './src/images/sprite/*.png',
    style: './_sprite.sass',
    processor: 'sass',
    'style-type': 'sass',
    prefix: 'sprite',
    dimension: [{
      ratio: 1, dpi: 72
    }, {
      ratio: 2, dpi: 192
    }],
  }).on('error', function(err) {
    gutil.log(err.toString());
    cb();
  })
  .pipe(gulpif('*.png', gulp.dest('./src/images/'), gulp.dest('./src/css/partials/')))
});

// Optimize images
gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/assets/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Templates
gulp.task('templates', function() {
  return gulp.src(paths.templates)
    .pipe(ejs().on('error', gutil.log))
    .pipe(gulp.dest('dist'))
    .pipe(notify({ message: 'Templates task complete' }));
});

// Clean up
gulp.task('clean', function() {
  return del(['dist/assets/css', 'dist/assets/js', 'dist/assets/images', 'dist/assets/fonts', 'dist/*.html']);
});

// Rev all files
gulp.task('rev', function () {
  gulp.src('dist/**')
    .pipe(revall({ ignore: [/^\/favicon.ico$/g, '.html'] }))
    .pipe(gulp.dest('rev'));
});

// Copy fonts
gulp.task('fonts', function() {
  gulp.src('src/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe(flatten())
    .pipe(gulp.dest('dist/assets/fonts'));
});

// Create icon font
var fontName = 'webicons';
gulp.task('iconfont', function(){
  gulp.src(['./src/images/icons/*.svg'])
    .pipe(iconfontCss({
      fontName: fontName,
      targetPath: '../css/partials/_icons.scss',
      fontPath: '../fonts/'
    }))
    .pipe(iconfont({
      fontName: fontName
     }))
    .pipe(gulp.dest('./src/fonts'));
});

// Default task
gulp.task('default', ['clean', 'sprites', 'iconfont'], function() {
  gulp.start('css', 'js', 'images', 'templates', 'fonts');
});

// Setup connect server
gulp.task('connect', function() {
  var connect = require('connect');
  var app = connect()
      .use(require('connect-livereload')({ port: 35729 }))
      .use(require('serve-static')('dist'))
      .use(require('serve-index')('dist'));
        
  require('http').createServer(app)
    .listen(9000)
    .on('listening', function() {
      console.log('Started connect web server on http://localhost:9000');
    });
});

// Serve
gulp.task('serve', ['connect'], function() {
  require('opn')('http://localhost:9000');
});

// Watch
gulp.task('watch', ['connect', 'serve'], function() {

  // Watch SASS files
  gulp.watch('src/css/**/*.sass', ['css']);
  
  // Watch JS files
  gulp.watch('src/js/**/*.js', ['js']);

  // Watch image files
  gulp.watch(paths.images, ['images']);

  // Watch iconfonts files
  gulp.watch('./src/images/icons/*.svg', ['iconfont', 'fonts']);
  
  // Watch sprite folder
  gulp.watch('./src/images/sprite/*.png', ['sprites']);

  // Watch template files
  gulp.watch('./src/templates/**/*.ejs', ['templates']);
  
  // Watch for fonts
  gulp.watch('./src/**/*.{eot,svg,ttf,woff,woff2}', ['fonts']);
  
  // Create LiveReload server
  livereload({ start: true });

  // Watch any files in assets folder reload on change
  gulp.watch(['dist/assets/**', 'dist/*.html']).on('change', function(file) {
    livereload.changed(file.path);
  });

});