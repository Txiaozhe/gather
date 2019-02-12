const _ = require('lodash');
const DEVICES = require('./device');
const giftManager = require('../helper/giftManager');
const util = require('../gather/lib/util');
const fastXmlParser = require('fast-xml-parser');
const Gift = require('../gift/Gift');
const giftPool = {
  Douyu: {},
  Huya: {},
  Panda: {},
  Zhanqi: {},
  Longzhu: {},
  XYPanda: {}
};

//加载礼物信息
async function loadGift() {
  for (let plat in giftPool) {
    giftPool[plat] = await giftManager.getGiftList(plat);
  }
}

//初始化加载
loadGift();
//定制更新
setInterval(loadGift, 30 * 1000);

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
 * price:礼物对应rmb价值(option)
 */
//平台币对应RMB比率
const rate = {
  Douyu: 1,
  Huya: 0.001,
  Longzhu: 0.01,
  Chushou: 0.001,
  Panda: 0.1,
  Zhanqi: 0.01,
  Quanmin: 0.1,
  Kugou: 0.01,
  YY: 1
};

module.exports = {
  async Douyu(opt) {
    let data = opt.data;
    let raw = {
      plat: 'douyu',
      user_id: data.uid,
      user_nick: data.nn,
      user_level: data.level,
      medal_level: data.bl,
      room_id: data.rid,
      device: 0, // 0: unknown, 1: pc, 2: mobile
      timestamp: +new Date()
    };

    if (data.type === 'chatmsg') {
      raw = _.extend({}, raw, {
        type: 'chat',
        txt: data.txt
      });
    } else if (data.type === 'dgb') {
      //礼物检测
      let giftItem = _.cloneDeep(_.find(giftPool['Douyu'], {gift_id: data.gfid}));
      if (!giftItem) {
        //新增礼物信息
        let giftList = await giftManager.requestGift('Douyu', data.rid);
        //判断礼物是否为背包礼物
        let gift = _.cloneDeep(_.find(giftList, {id: data.gfid.toString()}));
        if (!gift) {
          // console.log('背包礼物', gift, data.gfid);
          giftItem = {
            gift_id: data.gfid,
            price: 0,
            gift_cost: 0,
            plat: 'Douyu',
            isBroadcast: 0,
            token_type: 0,
            gift_name: '背包礼物'
          };
          try {
            await giftManager.setGift(giftItem);
          } catch (e) {
            console.log(e);
          }
          //cache 刷新
          giftPool.Douyu.push(giftItem);
        } else {
          giftItem = {
            gift_id: gift.id,
            plat: 'Douyu',
            isBroadcast: 0,
            token_type: 0,
            gift_name: gift.name
          };
          giftItem.gift_cost = gift.type === '2' ? gift.pc : 0;
          giftItem.price = giftItem.gift_cost * rate.Douyu;
          // console.log('newGift======>', giftItem.name, giftItem.gift_id);
        }
        //过滤出新增礼物信息
        let newList = _.differenceWith(giftList, giftPool.Douyu, (a, b) => a.id == b.gift_id);
        newList.map(async (gift) => {
          let newGift;
          let cost = gift.type === '2' ? gift.pc : 0;
          newGift = {
            gift_id: gift.id,
            price: cost * rate.Douyu,
            gift_cost: cost,
            plat: 'Douyu',
            isBroadcast: 0,
            token_type: gift.type === '2' ? 1 : 0,
            gift_name: gift.name
          };
          try {
            await giftManager.setGift(newGift);
          } catch (e) {
            util.alarm(e);
          }
          //cache 刷新
          giftPool.Douyu.push(newGift);
        });
      }
      giftItem.gift_count = data.gfcnt || 1;
      giftItem.gift_cost *= giftItem.gift_count;
      giftItem.price *= giftItem.gift_count;
      raw = Object.assign({type: 'gift'}, raw, giftItem);
    } else {
      return;
    }
    return raw;
  },
  async Panda(opt) {
    let data = opt.data;
    if (data.protocol != 393219) {
      return null;
    }

    data = data.data || {};
    let ext = data.data || {};
    let from = ext.from || {};
    let to = ext.to || {};
    let raw = {
      plat: 'panda',
      user_id: from.rid,
      user_nick: from.nickName,
      user_level: from.level || -1,
      medal_level: -1,
      room_id: to.toroom,
      device: DEVICES.PANDA[from.__plat] || 0,
      timestamp: data.time * 1000
    };

    if (data.type == 1) {
      raw = _.extend({}, raw, {
        type: 'chat',
        txt: ext.content
      });
    } else if (data.type == 306) {

      //礼物检测
      let content = ext.content;
      let giftItem = _.cloneDeep(_.find(giftPool['Panda'], {gift_id: content.id}));
      if (!giftItem) {
        //新增礼物信息
        let giftList = await giftManager.requestGift('Panda', to.toroom);
        //判断礼物是否为背包礼物
        let gift = _.cloneDeep(_.find(giftList, {id: content.id}));
        if (!gift) {
          // console.log('背包礼物', gift, content.id);
          giftItem = {
            gift_id: content.id,
            price: 0,
            gift_cost: 0,
            plat: 'Panda',
            isBroadcast: 0,
            token_type: 0,
            gift_name: '背包礼物'
          };
          await giftManager.setGift(giftItem);
          //cache 刷新
          giftPool.Douyu.push(giftItem);
        } else {
          giftItem = {
            gift_id: gift.id,
            plat: 'Panda',
            isBroadcast: 0,
            token_type: 0,
            gift_name: gift.name
          };
          giftItem.gift_cost = gift.price;
          giftItem.price = giftItem.gift_cost * rate.Panda;
          // console.log('newGift======>', giftItem.name, giftItem.gift_id);

          await giftManager.updateGift(giftItem);
        }
        //过滤出新增礼物信息
        let newList = _.differenceWith(giftList, giftPool.Douyu, (a, b) => a.id == b.gift_id);
        newList.map(async (gift) => {
          let newGift;
          let cost = gift.price;
          newGift = {
            gift_id: gift.id,
            price: (cost * rate.Panda).toFixed(2),
            gift_cost: cost,
            plat: 'Panda',
            isBroadcast: 0,
            token_type: 1,
            gift_name: gift.name
          };
          // console.log('newGiftList====>',newGift);
          try {
            await giftManager.setGift(newGift);
          } catch (e) {
            util.alarm(e);
          }
          //cache 刷新
          giftPool.Douyu.push(newGift);
        });
      }
      giftItem.gift_count = content.count || 1;
      giftItem.gift_cost *= giftItem.gift_count;
      giftItem.price *= giftItem.gift_count;
      raw = Object.assign({type: 'gift'}, raw, giftItem);
      if (raw.price > 100000) {
        util.alarm('price error', raw);
      }
    } else {
      return;
    }
    return raw;
  },
  async XYPanda(opt) {
    let data = opt.data;
    if (data.cmd != 2001) {
      return;
    }
    data = data.data;
    let ext = data.data || {};
    let from = data.from || {};
    let to = data.to || {};
    let raw = {
      plat: 'panda',
      user_id: from.rid,
      user_nick: from.nick,
      user_level: from.level_now,
      medal_level: -1,
      room_id: `88888888${to}`,
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
      //礼物检测
      let giftItem = _.cloneDeep(_.find(giftPool['XYPanda'], {gift_id: ext.gift_id}));
      if (!giftItem) {
        //新增礼物信息
        let giftList = await giftManager.requestGift('XYPanda', to);
        //判断礼物是否为背包礼物
        let gift = _.cloneDeep(_.find(giftList, {id: ext.gift_id}));
        if (!gift) {
          // console.log('背包礼物', gift, ext.gift_id);
          giftItem = {
            gift_id: ext.gift_id,
            price: 0,
            gift_cost: 0,
            plat: 'XYPanda',
            isBroadcast: 0,
            token_type: 0,
            gift_name: '背包礼物'
          };
          await giftManager.setGift(giftItem);
          //cache 刷新
          giftPool.Douyu.push(giftItem);
        } else {
          giftItem = {
            gift_id: gift.id,
            plat: 'XYPanda',
            isBroadcast: 0,
            token_type: 1,
            gift_name: gift.name
          };
          giftItem.gift_cost = gift.price;
          giftItem.price = giftItem.gift_cost * rate.Panda;
          // console.log('newGift======>', giftItem.name, giftItem.gift_id);
        }
        //过滤出新增礼物信息
        let newList = _.differenceWith(giftList, giftPool.Douyu, (a, b) => a.id == b.gift_id);
        newList.map(async (gift) => {
          let newGift;
          let cost = gift.price;
          newGift = {
            gift_id: gift.id,
            price: (cost * rate.Panda).toFixed(2),
            gift_cost: cost,
            plat: 'XYPanda',
            isBroadcast: 0,
            token_type: 1,
            gift_name: gift.name
          };
          try {
            await giftManager.setGift(newGift);
          } catch (e) {
            util.alarm(e);
          }
          //cache 刷新
          giftPool.Douyu.push(newGift);
          // console.log('newGiftList===>',gift);
        });
      }
      giftItem.gift_count = ext.count || 1;
      giftItem.gift_cost *= giftItem.gift_count;
      giftItem.price *= giftItem.gift_count;
      raw = Object.assign({type: 'gift'}, raw, giftItem);
      if (raw.price > 100000) {
        util.alarm('price error', raw);
      }
    } else {
      return;
    }
    return raw;
  },
  async Zhanqi(opt) {
    let {data, roomInfo} = opt;
    const giftInfo = Gift.getInfo('zhanqi');
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
      console.log('zhanqigift 礼物1')
      let ext = data.data;
      let giftItem = giftInfo[ext.id];
      if (ext.roomid != roomDetail.id) {
        return;
      }
      console.log('zhanqigift 礼物2')
      let price = ext.priceType == 2 ? (giftItem ? giftItem.price : ext.price) : 0;
      let cost = giftCost(price, ext.count);
      console.log('zhanqigift 礼物3')
      raw = _.extend({}, raw, {
        type: 'gift',
        user_id: ext.uid,
        user_nick: ext.nickname,
        user_level: ext.plevel,
        gift_id: giftItem ? giftItem.id : ext.id,
        gift_name: giftItem ? giftItem.name : ext.name,
        gift_count: ext.count,
        gift_cost: cost,
        price: cost * rate.Zhanqi
      });
      console.log('zhanqigift 礼物4', raw)
    } else {
      return null;
    }
    return raw;
  },
  async Longzhu(opt) {
    let {data, roomInfo} = opt;
    const giftInfo = Gift.getInfo('longzhu');
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
      let giftItem = giftInfo[msg.itemType];
      if (!giftItem) {
        return;
      }

      let name = giftItem.name;
      let icon = giftItem.bannerIconLarge;
      let cost = giftCost(giftItem.moneyCost, msg.number);
      raw = _.extend({}, raw, {
        type: 'gift',
        gift_id: giftItem.id,
        gift_name: giftItem.title,
        gift_count: msg.number,
        gift_cost: cost / rate.Longzhu,
        price: cost
      });
    } else {
      return;
    }

    return raw;
  },
  async Chushou(opt) {
    let {data, roomInfo} = opt;
    const giftInfo = Gift.getInfo('chushou');
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
      let giftItem = giftInfo['' + ext.id];
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
  async Huya(opt) {
    let {data, roomInfo} = opt;
    const giftInfo = Gift.getInfo('huya');
    // console.log(opt);
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

      if (raw.user_id == -1) {
        return;
      }

      raw = _.extend({}, raw, {
        type: 'chat',
        txt: ext.sContent
      });
    } else if (data.cmd == 6501) {
      let giftItem = giftInfo[ext.iItemType];
      if (!giftItem) {
        return;
      }

      let identity = giftItem.vPropsIdentity || {};
      let value = (identity.value || [])[0];
      let imgsrc = value ? value.sPropsPic24 : '';
      let cost = giftCost(giftItem.iPropsGreenBean, ext.iItemCount);
      const payid = ext.strPayId;
      raw = _.extend({}, raw, {
        type: 'gift',
        gift_id: giftItem.iPropsId,
        gift_name: giftItem.sPropsName,
        image: imgsrc.slice(0, imgsrc.lastIndexOf('&')),
        gift_count: ext.iItemCount,
        gift_cost: cost,
        price: payid ? cost * rate.Huya : 0
      });
    } else {
      return;
    }

    return raw;
  },
  async Quanmin(opt) {
    let {data, roomInfo} = opt;
    const giftInfo = Gift.getInfo('quanmin');
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
      let giftItem = giftInfo[data.gid];
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
  },

  async Fanxing(opts) {
    const { data, roomInfo } = opts;
    const giftInfo = Gift.getInfo('fanxing');

    // 601, 602, 613 礼物, 501 弹幕, 401 免费礼物
    if (![601, 602, 613, 501, 401].includes(data.cmd)) {
      return null;
    }
    if (data.content.roomid + '' !== roomInfo.room_id + '') {
      return null;
    }
    const content = data.content.content;
    if (!content) {
      return null;
    }
    let raw = {};
    switch (data.cmd) {
      case 613:
        // 用户抽奖行为，不是赠送
        if (content.tip) {
          return null;
        }
      case 602:
      case 601:
        // 寻找女神
        if (content.actionId === 'HuntPubTalk') {
          return null;
        }
        // 约会女神
        if (content.actionId === 15) {
          return null;
        }
        const prizeList = content.prizeList || {};
        const gift = Object.values(prizeList)[0] || {};
        raw = {
          type: 'gift',
          gift_id: content.giftId || content.giftid || gift.id,
          gift_name: content.giftName || (Array.isArray(content.giftname) ? content.giftname[0] : content.giftname) || gift.name,
          gift_cost: +content.coin || content.worthCoin || +gift.cost || data.content.pvalue || (content.giftNum ? content.giftNum : +content.num) * +content.price || 0,
          gift_count: (Array.isArray(content.giftNum) ? +content.giftNum[0] : content.giftNum) || +content.num || (gift.num ? +gift.num : 1), // 优先级 giftNum > num
          price: (+content.coin || content.worthCoin || +gift.cost || data.content.pvalue || (content.giftNum ? content.giftNum : +content.num) * +content.price || 0) * rate.Kugou
        };
        if (!raw.gift_id && !raw.gift_name) {
          return null;
        } else if (!raw.gift_id && raw.gift_name) {
          let giftImg = content.giftImg || '';
          if (!giftImg && content.giftimg) {
            if (Array.isArray(content.giftimg)) {
              giftImg = content.giftimg[0] || '';
            } else {
              giftImg = content.giftimg || '';
            }
          }
          const reg = giftImg.match(/giftres\/(\S*)\//);
          const gid = reg ? reg[1] : raw.gift_name;
          raw.gift_id = giftInfo[raw.gift_name] && giftInfo[raw.gift_name].giftId || gid;
        } else if (raw.gift_id && !raw.gift_name) {
          raw.gift_name = giftInfo[raw.gift_id] && giftInfo[raw.gift_id].giftName;
        }
        if (!raw.gift_cost) {
          raw.gift_cost = giftInfo[raw.gift_id] && giftInfo[raw.gift_id].price || 0;
        }
        if (!raw.gift_name) {
          return null;
        }
        // if (!raw.gift_cost && raw.gift_name !== 'PK免费票') {
        //   console.log('no gift cost');
        //   console.log(data);
        // }
        break;
      case 501:
        raw = {
          type: 'chat',
          txt: content.chatmsg
        };
        break;
      case 401:
        raw = {
          type: 'gift',
          gift_id: '星星',
          gift_name: '星星',
          gift_cost: 0,
          gift_count: content.num,
          price: 0
        };
        break;
    }
    const user_nick = content.sentName || content.sendername || content.senderName || content.nickname || content.nickName;
    if (!user_nick) {
      return null;
    }
    const room_nick = content.getName || content.receivername || content.receiverName || roomInfo.anchor_nick;
    if (room_nick !== roomInfo.anchor_nick) {
      return null;
    }
    const user_level = content.senderrichlevel || content.senderRichLevel || content.richLevel || content.richlevel;
    if (user_level === undefined) {
      return null;
    }
    return Object.assign({
      plat: 'fanxing',
      user_id: content.sentUserId || content.senderid || content.senderId || content.userId || content.userid,
      user_nick,
      user_level,
      medal_level: -1,
      room_id: content.roomId || data.content.roomid,
      room_nick,
      cate_id: roomInfo.cate_id || 6,
      cate_name: roomInfo.cate_name || '秀场',
      device: 0,
      timestamp: content.addTime ? content.addTime * 1000 : data.content.time * 1000 || +new Date()
    }, raw);
  },

  async YY (opts) {
    const { data, roomInfo } = opts;
    const giftInfo = Gift.getInfo('yy');

    let raw = {};
    switch (data.type) {
      case 'chat':
        const jsonObj = fastXmlParser.parse(data.msg, {
          attributeNamePrefix: '',
          ignoreAttributes: false,
          parseAttributeValue: true
        });
        const txt = jsonObj ? jsonObj.msg.txt.data : data.msg;
        raw = {
          txt,
          user_id: data.from_uid,
          user_nick: data.nick,
        };
        break;
      case 'gift':
        raw = {
          gift_id: data.id,
          gift_name: giftInfo[data.id].name,
          gift_cost: (data.num * giftInfo[data.id].price).toFixed(2),
          gift_count: data.num,
          price: (data.num * giftInfo[data.id].price * rate.YY).toFixed(2),
          user_id: data.fromId,
          user_nick: data.fromName,
        };
        break;
    }
    return Object.assign(raw, {
      type: data.type,
      plat: 'yy',
      user_level: -1,
      medal_level: -1,
      room_id: roomInfo.room_id,
      room_nick: roomInfo.anchor_nick,
      cate_id: roomInfo.cate_id,
      cate_name: roomInfo.cate_name,
      device: 0,
      timestamp: +new Date()
    });
  }
};
