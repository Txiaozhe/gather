const Kugou = require('./Kugou');
const crypto = require('crypto');
const rp = require('request-promise');
const config = require('../config/config');
const Logger = require('../config/Logger');
const logger = new Logger('KugouH5/danmu');

module.exports = class KugouH5 extends Kugou {
  constructor (url = '', opts) {
    super(url, opts);
  }

  async getWs () {
    const formData = {
      roomId: this.roomId,
      kugouId: 0,
      token: 0,
      appid: 2815,
      channel: 2,
      platform: 207,
      times: +new Date()
    };
    let res;
    try {
      formData.sign = this._generateSign(formData);
      res = await rp({
        uri: 'http://mo.fanxing.kugou.com/mfx/h5/share/live/getSocketInfo',
        method: 'POST',
        formData
      });
      res = res.match(/window.name='(\S*)';/)[1];
      res = JSON.parse(res);
      const socketInfo = res.data.socketInfo;
      return socketInfo[0].ip + ':1314';
    } catch (e) {
      logger.error('getws error', config.plat.fanxing, e);
    }
  }

  _generateSign (formData) {
    let values = Object.values(formData);
    values = values.sort();
    values.sort();
    const str = values.join('') + '#FX_md5*!';
    return crypto.createHash('md5').update(str).digest('hex');
  }

  login () {
    this.send({
      appid: null,
      cmd: 201,
      kugouid: null,
      roomid: this.roomId
    });
  }

  heartbeat () {
    this.scheduler = setInterval(() => {
      this.send('HEARTBEAT_REQUEST');
    }, 5 * 1000);
  }

  _decode (data) {
    if (data.utf8Data === 'HEARTBEAT_RESPONSE') {
      return null;
    }
    return JSON.parse(data.utf8Data);
  }
};
