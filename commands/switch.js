
const path = require('path');
const fs = require('fs-extra');
const homeDir = require('home-dir');
const gitconfig = require('parse-git-config');
const inquirer = require('inquirer');
const spwan = require('cross-spawn');
const invariant = require('invariant');
const homeGitConfigPath = path.resolve(homeDir(), '.gitconfig');
const cacheFilePath = path.join(__dirname, '../_cache.json');
const packageJsonPath = path.join(__dirname, '../package.json');

// 判断是否已经默认读取了用户的本地配置
// 如果没有读取过 则自动读取
function hasInit() {
  const obj = fs.readJsonSync(packageJsonPath);
  if (obj._git_bin_init_ == 'true') {
    return true;
  }
  obj._git_bin_init_ = 'true';
  // 写入文件
  fs.writeJsonSync(packageJsonPath, obj, { spaces: 2 });
  return false;
}

// 检查缓存文件是否存在
function checkCacheFile() {
  if (!fs.existsSync()) {
    fs.writeJSONSync(cacheFilePath, {}, { spaces: 2 });
  }
}

module.exports = function() {
  invariant(
    fs.existsSync(homeGitConfigPath),
    `can not find .gitconfig in your home dir: ${homeGitConfigPath}`
  );

  // 如果没有初始化过 则读取用户信息
  if (!hasInit()) {
    // 初始化缓存文件
    checkCacheFile();
    // 读取全局配置
    const config = gitconfig.sync({
      cwd: homeDir(),
      path: '.gitconfig'
    });

    if (config.user && config.user.name && config.user.email) {
      fs.writeJSONSync(cacheFilePath, {
        [`${config.user.name}`]: config.user.email
      }, { spaces: 2 });
    }

  }

  let cacheJson = {};
  try {
    cacheJson = fs.readJsonSync(cacheFilePath);
  } catch(error) {}

  const users = [];
  for (var name in cacheJson) {
    users.push(name);
  }

  if (users.length == 0) {
    console.log(`
      您还没有配置用户信息，快使用 gitbin add 添加吧
    `);
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
      cache[answers.user]
    ]);
    console.log(`成功切换到${answers.user}`);
  });
};
