const VideoStream = require('./VideoStream');
const rp = require('request-promise');
const QUALITY = {
  BLUE: 0,
  SUPER: 2000,
  HIGH: 1200,
  FLUENCY: 500
};

class HuyaStream extends VideoStream {

  constructor (plat = 'huya') {
    super(plat);
  }

  async getStreamAddr (plat, roomId, url) {
    try {
      const { sStreamName, sFlvUrl, sFlvUrlSuffix, sFlvAntiCode } = await this.getParams(plat, roomId, url);
      return `${sFlvUrl}/${sStreamName}.${sFlvUrlSuffix}?${sFlvAntiCode}&ratio=${QUALITY.FLUENCY}`;
    } catch (e) {
      console.log(`get plat: ${plat}, rid: ${roomId} stream addr error`);
    }
  }

  async getParams (plat, roomId, url) {
    try {
      let res = await rp({ uri: url });
      res = res.replace(/ |\r\n/g, '');
      res = res.match(/"stream":(\S*)};window/)[1];
      res = JSON.parse(res);
      const gameStreamInfoList = res.data[0].gameStreamInfoList;
      const gameStreamInfo = gameStreamInfoList[0];
      const { sStreamName, sFlvUrl, sFlvUrlSuffix, sFlvAntiCode } = gameStreamInfo;
      return { sStreamName, sFlvUrl, sFlvUrlSuffix, sFlvAntiCode };
    } catch (e) {
      console.log(`get plat: ${plat}, rid: ${roomId} query params error`);
    }
  }

}

module.exports = new HuyaStream();