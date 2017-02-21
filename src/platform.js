var tryRequire = require('try-require');
var fs = tryRequire('fs');
var path = tryRequire('path');
// import fs from 'fs-extra';
// import path from 'path';

const REACT_NATIVE_PACKAGE_JSON_PATH = function() {
  return path.resolve(
    process.cwd(),
    'node_modules',
    'react-native',
    'package.json'
  );
};

const REACT_PACKAGE_JSON_PATH = function() {
  return path.resolve(
    process.cwd(),
    'node_modules',
    'react',
    'package.json'
  );
};

export const isMobile = () => {
  const reactNativePackageJsonPath = REACT_NATIVE_PACKAGE_JSON_PATH();

  if (fs.existsSync(reactNativePackageJsonPath)) {
    return true;
  }

  return false;
}

export const isWeb = () => {
  const reactPackageJsonPath = REACT_PACKAGE_JSON_PATH();
  const reactNativePackageJsonPath = REACT_NATIVE_PACKAGE_JSON_PATH();

  if (fs.existsSync(reactPackageJsonPath) && !fs.existsSync(reactNativePackageJsonPath)) {
    return true;
  }

  return false
}
