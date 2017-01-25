'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vorpal = require('vorpal');

var _vorpal2 = _interopRequireDefault(_vorpal);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('babel-register');

var app = (0, _vorpal2.default)();

require('./commands').default(app);
if (_fs2.default.existsSync(process.cwd() + '/src/cli.js')) {
  require(process.cwd() + '/src/cli').default(app);
}

exports.default = {
  run: function run() {

    if (process.argv.length > 2) {
      // one and done
      app.parse(process.argv);
    } else {
      // interactive shell
      app.log('Welcome to the Reazy command line.');
      app.log('Type "exit" to quit, "help" for a list of commands.');

      app.delimiter('reazy$').show();
    }
  },

  init: function init(root, projectName, type) {
    if (type) {
      app.parse([process.argv[0], process.argv[1], 'init', type]);
    } else {
      app.parse([process.argv[0], process.argv[1], 'init']);
    }
  }
};
//# sourceMappingURL=cli.js.map