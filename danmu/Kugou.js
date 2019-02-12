const WSConn = require('./WSConn');
const rp = require('request-promise');
const redis = require('../config/redis');
const config = require('../config/config');
const Logger = require('../config/Logger');
const logger = new Logger('Fanxing/danmu');
const Gift = require('../gather/lib/gift');
const giftHelper = Gift.getInstance();

module.exports = class Kugou extends WSConn {

  constructor (url = '', opts) {
    super();
    this.url = url;
    this.roomId = this.parseRoomId(url);

    this.roomInfo = opts || {};

    this.init();
  }

  async init () {
    const giftInfo = await this.getGift();
    for(let key in giftInfo) {
      if (giftInfo.hasOwnProperty(key)) {
        giftHelper.push({
          plat: config.plat.fanxing,
          gift_id: giftInfo[key].giftId,
          gift_cost: giftInfo[key].price,
          isBroadcast: 0,
          token_type: 0,
          gift_name: giftInfo[key].giftName,
          gift_img: ''
        });
      }
    }
    try {
      const ws = await this.getWs();
      this.on('connect', this.clientConnHandler);
      this.connect(`ws://${ws}`);
    } catch (e) {
      this.emit('initerror', e);
    }
  }

  parseRoomId (url = '') {
    return url.split('/').pop();
  }

  async _getGiftCache () {
    const gift = await redis.get('DANMU:KUGOU:GIFT');
    if (gift) {
      return JSON.parse(gift);
    }
  }

  async _updateGiftCache (gift) {
    return await redis.set('DANMU:KUGOU:GIFT', JSON.stringify(gift), 'EX', 60 * 60 * 24);
  }
  
  async getGift () {
    const opts = {
      uri: 'http://act.fanxing.kugou.com/api/YueZhan/getGiftList',
      qs: {
        args: [154],
        jsoncallback: 'jsonpcallback_httpactfanxingkugoucomapiphpactYueZhangetGiftListargs154'
      },
      headers: {
        'User-Agent': encodeURIComponent('酷狗直播 3.95.2 rv:3.95.0.1 (iPhone; iPhone OS 9.3.2; zh_CN)')
      }
    };
    try {
      const gift = await this._getGiftCache();
      if (gift) {
        return gift;
      }
      let res = await rp(opts);
      res = res.match(/\((.+)\)/)[1];
      res = JSON.parse(res);
      const giftList = res.data.giftList || [];
      let obj = {};
      for (let e of giftList) {
        for (let gift of e.giftTypeList) {
          obj[gift.giftId] = gift;
          obj[gift.giftName] = gift;
        }
      }
      if (giftList.length) {
        this._updateGiftCache(obj);
      }
      return obj;
    } catch (e) {
      console.error('Kugou get gift list err: ', e.toString());
      return {};
    }
  }

  async _getWsCache () {
    const addrs = await redis.get('DANMU:KUGOU:WS');
    if (addrs) {
      return JSON.parse(addrs);
    }
  }

  async _updateWsCache (addrs) {
    return await redis.set('DANMU:KUGOU:WS', JSON.stringify(addrs), 'EX', 60 * 60 * 24);
  }
  
  async getWs () {
    const opts = {
      uri: 'https://fx2.service.kugou.com/socket_scheduler/pc/v2/address.jsonp',
      qs: {
        jsonpcallback: 'jsonpcallback_httpsfx2servicekugoucomsocket_schedulerpcv2addressjsonp',
        _p: 0,
        _v: '7.0.0',
        pv: 20171111,
        rid: this.roomId,
        cid: 100,
        at: 101,
        _: +new Date()
      },
      headers: {
        'User-Agent': encodeURIComponent('酷狗直播 3.95.2 rv:3.95.0.1 (iPhone; iPhone OS 9.3.2; zh_CN)')
      }
    };
    try {
      let addrs = await this._getWsCache();
      if (addrs) {
        return addrs[Math.floor((Math.random() * addrs.length))].host;
      }
      let res = await rp(opts);
      res = res.match(/\((.+)\)/)[1];
      res = JSON.parse(res);
      addrs = res.data.addrs || [];
      if (addrs.length) {
        this._updateWsCache(addrs);
      }
      return addrs[Math.floor((Math.random() * addrs.length))].host;
    } catch (e) {
      console.error('can not get ws address: ', e);
      const addrsBackup = [
        '119.146.204.143:1315',
        '119.146.204.169:1315',
        '119.146.204.167:1315'
      ];
      console.warn('select a backup address !!!');
      return addrsBackup[Math.floor((Math.random() * addrsBackup.length))];
    }
  }

  // ws创建成功，登录并发送心跳，同时接收数据
  clientConnHandler () {
    this.on('rawdata', this.clientDataHandler);
    this.on('close', this.clientCloseHandler);
    this.login();
    this.heartbeat();
  }

  clientDataHandler (data) {
    data = this._decode(data);
    if (data) {
      this.emit('data', [].concat(data));
    }
  }

  clientCloseHandler () {
    clearInterval(this.scheduler);
  }

  destroy () {
    clearInterval(this.scheduler);
    super.destroy();
  }

  login () {
    this.send({
      appid: 1010,
      clientid: 100,
      cmd: 201,
      kugouid: 0,
      referer: 0,
      roomId: this.roomId,
      soctoken: '',
      token: '',
      v: 20171111
    });
  }

  // 每5秒心跳，保持连接
  heartbeat () {
    this.scheduler = setInterval(() => {
      this.send('H');
    }, 5 * 1000);
  }

  offset (data) {
    this.send({
      cmd: 211,
      kugouId: 1293910630,
      msgId: data.msgId,
      offset: data.offset,
      roomId: data.content.roomid || this.roomId,
      rpt: 0
    });
  }

  send (data) {
    this.connection.send(this._encode(data));
  }

  _encode (data) {
    if (typeof data === 'object') {
      return JSON.stringify(data);
    }
    return data;
  }

  _decode (data) {
    // 心跳消息
    if (data.utf8Data === 'H') {
      return null;
    }
    const parsedData = JSON.parse(data.utf8Data);
    if (parsedData.offset) {
      this.offset(parsedData);
    }
    return parsedData;
  }

}