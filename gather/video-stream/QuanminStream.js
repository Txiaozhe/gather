const VideoStream = require('./VideoStream');
const rp = require('request-promise');
const moment = require('moment');

class QuanminStream extends VideoStream {

  constructor (plat = 'quanmin') {
    super(plat);
  }

  async getStreamAddr (plat, roomId, url) {
    try {
      const res = await rp({
        uri: `https://www.quanmin.tv/json/rooms/${roomId}/lineInfo.json`,
        qs: {
          _t: moment().format('YYYYMDHm')
        },
        json: true
      });
      const roomLine = res.room_lines[0];
      let flvs = Object.values(roomLine.flv);
      flvs = flvs.filter(e => typeof e === 'object').sort((a, b) => a.quality - b.quality);
      return flvs[0].src;
    } catch (e) {
      console.log(`get plat: ${plat}, rid: ${roomId} stream addr error`);
    }
  }

}

module.exports = new QuanminStream();