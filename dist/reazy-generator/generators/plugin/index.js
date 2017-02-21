'use strict';

var generators = require('yeoman-generator');
var path = require('path');
var ora = require('ora');
var Shell = require('shelljs');
var fs = require('fs-extra');
var ejs = require('ejs');
var chalk = require('chalk');
var _ = require('lodash');

var renderAndCopyTemplate = function renderAndCopyTemplate(templatePath, destinationPath, data) {
  var template = fs.readFileSync(templatePath, { encoding: 'utf8' });
  var content = ejs.render(template, data);
  fs.outputFileSync(destinationPath, content, { encoding: 'utf8' });
};

module.exports = generators.Base.extend({
  constructor: function constructor() {
    generators.Base.apply(this, arguments);
  },

  initializing: function initializing() {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    this.props = {
      name: this.pkg.name || process.cwd().split(path.sep).pop(),
      description: this.pkg.description
    };
  },

  prompting: function prompting() {
    var done = this.async();
    var prompts = [{
      name: 'name',
      message: 'Project name',
      default: this.props.name,
      validate: function validate(input) {
        if (input.indexOf('reazy-') !== 0) {
          return chalk.yellow('Name of the plugin should have "reazy-" prefix');
        } else {
          return true;
        }
      }
    }, {
      name: 'description',
      message: 'Description',
      when: !this.pkg.description
    }];

    this.prompt(prompts).then(function (props) {
      this.props = _.assign(this.props, props);
      done();
    }.bind(this));
  },

  writing: function writing() {
    fs.copySync(this.templatePath('static'), this.destinationPath());
    fs.copySync(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));

    renderAndCopyTemplate(this.templatePath('README.md'), this.destinationPath('README.md'), this.props);

    var template = fs.readFileSync(this.templatePath('_package.json'), { encoding: 'utf8' });
    var content = ejs.render(template, this.props);

    var currentPackageJson = require(this.destinationPath('package.json'));
    // merge package json
    var packageJson = _.merge(currentPackageJson, JSON.parse(content));
    content = JSON.stringify(packageJson, null, 2);
    fs.outputFileSync(this.destinationPath('package.json'), content, { encoding: 'utf8' });
  },

  install: function install() {
    var done = this.async();

    var spinnerInstall = ora('Running "npm install"').start();
    Shell.exec('npm install', { silent: true }, function (code, stdout, stderr) {
      spinnerInstall.succeed('Dependencies installed');
      done();
    });
  },

  end: function end() {
    this.log('\nWe\'ve created "' + this.props.name + '" plugin!');

    this.log('To start developing, run `npm link && npm run watch`.');
    this.log('Now you can create a Reazy project and run `npm link <your-plugin-name>` to start testing your plugin in real-time.');

    process.exit(0);
  }
});