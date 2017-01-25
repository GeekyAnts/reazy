import reazy from 'reazy';
import example from './commands/example.js';

const app = reazy();

export default function(vorpal) {
  app.use(example(vorpal));


}
