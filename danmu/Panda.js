const Conn = require('./Conn');
const voca = require('voca');
const request = require('superagent');
const _ = require('lodash');
const pair = require('../helper/pair');
const cutbuf = require('../helper/cutbuf');

const ADDRESS_URL = 'https://api.homer.panda.tv/chatroom/getinfo?rid=0&roomid=%s&retry=0&__version=3.2.1.4923&__plat=web';
const KEEPALIVE_INTERVAL = 30000;
const REQ_TIMEOUT = 6000;
const PROTOCOL = {
  LOGIN_SUCCESS: 393222,
  HEARTBEAT: 393217,
  RECVMSG: 393219
};

module.exports = class Panda extends Conn {
  constructor(url = '') {
    super();
    this.url = url;
    this.roomId = -1;
    this.serverInfo = null;
    this.buffer = Buffer.alloc(0);
    this.isLoginReg = false;
    this.keepaliveTimer = null;
    this.clientConnHandler = this.clientConnHandler.bind(this);
    this.clientDataHandler = this.clientDataHandler.bind(this);
    this.init();
  }

  async init() {
    let serverAddress;
    try {
      serverAddress = await this.requestServerAddress();
    } catch (e) {
      this.emit('initerror', e);
      return false;
    }

    if (serverAddress) {
      this.on('connect', this.clientConnHandler);
      serverAddress = serverAddress.split(':');
      this.connect(serverAddress[1], serverAddress[0]);
    }
  }

  async requestServerAddress() {
    let parts = this.url.split('/');
    let len = parts.length;
    this.roomId = parts[len - 1] || parts[len - 2];

    let url = voca.sprintf(ADDRESS_URL, this.roomId);
    let res = await request.get(url).timeout({
      response: REQ_TIMEOUT
    });
    let body = res.text;
    try {
      body = JSON.parse(body);
    } catch (e) {}

    if (!body || body.errno || !body.data) {
      throw new Error('request error');
    }

    this.serverInfo = body.data;
    let serverAddress = body.data.chat_addr_list;
    let rand = Math.floor(Math.random() * serverAddress.length);
    return serverAddress[rand];
  }

  destroy() {
    clearTimeout(this.keepaliveTimer);
    super.destroy();
  }

  encode(data) {
    let length = Buffer.byteLength(data);
    let buffer = Buffer.alloc(5 + 1 + length + 4);
    buffer.fill(Buffer.from([0x00, 0x06, 0x00, 0x02, 0x00]), 0);
    buffer.writeUInt8(length, 5);
    buffer.write(data, 6);
    buffer.fill(Buffer.from([0x00, 0x06, 0x00, 0x00]), 6 + length);
    return buffer;
  }

  decode(buffer) {
    let contents = [];
    this.buffer = Buffer.concat([this.buffer, buffer]);

    try {
      let count = 0;
      label: for (;;) {
        let protocol = this.buffer.readInt32BE(0);
        switch (protocol) {
          case PROTOCOL.LOGIN_SUCCESS: {
            let len = this.buffer.readInt16BE(4);
            let content = this.buffer.slice(4 + 2, 4 + 2 + len);
            if (len > content.length) {
              break label;
            }

            let kvs = pair(content, '\n', ':');
            contents.push({
              protocol: protocol,
              data: kvs
            });
            this.buffer = this.buffer.slice(4 + 2 + len);
            break;
          }
          case PROTOCOL.HEARTBEAT: {
            contents.push({
              protocol: protocol,
              data: {}
            });
            this.buffer = this.buffer.slice(4);
            break;
          }
          case PROTOCOL.RECVMSG: {
            let len = this.buffer.readInt16BE(4);
            let content = this.buffer.slice(4 + 2, 4 + 2 + len);

            if (len > content.length) {
              break label;
            }

            let extMsg = pair(content, '\n', ':');
            let extLen = 4 + 2 + len;
            let itemLen = this.buffer.readInt32BE(extLen);
            content = this.buffer.slice(extLen + 4, extLen + 4 + itemLen);
            if (itemLen > content.length) {
              break label;
            }

            content = cutbuf(content, 16);
            for (let item of content) {
              content = JSON.parse(item);
              contents.push({
                protocol: protocol,
                data: content,
                ext: extMsg
              });
            }

            this.buffer = this.buffer.slice(extLen + 4 + itemLen);
            break;
          }
        }
      }
    } catch (e) {}

    return contents;
  }

  async keepalive() {
    this.keepaliveTimer = setTimeout(() => {
      this.write(Buffer.from([0x00, 0x06, 0x00, 0x00]), true);
      this.keepalive();
    }, KEEPALIVE_INTERVAL);
  }

  clientConnHandler() {
    let { rid, appid, ts, sign, authType } = this.serverInfo;
    let data = [
      ['u', `${rid}@${appid}`],
      ['k', 1],
      ['t', 300],
      ['ts', ts],
      ['sign', sign],
      ['authtype', authType]
    ];

    data = data.map(item => {
      return `${item[0]}:${item[1]}`;
    });

    this.on('rawdata', this.clientDataHandler);
    this.write(data.join('\n'));
  }

  async clientDataHandler(data) {
    if (!this.isLoginReg) {
      let index = _.findIndex(data, {
        protocol: PROTOCOL.HEARTBEAT
      });
      if (index > -1) {
        this.isLoginReg = true;
        this.keepalive();
      }
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