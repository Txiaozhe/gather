/**
 * tangxiaoji
 */

const rpc = require('./lib/rpc');
const Logger = require('../config/Logger');
const logger = new Logger('beelauncher');
const config = require('../config/config');

logger.log('bee start', 'local: ', config.app.host, 'quanmin: ', config.quanmin.target);
if(config.app.host === config.quanmin.target) {
  require('./lib/quanmin').check((err, count) => {
    logger.log(`inited quanmin ${count} tasks`);
  });
} else {
  const manager = require('./lib/bee');
  manager.check((err, count) => {
    logger.log(`inited ${count} tasks`);
    new rpc.Client(manager);
  });

  manager._beeCheck(count => logger.error('_beeCheck 任务自检', '_beeCheck', '', count));
}

process.on('uncaughtException', (err) => {
  logger.error('bee start uncaughtException', 'bee', err);
});
