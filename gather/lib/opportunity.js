/**
 * Creator: Tang Xiaoji
 * Time: 2018-07-27
 */

'use strict';

const config = require('../../config/config');
const video_stream = require('../video-stream');
const redis = require('../../config/redis');
const mysql = require('../../config/mysql');
const moment = require('moment');
const notice = require('./notice');

class Opportunity {
  constructor(debug = false) {
    this.isDebug = debug;
  }
  
  async updateStartInfo (plat, rid, start_time = moment().unix(), stop_time = null) {
    if (this.isDebug) {
      return;
    }

    return new Promise((resolve, reject) => {
      if (!config.plat.hasOwnProperty(plat)) {
        reject('plat error');
      } else {
        if (plat === 'xypanda') {
          plat = 'panda';
        }
        mysql.pool.query('INSERT INTO ?? ( ?? ) VALUES ( ? ) ON DUPLICATE KEY UPDATE start_time = ?, stop_time = ?;', [
          config.tbl_name.db_fentuan_anchor_start_time, [
            'plat', 'room_id', 'room_nick', 'start_time', 'stop_time'
          ], [plat, rid, '', start_time, stop_time],
          start_time, stop_time
        ], (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      }
    });
  }

  async updateHistoryStartInfo(plat, rid, hid, start_time = moment().unix(), stop_time = null) {
    if (this.isDebug) {
      return;
    }
    
    return new Promise((resolve, reject) => {
      if (!config.plat.hasOwnProperty(plat)) {
        reject('plat error');
      } else {
        if (plat === 'xypanda') {
          plat = 'panda';
        }
        mysql.pool.query('INSERT INTO ?? ( ?? ) VALUES ( ? ) ON DUPLICATE KEY UPDATE start_time = ?, stop_time = ?;', [
          config.tbl_name.db_fentuan_anchor_start_time_history, [
            'plat', 'room_id', 'room_nick', 'start_time', 'stop_time', 'hid'
          ], [plat, rid, '', start_time, stop_time, hid],
          start_time, stop_time
        ], (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      }
    });
  }

  async updateLiveStatus(rid, status, platform) {
    if (this.isDebug) {
      return;
    }
    
    return new Promise((resolve, reject) => {
      mysql.pool.query('UPDATE ?? SET status = ? WHERE platform = ? AND rid = ? LIMIT 1', [
        config.tbl_name.db_rpt_fentuan_anchor_info_explore, status, platform, rid
      ], (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  /**
   * @param type stop/start
   * @param plat quanmin/huya/douyu...
   * @param rid
   * @param url
   * @param hid
   */
  async checkRegisterUser(type, plat, rid, url, hid) {
    if (this.isDebug) {
      return;
    }
    
    return new Promise((resolve, reject) => {
      if (plat === 'xypanda') {
        plat = 'panda';
      }
      mysql.pool.query('SELECT room_id, plat FROM ?? WHERE plat = ? AND room_id = ? AND bind = ?', [
        config.tbl_name.db_user_user_room_bind, plat, rid, 1
      ], (err, res) => {
        if (err) {
          reject(err);
        } else {
          const stream = video_stream[plat];
          if (res && res.length && stream && typeof stream[type] === 'function') {
            stream[type](plat, rid, url, hid).then(r => {
              resolve(r);
            }).catch(e => {
              reject(e);
            });
          }
        }
      });
    });
  }

  async updateRoomList(plat, tasks) {
    if (this.isDebug) {
      return;
    }
    
    let newest = [];
    for (let task of tasks) {
      newest.push(`${plat}:${task.room_id}`);
    }
    return await redis.sadd(config.SET_GATHER_STREAM_NEW(plat), newest);
  }

  async removeRoom(plat, rid) {
    if (this.isDebug) {
      return;
    }
    
    return await redis.srem(config.SET_GATHER_STREAM_NEW(plat), `${plat}:${rid}`);
  }

  async pushLiveReport(rid, platform, hid, startTime, stopTime) {
    if (this.isDebug) {
      return;
    }
    
    return await redis.lpush(config.LIST_ANCHOR_LIVE_REPORT(), JSON.stringify({
      rid: rid,
      platform: platform,
      hid: hid,
      startTime: startTime,
      stopTime: stopTime
    }));
  }

  // 获取公告并校验，只在开播时调用
  async getNoticeToCheck(roominfo) {
    const noti = await notice(roominfo.plat, roominfo.url);
    const isMatch = /((\D)\d{5,}(\D))|(\d{5,}(\D))|((\D)\d{5,})/g.test(noti);

    if (isMatch) {
      const [err, res] = await mysql.asyncQuery('INSERT INTO ?? ( ?? ) VALUES ( ? ) ON DUPLICATE KEY UPDATE notice = ?, isCheck = ?', [
        config.tbl_name.db_fentuan_anchor_att, [
          'rid', 'platform', 'notice', 'isCheck', 'cover'
        ], [
          roominfo.room_id, config.plat_no[roominfo.plat], noti, 1, ''
        ], noti, 1
      ]);

      if (err) {
        throw err;
      } else {
        return res;
      }
    } else {
      return ''
    }
  }
}

module.exports = new Opportunity();
