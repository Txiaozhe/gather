/**
 * Creator: Tang Xiaoji
 * Time: 2018-06-27
 */

'use strict';

const Logger = require('../config/Logger');
const logger = new Logger('nest');

require('./sub/index'); // todo 打开监视

require('./lib/dispather').initSearcher((plat, info) => {
  logger.log('initSearcher: ', plat, info);
});

process.on('uncaughtException', (err) => {
  logger.error('nest start uncaughtException', 'nest', err);
});
