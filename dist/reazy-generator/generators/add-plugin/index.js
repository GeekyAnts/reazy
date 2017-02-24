'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var generators = require('yeoman-generator');
var fs = require('fs');

module.exports = generators.Base.extend({
  constructor: function constructor(args, opts) {
    if (opts.plugin.indexOf('reazy-') === 0) {
      this.pluginName = opts.plugin;
      this.pluginPath = opts.plugin;
    } else if (opts.plugin.indexOf('../') === 0) {
      this.pluginName = '../reazy-' + opts.plugin.substring(3);
      this.pluginPath = 'reazy-' + opts.plugin.substring(3);
    } else {
      this.pluginName = 'reazy-' + opts.plugin;
      this.pluginPath = 'reazy-' + opts.plugin;
    }
    generators.Base.apply(this, arguments);
  },

  initializing: function initializing() {},

  prompting: function prompting() {},

  writing: function writing() {
    var _this = this;

    var done = this.async();
    this.spawnCommandSync('npm', ['install', '--save', this.pluginName]);
    var pkg = this.fs.readJSON(this.destinationPath('node_modules', this.pluginPath, 'package.json'), {});
    if (pkg['reazy-setup']) {
      var setupScriptPath = pkg['reazy-setup'].split('/');
      setupScriptPath = this.destinationPath.apply(this, ['node_modules', this.pluginPath].concat(_toConsumableArray(setupScriptPath)));

      var setupScript = require(setupScriptPath);
      setupScript.add(function () {
        _this.log('\nSuccessfully added ' + _this.pluginName + '\n');
        done();
      });
    } else {
      this.log('No setup script found. This plugin might require additional setup.');
      this.log('\nSuccessfully added ' + this.pluginName + '\n');
    }
  },

  end: function end() {}
});