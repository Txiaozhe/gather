// const redis = require('../gather/lib/redis');
const mysql = require('../config/mysql');
const config = require('../config/config');
const util = require('../gather/lib/util');
const request = require('superagent');
module.exports = {
  setGift: async (giftInfo) => {
    let field = ['gift_id', 'price', 'gift_cost', 'gift_name', 'plat',
      'isBroadcast', 'token_type'];
    await mysql.queryAsync('INSERT INTO ?? (??) VALUES (?)', [
      config.TABLE_NAME_GIFT, field, [giftInfo.gift_id, giftInfo.price || 0, giftInfo.gift_cost || 0, giftInfo.gift_name || '', giftInfo.plat,
        giftInfo.isBroadcast || 0, giftInfo.token_type || 0]]);
    return true;
  },
  updateGift: async (giftInfo) => {
    if(!giftInfo.gift_name || !giftInfo.gift_id || !giftInfo.plat) {
      return false
    }

    await mysql.queryAsync('UPDATE ?? SET gift_name = ? WHERE gift_id = ? AND plat = ?', [
      config.TABLE_NAME_GIFT, giftInfo.gift_name, giftInfo.gift_id, giftInfo.plat
    ]);
    return true;
  },
  getGiftList: async (plat) => {
    return await mysql.queryAsync(
      'SELECT * FROM ?? WHERE plat = ?', [
        config.TABLE_NAME_GIFT, plat
      ]);
  },
  getGift: async (plat, giftId) => {
    return await mysql.queryAsync(
      'SELECT * FROM ?? WHERE plat = ? AND gift_id = ?', [
        config.TABLE_NAME_GIFT, plat, giftId
      ]);
  },
  requestGift: async (plat, roomId) => {
    switch (plat) {
      case 'Douyu':
        let dyRes = await request.get(`http://open.douyucdn.cn/api/RoomApi/room/${roomId}`);
        return dyRes.body.data.gift;
        break;
      case 'Panda':
        let pdRes = await request.get(`https://mall.gate.panda.tv/ajax_gift_gifts_get?roomid=${roomId}`);
        if(pdRes.body.errno===0){
          return pdRes.body.data.items;
        }else {
          throw new Error(errno);
        }
        break;
      case 'XYPanda':
        let GIFT_URL = 'https://gift.xingyan.panda.tv/gifts?__plat=pc_web&hostid=';
        let url = `${GIFT_URL}${roomId}`;
        let xyRes = await request.get(url).timeout({
          response: 6000
        });
        if (!xyRes.text) {
          throw e;
        }
        try {
          let body = JSON.parse(xyRes.text);
          this.giftInfo = body.data;
          return body.data;
        } catch (e) {
          throw e;
        }
        break;
      default:
        console.log('[E]unknown plat', plat);
        util.alarm('[E]unknown plat', plat);
    }
  }
};