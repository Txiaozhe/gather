/**
 * Creator: Tang Xiaoji
 * Time: 2018-01-23
 */

const moment = require('moment');

const TYPE = {
  Broadcast: 'logtail_broadcast',
  Alarm: 'logtail_alarm',
  DataNative: 'logtail_data_native'
};

const LEVEL = {
  Debug: 'debug',
  Log: 'log',
  Info: 'info',
  Error: 'error',
};

class Logger {
  constructor(space) {
    this.space = space;
  }

  log() {
    console.log(`\x1B[32m[INFO]\x1B[39m ${moment().format('YYYY-MM-DD HH:mm:ss')} ${this.space}: ${Array.prototype.slice.call(arguments).join(', ')}`);
  }

  debug(arg) {
    console.log(`\x1B[33m[DEBUG]\x1B[39m ${moment().format('YYYY-MM-DD HH:mm:ss')} ${this.space}: `, JSON.stringify(arg));
  }

  /**
   * @param title
   * @param plat
   * @param err
   * @param info
   * @param print 是否打印在控制台
   * @param report 是否推loghub
   */
  error(title, plat, err, info = '', print = false, report = true) {
    if(print) {
      if (err && err instanceof Error) {
        console.log(`\x1B[31m[ERROR]\x1B[39m ${moment().format('YYYY-MM-DD HH:mm:ss')} ${this.space}: ${plat} ${title}\n${err.stack}`)
      } else {
        console.log(`\x1B[31m[ERROR]\x1B[39m ${moment().format('YYYY-MM-DD HH:mm:ss')} ${this.space}: ${plat} ${title} ${err}`)
      }
    }

    if (report) {
      this.alarm(title, err, plat, info, LEVEL.Error);
    }
  }

  static getLogtail(type) {
    return require('../config/log').getLogger(type);
  }

  static write(logtail, info) {
    logtail.info(info);
  }

  alarm(title, err = '', plat = 'null', info = '', type = LEVEL.Log) {
    const payload = {};
    payload.host = require('ip').address();
    payload.title = title;
    payload.stack = err;
    payload.plat = plat;
    payload.type = type;
    payload.space = this.space;
    payload.info = info;
    if (err instanceof Error) {
      payload.stack = err.stack;
    }
    const logtail = Logger.getLogtail(TYPE.Alarm);
    Logger.write(logtail, payload);
  };
}

Logger.type = TYPE;
Logger.level = LEVEL;
module.exports = Logger;
