/**
 * Creator: Tang Xiaoji
 * Time: 2018-07-05
 */

'use strict';

const config = require('../../config/config');
const mysql = require('../../config/mysql');
const redis = require('../../config/redis');
const Logger = require('../../config/Logger');
const logger = new Logger(`gift`);
const Queue = require('./queue');
const GIFT_TBL_FIELD = [
  'gift_id',
  'price',
  'gift_cost',
  'plat',
  'isBroadcast',
  'token_type',
  'gift_name',
  'gift_img'
];

const rate = {
  douyu: 1,
  huya: 0.001,
  longzhu: 0.01,
  chushou: 0.001,
  panda: 0.1,
  zhanqi: 0.01,
  quanmin: 0.1,
  fanxing: 0.01,
  yy: 1
};

module.exports = class Gift {
  constructor() {
    this.giftQueue = new Queue(1000, (gifts, onerror) => {
      gifts.forEach(gift => {
        this.putRedis(gift).then(r => {
          // logger.log('queue put redis gift success', gift.plat, r, `${gift.gift_id} ${gift.gift_name}`);
        }).catch(e => {
          logger.error('queue put redis gift error', gift.plat, e, `${gift.gift_id} ${gift.gift_name}`);
        });
      });
    }, false);
  }

  static getInstance() {
    if (!Gift.instance) {
      Gift.instance = new Gift();
    }
    return Gift.instance
  }

  giftCost(cost, count = 1) {
    count = parseInt(count) || 1;
    return cost * count;
  }

  getPrice(cost, plat) {
    if (!config.plat[plat]) {
      logger.error('getPrice error', plat, 'plat error');
      return 0;
    } else {
      return cost * rate[plat];
    }
  }

  push(gift) {
    return;
    if (!gift.gift_id || !config.plat[gift.plat]) {
      logger.error('put gift error', gift.plat, 'plat or gift_id error');
    } else {
      this.giftQueue.push(gift);
    }
  }

  put(gift) {
    this.putToMysql(gift).then(r => {
      this.putRedis(gift).then(r => {
        // logger.log('queue put redis gift success', gift.plat, r, `${gift.gift_id} ${gift.gift_name}`);
      }).catch(e => {
        logger.error('queue put redis gift error', gift.plat, e, `${gift.gift_id} ${gift.gift_name}`);
      });
    }).catch(e => {
      logger.error('queue put mysql gift error', gift.plat, e, `${gift.gift_id} ${gift.gift_name}`);
    });
  }

  putToMysql(gift) {
    return new Promise((resolve, reject) => {
      if (!gift.gift_id || !config.plat[gift.plat]) {
        reject('gift error');
      } else {
        const key = config.HASH_GIFT_MAP(gift.plat, gift.gift_id);
        redis.hget(key, 'gift_name').then(gname => {
          if (gname) {
            resolve('gift 存在，不进行写入');
          } else {
            mysql.getConn((err, conn) => {
              if (err) {
                reject(err);
              } else {
                const values = [];
                let update = '';
                const update_value = [];
                GIFT_TBL_FIELD.forEach(key => {
                  switch (key) {
                    case 'plat': {
                      values.push(gift.plat);
                      break;
                    }
                    case 'isBroadcast': {
                      values.push(gift[key] || 0);
                      break;
                    }
                    case 'token_type': {
                      values.push(gift[key] || 0);
                      break;
                    }
                    case 'price': {
                      values.push(this.getPrice(gift.gift_cost, gift.plat));
                      update += 'price = ?,';
                      update_value.push(this.getPrice(gift.gift_cost, gift.plat));
                      break;
                    }
                    case 'gift_name': {
                      values.push(gift[key] || '');
                      update += 'gift_name = ?,';
                      update_value.push(gift[key] || '');
                      break;
                    }
                    case 'gift_cost': {
                      const cost = parseFloat(gift[key]);
                      values.push(cost || 0);
                      update += 'gift_cost = ?,';
                      update_value.push(cost || 0);
                      break;
                    }
                    case 'gift_id': {
                      values.push(gift[key]);
                      break;
                    }
                    case 'gift_img': {
                      values.push(gift[key] || '');
                      if (gift[key]) {
                        update += 'gift_img = ?,';
                        update_value.push(gift[key]);
                      }
                      break;
                    }
                  }
                });

                if (update[update.length - 1] === ',') {
                  update = update.slice(0, update.length - 1)
                }
                conn.query('INSERT INTO ?? ( ?? ) VALUES ( ? ) ON DUPLICATE KEY UPDATE ' + update, [
                  config.tbl_name.db_fentuan_giftlist_v2, GIFT_TBL_FIELD, values, ...update_value
                ], (err, res) => {
                  conn.release();
                  if (err) {
                    reject(err);
                  } else {
                    resolve(res);
                  }
                });
              }
            })
          }
        });
      }
    });
  }

  async putRedis(gift) {
    try {
      if (!gift.gift_id || !config.plat[gift.plat]) {
        return Promise.reject('giftid or plat error');
      }

      const gift_id = gift.gift_id;
      const _gift = {
        gift_name: gift.gift_name,
        image: gift.gift_img,
        gift_cost: gift.gift_cost,
        price: this.getPrice(gift.gift_cost, gift.plat)
      };
      const key = config.HASH_GIFT_MAP(gift.plat, gift_id);
      const gname = await redis.hget(key, 'gift_name');
      if (!gname) {
        await redis.hmset(key, _gift);
      }

      return true;
    } catch (e) {
      throw e;
    }
  }
};
