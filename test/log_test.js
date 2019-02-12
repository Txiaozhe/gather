/**
 * Creator: Tang Xiaoji
 * Time: 2017-12-26
 */

const Log4js = require('../config/log');
const logtail_chat = Log4js.getLogger('logtail_chat');

setInterval(() => {
  logtail_chat.info('jjjjjj');
}, 1000);
