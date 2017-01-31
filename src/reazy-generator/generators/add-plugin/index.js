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
    // this.npmInstall([this.pluginNameTest], {save: true}, function () {
    this.npmInstall([this.pluginName], {save: true}, function () {
      const pkg = self.fs.readJSON(self.destinationPath('node_modules', self.pluginName, 'package.json'), {});
      if(pkg.scripts.postadd) {
        // self.destinationRoot(self.destinationPath('node_modules', self.pluginName));
        let postaddScriptPath = pkg.scripts.postadd.split('/');
        postaddScriptPath = self.destinationPath('node_modules', self.pluginName, ...postaddScriptPath);
        // const cmd = postaddCommand[0];
        // const args = postaddCommand.slice(1);
        self.spawnCommandSync('node', [postaddScriptPath]);
        // self.destinationRoot('../../');
      } else {
        self.log('No postadd script found. This plugin might require additional setup.');
      }
    });
  },

  end: function() {
    this.log('\nSuccessfully added ' + this.pluginName + '\n');
  }
});
