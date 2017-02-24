import generators from 'yeoman-generator';
import { removeEnv, removeImport, removeUse } from 'reazy-setup-helper';


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

  writing: function () {
    // Uncomment to remove the import from src/app.js
    // removeImport('reazy-plugin');

    // Uncomment to remove app.use from src/app.js
    // removeUse('reazy-plugin');

    // Uncomment to remove config variable from env file
    // removeEnv('prompt1');
  }
});
