const VideoStream = require('./VideoStream');
const rp = require('request-promise');

class FanxingStream extends VideoStream {

  constructor (plat = 'fanxing') {
    super(plat);

    this.uri = 'http://fx2.service.kugou.com/video/pc/live/pull/v1/streamaddr.jsonp'
  }

  spliceQuery (roomId) {
    let qs = {
      roomId,
      version: '1.0',
      platform: 7,
      streamType: '1-2-3',
      ch: 'fx',
      ua: 'fx-flash',
      kugouId: 1293910630,
      layout: 1,
      _: Math.random()
    };
    let jsonpcallback = '';
    jsonpcallback += this.uri;
    for (let [k, v] of Object.entries(qs)) {
      jsonpcallback += (k + v);
    }
    jsonpcallback = jsonpcallback.replace(/[:/.-]/g, '');
    qs.jsonpcallback = jsonpcallback;
    return qs;
  }
  
  async getStreamAddr (plat, roomId, url) {
    try {
      const qs = this.spliceQuery(roomId);
      let res = await rp({
        uri: this.uri,
        qs
      });
      const str = res.slice(qs.jsonpcallback.length + 1, -1);
      res = JSON.parse(str);
      return res.data.httpflv[0];
    } catch (e) {
      console.log(`get plat: ${plat}, rid: ${roomId} stream addr error`);
    }
  }

}

module.exports = new FanxingStream();