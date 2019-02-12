const EventEmitter = require('events');
const request = require('superagent');
const _ = require('lodash');
const config = require('../config/config');
const redis = require('../config/redis');

const JSONP_CALLBACK = 'jQuery110209616188693157892_';
const CHAT_URL = 'https://chat.chushou.tv/chat/get.htm';
const RETRY_TIMEOUT = 30 * 1000;
const REQ_TIMEOUT = 6000;
const MAX_RETYR = 5;

module.exports = class Chushou extends EventEmitter {
  constructor(url = '') {
    super();
    this.url = url;
    this.timer = null;
    this.roomId = -1;
    this.breakpoint = '';
    this.cid = -1;
    this.retryCount = 0;
    this.agent = request.agent();
    this.init();
  }

  async init() {
    try {
      const roomStatus = await this.requestRoomStatus();
      if (roomStatus) {
        this.emit('connect');
        this.connect();
      } else {
        this.emit('initerror', 'unable to get chushou room info');
      }
    } catch (e) {
      this.emit('initerror', e);
    }
  }

  async requestRoomStatus() {
    try {
      let parts = this.url.split('/');
      let roomId = parts[parts.length - 1];
      if (!roomId || roomId.lastIndexOf('.') === -1) {
        this.emit('initerror', new Error('url error'));
        return false;
      }

      roomId = roomId.slice(0, roomId.lastIndexOf('.'));
      await redis.lpush(config.LIST_GIFT_TASK_KEY(config.plat.chushou), roomId);

      this.roomId = roomId;
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
    if (!this.agent) {
      return;
    }

    let callback = `${JSONP_CALLBACK}${+new Date()}`;
    let res = await this.agent
      .get(CHAT_URL)
      .timeout(REQ_TIMEOUT)
      .query({
        style: 2,
        roomId: this.roomId,
        breakpoint: this.breakpoint,
        _: Date.now(),
        callback: callback
      })
      .set('Referer', this.url)
      .set('Pragma', 'no-cache')
      .set('Cache-Control', 'no-cache');

    if (res.status != 200 || !res.text) {
      throw new Error('[E] request [%s] error', CHAT_URL, res.status, res.text);
    }

    let body = res.text;
    if (body.indexOf(callback) > -1) {
      body = body.replace(callback, '').replace(/^\(|\);?$/g, '');
      let data = JSON.parse(body).data;
      this.breakpoint = body.breakpoint;

      let items = data.items;
      let index = _.findIndex(items, {
        id: this.cid
      });
      if (index > -1) {
        items = items.splice(index + 1);
      }

      if (items && items.length) {
        this.cid = items[items.length - 1].id;
        this.emit('data', items);
      }
    }
  }

  async restart() {
    this.breakpoint = '';
    this.agent = request.agent();
    this.init();
  }

  destroy() {
    clearTimeout(this.timer);
    this.cid = -1;
    this.breakpoint = '';
    this.agent = null;
    this.emit('destroy');
    this.removeAllListeners();
  }
};