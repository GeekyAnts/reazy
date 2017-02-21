var generators = require('yeoman-generator');
var fs = require('fs-extra');
var path = require('path');
var transform = require('../../lib/transform');

function useService(filename, statement) {
  let fileContents = fs.readFileSync(filename, {encoding: 'utf8'}).split('\n');
  let indexOfApp = fileContents.length - 1;
  fileContents.filter(function (word, index) {
    if (word.match(/reazy\(\)/g)) {
      indexOfApp = index;
      return true;
    }
    return false;
  });
  fileContents.splice(indexOfApp + 1, 0, '');
  fileContents.splice(indexOfApp + 2, 0, statement);
  fileContents = fileContents.join('\n');
  fs.writeFileSync(filename, fileContents, {encoding: 'utf8'});
}

function importService(filename, name, moduleName) {
  if (fs.existsSync(filename)) {
    var content = fs.readFileSync(filename).toString();
    var ast = transform.parse(content);

    transform.addImport(ast, name, moduleName);

    fs.writeFileSync(filename, transform.print(ast));
  }
}

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
  },

  initializing: function () {
    // const done = this.async();

    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    if (!this.pkg || !this.pkg.name) {
      this.log('Please run this command in the root of a Reazy project');
      process.exit(1);
    }

    this.props = {
      name: this.pkg.name || process.cwd().split(path.sep).pop()
    };

  },

  writing: function () {
    const appJsPath = this.destinationPath('src/app.js');

    importService(appJsPath, 'reazyPlugin', 'reazy-plugin');
    useService(appJsPath, `app.use(reazyPlugin({}), 'reazyPlugin')`);
  }
});
