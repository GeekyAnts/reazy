import {runGenerator} from 'reazy-setup-helper';
import path from 'path';

const add = (cb) => {
  runGenerator(path.join(__dirname, 'generators', 'add'), '<%= name %>-add', cb);
};

const remove = (cb) => {
  runGenerator(path.join(__dirname, 'generators', 'remove'), '<%= name %>-remove', cb);
};

export { add, remove }
