/**
 * Creator: Tang Xiaoji
 * Time: 2018-06-25
 */

'use strict';

const mysql = require('../../config/mysql');
const { TYPE, DanmuClient } = require('../../danmu');
const config = require('../../config/config');
const util = require('./util');
const Logger = require('../../config/Logger');
const logger = new Logger('lib/bee');
const monitor = require('../../helper/monitor');
const Queue = require('./queue');
const redis = require('../../config/redis');
const moment = require('moment');
const _ = require('lodash');

const failQueue = new Queue(1000, (data, onerror) => {
  data.forEach(url => {
    mysql.getConn((err, conn) => {
      if (err) {
        logger.error('failQueue getconn error', config.getRealType(url), err, url);
      } else {
        conn.query('UPDATE ?? SET status = ? WHERE url = ? AND status = ?', [
          config.tbl_name.db_fentuan_taskv2, config.status.FAILED, url, config.status.RUNNING
        ], err => {
          conn.release();
          if (err) {
            logger.error('failQueue', config.getRealType(url), err, url);
            onerror();
          }
        });
      }
    })
  });
});

let size = 0;
const bees = {};
const MAX_ERROR_RETRY = 20;
const BEE_TIMEOUT = 10 * 1000;

class Bee {
  constructor(task) {
    this.url = task.url;
    this.plat = task.plat;
    this.opts = task;
    this.error = 0;
    this.reconnectCount = 0;
    this.waitToDestory = null;
    this.init();
    if (config.blockList.includes(this.plat)) {
      logger.log('该平台暂不支持', this.plat);
    } else {
      this.start();
    }

    this.native_data_logtail = Logger.getLogtail(`${Logger.type.DataNative}_${this.plat}`);
  }

  start() {
    try {
      this.client = new DanmuClient(this.plat, this.url, this.opts);
      this.client.on('connect', this.connectHandler.bind(this));
      this.client.on('initerror', this.errorHandler.bind(this));
      this.client.on('error', this.errorHandler.bind(this));
      this.client.on('data', this.dataHandler.bind(this));
      this.client.on('close', this.errorHandler.bind(this, 'close'));
      this.client.on('monitor_stop', this.monitorStopHandler.bind(this));
      this.client.on('destroy', this.monitorStopHandler.bind(this));

      if (this.plat !== config.plat.chushou && this.plat !== config.plat.huya && this.plat !== config.plat.huoshan) {
        // 除触手、虎牙以外平台
        this.timeout();
      } else {
        this.error += 5;
      }
    } catch (e) {
      logger.error('init bee error', this.plat, e);
    }
  }

  async init() {
    try {
      if (this.plat === config.plat.douyu || this.plat === config.plat.panda) {
        await redis.lpush(config.LIST_GIFT_TASK_KEY(this.plat), this.opts.room_id);
      }
    } catch (e) {
      logger.error('init bee gift error', this.plat, e);
    }
  };

  connectHandler() {
    logger.log('连接成功 ======> ', this.url);
  }

  timeout() {
    clearTimeout(this.nodata_timer);
    this.nodata_timer = setTimeout(() => {
      if (this.reconnectCount > 1) {
        logger.error('重连', this.plat, this.reconnectCount, this.url);
      }
      this.reconnectCount++;
      this.errorHandler('timeout');
    }, BEE_TIMEOUT * util.fib(this.reconnectCount));
  }

  dataHandler(data) {
    this.error = 0;
    this.reconnectCount = 0;
    if (this.plat !== config.plat.chushou && this.plat !== config.plat.huya && this.plat !== config.plat.huoshan) {
      this.timeout();
    }
    [].concat(data).forEach(item => {
      // 输出日志
      Logger.write(this.native_data_logtail, util.trimNativeDataInfo(this.opts, item));
    });
  }

  errorHandler(err) {
    if (err) {
      this.stop();
      if (this.error++ > MAX_ERROR_RETRY) {
        logger.error('bee监听错误', this.plat, err, this.url);
        this.waitToDestory = this.url;
      } else {
        try {
          setTimeout(this.start.bind(this), 1000);
        } catch (e) {
          this.errorHandler(e);
        }
      }
    }
  }

  stop() {
    clearTimeout(this.nodata_timer);
    try {
      this.client && this.client.destroy();
    } catch (e) {
      logger.error('stop error', this.plat, e);
    }
  }

  // 监听结束
  monitorStopHandler() {
    this.client = null;
    delete bees[this.url];
    if (this.waitToDestory) {
      failQueue.push(this.waitToDestory);
      this.waitToDestory = null;
    }
    logger.error('监听结束', this.plat, this.reconnectCount, this.url);
  }
}

class Manager {
  constructor() {
    this.count = () => {
      logger.log('当前监听数 ===>', Object.keys(bees).length);
      return size;
    };

    // 检查机器性能
    monitor.updateSystemInfo();
  }

  check(cb) {
    logger.log('任务自检...', config.app.host);
    const tasks = [];
    mysql.getConn((err, conn) => {
      if (err) {
        logger.error('任务自检 getConn', config.app.host, err);
        setTimeout(this.check.bind(this), config.timeout.nest_check_task);
      } else {
        conn.query('SELECT plat, anchor_nick, anchor_id, cate_id, cate_name, room_id, room_title, status, url, sub, create_at FROM ?? WHERE client_ip = ?', [
          config.tbl_name.db_fentuan_taskv2, config.app.host
        ], (err, result) => {
          conn.release();
          setTimeout(this.check.bind(this), config.timeout.nest_check_task);
          if (err) {
            logger.error('任务自检', config.app.host, err);
          } else {
            size = result.length;
            result.forEach(async task => {
              if ([2, 3].includes(+task.status) && task.sub == 2) {
                size--;
              }

              if (!config.blockList.includes(task.plat)) {
                const is_update_client = (moment().unix() - moment(task.create_at).unix()) > (24 * 60 * 60 + _.random(0, 60 * 60));
                if (task.sub == 1 && is_update_client) {
                  try {
                    await mysql.asyncQuery('UPDATE ?? SET status = ?, create_at = ? WHERE plat = ? AND room_id = ? LIMIT 1', [
                      config.tbl_name.db_fentuan_taskv2, config.status.FAILED, moment().format('YYYY-MM-DD HH:mm:ss'), task.plat, task.room_id
                    ]);

                    logger.error('update client', task.plat, '', `${task.room_id} ${task.create_at}`);
                    task.status = config.status.FAILED;
                    tasks.push(task);
                  } catch(e) {
                    logger.error('task update client error', task.plat, err, task.room_id);
                    tasks.push(task);
                  }
                } else {
                  tasks.push(task);
                }
              }
            });
            logger.log(`检查到 ${tasks.length} 个任务, 有效任务: ${size}`);
            this.updateTasks(tasks);
            cb && cb(err, size);
          }
        });
      }
    });
  }

  // 每个任务做自检
  async _beeCheck(cb) {
    await util.sleep(2 * 60 * 1000);
    logger.error('_beeCheck 任务自检', '_beeCheck');
    const ip = config.app.host;
    const stop = [];
    for (let url of Object.keys(bees)) {
      const task = new Promise((resolve, reject) => {
        mysql.getConn((err, conn) => {
          if (err) {
            resolve();
            logger.error('_beeCheck error', config.getRealType(url), err, url);
          } else {
            conn.query('SELECT client_ip FROM ?? WHERE url = ?', [
              config.tbl_name.db_fentuan_taskv2, url
            ], (err, res) => {
              conn.release();
              if (err) {
                logger.error('_beeCheck error', config.getRealType(url), err, url);
                resolve();
              } else {
                if (!res || !res.length || res[0].client_ip !== ip) {
                  logger.error('_beeCheck 对不正常任务执行关闭操作', config.getRealType(url), res, url);
                  // 不正常任务，执行关闭操作
                  resolve(url);
                } else {
                  resolve();
                }
              }
            });
          }
        });
      });

      const u = await task;
      u && stop.push({ plat: config.getType(url), url: u });
    }

    this.stop(stop);
    cb && cb(stop.length);
    setTimeout(this._beeCheck.bind(this), 10 * 60 * 1000);
  }

  updateTasks(tasks) {
    const list = {
      accept: [],
      start: [],
      del: [],
      stop: []
    };

    tasks.forEach(task => {
      const url = task.url;
      const isRunning = bees.hasOwnProperty(url);
      const isSub = task.sub == 1;
      switch (task.status) {
        case config.status.ACCEPT:
          if (!isRunning) {
            list.start.push(task);
          }
          list.accept.push(url);
          break;
        case config.status.RUNNING:
          if (!isRunning) {
            list.start.push(task);
          }
          break;
        case config.status.CLOSED:
          if (!isSub) {
            list.del.push(url);
            if (isRunning) {
              list.stop.push(task);
            }
          }
          break;
        case config.status.FAILED:
          if (isRunning) {
            list.stop.push(task);
          }
          break;
      }
    });
    this.todo(list);
  }

  todo(list) {
    for (let method in list) {
      if (list.hasOwnProperty(method)) {
        const tasks = list[method];
        if (tasks.length) {
          if (typeof this[method] === 'function') {
            logger.log(`操作 ${method}: ${tasks.length}`);
            try {
              this[method](tasks);
            } catch (e) {
              logger.error(`操作 ${method} error: `, config.app.host, e);
            }
          } else {
            logger.log(`没有此操作：${method}`);
          }
        }
      }
    }
  }

  // task-todo 开启采集
  accept(urls) {
    this.updateStatus(urls, config.status.RUNNING);
  }

  // task-todo
  start(tasks) {
    return this._process(tasks, (task) => {
      if (!bees.hasOwnProperty(task.url)) {
        //房间信息初始化
        bees[task.url] = new Bee(task);
      }
    });
  }

  // task-todo
  del(urls) {
    urls.forEach(url => {
      mysql.getConn((err, conn) => {
        if (err) {
          logger.error('del getconn err', url, err);
        } else {
          conn.query('DELETE FROM ?? WHERE url = ? AND sub = ?', [
            config.tbl_name.db_fentuan_taskv2, url, 2
          ], (err) => {
            conn.release();
            if (err) {
              logger.error('del task', url, err);
            }
          });
        }
      })
    });
  }

  // task-todo
  stop(tasks) {
    return this._process(tasks, (task) => {
      const bee = bees[task.url];
      if (bee) {
        bee.stop();
        delete bees[task.url];
        //移除关闭房间
        logger.error('主播关播，停止监听房间', task.plat, task.url);
      } else {
        return `No such task ${task.url}`;
      }
    });
  }

  _process(tasks, each) {
    const ret = {
      running: 0,
      success: [],
      fail: []
    };
    [].concat(tasks).forEach(task => {
      const type = config.getRealType(task.url);
      task.plat = type;
      let err = null;
      if (type) {
        if (TYPE.hasOwnProperty(type)) {
          try {
            err = each(task);
            if (!err) {
              ret.success.push(task.url);
              return;
            }
          } catch (e) {
            err = e.message || e;
          }
        } else {
          err = `Unsupport client type ${type}`;
        }
      } else {
        err = `Unknown url pattern ${task.url}`;
      }
      if (err) {
        logger.error('_process', task.plat, err);
        ret.fail.push(task.url);
      }
    });
    ret.running = Object.keys(bees).length;
    return ret;
  }

  fail(urls) {
    this.updateStatus(urls, config.status.FAILED);
  }

  updateStatus(urls, status) {
    urls.forEach(url => {
      mysql.getConn((err, conn) => {
        if (err) {
          logger.error('updateStatus getconn err', url, err);
        } else {
          conn.query('UPDATE ?? SET status = ? WHERE url = ?', [
            config.tbl_name.db_fentuan_taskv2, status, url
          ], (err) => {
            conn.release();
            if (err) {
              logger.error('update task', url, err);
            }
          });
        }
      })
    })
  }
}

module.exports = new Manager();
