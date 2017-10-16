
const path = require('path');
const fs = require('fs-extra');
const homeDir = require('home-dir');
const gitconfig = require('parse-git-config');
const inquirer = require('inquirer');
const spwan = require('cross-spawn');
const gitConfigPath = path.resolve(homeDir(), '.gitconfig');
const cacheFilePath = path.join(__dirname, '../_cache.json');
const packageJsonPath = pat.join(__dirname, '../package.json');


function _init() {
  const obj = fs.readJsonSync(packageJsonPath);
  if (obj._switch_init_) {
    return true;
  }
  obj._switch_init_ = 'true';
  // 写入文件
  fs.writeJsonSync(packageJsonPath, obj);
  return false;
}

module.exports = function() {
  if (!fs.existsSync(gitConfigPath)) {
    throw new Error('can not find .gitconfig in your home dir');
  }
  // 如果没有初始化过 则读取用户信息
  if (!_init()) {
    const config = gitconfig.sync(gitConfigPath);
    console.log(config);
    fs.writeJSONSync(cacheFilePath, {
        [`${config.user.name}`]: config.user.email
    });
  }
  const cache = fs.readJsonSync(cacheFilePath);
  const users = [];
  for (var p in cache) {
    users.push(p);
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
      cache[answers.user]
    ]);
    console.log(`成功切换到${answers.user}`);
  });
};
