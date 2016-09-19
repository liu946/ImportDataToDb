/**
 * Created by liu946 on 16/9/16.
 * Email mkliuyag@163.com
 */
"use strict";


const fs = require('fs');
const path = require('path');


function match(pattern, fileName) {
  if (pattern === undefined) return false;
  if (pattern instanceof Array) return pattern.indexOf(fileName);
  if (pattern instanceof RegExp) return pattern.test(fileName);
  return pattern === fileName;
}

/**
 *
 * @param dirname String autoLoadDir
 * @param option Object options
 * @param option.match 匹配规则
 * @param option.ignore 忽略规则
 */

function load (dirname, option) {
  option = option ? option : {};
  const modules = {};
  const files = fs.readdirSync(dirname);
  files.forEach((file) => {
    if (/.*\.js$/.test(file)) {
      if (option.match && !match(option.match, file)) return;
      if (option.ignore && match(option.ignore, file)) return;
      modules[path.basename(file, '.js')] = require(path.join(dirname, file));
    }
  });

  return modules;
};

function loadDict() {
  return load.apply(this, arguments);
}

function loadArray() {
  const modules = load.apply(this, arguments);
  return Object.keys(modules).map((k) => modules[k]);
}

module.exports = {
  load,
  loadDict,
  loadArray,
};
