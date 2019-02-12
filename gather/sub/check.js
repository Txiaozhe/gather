/**
 * Creator: Tang Xiaoji
 * Time: 2018-07-17
 */

'use strict';

const mysql = require('../../config/mysql');
const config = require('../../config/config');
const Logger = require('../../config/Logger');
const logger = new Logger('sub/check');
const subs = require('./subs');

class Check {
  constructor() {
    this.check();
  }

  async check() {
    const [err, conn] = await mysql.asyncGetConn();
    for (let plat in config.plat) {
      if (config.plat.hasOwnProperty(plat)) {
        if (err) {
          logger.error('check getconn error', plat, err);
        } else {
          const [err, res] = await mysql.asyncQuery('SELECT room_id FROM ?? WHERE platform_name = ?', [
            config.tbl_name.db_user_all_room_bind, plat
          ], conn);

          if (err) {
            logger.error('search binds from mysql error', plat, err);
          } else {
            try {
              const subslist = await subs.getSubList(plat)
              const news = {}, old = {};
              res.forEach(r => news[r.room_id] = 1);
              subslist.forEach(s => old[s] = 1);
              await this.subHandler(plat, news, old);
            } catch (e) {
              logger.error('search subslist from redis error', plat, e);
            }
          }
        }
      }
    }

    conn.release();
    setTimeout(this.check.bind(this), config.timeout.check_sub_list); // 10mim
  }

  async subHandler(plat, news, old) {
    const plan = {
      sub: [],
      unSub: [],
      update: []
    };
    for (let new_rid in news) {
      if (news.hasOwnProperty(new_rid)) {
        if (!old.hasOwnProperty(new_rid)) {
          plan.sub.push(new_rid);
        } else {
          plan.update.push(new_rid);
        }
      }
    }

    for (let old_rid in old) {
      if (old.hasOwnProperty(old_rid)) {
        if (!news.hasOwnProperty(old_rid)) {
          plan.unSub.push(old_rid);
        }
      }
    }

    await this.todo(plat, plan);
  }

  async todo(plat, plan) {
    for (let method in plan) {
      if (plan.hasOwnProperty(method)) {
        const list = plan[method];
        if (list.length && typeof subs[method] === 'function') {
          for (let rid of list) {
            try {
              await (subs[method](plat, rid));
            } catch (e) {
              logger.error(`check ${method}`, plat, e);
            }
          }
          logger.error(`长期订阅`, plat, method, list.length);
        }
      }
    }
  }
}

module.exports = new Check();
