'use strict';

var generators = require('yeoman-generator');
var path = require('path');
var assign = require('object.assign').getPolyfill();
var ora = require('ora');
var Shell = require('shelljs');
var fs = require('fs-extra');
var ejs = require('ejs');

var checkCommmand = function checkCommmand(command, cb) {
  // !!Shell.which(command);
  Shell.exec('which ' + command, { silent: true }, function (code, stdout, stderr) {
    cb(!!stdout);
  });
};

var emptyFolder = function emptyFolder(folder) {
  Shell.rm('-rf', folder);
  Shell.mkdir(folder);
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

    this.dependencies = ['native-base@0.5.22', 'react-native-vector-icons@4.0.0', 'react@15.4.1', 'react-native-router-flux@3.37.0', 'react-native@0.40.0', 'reazy-native-router-actions@0.0.2', 'mobx@3.0.0', 'mobx-react@4.1.0'];
  },

  /**
   * Check for react-native.
   */
  findReactNativeCli: function findReactNativeCli() {
    var done = this.async();
    var spinner = ora('Finding react-native').start();

    checkCommmand('react-native', function (isInstalled) {
      if (!isInstalled) {
        spinner.fail('Missing react-native - \'npm install -g react-native-cli\'');
        process.exit(1);
      }

      Shell.exec('react-native --version', { silent: true }, function (code, stdout, stderr) {
        // verify 1.x.x or higher (we need react-native link)
        if (!stdout.match(/react-native-cli:\s[1-9]\d*\.\d+\.\d+/)) {
          spinner.fail('Must have at least version 1.x - \'npm install -g react-native-cli\'');
          process.exit(1);
        }

        spinner.succeed('Found react-native');
        done();
      });
    });
  },

  /**
   * Check if Android is good
   */
  checkAndroid: function checkAndroid() {
    var done = this.async();
    var spinner = ora('Finding android').start();

    checkCommmand('android', function (isInstalled) {
      if (isInstalled) {
        Shell.exec('android list', { silent: true }, function (code, stdout, stderr) {
          if (stdout.match(/android-23/)) {
            spinner.succeed('Found android');
          } else {
            spinner.fail('Missing android SDK 23');
          }
          done();
        });
      } else {
        spinner.fail('Missing android!');
        done();
      }
    });
  },

  /**
   * Check for git.
   */
  findGit: function findGit() {
    var spinner = ora('Finding git').start();

    checkCommmand('git', function (isInstalled) {
      if (!isInstalled) {
        spinner.fail('Missing git');
        process.exit(1);
      }

      spinner.succeed('Found git');
    });
  },

  prompting: function prompting() {
    var done = this.async();
    var prompts = [{
      name: 'name',
      message: 'Project name',
      default: this.props.name,
      validate: function validate(input) {
        if (!input.match(/^[$A-Z_][0-9A-Z_$]*$/i)) {
          return input + ' is not a valid name for a project.\nPlease use a valid identifier name (alphanumeric).';
        } else if (input === 'React') {
          return input + ' is not a valid name for a project.\nPlease do not use the reserved word "React"';
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
      this.props = assign(this.props, props);
      done();
    }.bind(this));
  },

  writing: {
    application: function application() {
      fs.copySync(this.templatePath('static'), this.destinationPath());
      // fs.copySync(this.templatePath('static/.*'), this.destinationPath());

      var template = fs.readFileSync(this.templatePath('react-native-index.js'), { encoding: 'utf8' });
      var content = ejs.render(template, this.props);
      fs.writeFileSync(this.destinationPath('src/services/react-native', 'index.js'), content, { encoding: 'utf8' });
      // this.fs.copyTpl(
      //   this.templatePath('react-native-index.js'),
      //   this.destinationPath('src/services/react-native', 'index.js'),
      //   this.props
      // );
    },

    config: function config() {
      var template = fs.readFileSync(path.join(__dirname, 'templates', 'package.json'), { encoding: 'utf8' });
      var content = ejs.render(template, this.props);
      fs.writeFileSync(path.join(process.cwd(), 'package.json'), content, { encoding: 'utf8' });
      // this.fs.copyTpl(
      //   this.templatePath('package.json'),
      //   this.destinationPath('package.json'),
      //   this.props
      // );
    }
  },

  install: function install() {
    var devDependencies = ['babel-jest@18.0.0', 'babel-plugin-transform-decorators-legacy', 'babel-preset-react-native@1.9.1', 'babel-preset-react-native-stage-0', 'jest@18.0.0', 'react-test-renderer@15.4.1'];

    var self = this;

    var spinnerInstallDev = ora('Installing dev dependencies').start();
    this.npmInstall(devDependencies, { saveDev: true, stdio: 'ignore' }, function () {
      spinnerInstallDev.succeed('Dev dependencies installed');

      var spinnerInstall = ora('Installing dependencies').start();
      self.npmInstall(self.dependencies, { save: true, stdio: 'ignore' }, function () {
        spinnerInstall.succeed('Dependencies installed');
        emptyFolder(self.destinationPath('android'));
        emptyFolder(self.destinationPath('ios'));
        Shell.rm('-f', self.destinationPath('.gitignore'));
        Shell.rm('-f', self.destinationPath('.babelrc'));
        Shell.rm('-f', self.destinationPath('.flowconfig'));
        self.spawnCommandSync('react-native', ['upgrade'], { stdio: 'ignore' });
        self.spawnCommandSync('react-native', ['link'], { stdio: 'ignore' });
        fs.copySync(self.templatePath('_babelrc'), self.destinationPath('', '.babelrc'));
        fs.copySync(self.templatePath('_gitignore'), self.destinationPath('', '.gitignore'));
      });
    });
  },

  end: function end() {
    this.log('\nWe\'ve created your "' + this.props.name + '" app!');

    this.log('To start your reazy app run `react-native run-ios` or `react-native run-android`.');

    process.exit(0);
  }
});