import yeoman from 'yeoman-environment';

const env = yeoman.createEnv();

env.register(__dirname + '/generators/add', 'reazy-plugin-add');

env.run('reazy-plugin-add', { disableNotifyUpdate: true });
