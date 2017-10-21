
const path = require('path');
const fs = require('fs-extra');
const invariant = require('invariant');
const homeDir = require('home-dir')();
const packageJsonPath = path.join(__dirname, '../package.json');
const cacheFilePath = path.resolve(__dirname, '../_cache.json');
const homeGitConfigPath = path.resolve(homeDir, '.gitconfig');

module.exports = {
  hasInit: function() {
    // 判断是否已经默认读取了用户的本地配置
    // 如果没有读取过 则自动读取
    const obj = fs.readJsonSync(packageJsonPath);

    return obj._git_bin_init_ === 'true';
  },
  /*
   * 读取缓存文件
   */
  getCacheJSON: function() {
    let cacheJson = {};

    try {
      cacheJson = fs.readJsonSync(cacheFilePath);
    } catch(error) {}

    return cacheJson;
  },
  /*
   * 更新缓存文件
   */
  setCacheJSON: function(obj) {
    const { userName, email } = obj;
    const cacheJson = this.getCacheJSON();

    cacheJson[userName] = email;

    fs.writeJsonSync(cacheFilePath, cacheJson, { spaces: 2 });

    return true;
  },
  /*
   * 校验用户目录下是否有.gitconfig
   */
  validHomeDirGitConfig: function() {
    invariant(
      fs.existsSync(homeGitConfigPath),
      `can not find .gitconfig in your home dir: ${homeGitConfigPath}`
    );
  }
};
