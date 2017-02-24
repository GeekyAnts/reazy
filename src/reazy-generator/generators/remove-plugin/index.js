'use strict';

var generators = require('yeoman-generator');
var fs = require('fs');
import {spawnSync} from 'child_process';

module.exports = generators.Base.extend({
  constructor: function(args, opts) {
    if(opts.plugin.indexOf('reazy-') === 0) {
      this.pluginName = opts.plugin;
    } else {
      this.pluginName = 'reazy-' + opts.plugin;
    }
    generators.Base.apply(this, arguments);
  },

  initializing: function () {

  },

  prompting: function () {

  },

  writing: function () {
    const done = this.async();
    const pkg = this.fs.readJSON(this.destinationPath('node_modules', this.pluginName, 'package.json'), {});
    if(pkg['reazy-setup']) {
      let setupScriptPath = pkg['reazy-setup'].split('/');
      setupScriptPath = this.destinationPath('node_modules', this.pluginName, ...setupScriptPath);

      const setupScript = require(setupScriptPath);
      setupScript.remove((err) => {
        if(err) {
          console.log(chalk.red(err));
        } else {
          spawnSync('npm', ['uninstall', '--save', this.pluginName], {stdio: 'inherit'});
          this.log('\nSuccessfully removed ' + this.pluginName + '\n');
        }
        done();
      });
    } else {
      this.log('No setup script found. This plugin might require additional cleanup.');
      this.log('\nSuccessfully removed ' + this.pluginName + '\n');
    }

  },

  end: function() {

  }
});
