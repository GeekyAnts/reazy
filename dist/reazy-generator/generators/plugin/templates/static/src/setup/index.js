import {runGenerator} from 'reazy-setup-helper';
import path from 'path';

const add = (cb) => {
  runGenerator(path.join(__dirname, 'generators', 'add'), 'reazy-native-auth-facebook-add', cb);
};

const remove = (cb) => {
  runGenerator(path.join(__dirname, 'generators', 'remove'), 'reazy-native-auth-facebook-remove', cb);
};

export { add, remove }
