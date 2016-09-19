/**
 * Created by liu946 on 16/9/16.
 * Email mkliuyag@163.com
 */

/**
 *
 * 自动加载所有的模型
 */
'use strict';

const Sequelize = require('sequelize');
const dbConfig = require('../config').sequelize;
const moduleLoader = require('../tool/module-loader');
const modelDict = moduleLoader.load(__dirname, {ignore: 'index.js'});
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

for (let model in modelDict) {
  modelDict[model] = sequelize.import(model, modelDict[model]);
}

module.exports = modelDict;
