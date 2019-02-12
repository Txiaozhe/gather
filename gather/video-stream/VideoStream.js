const redis = require('../../config/redis');
const ACTION = {
  STOP: 0,
  START: 1,
  UPDATE: 2
};
const MAX_SLEEP = 10;
const MAX_QUEUE_LEN = 10000;

module.exports = class VideoStream {

  constructor (plat) {
    this.plat = plat;
    this.check();
  }

  async updateLiving (plat, roomId) {
    return redis.sadd('SET:GATHER:STREAM:LIVING', `${plat}:${roomId}`);
  }

  async living () {
    const living = await redis.smembers('SET:GATHER:STREAM:LIVING');
    let arr = [];
    for (let e of living) {
      let [plat, roomId] = e.split(':');
      arr.push([plat, roomId]);
    }
    return arr;
  }

  async isLiving (plat, roomId) {
    return redis.sismember('SET:GATHER:STREAM:LIVING', `${plat}:${roomId}`);
  }

  async removeLiving (plat, roomId) {
    return redis.srem('SET:GATHER:STREAM:LIVING', `${plat}:${roomId}`);
  }

  async incrSleeping (plat, roomId) {
    return redis.hincrby('HASH:GATHER:STREAM:SLEEPING', `${plat}:${roomId}`, 1);
  }

  async sleeping () {
    return redis.hgetall('HASH:GATHER:STREAM:SLEEPING');
  }

  async dead () {
    const sleeping = await this.sleeping();
    let arr = [];
    for (let [k, v] of Object.entries(sleeping)) {
      if (v > MAX_SLEEP) {
        let [plat, roomId] = k.split(':');
        arr.push([plat, roomId]);
      }
    }
    return arr;
  }

  async removeDead (arr) {
    let fields = [];
    for (let [plat, roomId] of arr) {
      fields.push(`${plat}:${roomId}`);
    }
    return redis.hdel('HASH:GATHER:STREAM:SLEEPING', fields);
  }

  async setHid (plat, roomId, url, hid) {
    return redis.hset('HASH:GATHER:STREAM:HID', `${plat}:${roomId}`, `${url}::${hid}`);
  }

  async getHid (plat, roomId) {
    const res = await redis.hget('HASH:GATHER:STREAM:HID', `${plat}:${roomId}`);
    return res ? res.split('::') : [];
  }

  async delHid (plat, roomId) {
    return redis.hdel('HASH:GATHER:STREAM:HID', `${plat}:${roomId}`);
  }

  async start (plat, roomId, url, hid) {
    await this.setHid(plat, roomId, url, hid);
    await this.updateLiving(plat, roomId);
    const streamAddr = await this.getStreamAddr(plat, roomId, url);
    await this.sendSign(hid, plat, roomId, ACTION.START, streamAddr);
  }

  async update (plat, roomId) {
    const [url, hid] = await this.getHid(plat, roomId);
    const streamAddr = await this.getStreamAddr(plat, roomId, url);
    if (streamAddr) {
      await this.sendSign(hid, plat, roomId, ACTION.UPDATE, streamAddr);
    }
  }

  async stop (plat, roomId, url, hid) {
    if (!hid) {
      [, hid] = await this.getHid(plat, roomId);
    }
    await this.delHid(plat, roomId);
    await this.removeLiving(plat, roomId);
    await this.sendSign(hid, plat, roomId, ACTION.STOP);
  }

  /**
   * 
   * @param {*} hid
   * @param {*} plat 
   * @param {*} roomId 
   * @param {*} action 开关播信号，1：开播，0：关播，2：更新
   * @param {*} streamAddr 
   * @param {*} opts 扩展字段
   */
  async sendSign (hid, plat, roomId, action, streamAddr = '', opts = '') {
    const value = `${hid}::${plat}::${roomId}::${action}::${streamAddr}::${opts}`;
    if (action !== ACTION.UPDATE) {
      console.log('send sign: ', value);
    }
    return redis.lpush('LIST:GATHER:STREAM', value);
  }

  async getSignQueueLen () {
    return redis.llen('LIST:GATHER:STREAM');
  }

  async getStreamAddr (plat, roomId, url) {
    return '';
  }

  async newest (plat) {
    let arr = [];
    const roomList = await redis.smembers(`SET:GATHER:STREAM:NEW:${plat.toUpperCase()}`);
    for (let e of roomList) {
      let [plat, roomId] = e.split(':');
      arr.push([plat, roomId]);
    }
    return arr;
  }

  async inNewest (plat, roomId) {
    return redis.sismember(`SET:GATHER:STREAM:NEW:${plat.toUpperCase()}`, `${plat}:${roomId}`);
  }

  check () {
    setInterval(async () => {
      console.log(`${this.plat} run video stream schedule !`);
      const living = await this.living();
      for (let [plat, roomId] of living) {
        if (plat !== this.plat) {
          continue;
        }
        const inNewest = await this.inNewest(plat, roomId);
        if (inNewest) {
          const len = await this.getSignQueueLen();
          if (len < MAX_QUEUE_LEN) {
            await this.update(plat, roomId);
          }
        } else {
          await this.incrSleeping(plat, roomId);
        }
      }

      const dead = await this.dead();
      for (let [plat, roomId] of dead) {
        const isLiving = await this.isLiving(plat, roomId);
        if (isLiving) {
          await this.stop(plat, roomId);
        }
      }
      if (dead.length) {
        await this.removeDead(dead);
      }
    }, 60 * 1000);
  }

}