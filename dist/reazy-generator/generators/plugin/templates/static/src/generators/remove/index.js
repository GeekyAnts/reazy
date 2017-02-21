var generators = require('yeoman-generator');
var fs = require('fs');
var path = require('path');
var transform = require('../../lib/transform');

function removeService(filename, name, moduleName) {
  if (fs.existsSync(filename)) {
    let content = fs.readFileSync(filename).toString();

    content = content.replace('import ' + name + ' from \'' + moduleName + '\';\n', '');
    content = content.replace('app.use(' + name + '(), \'config\');\n', '');

    fs.writeFileSync(filename, content, {encoding: 'utf8'});
  }
}

function deleteEnvFile(filename) {
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }
}

function unlinkIOS(filename, projName) {
  if (fs.existsSync(filename)) {
    let fileContents = fs.readFileSync(filename, {encoding: 'utf8'});
    fileContents = fileContents.replace('INFOPLIST_OTHER_PREPROCESSOR_FLAGS = "-traditional";', '');
    fileContents = fileContents.replace('INFOPLIST_PREFIX_HEADER = "${CONFIGURATION_BUILD_DIR}/GeneratedInfoPlistDotEnv.h";', '');
    fileContents = fileContents.replace('INFOPLIST_PREPROCESS = YES;', '');
    try {
      fs.writeFileSync(filename, fileContents, {encoding: 'utf8'});
    } catch(err) {
      console.log('err', err);
    }
  } else {
    console.log('Make sure that the iOS project exists and the name in package.json matches the iOS project name');
  }
}

function unlinkAndroid(filename) {
  if (fs.existsSync(filename)) {
    let fileContents = fs.readFileSync(filename, {encoding: 'utf8'});

    fileContents = fileContents.replace(`apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"`, '');

    fs.writeFileSync(filename, fileContents, {encoding: 'utf8'});
  } else {
    console.log('Make sure that the Android project exists');
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
    const envPath = this.destinationPath('.env');
    const envExamplePath = this.destinationPath('.env.example');
    const iosProjPath = this.destinationPath('ios', this.props.name + '.xcodeproj', 'project.pbxproj');
    const androidBuildGradlePath = this.destinationPath('android/app/build.gradle');


    this.spawnCommandSync('react-native', ['unlink', 'react-native-config']);
    this.log('Uninstalling react-native-config...');
    this.spawnCommandSync('npm', ['uninstall', '--save', 'react-native-config']);
    unlinkIOS(iosProjPath, this.props.name);
    unlinkAndroid(androidBuildGradlePath);

    // Automatically import the new service into services/index.js and initialize it.
    removeService(appJsPath, 'reazyNativeConfig', 'reazy-native-config');
    deleteEnvFile(envPath);
    deleteEnvFile(envExamplePath);
  }
});
