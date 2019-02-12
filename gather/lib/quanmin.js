/**
 * Creator: Tang Xiaoji
 * Time: 2018-06-29
 */

'use strict';

const config = require('../../config/config');
const mysql = require('../../config/mysql');
const Logger = require('../../config/Logger');
const logger = new Logger('quanmin bee');
const util = require('./util');
const Socket = require('net').Socket;
const msgPack = require('msgpack-lite');
const native_data_logtail = Logger.getLogtail(`${Logger.type.DataNative}_${'quanmin'}`);
const monitor = require('../../helper/monitor');
const Gift = require('./gift');
const giftHelper = Gift.getInstance();
const subs = require('../sub/subs');

const slice = (...arg) => Buffer.prototype.slice.call(...arg);

class Quanmin {
  constructor() {
    this.list = {};
    this.subs = {};

    this.initSubs();
    setTimeout(this.initBee.bind(this), 10 * 1000);

    // 检查机器性能
    monitor.updateSystemInfo();
  }

  // 初始化长期监听的房间列表
  async initSubs() {
    const rids = await subs.getSubList(config.plat.quanmin);
    logger.error('initSubs 获取订阅列表', config.plat.quanmin, '', rids.length);
    if (rids && rids.length) {
      const [err, conn] = await mysql.asyncGetConn();
      if (err) {
        logger.error('initSubs getconn error', config.plat.quanmin, err);
      } else {
        for (let rid of rids) {
          const [err, res] = await mysql.asyncQuery('SELECT * FROM ?? WHERE rid = ? AND platform = ?', [
            config.tbl_name.db_fentuan_anchor_info, rid, config.plat_no.quanmin
          ], conn);
          if (err) {
            logger.error('initSubs query anchor info', config.plat.quanmin, e);
          } else if (res && res.length) {
            this.subs[res[0].uid] = res[0];
          }
        }
      }
      conn.release();
    }
    setTimeout(this.initSubs.bind(this), config.timeout.quanmin_init_subs); // 1h
  }

  initBee() {
    this.socket = new Socket();
    this.offset = 0;
    this.buffer = Buffer.from([]);

    this.socket.on('error', this.onErrorHandler.bind(this));
    this.socket.on('timeout', this.onErrorHandler.bind(this));
    this.socket.on('connect', this.onConnectHandler.bind(this));
    this.socket.on('data', this.clientDataHandler.bind(this));

    this.getGifts.call(this);
    this.socket.connect(config.quanmin.port, config.quanmin.host);
  }

  async check(cb) {
    const [err, conn] = await mysql.asyncGetConn();
    if (err) {
      logger.error('任务自检 getConn', config.plat.quanmin, err);
    } else {
      const [err, result] = await mysql.asyncQuery('SELECT anchor_nick, anchor_id, cate_id, cate_name, room_id, room_title, url, status, plat FROM ?? WHERE plat = ?', [
        config.tbl_name.db_fentuan_taskv2, config.plat.quanmin
      ], conn);
      if (err) {
        logger.error('任务自检', config.plat.quanmin, err);
      } else {
        logger.log(`检查到 ${result.length} 个任务`);
        await this.updateTasks(result);
      }
      conn.release();
      cb && cb(err, result.length);
    }

    setTimeout(this.check.bind(this), config.timeout.quanmin_check_task); // 5s
  }

  async updateTasks(tasks) {
    const list = {
      start: [],
      del: []
    };
    tasks.forEach(task => {
      switch (task.status) {
        case config.status.RUNNING:
          if (!this.list.hasOwnProperty(task.anchor_id)) {
            this.list[task.anchor_id] = task;
          }
          break;
        case config.status.ACCEPT: {
          if (!this.list.hasOwnProperty(task.anchor_id)) {
            this.list[task.anchor_id] = task;
          }
          list.start.push(task.url);
          break;
        }
        case config.status.CLOSED: {
          if (this.list.hasOwnProperty(task.anchor_id)) {
            delete this.list[task.anchor_id];
          }
          list.del.push(task.url);
          break;
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

  async start(urls) {
    const [err, conn] = await mysql.asyncGetConn();
    if (err) {
      logger.error('start getconn error', config.plat.quanmin, err);
    } else {
      for (let url of urls) {
        try {
          await mysql.asyncQuery('UPDATE ?? SET status = ? WHERE url = ?', [
            config.tbl_name.db_fentuan_taskv2, config.status.RUNNING, url
          ], conn);
        } catch (e) {
          logger.error('start error', config.plat.quanmin, e, url);
          continue;
        }
      }

      conn.release();
      logger.error('start tasks', config.plat.quanmin, '', urls.length);
    }
  }

  async del(urls) {
    const [err, conn] = await mysql.asyncGetConn();
    if (err) {
      logger.error('del getconn error', config.plat.quanmin, err);
    } else {
      for (let url of urls) {
        try {
          await mysql.asyncQuery('DELETE FROM ?? WHERE url = ? AND sub = ?', [
            config.tbl_name.db_fentuan_taskv2, url, 2
          ], conn);
        } catch (e) {
          logger.error('del error', config.plat.quanmin, e, url);
          continue;
        }
      }

      conn.release();
      logger.error('del tasks', config.plat.quanmin, err, urls.length);
    }
  }

  onErrorHandler(err) {
    logger.log('socket error', err);
  }

  async onConnectHandler() {
    const res = await util.getToken();
    let token;
    try {
      token = res.body.data.token;
    } catch (e) {
      logger.error('获取token失败', config.plat.quanmin, e);
    }

    if (token) {
      this.send(config.quanmin.type.AUTH, {
        appId: config.quanmin.appId,
        token: token
      });
    }
    logger.log('全民连接成功');
  }

  async clientDataHandler(buffer) {
    try {
      this.buffer = this.buffer ? Buffer.concat([this.buffer, buffer]) : Buffer.from(buffer);
      this.offset = this.offset || 0;

      while (this.buffer && (this.buffer.length - this.offset >= 24)) {
        try {
          let packageLen = this.buffer.readInt32LE(this.offset);
          this.offset += 4;
          let offset = 0;
          let pack = slice(this.buffer, this.offset, this.offset + packageLen);
          if ((packageLen === pack.length) && (pack.length > 24)) {
            let sequence = pack.readInt32LE(offset);
            offset += 4;
            let type = pack.readInt32LE(offset);
            offset += 4;
            let ver = pack.readInt32LE(offset);
            offset += 4;
            let crc = pack.readUInt32LE(offset);
            offset += 4;
            let reserve = pack.readInt32LE(offset);
            offset += 4;
            let content = msgPack.decode(slice(pack, offset, offset + packageLen - 20));
            this.offset += packageLen;
            //连接初始化
            if (content.code && content.code !== 200) {
              logger.error('clientDataHandler', config.plat.quanmin, content.msg, content);
              continue;
            }
            switch (type) {
              case config.quanmin.type.AUTH:
                //订阅
                this.send(config.quanmin.type.SUB, {
                  owid: []
                });
                //维持心跳
                this.keepalive();
                break;
              case config.quanmin.type.SUB:
                break;
              case config.quanmin.type.BAR:
                try {
                  content.cmd = type;
                  this.writeLog(content);
                } catch (e) {
                  logger.error(`cmd bar error`, config.plat.quanmin, e, content);
                }
                break;
              case config.quanmin.type.GIFT:
                try {
                  content.cmd = type;
                  this.writeLog(content);
                } catch (e) {
                  logger.error(`cmd gift error`, config.plat.quanmin, e, content);
                }
                break;
              default:

            }
          } else {
            break;
          }
        } catch (e) {
          logger.error('parse', config.plat.quanmin, e);
          break;
        }
      }
      this.clean();
    } catch (e) {
      logger.error('dataerror', config.plat.quanmin, e);
    }
  }

  clean() {
    this.buffer = null;
    this.offset = 0;
  }

  async getGifts() {
    try {
      const res = await util.getGiftList();
      const gifts = JSON.parse(res.text).data.list;
      if (gifts && gifts.length) {
        for (let gift of gifts) {
          gift = {
            plat: config.plat.quanmin,
            gift_id: gift.attrId,
            gift_cost: gift.diamond,
            isBroadcast: 1,
            token_type: 1,
            gift_name: gift.name,
            gift_img: gift.icon
          };
  
          await giftHelper.putToMysql(gift);
          await giftHelper.putRedis(gift);
        }
      }
    } catch (e) {
      logger.error('getgifts error', config.plat.quanmin, e);
    }

    setTimeout(this.getGifts.bind(this), config.timeout.quanmin_get_gift);
  }

  keepalive() {
    setTimeout(() => {
      this.send(config.quanmin.type.HB);
      this.keepalive();
    }, 30 * 1000);
  }

  send(service, data) {
    try {
      let content;
      if (data) {
        content = msgPack.encode(data);
      }
      let tmp = util.encode({
        service: service,
        content: content
      });
      this.socket.write(tmp);
    } catch (e) {
      logger.error('send', config.plat.quanmin, e);
    }
  }

  writeLog(content) {
    let room = this.list[content.owid] || this.subs[content.owid];
    if (room) {
      // 开播中, 输出日志
      Logger.write(native_data_logtail, util.trimNativeDataInfo(room, content));
    } else {
      // logger.error('未开播，丢弃数据', config.plat.quanmin, content, content.owid);
    }
  }
}

module.exports = new Quanmin();
