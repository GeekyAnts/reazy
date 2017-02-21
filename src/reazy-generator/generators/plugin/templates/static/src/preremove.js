import yeoman from 'yeoman-environment';

const env = yeoman.createEnv();

env.register(__dirname + '/generators/remove', 'reazy-plugin-remove');

env.run('reazy-plugin-remove', { disableNotifyUpdate: true });
