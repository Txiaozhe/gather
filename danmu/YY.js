const EventEmitter = require('events');
const YYHandler = require('../helper/yy-sdk');
const redis = require('../config/redis');
const config = require('../config/config');

module.exports = class YY extends EventEmitter {
  constructor (url = '', opts) {
    super();
    this.url = url;

    this.init();
  }

  async init () {
    try {
      await redis.lpush(config.LIST_GIFT_TASK_KEY(config.plat.yy, this.url));

      this.socket = new YYHandler();
      const [topSid, subSid] = this.parseSid();
      this.socket.joinChannel(topSid, subSid);
      this.socket.agent().on('data', (data) => this.clientDataHandler(data));
      this.socket.agent().on('gift', (data) => this.clientGiftHandler(data));
    } catch (e) {
      this.emit('initerror', e);
    }
  }

  destroy () {
    this.socket.logout();
    this.removeAllListeners();
  }

  parseSid () {
    let [ , , , topSid, subSid] = this.url.split(/[/?]/);
    return [topSid, subSid];
  }

  clientDataHandler (data) {
    data.type = 'chat';
    this.emit('data', [].concat(data));
  }

  clientGiftHandler (gift) {
    gift.type = 'gift';
    this.emit('data', [].concat(gift));
  }
};
