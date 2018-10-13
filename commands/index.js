/*
 * @Author: 宁尘
 * @Date: 2018-10-14 01:51:01
 * @Last Modified by:   宁尘
 * @Last Modified time: 2018-10-14 01:51:01
 */

const switchCmd = require('./switch.js');
const openCmd = require('./open.js');
const addCmd = require('./add.js');
const initCmd = require('./init.js');

module.exports = {
  switch: switchCmd,
  open: openCmd,
  add: addCmd,
  init: initCmd
};
