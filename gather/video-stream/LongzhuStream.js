const VideoStream = require('./VideoStream');
const rp = require('request-promise');

class LongzhuStream extends VideoStream {

  constructor (plat = 'longzhu') {
    super(plat);
  }

  async getStreamAddr (plat, roomId, url) {
    try {
      let res = await rp({
        uri: 'https://livestream.longzhu.com/live/getlivePlayurl',
        qs: {
          roomId,
          hostPullType: 2,
          isAdvanced: true,
          playUrlsType: 1,
          callback: 'jsonp3'
        }
      });
      res = res.slice(7, -1);
      res = JSON.parse(res);
      let urls = res.playLines && res.playLines[0].urls;
      urls = urls.sort((a, b) => a.rateLevel - b.rateLevel);
      return urls[0].securityUrl;
    } catch (e) {
      console.log(`get plat: ${plat}, rid: ${roomId} stream addr error`);
    }
  }

}

module.exports = new LongzhuStream();