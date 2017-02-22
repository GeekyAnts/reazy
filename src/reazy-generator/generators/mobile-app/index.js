'use strict';

var generators = require('yeoman-generator');
var path = require('path');
var ora = require('ora');
var Shell = require('shelljs');
var fs = require('fs-extra');
var ejs = require('ejs');
var _ = require('lodash');

const checkCommmand = (command, cb) => {
  // !!Shell.which(command);
  Shell.exec('which ' + command, {silent: true}, (code, stdout, stderr) => {
    cb(!!stdout);
  });
}

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);
  },

  initializing: function () {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    this.props = {
      name: this.pkg.name || process.cwd().split(path.sep).pop(),
      description: this.pkg.description,
      reazyVersion: require(path.join(__dirname, '../../../../package.json')).version,
    };

  },

  /**
   * Check for react-native.
   */
  findReactNativeCli: function() {
    var done = this.async();
    const spinner = ora('Finding react-native').start();

    checkCommmand('react-native', (isInstalled) => {
      if(!isInstalled) {
        spinner.fail(`Missing react-native - 'npm install -g react-native-cli'`);
        process.exit(1);
      }

      Shell.exec('react-native --version', { silent: true }, (code, stdout, stderr) => {
        // verify 1.x.x or higher (we need react-native link)
        if (!stdout.match(/react-native-cli:\s[1-9]\d*\.\d+\.\d+/)) {
          spinner.fail(`Must have at least version 1.x - 'npm install -g react-native-cli'`);
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
  checkAndroid: function() {
    var done = this.async();
    const spinner = ora('Finding android').start();

    checkCommmand('android', (isInstalled) => {
      if (isInstalled) {
        Shell.exec('android list', { silent: true }, (code, stdout, stderr) => {
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
  findGit: function() {
    var done = this.async();
    const spinner = ora('Finding git').start();

    checkCommmand('git', (isInstalled) => {
      if (!isInstalled) {
        spinner.fail(`Missing git`);
        process.exit(1);
      }

      spinner.succeed('Found git');
      done();
    });

  },

  prompting: function () {
    var done = this.async();
    var prompts = [
      {
        name: 'name',
        message: 'Project name',
        default: this.props.name,
        validate: function(input) {
          if (!input.match(/^[$A-Z_][0-9A-Z_$]*$/i)) {
            return `${input} is not a valid name for a project.
Please use a valid identifier name (alphanumeric).`;
          }

          else if (input === 'React') {
            return `${input} is not a valid name for a project.
Please do not use the reserved word "React"`;
          } else {
            return true;
          }
        }
      },
      {
        name: 'description',
        message: 'Description',
        when: !this.pkg.description
      },
    ];

    this.prompt(prompts).then((props) => {
      this.props = _.assign(this.props, props);
      done();
    });
  },

  reactNativeInit: function () {
    var done = this.async();
    var spinner = ora('Generating React Native project').start();

    Shell.exec('react-native init ' + this.props.name, { silent: true }, (code, stdout, stderr) => {

      spinner.succeed('React Native project generated');
      var fileArray = fs.readdirSync(path.join(this.destinationPath(), this.props.name));

      fileArray.forEach((currentFile, index) => {
        if (currentFile !== 'node_modules') {
          fs.copySync(path.join(this.destinationPath(), this.props.name, currentFile), path.join(this.destinationPath(), currentFile), { overwrite: true });
        }
      });
      fs.removeSync(path.join(this.destinationPath(), this.props.name));

      fs.copySync(this.templatePath('_babelrc'), this.destinationPath('', '.babelrc'));
      fs.copySync(this.templatePath('_gitignore'), this.destinationPath('', '.gitignore'));

      done();
    });
  },

  writing: {
    application: function () {
      fs.copySync(this.templatePath('static'), this.destinationPath());

      var template = fs.readFileSync(this.templatePath('react-native-index.js'), { encoding: 'utf8' });
      var content = ejs.render(template, this.props);

      fs.outputFileSync(this.destinationPath('src/services/react-native', 'index.js'), content, { encoding: 'utf8' });
    },

    config: function () {
      var template = fs.readFileSync(path.join(__dirname, 'templates', '_package.json'), { encoding: 'utf8' });
      var content = ejs.render(template, this.props);

      var currentPackageJson = require(path.join(this.destinationPath(), 'package.json'));
      // merge package json
      var packageJson = _.merge(currentPackageJson, JSON.parse(content));
      content = JSON.stringify(packageJson, null, 2);
      fs.outputFileSync(path.join(process.cwd(), 'package.json'), content, { encoding: 'utf8' });
    }
  },

  install: function() {
    var done = this.async();

    var spinnerInstall = ora('Running "npm install"').start();
    Shell.exec('npm install', { silent: true }, (code, stdout, stderr) => {
      spinnerInstall.succeed('Dependencies installed');

      this.spawnCommandSync('react-native', ['link'], { stdio: 'ignore' });

      //Reazy deps
      this.log('\nInstalling Reazy dependencies...');
      this.spawnCommandSync('reazy', ['add', 'native-config'], { stdio: 'inherit' });
      done();
    });
  },

  end: function() {
    this.log('\nWe\'ve created your "' + this.props.name + '" app!');

    this.log('To start your reazy app run `react-native run-ios` or `react-native run-android`.');

    process.exit(0);
  }
});
