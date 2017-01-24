'use strict';

var generators = require('yeoman-generator');
var fs = require('fs');

module.exports = generators.Base.extend({
  constructor: function(args, opts) {
    this.pluginNameTest = '../reazy-' + opts.plugin;
    this.pluginName = 'reazy-' + opts.plugin;
    generators.Base.apply(this, arguments);
  },

  initializing: function () {

  },

  prompting: function () {

  },

  writing: function () {
    const self = this;

    const pkg = self.fs.readJSON(self.destinationPath('node_modules', self.pluginName, 'package.json'), {});
    if(pkg.scripts.preremove) {
      // self.destinationRoot(self.destinationPath('node_modules', self.pluginName));
      let preremoveScriptPath = pkg.scripts.preremove.split('/');
      preremoveScriptPath = self.destinationPath('node_modules', self.pluginName, ...preremoveScriptPath);
      // const cmd = preremoveCommand[0];
      // const args = preremoveCommand.slice(1);
      self.spawnCommandSync('node', [preremoveScriptPath]);
      // self.destinationRoot('../../');
    } else {
      self.log('No preremove script found. Uninstalling the package...');
    }

    this.spawnCommandSync('npm', ['uninstall', '--save', self.pluginName]);
  },

  end: function() {
    this.log('\nSuccessfully removed ' + this.pluginName + '\n');
  }
});
