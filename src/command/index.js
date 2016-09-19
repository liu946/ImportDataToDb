#! /usr/bin/env node --harmony
/**
 * Created by liu946 on 16/9/16.
 * Email mkliuyag@163.com
 */
"use strict";

const model = require('../model');
const moduleLoader = require('../tool/module-loader');
const taskList = moduleLoader.loadArray(__dirname, {ignore: 'index.js'});
const co = require('co');
const program = require('commander');
const chalk = require('chalk');
const config = require('../config');

// version
program.version(config.packageJson.version);

taskList.forEach((task) => {
  if (!task || !task.command) return;

  // command
  let command = program.command(task.command);

  // description alias
  ['description', 'alias'].forEach((v) => {
    if (task[v]) command = command[v](task[v]);
  });

  // options
  if (task.optionList && task.optionList.length) {
    task.optionList.forEach((option) => {
      command = command.option.apply(command, option);
    });
  }

  // help
  if (task.help) {
    command = command.on('--help', task.help);
  }

  // action
  if (task.action && isGeneratorFunction(task.action)) {
    command = command.action(function () {
      co.wrap(task.action)
        .apply(this, arguments)
        .catch(function (err) {
          console.error(err.stack);
        });
    })
  } else if (task.action && typeof task.action === 'function') {
    command = command.action(task.action);
  } else {
    command = command.action(function () {
      console.error(chalk.bold.red('\n  No action when command "%s"'), task.command);
      program.help();
    });
  }
});

// program
//   .command('*')
//   .action(function(env){
//     console.error(chalk.bold.red('\n  Can not resolve deploying "%s"\n'), env);
//     program.outputHelp();
//   });

program.parse(process.argv);


/**
 * Check if `obj` is a generator.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */

function isGenerator(obj) {
  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

/**
 * Check if `obj` is a generator function.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */
function isGeneratorFunction(obj) {
  var constructor = obj.constructor;
  if (!constructor) return false;
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
  return isGenerator(constructor.prototype);
}
