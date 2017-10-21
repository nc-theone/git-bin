#!/usr/bin/env node

const minimist = require('minimist');
const invariant = require('invariant');
const commands = require('./commands/index.js');

/*
 * ['/usr/local/bin/node', 'path/index.js', 'switch']
 */
const command = process.argv.slice(0, 3)[2]; // return switch
const params = minimist(process.argv.slice(3));

invariant(command && commands[command], `
  ---- 您输入的command不正确，暂时支持如下命令 ----
  add    添加git账户至本地
  switch 切换本地git账户
  open   在浏览器打开当前github仓库
  ---- end ----
`);

// 执行具体的命令
commands[command](params);
