'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var tryRequire = require('try-require');
var fs = tryRequire('fs');
var path = tryRequire('path');
// import fs from 'fs-extra';
// import path from 'path';

var REACT_NATIVE_PACKAGE_JSON_PATH = function REACT_NATIVE_PACKAGE_JSON_PATH() {
  return path.resolve(process.cwd(), 'node_modules', 'react-native', 'package.json');
};

var REACT_PACKAGE_JSON_PATH = function REACT_PACKAGE_JSON_PATH() {
  return path.resolve(process.cwd(), 'node_modules', 'react', 'package.json');
};

var isMobile = exports.isMobile = function isMobile() {
  var reactNativePackageJsonPath = REACT_NATIVE_PACKAGE_JSON_PATH();

  if (fs.existsSync(reactNativePackageJsonPath)) {
    return true;
  }

  return false;
};

var isWeb = exports.isWeb = function isWeb() {
  var reactPackageJsonPath = REACT_PACKAGE_JSON_PATH();
  var reactNativePackageJsonPath = REACT_NATIVE_PACKAGE_JSON_PATH();

  if (fs.existsSync(reactPackageJsonPath) && !fs.existsSync(reactNativePackageJsonPath)) {
    return true;
  }

  return false;
};