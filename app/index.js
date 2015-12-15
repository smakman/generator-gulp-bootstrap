'use strict';
var fs = require('fs');
var util = require('util');
var path = require('path');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');
var mkdirp = require('mkdirp');

var AppGenerator = module.exports = function Appgenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
  
  this.options = options;
  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(AppGenerator, yeoman.generators.Base);

AppGenerator.prototype.gulpfile = function () {
  this.template('gulpfile.js');
};

AppGenerator.prototype.packageJSON = function () {
  this.template('_package.json', 'package.json');
};

AppGenerator.prototype.git = function () {
  this.copy('gitignore', '.gitignore');
};

AppGenerator.prototype.bowerJSON = function () {
  this.template('_bower.json', 'bower.json');
};

AppGenerator.prototype.bowerrc = function () {
  this.copy('bowerrc', '.bowerrc');
};

AppGenerator.prototype.jshint = function () {
  this.copy('jshintrc', '.jshintrc');
};

AppGenerator.prototype.source = function () {
  this.directory('src');
};

AppGenerator.prototype.misc = function() {
  mkdirp('src/images/sprite');
  mkdirp('src/images/icons');
};

AppGenerator.prototype.install = function () {
  this.installDependencies();
};