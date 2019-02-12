const VideoStream = require('./VideoStream');
const rp = require('request-promise');
const crypto = require('crypto');
const QUALITY = {
  HIGH: 2,
  FLUENCY: 1,
  SUPER: 0
};

class DouyuStream extends VideoStream {
  
  constructor (plat = 'douyu') {
    super(plat);
  }

  async getStreamAddr (plat, roomId, url) {
    try {
      const min = +new Date()/60000|0;
      const did = DouyuStream.createHash();
      const res = await rp({
        uri: `https://www.douyu.com/lapi/live/getPlay/${roomId}`,
        method: 'POST',
        form: {
          ver: '2017081401',
          cptl: '0002',
          sign: await this.getSign(roomId, min, did),
          rate: QUALITY.FLUENCY,
          cdn: '',
          tt: min,
          did
        },
        json: true
      });
      return res.data.rtmp_url + '/' + res.data.rtmp_live;
    } catch (e) {
      console.log(`get plat: ${plat}, rid: ${roomId} stream addr error`);
    }
  }

  async getSign (roomId, min, did) {
    try {
      const res = await rp({
        uri: 'http://121.43.189.149:3103/sthvideo/getsign',
        method: 'POST',
        form: {
          roomid: roomId,
          min,
          did
        },
        json: true
      });
      return res.data.sign;
    } catch (e) {
      console.log(`douyu rid: ${roomId} get sign error`);
    }
  }

  /**
   * 生成指定长度随机字符串
   * @param length
   */
  static randString (length) {
    const str = "0123456789abcdefghijklmnopqrstuvwyxz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const str_len = str.length;
    let rand = '';
    for (let i = 0; i < length; i++) {
      rand = rand + str.charAt(Math.random() * str_len);
    }
    return rand;
  }

  /**
   * 生成随机摘要
   * @param str
   */
  static createHash (str) {
    let hash = crypto.createHash('md5');
    hash.update(DouyuStream.randString(20) + Date.now() + (str ? JSON.stringify(str) : ''), 'utf8');
    return hash.digest('hex').toUpperCase();
  }

}

module.exports = new DouyuStream();