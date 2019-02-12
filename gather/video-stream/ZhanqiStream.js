const VideoStream = require('./VideoStream');
const rp = require('request-promise');
const QUALITY = {
  NORMAL: '_360p',
  HIGH: '_480p',
  SUPER: '_720p',
  HD: ''
};

class ZhanqiStream extends VideoStream {

  constructor (plat = 'zhanqi') {
    super(plat);
  }

  async getStreamAddr (plat, roomId, url) {
    try {
      const [videoId, gid] = await Promise.all([
        this.getVideoId(plat, roomId, url),
        this.getGid(plat, roomId)
      ]);
      const key = await this.getKey(plat, roomId, videoId, gid);
      return `https://alhdl-cdn.zhanqi.tv/zqlive/${videoId}${QUALITY.NORMAL}.flv?${key}&fhost=h5&platform=128`
    } catch (e) {
      console.log(`get plat: ${plat}, rid: ${roomId} stream addr error`);
    }
  }

  async getVideoId (plat, roomId, url) {
    try {
      const res = await rp({ uri: url });
      const videoId = res.match(/"videoId":"(\S*)","chatStatus"/)[1];
      return videoId;
    } catch (e) {
      console.log(`get plat: ${plat}, rid: ${roomId} video id error`);
    }
  }

  async getGid (plat, roomId) {
    try {
      const res = await rp({
        uri: 'https://www.zhanqi.tv/api/public/room.viewer',
        qs: {
          uid: 401841505,
          _t: +new Date()/60000|0
        },
        json: true
      });
      return res.data.gid;
    } catch (e) {
      console.log(`get plat: ${plat}, rid: ${roomId} gid error`);
    }
  }

  async getKey (plat, roomId, videoId, gid) {
    try {
      const res = await rp({
        uri: 'https://www.zhanqi.tv/api/public/burglar/chain',
        method: 'POST',
        headers: {
          'Cookie': `gid=${gid}`
        },
        formData: {
          stream: videoId + QUALITY.NORMAL + '.flv',
          cdnKey: 202,
          platform: 128
        },
        json: true
      });
      return res.data.key;
    } catch (e) {
      console.log(`get plat: ${plat}, rid: ${roomId} key error`);
    }
  }

}

module.exports = new ZhanqiStream();