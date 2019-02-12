/**
 * Creator: Tang Xiaoji
 * Time: 2018-06-23
 */

'use strict';

const rpc = require('./rpc');
const config = require('../../config/config');
const Logger = require('../../config/Logger');
const logger = new Logger('dispatcher');
const mysql = require('../../config/mysql');
const redis = require('../../config/redis');
const Searcher = require('./searcher');
const Recycle = require('./recycle');
const broadcast = require('./broadcast');
const subs = require('../sub/subs');
const opp = require('./opportunity');
const uuidv1 = require('uuid/v1');
const moment = require('moment');

class Dispatcher {
  constructor() {
    this.server = new rpc.Server();
    this.server.on('remote', this.remoteHandler.bind(this));
    this.remotes = {};
    this.recycleTimeout = [];

    this.initRecycleTask();

    setInterval(this.check.bind(this), 10 * 1000);
  }

  initRecycleTask() {
    // 回收过期的任务重新分配
    this.recycle = new Recycle();
    this.recycle.on(Recycle.events.Reopen, this.onRecycleReopenHandler.bind(this));
  }

  onRecycleReopenHandler(plat, rooms) {
    logger.error('回收失败任务', plat, rooms.length);
    rooms.forEach(room => {
      let client_ip;
      if (plat === config.plat.quanmin) {
        client_ip = config.quanmin.target;
      } else {
        client_ip = this.getIdle();
      }
      if (client_ip) {
        mysql.getConn((err, conn) => {
          if (err) {
            logger.error('onRecycleReopenHandler getconn error', plat, err);
          } else {
            conn.query('UPDATE ?? SET status = ?, client_ip = ? WHERE plat = ? AND room_id = ?', [
              config.tbl_name.db_fentuan_taskv2, config.status.ACCEPT, client_ip, plat, room.room_id
            ], (err) => {
              conn.release();
              if (err) {
                logger.error('onRecycleReopenHandler', plat, err);
              } else {
              }
            });
          }
        })
      } else {
        logger.error('onRecycleReopenHandler 没有可用的ip', plat);
      }
    })
  }

  check(ips = []) {
    clearTimeout(this.checkTimer);
    this.checkTimer = setTimeout(() => {
      const checked = {};
      Object.keys(this.remotes).concat(ips).forEach(ip => {
        if (!checked[ip]) {
          checked[ip] = true;
          this._check(ip);
        }
      });
    }, 200);
  }

  async _check(ip) {
    const bee = this.remotes[ip];
    if (bee) {
      try {
        bee.task = await bee.remote.count();
      } catch (e) {
        logger.error('_check', ip, e);
      }
    } else {
      logger.error('_check', ip, '检测不到该主机');
    }
  }

  initSearcher(cb) {
    this.searcher = new Searcher();
    this.searcher.on('start', this.onStartInfoHandler.bind(this));
    this.searcher.on('stop', this.onStopInfoHandler.bind(this));
    this.searcher.on('error', this.onErrorInfoHandler.bind(this));
    this.searcher.runTask(cb);
  }

  onStartInfoHandler(plat, info) {
    logger.log('onStartInfoHandler', plat, `开播, 分发任务: ${info.length}`);
    this.contrast(plat, info, 'start', (task) => {
      if (task.deliver) {
        // 分发任务
        this.deliver(plat, Object.keys(task.deliver));
      }
    })
  }

  onStopInfoHandler(plat, info) {
    logger.log('onStopInfoHandler', plat, `关播, 分发任务: ${info.length}`);
    this.contrast(plat, info, 'stop', (task) => {
      if (task.close) {
        // 删除任务
        this.close(plat, Object.keys(task.close));
      }
    })
  }

  /**
   * @param plat huya...
   * @param info rid 数组, 新入任务
   * @param type start/stop
   * @param cb ({deliver, close}) => {}
   */
  contrast(plat, info, type, cb) {
    const tasks = {
      // 现有任务
      running: [], // 正在运行的任务、失败的任务、刚接受的任务
      closed: [], // 已被关播的任务，已发出过关播消息

      // 开播或关播
      deliver: [], // 将要分发的任务，即将发出开播消息
      close: [] // 将要关播的任务，即将关播
    };

    mysql.getConn((err, conn) => {
      if (err) {
        logger.error('searchalltask getconn', plat, err);
      } else {
        conn.query('SELECT room_id, status, sub, startInSub FROM ?? WHERE plat = ?', [
          config.tbl_name.db_fentuan_taskv2, plat
        ], (err, result) => {
          conn.release();
          if (err) {
            logger.error('searchalltask', plat, err);
          } else {
            if (result && result.length) {
              // 对旧任务进行分拣
              result.forEach(roominfo => {
                // sub状态为1: 长期监控的房间
                //    需根据startInSub来判断是否真实开播
                //    startInSub为1: 真实已开播 -> 走开关播流程
                //    startInSub为2: 真实未开播 -> 当做没有这个房间
                // sub状态为2: 非长期监控的房间
                //    直接走开关播流程，不关心startInSub的值
                if (roominfo.sub == 2 || (roominfo.sub == 1 && roominfo.startInSub == 1)) {
                  switch (roominfo.status) {
                    case config.status.FAILED:
                    case config.status.ACCEPT:
                    case config.status.RUNNING: {
                      tasks.running[roominfo.room_id] = 1;
                      break;
                    }
                    case config.status.CLOSED: {
                      tasks.closed[roominfo.room_id] = 1;
                      break;
                    }
                  }
                }
              });
            }

            switch (type) {
              case config.task_type.START: {
                // info: [rid]
                info.forEach(rid => {
                  if (!tasks.running[rid]) {
                    // 现有任务中都没有，新任务，分发
                    tasks.deliver[rid] = 1;
                    tasks.running[rid] = 1;
                  }
                });
                break;
              }
              case config.task_type.STOP: {
                info.forEach(rid => {
                  // 需关播
                  tasks.close[rid] = 1;
                });
                break;
              }
              default: {
                // 错误的type，不处理
                logger.error('error type', plat, type, info.length);
              }
            }
            cb && cb(tasks);
            delete tasks.running;
            delete tasks.closed;
          }
        });
      }
    });
  }

  async deliver(plat, rids) {
    logger.log('新分配任务', plat, rids.length);
    for (let rid of rids) {
      let isSub = false;
      try {
        isSub = await subs.isSub(plat, rid);
        if (isSub) {
          subs.update(plat, rid).then(r => logger.error('长期订阅', plat, r, rid)).catch(e => logger.error(`长期订阅错误`, plat, e, rid));
        }
      } catch (e) {
        logger.error('deliver 检查是否长期监听', plat, rid);
      }

      try {
        const start_info = await redis.hgetall(config.STRING_TASK_INFO(plat, rid));
        let client_ip;
        if (plat === config.plat.quanmin) {
          client_ip = config.quanmin.target;
        } else {
          client_ip = this.getIdle();
        }
        if (!Object.keys(start_info).length) {
          logger.error(`房间信息丢失`, plat, '', `${plat} ${rid}`);
        } else if (!client_ip) {
          logger.error(`没有可分配的ip`, plat, '', `${client_ip || '0.0.0.0'} ${plat} ${rid}`);
        } else {
          // 校验url
          const type = config.getType(start_info.url);
          if (type && config.plat.hasOwnProperty(type) && plat === type) {
            const hid = uuidv1();
            start_info.hid = hid;
            start_info.client_ip = client_ip;
            start_info.status = config.status.ACCEPT.toString();
            const now = moment().unix();
            const now_format = moment().format('YYYY-MM-DD HH:mm:ss');
            start_info.plat = plat;
            start_info.start_time = now;
            start_info.start_time_format = now_format;
            const fields = [
              'plat', 'url', 'status', 'client_ip', 'anchor_nick', 'room_id',
              'room_title', 'cate_id', 'cate_name', 'start_time', 'hid', 'anchor_id', 'startInSub', 'sub'
            ];
            const values = [];
            fields.forEach(field => {
              switch (field) {
                case 'startInSub': {
                  values.push(1);
                  break;
                }
                case 'sub': {
                  values.push(isSub ? 1 : 2);
                  break;
                }
                default: {
                  if (start_info[field]) {
                    values.push(start_info[field]);
                  } else {
                    values.push('');
                  }
                }
              }
            });

            const [err, conn] = await mysql.asyncGetConn();
            if (err) {
              logger.error('deliver getconn error', plat, err, rid);
            } else {
              const [err] = await mysql.asyncQuery('INSERT INTO ?? ( ?? ) VALUES ( ? ) ON DUPLICATE KEY UPDATE status = ?, startInSub = ?, sub = ?, url = ?', [
                config.tbl_name.db_fentuan_taskv2, fields, values, config.status.ACCEPT, 1, isSub ? 1 : 2, start_info.url
              ], conn);
              conn.release();
              if (err) {
                logger.error('deliver error', plat, err, rid);
              } else {
                // 设置开关播信息
                await redis.hmset(config.STRING_TASK_INFO(plat, rid), start_info);
                // 发出开播消息
                broadcast.start(start_info);
                opp.updateStartInfo(plat, rid, start_info.start_time).then(() => { }).catch(e => logger.error('updateStartInfo error', plat, e, rid));
                opp.updateHistoryStartInfo(plat, rid, hid, start_info.start_time).then(() => { }).catch(e => logger.error('updateHistoryStartInfo error', plat, e, rid));
                opp.updateLiveStatus(rid, 1, config.plat_no[plat]).then(() => { }).catch(e => logger.error('updateLiveStatus error', plat, e, rid));
                opp.checkRegisterUser('start', plat, start_info.room_id, start_info.url, start_info.hid).then(() => { }).catch(e => logger.error('start checkRegisterUser', plat, e, JSON.stringify(start_info)));
                opp.getNoticeToCheck(start_info).then(() => { }).catch(e => logger.error('getNoticeToCheck', plat, e, JSON.stringify(start_info)));
              }
            }
          } else {
            logger.error(`无效url`, plat, '', `${rid}, ${start_info.url}`);
          }
        }
      } catch (e) {
        logger.error('deliver error', plat, e, rid);
        continue;
      }
    }
  }

  async close(plat, rids) {
    logger.log('进入关播流程', plat, rids.length, 'rooms');
    // 非长期订阅，则将任务进行正常关播
    const [err, conn] = await mysql.asyncGetConn();
    if (err) {
      logger.error('close getconn error', plat, err);
    } else {
      for (let rid of rids) {
        try {
          // 长期订阅的房间不更新running状态
          const [err1] = await mysql.asyncQuery('UPDATE ?? SET status = ? WHERE room_id = ? AND plat = ? AND sub = ? LIMIT 1', [
            config.tbl_name.db_fentuan_taskv2, config.status.CLOSED, rid, plat, 2
          ], conn);
          if (err1) {
            logger.error('close1 error', plat, err);
          }

          const [err2] = await mysql.asyncQuery('UPDATE ?? SET startInSub = ? WHERE room_id = ? AND plat = ? LIMIT 1', [
            config.tbl_name.db_fentuan_taskv2, 2, rid, plat
          ], conn);
          if (err2) {
            logger.error('close2 error', plat, err);
          }
        } catch (e) {
          logger.error('close 检查是否长期监听', plat, rid);
        }

        try {
          // 检查关播消息
          const stop_info = await redis.hgetall(config.STRING_TASK_INFO(plat, rid));
          if (!stop_info) {
            logger.error('close no info', plat);
          } else {
            if (stop_info && stop_info.start_time) {
              // 发出关播消息
              const now = moment().unix();
              const now_format = moment().format('YYYY-MM-DD HH:mm:ss');
              stop_info.plat = plat;
              stop_info.stop_time = now;
              stop_info.stop_time_format = now_format;
              stop_info.start_time = parseInt(stop_info.start_time);
              broadcast.stop(stop_info);
              opp.updateStartInfo(plat, rid, stop_info.start_time, stop_info.stop_time).then(() => { }).catch(e => logger.error('updateStartInfo error', plat, e, JSON.stringify(stop_info)));
              opp.updateHistoryStartInfo(plat, rid, stop_info.hid || '', stop_info.start_time, stop_info.stop_time).then(() => { }).catch(e => logger.error('updateHistoryStartInfo error', plat, e, JSON.stringify(stop_info)));
              opp.updateLiveStatus(rid, 0, config.plat_no[plat]).then(() => { }).catch(e => logger.error('updateLiveStatus', plat, e, JSON.stringify(stop_info)));
              opp.checkRegisterUser('stop', plat, stop_info.room_id, stop_info.url, stop_info.hid).then(() => { }).catch(e => logger.error('stop checkRegisterUser', plat, e, JSON.stringify(stop_info)));
              opp.removeRoom(plat, rid).then(() => { }).catch(e => logger.error('removeRoom', plat, e, JSON.stringify(stop_info)));
              opp.pushLiveReport(rid, config.plat_no[plat], stop_info.hid || '', stop_info.start_time, stop_info.stop_time).then(() => { }).catch(e => logger.error('pushLiveReport', plat, e, JSON.stringify(stop_info)));

              // 删除任务和房间信息
              await redis.zrem(config.SORTED_SET_TASK(plat), rid);
              await redis.del(config.STRING_TASK_INFO(plat, rid));
              logger.error('删除开播信息和开播时间=>', plat, '', rid);
            } else {
              logger.error('丢失开播信息或开播时间', plat, '', rid);
              await redis.zrem(config.SORTED_SET_TASK(plat), rid);
              await redis.del(config.STRING_TASK_INFO(plat, rid));
            }
          }
        } catch (e) {
          logger.error('close error', plat, e, rids.length);
          continue;
        }
      }
    }
    conn.release();
  }

  onErrorInfoHandler(scene, e) {
    logger.error(scene, 'dispather', e);
  }

  getIdle(test) {
    let min = null;
    for (let ip in this.remotes) {
      const bee = this.remotes[ip];
      if (!min || min.task > bee.task) {
        min = bee;
      }
    }
    if (min) {
      if (!test) {
        min.task++;
      }
      return min.remote.ip;
    } else {
      return false;
    }
  }

  reduceRemoteCount(ip) {
    if (!ip) {
      return
    }

    const remote = this.remotes[ip];
    if (remote && remote.task > 0) {
      remote.task--;
    }
  }

  remoteHandler(remote) {
    const ip = remote.ip;
    if (this.remotes.hasOwnProperty(ip)) {
      logger.log(`机器重复 [${ip}]`);
    } else {
      this.addRemote(remote);
    }
  }

  async addRemote(remote) {
    const ip = remote.ip;
    this.recycleTimeout[ip] && clearTimeout(this.recycleTimeout[ip]);
    try {
      const count = await remote.count();
      this.remotes[ip] = {
        remote,
        error: 0,
        task: count
      };
      logger.log(`注册主机【${ip}】, 负载：${count}, 共${Object.keys(this.remotes).length}台主机`);
      remote.on('close', () => {
        this.removeRemote(ip);
      });
    } catch (e) {
      logger.error('addRemote', 'dispather', e);
      remote.end();
      remote.destroy();
    }
  }

  // 回收任务时无需考虑是否长期监听
  removeRemote(ip) {
    const old = this.remotes[ip];
    if (old) {
      delete this.remotes[ip];
      try {
        old.remote.end();
        old.remote.destroy();
      } catch (e) {
      }
      logger.error(`远程主机被移出集群, 回收该机器上的任务`, ip);
      clearTimeout(this.recycleTimeout[ip]);
      this.recycleTimeout[ip] = setTimeout(() => {
        this.recycle.recycleFailNodeTask(ip);
      }, config.timeout.wait_recycle);
    }
  }
}

module.exports = new Dispatcher();
