import generators from 'yeoman-generator';
import fs from 'fs-extra';
import _ from 'lodash';
import { addEnv, addImport, addUse } from 'reazy-setup-helper';

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
  },

  initializing: function () {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    if (this.pkg && this.pkg.name) {
      this.props = {
        name: this.pkg.name
      };
    } else {
      this.log('Please run this command in the root of a Reazy project');
      process.exit(1);
    }

  },

  prompting: function () {
    // Get input from user using command line prompts

    /*
    var done = this.async();
    var prompts = [
      {
        name: 'prompt1',
        message: 'Prompt 1',
        default: ''
      },
      {
        name: 'prompt2',
        message: 'Prompt 2',
        default: ''
      },
    ];

    this.prompt(prompts).then((props) => {
      this.props = _.assign(this.props, props);
      done();
    });
    */
  },

  writing: function () {
    // Uncomment to add import for your plugin to src/app.js
    // addImport('<%= name %>', '<%= camelCaseName %>');

    // Uncomment to add app.use for your plugin to src/app.js
    // addUse('app.use(<%= camelCaseName %>(), \'<%= camelCaseName %>\')');

    // Uncomment to add a config variable to env file
    // addEnv('prompt1', this.props.prompt1);
  }
});
