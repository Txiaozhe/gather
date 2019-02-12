/**
 * Creator: Tang Xiaoji
 * Time: 2018-06-23
 */

'use strict';

const EventEmitter = require('events');
const config = require('../../config/config');
const redis = require('../../config/redis');
const moment = require('moment');
const Logger = require('../../config/Logger');
const logger = new Logger('searcher');

class Searcher extends EventEmitter {
  constructor() {
    super();
  }

  async runTask(cb) {
    logger.log('开始检索任务...');
    for (let plat in config.plat_effective) {
      if(config.plat_effective.hasOwnProperty(plat)) {
        try {
          const now = moment().unix();
          const effect = now - config.plat_effective[plat];

          const latest_update_time = await redis.get(config.TASK_LATEST_UPDATE_TIME_KEY(plat));
          if (!latest_update_time || latest_update_time < effect) {
            // 超时未更新，设定任务失败
            this.emit('error', 'searcher', `超时未更新 latest: ${moment(Number(latest_update_time || 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}`);
          } else {
            const start = await redis.zrangebyscore(config.SORTED_SET_TASK(plat), effect, '+inf');
            const stop = await redis.zrangebyscore(config.SORTED_SET_TASK(plat), '-inf', effect);
            this.emit('start', plat, start);
            this.emit('stop', plat, stop);
            cb && cb(plat, `采集任务: ${start.length}, 关闭任务: ${stop.length}`);
          }
        } catch (e) {
          this.emit('error', 'searcher', e);
          continue;
        }
      } else {
        logger.log('没有这个平台', plat);
      }
    }

    setTimeout(() => this.runTask(cb), config.opp.search_task);
  }
}

module.exports = Searcher;
