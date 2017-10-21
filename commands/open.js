
// 需要实现 用户在git仓库下 通过命令行的方式 打开github链接
const path = require('path');
const open = require('open');
const fs = require('fs-extra');
const pwd = process.cwd();
const invariant = require('invariant');
const gitconfig = require('parse-git-config');

module.exports = function() {
  invariant(fs.existsSync(path.resolve(pwd, '.git')), `
    请在git仓库执行该命令
  `);

  const config = gitconfig.sync({
    cwd: pwd,
    path: '.git/config'
  });

  const remote = config["remote \"origin\""];

  if (typeof remote == 'object' && remote.url) {
    const originUrl = remote.url;
    let remoteUrl;
    let result;
    if (/^git/.test(originUrl)) {
      result = originUrl.match(/^git@github\.com:(\S+)\.git$/);
    } else if (/^https/.test(originUrl)) {
      result = originUrl.match(/^https:\/\/@github\.com:(\S+)\.git$/);
    }
    if (result[1]) {
      open(`https://github.com/${result[1]}`);
    } else {
      console.log('找不到git仓库的 remote url');
    }
  } else {
    console.log('找不到git仓库的 remote url');
  }
};
