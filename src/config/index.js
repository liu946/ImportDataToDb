
/**
 * 配置加载策略
 * 有属性才覆盖式叠加
 *
 * switch (NODE_ENV) {
 *  local: config.local.js + config.js
 *  dev: config.dev.js + config.local.js + config.js
 *  pre: config.pre.js + config.js
 *  prod: config.prod.js + config.pre.js + config.js
 * }
 *
 */
/**
 * obj2 overwrite obj1
 * @param obj1
 * @param obj2
 * @returns {*}
 */

'use strict';

const fs = require('fs');
const path = require('path');

function deepAssign(obj1, obj2) {
  if (!obj2) {
    return obj1;
  }

  for (var key in obj2) {
    if (typeof(obj2[key]) === 'object' && obj2[key].constructor !== Array) {
      if (!obj1.hasOwnProperty(key)) {
        obj1[key] = {};
      }

      deepAssign(obj1[key], obj2[key]);
    } else {
      obj1[key] = obj2[key];
    }
  }

  for (var _len = arguments.length, otherObjs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    otherObjs[_key - 2] = arguments[_key];
  }

  return deepAssign.apply(undefined, [obj1].concat(otherObjs));
}

function getConfig (configFileName) {
  try {
    return require('./' + configFileName);
  } catch (e) {
    return {};
  }
}


const configSet = {
  config: getConfig('config.js'),
  local: getConfig('config.local.js'),
  dev: getConfig('config.dev.js'),
  pre: getConfig('config.pre.js'),
  prod: getConfig('config.prod.js'),
};

const config = {};
const packageJsonPath = path.join(__dirname, '../../package.json');
try {
  config.packageJson = fs.readFileSync(packageJsonPath);
} catch (e) {
  config.packageJson = {};
  console.warn('expect package.json at ' + packageJsonPath);
}


switch (process.env.NODE_ENV) {
  case 'local':
    deepAssign(config, configSet.config, configSet.local);
    break;
  case 'dev':
    deepAssign(config, configSet.config, configSet.local, configSet.dev);
    break;
  case 'pre':
    deepAssign(config, configSet.config, configSet.pre);
    break;
  case 'prod':
    deepAssign(config, configSet.config, configSet.pre, configSet.prod);
    break;
  default:
    deepAssign(config, configSet.config);
    break;
}

module.exports = config;

