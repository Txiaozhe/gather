/**
 * Creator: Tang Xiaoji
 * Time: 2018-06-25
 */

'use strict';

// const Log4js = require('../config/log_test');
// const logt = Log4js.getLogger('logtail_data_native');
// logt.info({ddd:'dddddd'});

const Logger = require('../config/Logger');
const logtail = Logger.getLogtail(Logger.type.DataNative);

Logger.write(logtail, {dde: 'ddd'})