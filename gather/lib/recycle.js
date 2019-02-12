/**
 * Creator: Tang Xiaoji
 * Time: 2018-06-27
 */

'use strict';

const config = require('../../config/config');
const EventEmitter = require('events');
const Logger = require('../../config/Logger');
const logger = new Logger('recycle');
const mysql = require('../../config/mysql');

const EVENTS = {
  Reopen: 'recycle.reopen'
};

class Recycle extends EventEmitter {
  constructor() {
    super();

    setInterval(this.scan.bind(this), config.timeout.recycle_fail_task);
  }

  // 搜索所有失败的任务进行回收
  scan() {
    const plan = {
      reopen: [], // status: FAILED
    };
    for (let plat in config.plat) {
      if (config.plat.hasOwnProperty(plat) && !config.blockList.includes(plat)) {
        mysql.getConn((err, conn) => {
          if (err) {
            logger.error('scan getconn error', plat, err);
          } else {
            conn.query('SELECT room_id, client_ip FROM ?? WHERE plat = ? AND status = ?', [
              config.tbl_name.db_fentuan_taskv2, plat, config.status.FAILED
            ], (err, rooms) => {
              conn.release();
              if(err) {
                logger.error('scan error', plat, err);
              } else {
                if (rooms && rooms.length) {
                  rooms.forEach(room => {
                    plan.reopen.push(room);
                  });

                  this._todo(plat, plan);
                  logger.error('recyclescan', plat, `已回收：${plat} ${rooms.length}`);
                } else {
                  logger.error('recyclescan', plat, '没有需要回收的任务');
                }
              }
            });
          }
        });
      }
    }
  }

  _todo(plat, plan) {
    for (let type in plan) {
      const method = this[type];
      if (typeof method === 'function') {
        (method.bind(this))(plat, plan[type]);
      }
    }
  }

  reopen(plat, rooms) {
    this.emit(EVENTS.Reopen, plat, rooms);
  }

  // 回收掉线的机器上的任务
  recycleFailNodeTask(ip) {
    const list = {
      del: [],
      failed: []
    };
    mysql.getConn((err, conn) => {
      if (err) {
        logger.error('recycleFailNodeTask getconn0 error', ip, err);
      } else {
        conn.query('SELECT url, status, sub FROM ?? WHERE client_ip = ?', [
          config.tbl_name.db_fentuan_taskv2, ip
        ], (err, results) => {
          conn.release();
          if (err) {
            logger.error('recycleFailNodeTask select error', ip, err);
          } else {
            results.forEach(task => {
              if (task.sub == 1) {
                // 长期订阅的房间，无论开播与否都当做失败房间来进行回收
                list.failed.push(task.url);
              } else {
                switch (task.status) {
                  case config.status.CLOSED: {
                    // 删除关闭的任务
                    list.del.push(task.url);
                    break;
                  }
                  default: {
                    list.failed.push(task.url);
                  }
                }
              }
            });

            for (let type in list) {
              const method = this[type];
              if (typeof method === 'function') {
                method(list[type]);
              }
            }
          }
        });
      }
    })
  }

  del(urls) {
    urls.forEach(url => {
      mysql.getConn((err, conn) => {
        if (err) {
          logger.error('recycleFailNodeTask getconn1 error', config.getRealType(url), err);
        } else {
          conn.query('DELETE FROM ?? WHERE url = ? AND sub = ?', [
            config.tbl_name.db_fentuan_taskv2, url, 2
          ], (err) => {
            conn.release();
            if (err) {
              logger.error('recycleFailNodeTask del error', config.getRealType(url), err, url);
            }
          });
        }
      });
    });
  }

  failed(urls) {
    urls.forEach(url => {
      mysql.getConn((err, conn) => {
        if (err) {
          logger.error('recycleFailNodeTask getconn2 error', config.getRealType(url), err);
        } else {
          conn.query('UPDATE ?? SET status = ? WHERE url = ?', [
            config.tbl_name.db_fentuan_taskv2, config.status.FAILED, url
          ], (err) => {
            conn.release();
            if (err) {
              logger.error('recycleFailNodeTask update error', config.getRealType(url), err, url);
            } else {
              logger.error('机器掉线，回收任务', config.getRealType(url), url);
            }
          });
        }
      });
    });
  }
}

Recycle.events = EVENTS;
module.exports = Recycle;
