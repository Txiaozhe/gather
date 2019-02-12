const Conn = require('./Conn');
const SOCKET_HOST = 'openbarrage.douyutv.com';
const SOCKET_PORT = 8601;
const KEEPALIVE_INTERVAL = 30000;

module.exports = class Douyu extends Conn {
  constructor(url = '') {
    super();
    this.url = url;
    this.roomId = (() => {
      let parts = this.url.split('/');
      return parts[parts.length - 1];
    })();
    this.buffer = Buffer.alloc(0);
    this.isLoginReg = false;
    this.keepaliveTimer = null;
    this.clientConnHandler = this.clientConnHandler.bind(this);
    this.clientDataHandler = this.clientDataHandler.bind(this);
    this.init();
  }

  async init() {
    this.on('connect', this.clientConnHandler);
    this.connect(SOCKET_PORT, SOCKET_HOST);
  }

  destroy() {
    clearTimeout(this.keepaliveTimer);
    super.destroy();
  }

  encode(data) {
    let length = Buffer.byteLength(data);
    let buffer = Buffer.alloc(8 + 4 + length + 1);
    buffer.writeInt32LE(9 + length);
    buffer.writeInt32LE(9 + length, 4);
    buffer.writeInt32LE(689, 8);
    buffer.write(data, 12);
    return buffer;
  }

  decode(buffer) {
    let contents = [];
    this.buffer = Buffer.concat([this.buffer, buffer]);

    try {
      for (; ;) {
        let totalLen = this.buffer.length;
        let contentLen = this.buffer.readInt32LE(0);
        let segLen = 4 + contentLen;
        if (totalLen < segLen) {
          break;
        }

        let kvs = {};
        let content = this.buffer
          .slice(12, 12 + contentLen - 8 - 1)
          .toString('utf-8');

        content.split('/').forEach(item => {
          let pairs = item.split('@=');
          if (pairs.length == 2) {
            kvs[pairs[0]] = pairs[1];
          }
        });

        contents.push(kvs);
        this.buffer = this.buffer.slice(segLen);
      }
    } catch (e) {
    }

    return contents;
  }

  async keepalive() {
    this.keepaliveTimer = setTimeout(() => {
      this.write(`type@=keeplive/tick@=${this.roomId}/`);
      this.keepalive();
    }, KEEPALIVE_INTERVAL);
  }

  clientConnHandler() {
    this.on('rawdata', this.clientDataHandler);
    this.write(`type@=loginreq/roomid@=${this.roomId}/`);
  }

  async clientDataHandler(data) {
    if (!this.isLoginReg) {
      this.isLoginReg = true;
      this.keepalive();
      this.write(`type@=joingroup/rid@=${this.roomId}/gid@=-9999/`);
      return;
    }
    this.emit('data', data);
  }

  restart() {
    this.isLoginReg = false;
    this.buffer = Buffer.alloc(0);
    clearTimeout(this.keepaliveTimer);
    this.removeListener('connect', this.clientConnHandler);
    this.removeListener('rawdata', this.clientDataHandler);
    this.init();
  }
};