/**
 * Created by liu946 on 16/9/16.
 * Email mkliuyag@163.com
 */

module.exports = {
  sequelize: {
    host: 'localhost',
    dialect: 'mysql',
    database: 'chengyu',
    username: 'root',
    password: '123456',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },

  },
};

