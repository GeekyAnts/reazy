'use strict';

var generators = require('yeoman-generator');
var path = require('path');
var ora = require('ora');
var Shell = require('shelljs');
var fs = require('fs-extra');
var ejs = require('ejs');
var chalk = require('chalk');
var _ = require('lodash');

const checkCommmand = (command, cb) => {
  // !!Shell.which(command);
  Shell.exec('which ' + command, {silent: true}, (code, stdout, stderr) => {
    cb(!!stdout);
  });
}

function checkAppName(appName) {
  // TODO: there should be a single place that holds the dependencies
  var dependencies = [
    'react',
    'react-dom',
    'reazy',
    'reazy-web-config',
    'mobx',
    'mobx-react',
    'react-router'
  ];
  var devDependencies = ['custom-react-scripts'];
  var allDependencies = dependencies.concat(devDependencies).sort();

  if (allDependencies.indexOf(appName) >= 0) {
    return chalk.red(
        'We cannot create a project called ' + chalk.green(appName) + ' because a dependency with the same name exists.\n' +
        'Due to the way npm works, the following names are not allowed:\n\n'
      ) +
      chalk.cyan(
        allDependencies.map(function(depName) {
          return '  ' + depName;
        }).join('\n')
      ) +
      chalk.red('\n\nPlease choose a different project name.');
  } else {
    return true;
  }
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
  findCreateReactApp: function() {
    var done = this.async();
    const spinner = ora('Finding create-react-app').start();

    checkCommmand('create-react-app', (isInstalled) => {
      if(!isInstalled) {
        spinner.fail(`Missing create-react-app - 'npm install -g create-react-app'`);
        process.exit(1);
      }

      spinner.succeed('Found create-react-app');
      done();
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
        validate: (input) => checkAppName(input)
      },
      {
        name: 'description',
        message: 'Description',
        when: !this.pkg.description
      },
    ];

    this.prompt(prompts).then(function (props) {
      this.props = _.assign(this.props, props);
      done();
    }.bind(this));
  },

  createReactAppInit: function () {
    var done = this.async();
    var spinner = ora('Generating React project').start();

    Shell.exec(`create-react-app ${this.props.name} --scripts-version custom-react-scripts`, { silent: true }, (code, stdout, stderr) => {

      spinner.succeed('React project generated');
      var fileArray = fs.readdirSync(path.join(this.destinationPath(), this.props.name));

      fileArray.forEach((currentFile, index) => {
        if (currentFile !== 'node_modules') {
          fs.copySync(path.join(this.destinationPath(), this.props.name, currentFile), path.join(this.destinationPath(), currentFile), { overwrite: true });
        }
      });
      fs.removeSync(path.join(this.destinationPath(), this.props.name));

      fs.copySync(this.templatePath('_gitignore'), this.destinationPath('', '.gitignore'));

      done();
    });
  },

  writing: {
    application: function () {
      fs.removeSync(path.join(this.destinationPath(), 'src'));
      fs.copySync(this.templatePath('static'), this.destinationPath());
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

      //Reazy deps
      this.log('\nInstalling Reazy dependencies...');
      this.spawnCommandSync('reazy', ['add', 'web-config'], { stdio: 'inherit' });
      done();
    });
  },

  end: function() {
    this.log('\nWe\'ve created your "' + this.props.name + '" app!');

    this.log('To start your reazy app run `npm start`.');

    process.exit(0);
  }
});
