'use strict';

var generators = require('yeoman-generator');
var fs = require('fs');

module.exports = generators.Base.extend({
  constructor: function(args, opts) {
    if(opts.plugin.indexOf('reazy-') === 0) {
      this.pluginName = opts.plugin;
      this.pluginPath = opts.plugin;

    }else if(opts.plugin.indexOf('../') === 0) {
      this.pluginName = '../reazy-' + opts.plugin.substring(3);
      this.pluginPath = 'reazy-' + opts.plugin.substring(3);

    } else {
      this.pluginName = 'reazy-' + opts.plugin;
      this.pluginPath = 'reazy-' + opts.plugin;
    }
    generators.Base.apply(this, arguments);
  },

  initializing: function () {

  },

  prompting: function () {

  },

  writing: function () {
    const done = this.async();
    this.spawnCommandSync('npm', ['install', '--save', this.pluginName]);
    const pkg = this.fs.readJSON(this.destinationPath('node_modules', this.pluginPath, 'package.json'), {});
    if(pkg['reazy-setup']) {
      let setupScriptPath = pkg['reazy-setup'].split('/');
      setupScriptPath = this.destinationPath('node_modules', this.pluginPath, ...setupScriptPath);

      const setupScript = require(setupScriptPath);
      setupScript.add(() => {
        this.log('\nSuccessfully added ' + this.pluginName + '\n');
        done();
      });

    } else {
      this.log('No setup script found. This plugin might require additional setup.');
      this.log('\nSuccessfully added ' + this.pluginName + '\n');
    }
  },

  end: function() {

  }
});
