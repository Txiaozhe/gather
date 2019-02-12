/**
 * Creator: Tang Xiaoji
 * Time: 2018-07-16
 */

'use strict';

const config = require('../../config/config');
const redis = require('../../config/redis');
const mysql = require('../../config/mysql');
const moment = require('moment');
const Logger = require('../../config/Logger');
const logger = new Logger('nest/sub/subs');

const subStatus = {
  sub: 1,
  notSub: 2
}

class Subs {
  async sub(plat, rid) {
    if (!config.plat.hasOwnProperty(plat)) {
      throw new Error('plat error');
    }

    this.updateTaskSubStatus(plat, rid, subStatus.sub);
    try {
      return new Promise((resolve, reject) => {
        redis.multi([
          ['set', config.STRING_SUB_TASK_KEY(plat, rid), moment().format('YYYY-MM-DD HH:mm:ss'), 'EX', 12 * 60 * 60],
          ['sadd', config.SET_SUB_TASK_KEY(plat), rid]
        ]).exec((err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
    } catch (e) {
      throw e;
    }
  }

  async update(plat, rid) {
    if (!config.plat.hasOwnProperty(plat)) {
      throw new Error('plat error');
    }

    this.updateTaskSubStatus(plat, rid, subStatus.sub);
    try {
      return await redis.set(config.STRING_SUB_TASK_KEY(plat, rid), moment().format('YYYY-MM-DD HH:mm:ss'), 'EX', 12 * 60 * 60);
    } catch (e) {
      throw e;
    }
  }

  async isSub(plat, rid) {
    if (!config.plat.hasOwnProperty(plat)) {
      throw new Error('plat error');
    }

    try {
      const isMember = await redis.sismember(config.SET_SUB_TASK_KEY(plat), rid);
      if (isMember === 1) {
        const info = await redis.get(config.STRING_SUB_TASK_KEY(plat, rid));
        if (info) {
          return true;
        } else {
          await redis.srem(config.SET_SUB_TASK_KEY(plat), rid);
          return false;
        }
      } else {
        return false;
      }
    } catch (e) {
      throw e;
    }
  }

  async unSub(plat, rid) {
    if (!config.plat.hasOwnProperty(plat)) {
      throw new Error('plat error');
    }

    this.updateTaskSubStatus(plat, rid, subStatus.notSub);
    try {
      return new Promise((resolve, reject) => {
        redis.multi([
          ['del', config.STRING_SUB_TASK_KEY(plat, rid)],
          ['srem', config.SET_SUB_TASK_KEY(plat), rid]
        ]).exec((err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
    } catch (e) {
      throw e;
    }
  }

  async getSubList(plat) {
    if (!config.plat.hasOwnProperty(plat)) {
      throw new Error('plat error');
    }

    try {
      return await redis.smembers(config.SET_SUB_TASK_KEY(plat));
    } catch (e) {
      throw e;
    }
  }

  async updateTaskSubStatus(plat, rid, status) {
    const [err, conn] = await mysql.asyncGetConn();
    if (err) {
      logger.error('sub getconn error', plat, err, rid);
    } else {
      const [err] = await mysql.asyncQuery('UPDATE ?? SET sub = ? WHERE plat = ? AND room_id = ? LIMIT 1', [
        config.tbl_name.db_fentuan_taskv2, status, plat, rid
      ], conn);

      if (err) {
        logger.error('sub update sub status error', plat, err, rid);
      }
    }

    conn.release();
  }
}

module.exports = new Subs();
