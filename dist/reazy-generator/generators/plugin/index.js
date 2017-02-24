'use strict';

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _camelcase = require('camelcase');

var _camelcase2 = _interopRequireDefault(_camelcase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderAndCopyTemplate = function renderAndCopyTemplate(templatePath, destinationPath, data) {
  var template = _fsExtra2.default.readFileSync(templatePath, { encoding: 'utf8' });
  var content = _ejs2.default.render(template, data);
  _fsExtra2.default.outputFileSync(destinationPath, content, { encoding: 'utf8' });
};

module.exports = _yeomanGenerator2.default.Base.extend({
  constructor: function constructor() {
    _yeomanGenerator2.default.Base.apply(this, arguments);
  },

  initializing: function initializing() {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    this.props = {
      name: this.pkg.name || process.cwd().split(_path2.default.sep).pop(),
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
          return _chalk2.default.yellow('Name of the plugin should have "reazy-" prefix');
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
      props.camelCaseName = (0, _camelcase2.default)(props.name.replace('reazy-', ''));

      this.props = _lodash2.default.assign(this.props, props);
      done();
    }.bind(this));
  },

  writing: function writing() {
    _fsExtra2.default.copySync(this.templatePath('static'), this.destinationPath());
    _fsExtra2.default.copySync(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));

    renderAndCopyTemplate(this.templatePath('README.md'), this.destinationPath('README.md'), this.props);

    renderAndCopyTemplate(this.templatePath('setup-index.js'), this.destinationPath('src/setup/index.js'), this.props);

    renderAndCopyTemplate(this.templatePath('add-index.js'), this.destinationPath('src/setup/generators/add/index.js'), this.props);

    renderAndCopyTemplate(this.templatePath('remove-index.js'), this.destinationPath('src/setup/generators/remove/index.js'), this.props);

    var template = _fsExtra2.default.readFileSync(this.templatePath('_package.json'), { encoding: 'utf8' });
    var content = _ejs2.default.render(template, this.props);

    var currentPackageJson = require(this.destinationPath('package.json'));
    // merge package json
    var packageJson = _lodash2.default.merge(currentPackageJson, JSON.parse(content));
    content = JSON.stringify(packageJson, null, 2);
    _fsExtra2.default.outputFileSync(this.destinationPath('package.json'), content, { encoding: 'utf8' });
  },

  install: function install() {
    var done = this.async();

    var spinnerInstall = (0, _ora2.default)('Running "npm install"').start();
    _shelljs2.default.exec('npm install', { silent: true }, function (code, stdout, stderr) {
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