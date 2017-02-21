export default function(vorpal) {
  return function() {
    vorpal
      .command('example')
      .description('Example for local command')
      .action(function (args, callback) {
        this.log('Hello! This is an example command');
        callback();
      });
  }
}
