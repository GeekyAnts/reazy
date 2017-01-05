'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('reazy:application');

var Reazy = function () {
  function Reazy() {
    _classCallCheck(this, Reazy);

    this.services = {};
  }

  _createClass(Reazy, [{
    key: 'set',
    value: function set(name, value) {
      _lodash2.default.set(this, name, value);
    }
  }, {
    key: 'get',
    value: function get(name) {
      return _lodash2.default.get(this, name, _lodash2.default.get(this, ['services', name], null));
    }
  }, {
    key: 'getAllServices',
    value: function getAllServices() {
      return this.services;
    }
  }, {
    key: 'use',
    value: function use(service, serviceName) {
      // console.log('service', service);
      if (serviceName) {
        _lodash2.default.set(this, ['services', serviceName], service.call(this, serviceName));
      } else {
        service.call(this);
      }

      return this;
    }
  }, {
    key: 'configure',
    value: function configure(fn) {
      fn.call(this);

      return this;
    }
  }]);

  return Reazy;
}();

;

exports.default = function () {
  return new Reazy();
};