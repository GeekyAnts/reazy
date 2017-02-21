import vorpal from 'vorpal';
import fs from 'fs';
require('babel-register');

const app = vorpal();

require(`./commands`).default(app);
if(fs.existsSync(`${process.cwd()}/src/cli.js`)) {
  require(`${process.cwd()}/src/cli`).default(app);
}

export default {
  run: () => {
    if (process.argv.length > 2) {
      // one and done
      app.parse(process.argv);
    }
    else {
      // interactive shell
      app.log(`Welcome to the Reazy command line.`);
      app.log('Type "exit" to quit, "help" for a list of commands.');

      app
        .delimiter('reazy$')
        .show();
    }
  },

  init: (root, projectName, type) => {
    if(type) {
      app.parse([process.argv[0], process.argv[1], 'init', projectName, type]);
    } else {
      app.parse([process.argv[0], process.argv[1], 'init', projectName]);
    }
  }
}
