
const fs = require('fs-extra');
const inquirer = require('inquirer');
const spwan = require('cross-spawn');
const utils = require('../lib/index.js');

module.exports = function() {
  utils.validHomeDirGitConfig();

  // 如果没有初始化过 则读取用户信息
  if (!utils.hasInit()) {
    console.log(`请先执行 gitbin init 进行初始化`);
    return;
  }

  const cacheJson = utils.getCacheJSON();

  const users = [];
  for (var name in cacheJson) {
    users.push(name);
  }

  if (users.length == 0) {
    console.log(`您还没有配置用户信息，快使用 gitbin add 添加吧`);
    return;
  }

  inquirer.prompt([
    {
      type: 'list',
      name: 'user',
      message: '检测到您有下述用户，请选择一个',
      choices: users,
      default: users[0]
    }
  ]).then(function(answers) {
    console.log(`您选择了${answers.user}`);
    console.log('正在帮你切换用户信息...');
    spwan.sync('git', [
      'config',
      '--global',
      'user.name',
      answers.user
    ]);
    spwan.sync('git', [
      'config',
      '--global',
      'user.email',
      cacheJson[answers.user]
    ]);
    console.log(`成功切换到${answers.user}`);
  });
};
