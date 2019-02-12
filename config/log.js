/**
 *
 */

const os = require('os');

let log;
switch (os.platform()) {
  case 'darwin' : {
    log = require('./log_test');
    break;
  }
  case 'linux' : {
    log = require('./log_prod');
    break;
  }
  default: {
    log = require('./log_prod');
  }
}

module.exports = log;
