import yeoman from 'yeoman-environment';
import _ from 'lodash';

const env = yeoman.createEnv();

const reazyGenerators = '../reazy-generator/generators';

env.register(require.resolve(`${reazyGenerators}/app`), 'reazy:app');
env.register(require.resolve(`${reazyGenerators}/add-plugin`), 'reazy:add-plugin');
env.register(require.resolve(`${reazyGenerators}/remove-plugin`), 'reazy:remove-plugin');

const generatorOptions = {
  disableNotifyUpdate: true
};

function requireFromString(src, filename) {
  var m = new module.constructor();
  m.paths = module.paths;
  m._compile(src, filename);
  return m.exports;
}

const processArgv = _.clone(process.argv);

export default function(vorpal) {
  vorpal
    .command('init [type]', 'create a new app or plugin \n\  type: [web/mobile/plugin]')
    .autocomplete(['mobile', 'web', 'plugin'])
    .action(function (args, callback) {
      this.log('');
      const self = this;
      if(!args.type || ['mobile', 'web', 'plugin'].indexOf(args.type) === -1 ) {
        this.prompt({
          type: 'list',
          name: 'type',
          message: 'What would you like to create?',
          choices: ['mobile', 'web', 'plugin'],
        }, function (result) {
          if(result.type === 'mobile') {
            self.log(`Okay, generating a mobile app for you`);
            env.run('reazy:app', generatorOptions, callback);
          } else {
            self.log('Coming soon!');
            // callback();
          }
        });
      } else {
        if(args.type === 'mobile') {
          env.run('reazy:app', generatorOptions, callback);
        } else {
          self.log('Coming soon!');
          // callback();
        }
      }
      // env.run('reazy:app', generatorOptions);
    });

  vorpal
    .command('add <plugin>')
    .description('add a new plugin')
    .autocomplete(['native-config'])
    .action(function (args, callback) {
      env.run('reazy:add-plugin', args);
    });

  vorpal
    .command('remove <plugin>')
    .description('remove a plugin completely')
    .autocomplete(['native-config'])
    .action(function (args, callback) {
      env.run('reazy:remove-plugin', args);
    });

  // vorpal
  //   .catch('[words...]', 'Catches incorrect commands')
  //   .action(function (args, callback) {
  //     require('babel-register');
  //     const localProjectCli = require(process.cwd() + '/src/cli');
  //     localProjectCli.run(processArgv, vorpal);
  //   });
}

export { env };
