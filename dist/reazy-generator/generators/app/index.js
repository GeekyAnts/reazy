'use strict';

var generators = require('yeoman-generator');
var path = require('path');
var assign = require('object.assign').getPolyfill();

module.exports = generators.Base.extend({
  constructor: function constructor() {
    console.log('reazy init');
    generators.Base.apply(this, arguments);
  },

  initializing: function initializing() {
    console.log('awdgu');
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    this.props = {
      name: this.pkg.name || process.cwd().split(path.sep).pop(),
      description: this.pkg.description
    };

    this.dependencies = ['native-base@0.5.22', 'react-native-vector-icons@4.0.0', 'react@15.4.1', 'react-native-router-flux@3.37.0', 'react-native@0.40.0', 'reazy-native-router-actions@0.0.2', 'mobx@3.0.0', 'mobx-react@4.1.0'];
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
    /*
    services: function() {
      this.props.services = [];
       if (this.props.database) {
        // If auth is enabled also create a user service
        if (this.props.localAuth || this.props.authentication.length) {
          this.props.services.push('user');
           var providers = this.props.authentication.slice();
           if (this.props.localAuth) {
            providers.push('local');
          }
           this.composeWith('reazy:service', {
            options: {
              type: 'database',
              database: this.props.database,
              name: 'user',
              authentication: true,
              providers: providers
            }
          });
        }
         this.fs.copyTpl(
          this.templatePath('service.js'),
          this.destinationPath('src/services', 'index.js'),
          this.props
        );
      }
    },
    */
    application: function application() {
      this.fs.copy(this.templatePath('static'), this.destinationPath());
      this.fs.copy(this.templatePath('static/.*'), this.destinationPath());
      // this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('', '.gitignore'));

      this.fs.copyTpl(this.templatePath('react-native-index.js'), this.destinationPath('src/services/react-native', 'index.js'), this.props);
    },

    config: function config() {
      this.fs.copyTpl(this.templatePath('package.json'), this.destinationPath('package.json'), this.props);
    },

    deps: function deps() {
      var devDependencies = ['babel-jest@18.0.0', 'babel-plugin-transform-decorators-legacy', 'babel-preset-react-native@1.9.1', 'babel-preset-react-native-stage-0', 'jest@18.0.0', 'react-test-renderer@15.4.1'];

      /*
      this.dependencies.concat(devDependencies).forEach(function(dependency) {
        var separatorIndex = dependency.indexOf('@');
        var end = separatorIndex !== -1 ? separatorIndex : dependency.length;
        var dependencyName = dependency.substring(0, end);
         // Throw an error if the project name is the same as one of the dependencies
        if(dependencyName === this.props.name) {
          this.log.error('Your project can not be named ' + this.props.name + ' because the ' +
            dependency + ' package will be installed as dependency.');
          process.exit(1);
        }
      }.bind(this));
      */

      var self = this;

      this.npmInstall(devDependencies, { saveDev: true });
      this.npmInstall(this.dependencies, { save: true }, function () {
        self.spawnCommandSync('react-native', ['upgrade']);
        self.spawnCommandSync('react-native', ['link']);
        self.fs.copy(self.templatePath('_babelrc'), self.destinationPath('', '.babelrc'));
      });
    }
  },

  end: function end() {
    this.log('\nWoot! We\'ve created your "' + this.props.name + '" app!');

    this.log('To start your reazy app run `react-native run-ios` or `react-native run-android`.');

    process.exit(0);
  }
});
//# sourceMappingURL=index.js.map