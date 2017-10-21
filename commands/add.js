
const path = require('path');
const inquirer = require('inquirer');
const invariant = require('invariant');
const utils = require('../lib/index.js');
const cacheFilePath = path.resolve(__dirname, '../_cache.json');


module.exports = function() {
  if (!utils.hasInit()) {
    console.log(`请先执行 gitbin init 进行初始化`);
    return;
  }

  const cacheJson = utils.getCacheJSON();

  if (Object.keys(cacheJson).length != 0) {
    console.log(`检测到您本地已经有下述配置`);
    Object.keys(cacheJson).forEach(function(v, k) {
      console.log(`userName: ${v} email: ${cacheJson[v]}`);
    });
  }

  inquirer.prompt([
    {
      type: 'input',
      name: 'userName',
      message: '请输入用户名(用来做提交记录展示名称)',
      validate: function(value) {
        return value !== '';
      }
    },
    {
      type: 'input',
      name: 'email',
      message: '请输入邮件地址(用来做提交校验)',
      validate: function(value) {
        return !0;
      }
    }
  ]).then(function(answers) {
    const suc = utils.setCacheJSON(answers);
    suc === true ? console.log(`
      信息添加成功
    `) : console.log(`
      信息添加失败
    `);
  });

};
