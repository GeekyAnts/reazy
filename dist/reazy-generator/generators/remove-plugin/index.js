'use strict';

var _child_process = require('child_process');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var generators = require('yeoman-generator');
var fs = require('fs');


module.exports = generators.Base.extend({
  constructor: function constructor(args, opts) {
    if (opts.plugin.indexOf('reazy-') === 0) {
      this.pluginName = opts.plugin;
    } else {
      this.pluginName = 'reazy-' + opts.plugin;
    }
    generators.Base.apply(this, arguments);
  },

  initializing: function initializing() {},

  prompting: function prompting() {},

  writing: function writing() {
    var _this = this;

    var done = this.async();
    var pkg = this.fs.readJSON(this.destinationPath('node_modules', this.pluginName, 'package.json'), {});
    if (pkg['reazy-setup']) {
      var setupScriptPath = pkg['reazy-setup'].split('/');
      setupScriptPath = this.destinationPath.apply(this, ['node_modules', this.pluginName].concat(_toConsumableArray(setupScriptPath)));

      var setupScript = require(setupScriptPath);
      setupScript.remove(function (err) {
        if (err) {
          console.log(chalk.red(err));
        } else {
          (0, _child_process.spawnSync)('npm', ['uninstall', '--save', _this.pluginName], { stdio: 'inherit' });
          _this.log('\nSuccessfully removed ' + _this.pluginName + '\n');
        }
        done();
      });
    } else {
      this.log('No setup script found. This plugin might require additional cleanup.');
      this.log('\nSuccessfully removed ' + this.pluginName + '\n');
    }
  },

  end: function end() {}
});