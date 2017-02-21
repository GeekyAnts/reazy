import makeDebug from 'debug';
import _ from 'lodash';
import { isMobile, isWeb } from './platform';

const debug = makeDebug('reazy:application');

class Reazy {
  constructor () {
    this.services = {};
  }

  set(name, value) {
    _.set(this, name, value);
  }

  get(name) {
    return _.get(this, name, _.get(this, ['services', name], null));
  }

  getAllServices() {
    return this.services;
  }

  use (service, serviceName) {
    // console.log('service', service);
    if(serviceName) {
      _.set(this, ['services', serviceName], service.call(this, serviceName));
    } else {
      service.call(this)
    }

    return this;
  }

  isMobile() {
    return isMobile();
  }

  isWeb() {
    return isWeb();
  }

};

export default () => {
  return new Reazy();
}

export { isMobile, isWeb }
