const VideoStream = require('./VideoStream');
const rp = require('request-promise');
const QUALITY = {
  HIGH: '_mid',
  SUPER: ''
};

class PandaStream extends VideoStream {

  constructor (plat = 'panda') {
    super(plat);
  }

  async getStreamAddr (plat, roomId, url) {
    try {
      const res = await rp({
        uri: 'https://api.m.panda.tv/ajax_get_liveroom_baseinfo',
        qs: {
          roomid: roomId,
          slaveflag: 1,
          __version: '3.2.1.4923',
          __plat: 'ios',
          __channel: 'appstore'
        },
        json: true
      });
      const { plflag, room_key, sign, ts } = res.data.info.videoinfo;
      const pl = plflag.split('_')[1];
      return `https://pl${pl}.live.panda.tv/live_panda/${room_key}${QUALITY.HIGH}.flv?sign=${sign}${ts}`;
    } catch (e) {
      console.log(`get plat: ${plat}, rid: ${roomId} stream addr error`);
    }
  }

}

module.exports = new PandaStream();