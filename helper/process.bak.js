const _ = require('lodash');
const fs = require('fs');
const DEVICES = require('./device');
const giftManager = require('../helper/giftManager');
const giftPool = {
  Douyu: {},
  Huya: {},
  Panda: {},
  Zhanqi: {},
  Longzhu: {}
};

//加载礼物信息
async function loadGift() {
  for (let plat in giftPool) {
      giftPool[plat]=await giftManager.getGiftList(plat);
  }
}
loadGift();

const giftCost = (price, count = 1) => {
  count = parseInt(count) || 1;
  return price * count;
};

/**
 * 整理对应的数据结构，抹平各个平台的数据差异
 * plat: 平台名称(required)
 * user_id： 发送者的id(required)
 * user_nick：发送者的昵称(required)
 * user_level：发送者等级(required)
 * medal_level：发送者粉丝勋章等级（没有这个功能的平台统一为-1）(required)
 * room_id：主播的uid(required)
 * room_nick：主播昵称(required)
 * cate_id：直播间分类id(required)
 * cate_name：直播间分类名称（没有的话设置为空）(required)
 * device：设备标识，0是未知，1是pc，2是移动端(required)
 * timestamp：时间戳，格林威治时间到毫秒级(required)
 * type: 弹幕类型，chat/gift
 * txt: 文本相关字段(option)
 * gift_id：礼物id (option)
 * gift_name：礼物名称(option)
 * gift_cost：礼物价格（虚拟币单位）(option)
 * gift_count：送礼数量(option)
 */
//平台币对应RMB比率
const rate = {
  Douyu: 1,
  Huya: 0.001,
  Longzhu: 0.01,
  Chushou: 0.001,
  Panda: 0.1,
  Zhanqi: 0.01,
  Quanmin: 0.1
};
module.exports = {
  Douyu(opt) {
    let {data, giftInfo, roomInfo} = opt;
    //替换为库中数据
    let raw = {
      plat: 'douyu',
      user_id: data.uid,
      user_nick: data.nn,
      user_level: data.level,
      medal_level: data.bl,
      room_id: data.rid || roomInfo.room_id,
      room_nick: roomInfo.owner_name,
      cate_id: roomInfo.cate_id,
      cate_name: roomInfo.cate_name,
      device: 0, // 0: unknown, 1: pc, 2: mobile
      timestamp: +new Date()
    };

    if (data.type == 'chatmsg') {
      raw = _.extend({}, raw, {
        type: 'chat',
        txt: data.txt
      });
    } else if (data.type == 'dgb') {
      let giftItem = _.find(giftInfo, {id: data.gfid});
      if (!giftItem) {
        if (!giftPool.Douyu.includes(data.gfid)) {
          giftManager.setGift({
            id: data.gfid,
            price: 0,
            cost: 0,
            plat: 'Douyu',
            isBroadcast: 0,
            token_type: 0
          });
          giftPool.Douyu.push(data.gfid);
        }
        return;
      }
      let cost = giftCost(giftItem.type === '2' ? giftItem.pc : 0, data.gfcnt || 1);
      if (!giftPool.Douyu.includes(data.gfid)) {
        giftManager.setGift({
          id: data.gfid,
          price: (giftItem.type === '2' ? giftItem.pc : 0) * rate.Douyu,
          cost: giftItem.pc,
          plat: 'Douyu',
          isBroadcast: 0,
          token_type: giftItem.type === '2' ? 1 : 0
        });
        giftPool.Douyu.push(data.gfid);
      }
      raw = _.extend({}, raw, {
        type: 'gift',
        gift_id: giftItem.id,
        gift_name: giftItem.name,
        gift_count: data.gfcnt || 1,
        gift_cost: cost,
        price: cost * rate.Douyu
      });
    } else {
      return null;
    }

    return raw;
  },
  Panda(opt) {
    let {data, giftInfo, roomInfo} = opt;
    if (data.protocol != 393219) {
      return null;
    }

    data = data.data || {};
    let ext = data.data || {};
    let from = ext.from || {};
    let raw = {
      plat: 'panda',
      user_id: from.rid,
      user_nick: from.nickName,
      user_level: from.level,
      medal_level: -1,
      room_id: roomInfo.id,
      room_nick: roomInfo.nickname,
      cate_id: roomInfo.cate,
      cate_name: roomInfo.classification,
      device: DEVICES.PANDA[from.__plat] || 0,
      timestamp: data.time * 1000
    };

    if (data.type == 1) {
      raw = _.extend({}, raw, {
        type: 'chat',
        txt: ext.content
      });
    } else if (data.type == 306) {
      let content = ext.content;
      let giftItem = _.find(giftInfo, {id: content.id});
      if (!giftItem) {
        if (!giftPool.Panda.includes(content.id)) {
          giftManager.setGift({
            id: content.id,
            price: 0,
            cost: 0,
            plat: 'Panda',
            isBroadcast: 0,
            token_type: 0
          });
          giftPool.Panda.push(content.id);
        }
        return;
      }
      let cost = giftCost(giftItem.price, content.count);
      if (!giftPool.Panda.includes(content.id)) {
        giftManager.setGift({
          id: content.id,
          price: giftItem.price * rate.Panda,
          cost: giftItem.price,
          plat: 'Panda',
          isBroadcast: 0,
          token_type: 1
        });
        giftPool.Panda.push(content.id);
      }
      raw = _.extend({}, raw, {
        type: 'gift',
        gift_id: giftItem.id,
        gift_name: giftItem.name,
        gift_count: content.count,
        gift_cost: cost,
        price: cost * rate.Panda
      });
    } else {
      return null;
    }

    return raw;
  },
  XYPanda(opt) {
    let {data, giftInfo, roomInfo} = opt;
    if (data.cmd != 2001) {
      return null;
    }

    data = data.data;
    let ext = data.data || {};
    let from = data.from || {};
    let raw = {
      plat: 'panda',
      user_id: from.rid,
      user_nick: from.nick,
      user_level: from.level_now,
      medal_level: -1,
      room_id: roomInfo.xid,
      room_nick: roomInfo.nickName,
      cate_id: -1, // 星颜没有具体的分类，属于一个子站性质
      cate_name: '星颜',
      device: DEVICES.PANDA[data.plat] || 0,
      timestamp: +new Date()
    };

    if (data.type === 'chat') {
      raw = _.extend({}, raw, {
        type: 'chat',
        txt: ext.text
      });
    } else if (data.type === 'gift') {
      let giftItem = _.find(giftInfo, {id: ext.gift_id});
      if (!giftItem) {
        if (!giftPool.Panda.includes(ext.gift_id)) {
          giftManager.setGift({
            id: ext.gift_id,
            price: 0,
            cost: 0,
            plat: 'Panda',
            isBroadcast: 0,
            token_type: 0
          });
          giftPool.Panda.push(ext.gift_id);
        }
        return;
      }

      let cost = giftCost(giftItem.price, ext.count);
      if (!giftPool.Panda.includes(ext.gift_id)) {
        giftManager.setGift({
          id: ext.gift_id,
          price: giftItem.price * rate.Panda,
          cost: giftItem.price,
          plat: 'Panda',
          isBroadcast: 0,
          token_type: 1
        });
        giftPool.Panda.push(content.id);
      }
      raw = _.extend({}, raw, {
        type: 'gift',
        gift_id: giftItem.id,
        gift_name: giftItem.name,
        gift_count: ext.count,
        gift_cost: cost,
        price: cost * rate.Panda
      });
    } else {
      return null;
    }

    return raw;
  },
  Zhanqi(opt) {
    let {data, giftInfo, roomInfo} = opt;
    let roomDetail = roomInfo.detail || {};
    let raw = {
      plat: 'zhanqi',
      user_id: data.fromuid,
      user_nick: data.fromname,
      user_level: data.plevel,
      medal_level: -1,
      room_id: roomDetail.id,
      room_nick: roomDetail.nickname,
      //修改分类格式 class-game-->game
      // cate_id: `${roomDetail.classId}-${roomDetail.gameId}`,
      // cate_name: `${roomDetail.className}-${roomDetail.gameName}`,
      cate_id: roomDetail.gameId,
      cate_name: roomDetail.gameName,
      device: 0,
      timestamp: +new Date()
    };
    // console.log('==> %s: %j', data.cmdid, data);

    if (data.cmdid == 'chatmessage') {
      raw = _.extend({}, raw, {
        type: 'chat',
        txt: data.content
      });
    } else if (data.cmdid == 'Gift.Use') {
      let ext = data.data;
      let giftItem = _.find(giftInfo, {id: ext.id});
      if (!giftItem || ext.roomid != roomDetail.id) {
        if (!giftPool.Zhanqi.includes(ext.id)) {
          giftManager.setGift({
            id: ext.id,
            price: 0,
            cost: 0,
            plat: 'Zhanqi',
            isBroadcast: 0,
            token_type: 0
          });
          giftPool.Zhanqi.push(ext.id);
        }
        return;
      }
      let price = ext.priceType == 2 ? giftItem.price : 0;
      let cost = giftCost(price, ext.count);
      if (!giftPool.Zhanqi.includes(ext.id)) {
        giftManager.setGift({
          id: ext.id,
          price: giftItem.price * rate.Zhanqi,
          cost: giftItem.price,
          plat: 'Zhanqi',
          isBroadcast: 0,
          token_type: ext.priceType == 2 ? 1 : 0
        });
        giftPool.Zhanqi.push(ext.id);
      }
      raw = _.extend({}, raw, {
        type: 'gift',
        user_id: ext.uid,
        user_nick: ext.nickname,
        user_level: ext.plevel,
        gift_id: giftItem.id,
        gift_name: giftItem.name,
        gift_count: ext.count,
        gift_cost: cost,
        price: cost * rate.Zhanqi
      });
    } else {
      return null;
    }

    return raw;
  },
  Longzhu(opt) {
    let {data, giftInfo, roomInfo} = opt;
    if (data.type != 'utf8') {
      return null;
    }

    try {
      data = JSON.parse(data.utf8Data);
    } catch (e) {
      return null;
    }

    let msg = data.msg;
    let user = msg.user || {};
    let raw = {
      plat: 'longzhu',
      user_id: user.uid,
      user_nick: user.username,
      user_level: user.newGrade,
      medal_level: -1,
      room_id: roomInfo.Id,
      room_nick: roomInfo.Name,
      cate_id: roomInfo.Game,
      cate_name: roomInfo.GameName,
      device: DEVICES.LONGZHU[msg.via] || 0,
      timestamp: +new Date()
    };

    if (data.type == 'chat') {
      raw = _.extend({}, raw, {
        type: 'chat',
        txt: msg.content
      });
    } else if (data.type == 'gift') {
      let giftItem = _.find(giftInfo, {name: msg.itemType});
      if (!giftItem) {
        if (!giftPool.Longzhu.includes(msg.itemType)) {
          giftManager.setGift({
            id: msg.itemType,
            price: 0,
            cost: 0,
            plat: 'Longzhu',
            isBroadcast: 0,
            token_type: 0
          });
          giftPool.Longzhu.push(msg.itemType);
        }
        return;
      }

      let name = giftItem.name;
      let icon = giftItem.bannerIconLarge;
      let cost = giftCost(giftItem.moneyCost, msg.number);
      if (!giftPool.Longzhu.includes(msg.itemType)) {
        giftManager.setGift({
          id: msg.itemType,
          price: giftItem.moneyCost * rate.Longzhu,
          cost: giftItem.moneyCost,
          plat: 'Longzhu',
          isBroadcast: 0,
          token_type: 1
        });
        giftPool.Longzhu.push(msg.itemType);
      }
      raw = _.extend({}, raw, {
        type: 'gift',
        gift_id: giftItem.id,
        gift_name: giftItem.title,
        gift_count: msg.number,
        gift_cost: cost,
        price: cost * rate.Longzhu
      });
    } else {
      return null;
    }

    return raw;
  },
  Chushou(opt) {
    let {data, giftInfo, roomInfo} = opt;
    let creator = roomInfo.creator || {};
    let liveStatus = roomInfo.liveStatus || {};
    let category = liveStatus.game || {};
    let user = data.user || {};
    let nickname = user.nickname || '';
    let matches = nickname.match(/\"content\":\"(.+?)\"/);
    if (matches && matches.length >= 2) {
      nickname = matches[1];
    }

    let raw = {
      plat: 'chushou',
      user_id: user.uid,
      user_nick: nickname,
      user_level: -1,
      medal_level: -1,
      room_id: roomInfo.id,
      room_nick: creator.nickname,
      cate_id: category.id,
      cate_name: category.name,
      device: 0,
      timestamp: +new Date()
    };

    if (data.type == 1) {
      raw = _.extend({}, raw, {
        type: 'chat',
        txt: data.content
      });
    } else if (data.type == 3) {
      let metaInfo = data.metaInfo || {};
      let ext = metaInfo.gift || {};
      let giftItem = _.find(giftInfo, {id: '' + ext.id});
      if (!giftItem) {
        return null;
      }

      let cost = giftCost(ext.point, 1);
      raw = _.extend({}, raw, {
        type: 'gift',
        gift_id: giftItem.id,
        gift_name: giftItem.name,
        gift_count: 1,
        gift_cost: cost,
        price: cost * rate.Chushou
      });
    } else {
      return null;
    }

    return raw;
  },
  Huya(opt) {
    let {data, giftInfo, roomInfo} = opt;
    let ext = data.data || {};
    let user = ext.tUserInfo || {};
    let {detail, player} = roomInfo;
    let raw = {
      plat: 'huya',
      user_id: user.lUid || ext.lSenderUid,
      user_nick: user.sNickName || ext.sSenderNick,
      user_level: -1,
      medal_level: -1,
      room_id: player.yyid,
      room_nick: player.nick,
      cate_id: detail.gid,
      cate_name: detail.gameFullName,
      device: 0,
      timestamp: +new Date()
    };

    if (data.cmd == 1400) {
      if (!raw.user_nick && raw.user_nick === '系统消息') {
        return;
      }
      raw = _.extend({}, raw, {
        type: 'chat',
        txt: ext.sContent
      });
    } else if (data.cmd == 6501) {
      let giftItem = _.find(giftInfo, {iPropsId: ext.iItemType});
      if (!giftItem) {
        if (!giftPool.Huya.includes(ext.iItemType)) {
          giftManager.setGift({
            id: ext.iItemType,
            price: 0,
            cost: 0,
            plat: 'Huya',
            isBroadcast: 0,
            token_type: 0
          });
          giftPool.Huya.push(ext.iItemType);
        }
        return;
      }

      let identity = giftItem.vPropsIdentity || {};
      let value = (identity.value || [])[0];
      let imgsrc = value ? value.sPropsPic24 : '';
      let cost = giftCost(giftItem.iPropsGreenBean, ext.iItemCount);
      if (!giftPool.Huya.includes(ext.iItemType)) {
        giftManager.setGift({
          id: ext.iItemType,
          price: giftItem.iPropsGreenBean * rate.Huya,
          cost: giftItem.iPropsGreenBean,
          plat: 'Huya',
          isBroadcast: 0,
          token_type: 1
        });
        giftPool.Huya.push(ext.iItemType);
      }
      raw = _.extend({}, raw, {
        type: 'gift',
        gift_id: giftItem.iPropsId,
        gift_name: giftItem.sPropsName,
        image: imgsrc.slice(0, imgsrc.lastIndexOf('&')),
        gift_count: ext.iItemCount,
        gift_cost: cost,
        price: cost * rate.Huya
      });
    } else {
      return null;
    }

    return raw;
  },
  Quanmin(opt) {
    let {data, giftInfo, roomInfo} = opt;
    let user = data.user || {};
    let raw = {
      plat: 'quanmin',
      user_id: user.uid,
      user_nick: user.nickname,
      user_level: user.level,
      medal_level: -1,
      room_id: roomInfo.uid,
      room_nick: roomInfo.nick,
      cate_id: roomInfo.category_id,
      cate_name: roomInfo.category_name,
      device: DEVICES.QUANMIN[data.platForm] || 0, // 0: unknown, 1: pc, 2: mobile
      timestamp: +new Date()
    };

    if (data.cmd === 'Gateway.Chat.Notify') {
      raw = _.extend({}, raw, {
        type: 'chat',
        txt: data.txt
      });
    } else if (data.cmd === 'Gateway.Gift.Notify') {
      let giftItem = _.find(giftInfo, {id: data.gid});
      if (!giftItem) {
        return null;
      }
      let cost = giftCost(giftItem.diamond, data.count);
      raw = _.extend({}, raw, {
        type: 'gift',
        gift_id: giftItem.id,
        gift_name: giftItem.name,
        gift_count: data.count,
        gift_cost: cost,
        price: cost * rate.Quanmin
      });
    } else {
      return null;
    }

    return raw;
  }
};
