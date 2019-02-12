/**
 *
 */

const config_default = require('./config_default');
const config_prod = require('./config_prod');
const config_test = require('./config_test');
const config_local = require('./config_local');
const Logger = require('./Logger');
const logger = new Logger('launcher');
const os = require('os');

let config;

if(os.platform() === 'darwin') {
  config = Object.assign(config_default, config_local);
} else {
  const debug = !process.env.DEBUG_BEE || (process.env.DEBUG_BEE === 'true');

  if(debug) {
    logger.log('测试环境...');
    config = Object.assign(config_default, config_test);
  } else {
    logger.log('生产环境...');
    config = Object.assign(config_default, config_prod);
  }
}

module.exports = config;
