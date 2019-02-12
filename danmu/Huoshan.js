const EventEmitter = require('events');
const _ = require('lodash');
const config = require('../config/config');
// const redis = require('../config/redis');
const HuoshanApi = require('../helper/huoshan/api');

const RETRY_TIMEOUT = 20 * 1000;
const REQ_TIMEOUT = 6000;
const MAX_RETYR = 5;
const LIVE_ROOM_ID_RETRY = 30 * 60 * 1000; // 频繁检测 需要代理 然而采集需要大量代理

module.exports = class Huoshan extends EventEmitter {
  constructor(url = '', opts) {
    super();
    this.url = url;
    this.roomId = -1;
    this.anchorId = opts ? opts.anchor_id : '';
    this.retryCount = 0;
    this.cursor = 0;
    this.liveRoomTimer = null;
    this.destroyFlag = false;
    this.init();
  }

  async init() {
    try {
      let count = 0;
      while (!Object.keys(HuoshanApi.query).length && count < 10) {
        count++;
        await HuoshanApi.delay(1000)
      }
      if(count >= 10) {
        this.emit('initerror', new Error('获取设备信息失败'));
        return false;
      }
      // 尽量避免同时大量房间初始化 (同时大量初始化, 拿不到房间号)
      await HuoshanApi.delay(Math.floor(Math.random() * 120) * 1000);

      const roomStatus = await this.requestRoomStatus();
      const enterStatus = true; // await this.enterRoom();
      if (roomStatus && enterStatus) {
        if(!this.destroyFlag) {

          this.emit('connect');
          this.connect();
          
          // 重复获取 live room id, 防止主播短时间内频繁开关播 -> 直播间号随之改变, 带来采集不到信息的情况
          if(this.liveRoomTimer) clearInterval(this.liveRoomTimer);
          this.liveRoomTimer = setInterval(this.getLiveRoomId.bind(this),  LIVE_ROOM_ID_RETRY);
        }
      } else {
        this.emit('initerror', 'unable to get chushou room info');
      }
    } catch (e) {
      this.emit('initerror', e);
    }
  }

  async getLiveRoomId () {
    try {
      let roomId = await HuoshanApi.getLiveRoomIdByAnchorId(this.anchorId);
      if(!roomId) return false;

      if(this.roomId !== roomId) {
        this.roomId = roomId;
        this.cursor = 0;
      };
      return true;
    } catch (e) {
      return false;
    }
  }

  async requestRoomStatus() {
    try {
      let roomId = await this.getLiveRoomId();
      if (!roomId) {
        this.emit('initerror', new Error('huoshan huoshanId error'));
        return false;
      }
      // await redis.lpush(config.LIST_GIFT_TASK_KEY(config.plat.huoshan), roomId);
      return true;
    } catch (e) {
      throw e;
    }
  }

  connect() {
    clearTimeout(this.timer);
    this.timer = setTimeout(async () => {
      try {
        await this.clientDataHandler();
      } catch (e) {
        if (this.retryCount++ > MAX_RETYR) {
          this.emit('error', e);
          return;
        }
      }
      this.connect();
    }, RETRY_TIMEOUT);
  }

  async clientDataHandler() {

    let res = await HuoshanApi.fetchMessagePolling(this.roomId, this.cursor);

    if (res.status_code !== 0) {
      throw new Error('[E] request [%s] error', this.roomId, res.status_code, res);
    }
    let items = [];
    res.data.forEach(_tmp => {
      items.push(_tmp);
    })
    this.cursor = res.extra.cursor || 0;

    if (items && items.length) {
      this.emit('data', items);
    }
    return;
  }

  async enterRoom() {
    try {
      let res = await HuoshanApi.enterRoom(this.roomId);
      if (res.status_code === 0) return true;
      return false;
    } catch (e) {
      return false;
    }
  }

  async restart() {
    this.cursor = 0;
    this.init();
  }

  destroy() {
    clearTimeout(this.timer);
    if(this.liveRoomTimer) clearInterval(this.liveRoomTimer);
    this.destroyFlag = true;
    this.cursor = 0;
    this.emit('destroy');
    this.removeAllListeners();
  }
};

// const huoshan = new Huoshan('', {anchor_id: 100720770940})
// module.exports = async () => {
//   await HuoshanApi.delay(2000)
//   let res = await HuoshanApi.giftList();
//   res.data.forEach(_tmp => {
//     console.log(_tmp.id, ' -- ', _tmp.name || _tmp.describe, ' -- ', _tmp.diamond_count)
//   })
//   console.log('res ===> ', res.data.length)
// }