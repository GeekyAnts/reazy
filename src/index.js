import makeDebug from 'debug';
import _ from 'lodash';

const debug = makeDebug('reazy:application');

class Reazy {
  constructor () {
    this.services = {};
  }

  set(name, value) {
    this[name] = value;
  }

  get(name) {
    return _.get(this, name, _.get(this, ['services', name], null));
  }

  use (service, serviceName) {
    console.log('service', service);
    if(serviceName) {
      _.set(this, ['services', serviceName], service.call(this));
    } else {
      service.call(this)
    }

    return this;
  }

  configure (fn) {
    fn.call(this);

    return this;
  }

};

export default () => {
  return new Reazy();
}
