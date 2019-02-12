/**
 * Creator: Tang Xiaoji
 * Time: 2018-06-26
 */

'use strict';

const moment = require('moment');
const Logger = require('../../config/Logger');
const broadcast_logtail = Logger.getLogtail(Logger.type.Broadcast);

function start(info) {
  const now = moment().unix();
  const now_format = moment().format('YYYY-MM-DD HH:mm:ss');
  if(!info.start_time) info.start_time = now;
  if(!info.start_time_format) info.start_time_format = now_format;
  info.type = 'start';

  delete info.status;
  Logger.write(broadcast_logtail, info);
}

function stop(info) {
  const now = moment().unix();
  const now_format = moment().format('YYYY-MM-DD HH:mm:ss');
  info.type = 'stop';
  if(!info.stop_time) info.stop_time = now;
  if(!info.stop_time_format) info.stop_time_format = now_format;

  delete info.status;
  Logger.write(broadcast_logtail, info);
}

module.exports = {
  start,
  stop
};
