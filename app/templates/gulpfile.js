'use strict';
// generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    include = require('gulp-include'),
    ejs = require('gulp-ejs'),
    gutil = require('gulp-util'),
    rev = require('gulp-rev'),
    revall = require('gulp-rev-all'),
    livereload = require('gulp-livereload'),
    gulpif = require('gulp-if'),
    sprite = require('css-sprite').stream,
    flatten = require('gulp-flatten');
    
// Define paths
var paths = {  
  scripts:   ['src/js/*.coffee', 'src/js/*.js'],
  styles:    ['src/css/*.scss', 'src/css/*.sass', 'src/css/*.css'],
  images:    ['src/images/*.png'],
  templates: ['src/templates/*.ejs']
};

// CSS
gulp.task('css', function() {
  return gulp.src(paths.styles)
    .pipe(sass({ 
      style: 'expanded',
      loadPath: [
        process.cwd() + '/src/css/partials',
        process.cwd() + '/src/vendor'
      ]
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('html/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('html/assets/css'))
    .pipe(notify({ message: 'CSS task complete' }));
});

// Javascript
gulp.task('js', function() {
  return gulp.src(paths.scripts)
    .pipe(include())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('html/assets/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('html/assets/js'))
    .pipe(notify({ message: 'JS task complete' }));
});

// Generate sprite
gulp.task('sprites', function () {
  return gulp.src('./src/images/sprite/*.png')
    .pipe(sprite({
      name: 'sprite.png',
      style: '_sprite.sass',
      cssPath: '../images',
      processor: 'sass',
      retina: true
    }).on('error', gutil.log))
    .pipe(gulpif('*.png', gulp.dest('./src/images/'), gulp.dest('./src/css/partials/')))    
    .pipe(notify({ message: 'Sprites task complete' }));
});

// Optimize images
gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('html/assets/images'))
    //.pipe(rev())
    //.pipe(gulp.dest('html/assets/images'))
    //.pipe(rev.manifest())
    //.pipe(gulp.dest('.'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Templates
gulp.task('templates', function() {
  return gulp.src(paths.templates)
    .pipe(ejs().on('error', gutil.log))
    .pipe(gulp.dest('html'))
    .pipe(notify({ message: 'Templates task complete' }));
});

// Clean up
gulp.task('clean', function() {
  return gulp.src(['html/assets/css', 'html/assets/js', 'html/assets/images', 'html/assets/fonts', 'html/*.html'], {read: false})
    .pipe(clean());
});

// Rev all files
gulp.task('rev', function () {
  gulp.src('html/**')
    .pipe(revall({ ignore: [/^\/favicon.ico$/g, '.html'] }))
    .pipe(gulp.dest('rev'));
});

// Copy fonts
gulp.task('fonts', function() {
  gulp.src(['src/**/*.eot','src/**/*.svg','src/**/*.ttf','src/**/*.woff'])
    .pipe(flatten())
    .pipe(gulp.dest('html/assets/fonts'));
});

// Default task
gulp.task('default', ['clean', 'sprites'], function() {
  gulp.start('css', 'js', 'images', 'templates', 'fonts');
});

// Setup connect server
gulp.task('connect', function() {
  var connect = require('connect');
  var app = connect()
      .use(require('connect-livereload')({ port: 35729 }))
      .use(connect.static('html'))
      .use(connect.directory('html'));
        
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
  
  // Watch sprite folder
  gulp.watch('src/images/sprite/*.png', ['sprites']);

  // Watch template files
  gulp.watch('src/templates/**/*.ejs', ['templates']);
  
  // Watch for fonts
  gulp.watch(['src/**/*.eot','src/**/*.svg','src/**/*.ttf','src/**/*.woff'], ['fonts']);
  
  // Create LiveReload server
  var server = livereload();

  // Watch any files in assets folder reload on change
  gulp.watch(['html/assets/**', 'html/*.html']).on('change', function(file) {
    server.changed(file.path);
  });

});