'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _uberproto = require('uberproto');

var _uberproto2 = _interopRequireDefault(_uberproto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('reazy:application');
var methods = ['find', 'get', 'create', 'update', 'patch', 'remove'];
var Proto = _uberproto2.default.extend({
  create: null
});

var Reazy = function () {
  function Reazy() {
    _classCallCheck(this, Reazy);
  }

  _createClass(Reazy, [{
    key: 'init',
    value: function init() {
      Object.assign(this, {
        methods: methods,
        services: {},
        providers: [],
        _setup: false
      });
    }
  }, {
    key: 'service',
    value: function service(location, _service) {
      var _this = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      // strip slashes
      location = location.replace(/^(\/*)|(\/*)$/g, '');

      if (!_service) {
        var current = this.services[location];

        if (typeof current === 'undefined' && typeof this.defaultService === 'function') {
          return this.service(location, this.defaultService(location), options);
        }

        return current;
      }

      var protoService = Proto.extend(_service);

      debug('Registering new service at `' + location + '`');

      if (typeof protoService._setup === 'function') {
        protoService._setup(this, location);
      }

      // Run the provider functions to register the service
      this.providers.forEach(function (provider) {
        return provider.call(_this, location, protoService, options);
      });

      // If we ran setup already, set this service up explicitly
      if (this._isSetup && typeof protoService.setup === 'function') {
        debug('Setting up service for `' + location + '`');
        protoService.setup(this, location);
      }

      return this.services[location] = protoService;
    }
  }, {
    key: 'use',
    value: function use(location) {
      var service = void 0;
      var middleware = Array.from(arguments).slice(1).reduce(function (middleware, arg) {
        if (typeof arg === 'function') {
          middleware[service ? 'after' : 'before'].push(arg);
        } else if (!service) {
          service = arg;
        } else {
          throw new Error('invalid arg passed to app.use');
        }
        return middleware;
      }, {
        before: [],
        after: []
      });

      var hasMethod = function hasMethod(methods) {
        return methods.some(function (name) {
          return service && typeof service[name] === 'function';
        });
      };

      // Check for service (any object with at least one service method)
      if (hasMethod(['handle', 'set']) || !hasMethod(this.methods.concat('setup'))) {
        return this._super.apply(this, arguments);
      }

      // Any arguments left over are other middleware that we want to pass to the providers
      this.service(location, service, { middleware: middleware });

      return this;
    }
  }, {
    key: 'setup',
    value: function setup() {
      var _this2 = this;

      // Setup each service (pass the app so that they can look up other services etc.)
      Object.keys(this.services).forEach(function (path) {
        var service = _this2.services[path];

        debug('Setting up service for `' + path + '`');
        if (typeof service.setup === 'function') {
          service.setup(_this2, path);
        }
      });

      this._isSetup = true;

      return this;
    }

    // Express 3.x configure is gone in 4.x but we'll keep a more basic version
    // That just takes a function in order to keep Feathers plugin configuration easier.
    // Environment specific configurations should be done as suggested in the 4.x migration guide:
    // https://github.com/visionmedia/express/wiki/Migrating-from-3.x-to-4.x

  }, {
    key: 'configure',
    value: function configure(fn) {
      fn.call(this);

      return this;
    }
  }, {
    key: 'listen',
    value: function listen() {
      var server = this._super.apply(this, arguments);

      this.setup(server);
      debug('Feathers application listening');

      return server;
    }
  }]);

  return Reazy;
}();

;

exports.default = function () {
  return new Reazy();
};