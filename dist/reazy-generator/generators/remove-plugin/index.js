'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var generators = require('yeoman-generator');
var fs = require('fs');

module.exports = generators.Base.extend({
  constructor: function constructor(args, opts) {
    // this.pluginNameTest = '../reazy-' + opts.plugin;
    this.pluginName = 'reazy-' + opts.plugin;
    generators.Base.apply(this, arguments);
  },

  initializing: function initializing() {},

  prompting: function prompting() {},

  writing: function writing() {
    var self = this;

    var pkg = self.fs.readJSON(self.destinationPath('node_modules', self.pluginName, 'package.json'), {});
    if (pkg.scripts.preremove) {
      // self.destinationRoot(self.destinationPath('node_modules', self.pluginName));
      var preremoveScriptPath = pkg.scripts.preremove.split('/');
      preremoveScriptPath = self.destinationPath.apply(self, ['node_modules', self.pluginName].concat(_toConsumableArray(preremoveScriptPath)));
      // const cmd = preremoveCommand[0];
      // const args = preremoveCommand.slice(1);
      self.spawnCommandSync('node', [preremoveScriptPath]);
      // self.destinationRoot('../../');
    } else {
      self.log('No preremove script found. Uninstalling the package...');
    }

    this.spawnCommandSync('npm', ['uninstall', '--save', self.pluginName]);
  },

  end: function end() {
    this.log('\nSuccessfully removed ' + this.pluginName + '\n');
  }
});