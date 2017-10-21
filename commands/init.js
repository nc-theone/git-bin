
const path = require('path');
const fs = require('fs-extra');
const homeDir = require('home-dir')();
const gitconfig = require('parse-git-config');
const utils = require('../lib/index.js');

module.exports = function() {
  const packageJsonPath = path.join(__dirname, '../package.json');
  const cacheFilePath = path.join(__dirname, '../_cache.json');
  const homeGitConfigPath = path.resolve(homeDir, '.gitconfig');

  console.log(`~~初始化开始~~`);
  const obj = fs.readJsonSync(packageJsonPath);

  // 设定标志位
  obj._git_bin_init_ = 'true';
  // 写入文件
  fs.writeJsonSync(packageJsonPath, obj, { spaces: 2 });

  // 初始化缓存文件
  console.log(`正在从 ${homeGitConfigPath} 中读取配置`);

  utils.validHomeDirGitConfig();

  // 解析gitconfig配置
  const config = gitconfig.sync({
    cwd: homeDir,
    path: '.gitconfig'
  });

  if (config.user && config.user.name && config.user.email) {
    fs.writeJSONSync(cacheFilePath, {
      [`${config.user.name}`]: config.user.email
    }, { spaces: 2 });

    console.log(`
      读取到了下述信息
        userName: ${config.user.name}
        email:    ${config.user.email}
    `);
  } else {
    console.log(`暂未发现任何用户信息`);
  }

  console.log(`从 ${homeGitConfigPath} 中读取成功`);

  console.log(`~~初始化结束~~`);

};
