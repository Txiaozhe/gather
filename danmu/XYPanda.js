const Conn = require('./Conn');
const voca = require('voca');
const request = require('superagent');
const _ = require('lodash');
const md5 = require('md5');

const SOCKETSERVER_URL = '%s//online.panda.tv/dispatch';
const KEEPALIVE_INTERVAL = 30000;
const REQ_TIMEOUT = 6000;
const PROTOCOL = {
  REG: 2147483649,
  REG_SUCCESS: 2147483648
};

module.exports = class XYPanda extends Conn {
  constructor(url = '') {
    super();
    this.url = url;
    this.roomId = null;
    this.serverInfo = null;
    this.isLoginReg = false;
    this.keepaliveTimer = null;
    this.buffer = Buffer.alloc(0);
    this.guid = this.genGuid();
    this.clientConnHandler = this.clientConnHandler.bind(this);
    this.clientDataHandler = this.clientDataHandler.bind(this);
    this.restartHandler = this.restart.bind(this);
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
      this.connect(serverAddress[1], serverAddress[0]);
    }
  }

  async requestServerAddress() {
    let parts = this.url.split('/');
    let guid = this.guid;
    let cluster = 'v3';
    let plat = 'pc_web';
    let xid = parts[parts.length - 1];
    this.roomId = xid;
    this.timestamp = Math.round(new Date().getTime() / 1000);
    this.sign = md5(`uzY@H/C!N^G9K:EY${guid}${cluster}${this.timestamp}`);

    let url = voca.sprintf(SOCKETSERVER_URL, parts[0]);
    let res = await request
      .get(url)
      .timeout({
        response: REQ_TIMEOUT
      })
      .query({
        guid: guid,
        time: this.timestamp,
        cluster: cluster,
        plat: plat,
        xid: xid,
        sign: this.sign
      });

    let body = res.body;
    if (!body || body.error) {
      throw new Error('request error');
    }

    this.serverInfo = body;
    return [body.addr, body.port];
  }

  destroy() {
    clearTimeout(this.keepaliveTimer);
    super.destroy();
  }

  encode(data) {
    let { cmd, buffer } = data;
    let headerBuf = Buffer.alloc(4 + 8 + 4 + 4 + 4);
    headerBuf.writeUInt8(3, 0);
    headerBuf.writeUInt8(0, 1);
    headerBuf.writeUInt8(0, 2);
    headerBuf.writeUInt8(0, 3);
    headerBuf.writeDoubleBE(Math.random(), 4);
    headerBuf.writeUInt32BE(cmd, 12);
    headerBuf.writeUInt32BE(0, 16);
    headerBuf.writeUInt32BE(buffer.length, 20);
    return Buffer.concat([headerBuf, buffer]);
  }

  decode(buffer) {
    let contents = [];
    this.buffer = Buffer.concat([this.buffer, buffer]);
    if (this.buffer.length < 24) {
      return contents;
    }

    try {
      for (;;) {
        let pad = this.buffer.readUInt32BE(0);
        let rand = this.buffer.readDoubleBE(4);
        let cmd = this.buffer.readUInt32BE(12);
        let length = this.buffer.readUInt32BE(20);
        let data = this.buffer.slice(24, 24 + length).toString('utf-8');
        if (cmd != PROTOCOL.REG_SUCCESS) {
          data = JSON.parse(data);
        }

        contents.push({
          rand: rand,
          cmd: cmd,
          data: data
        });
        this.buffer = this.buffer.slice(24 + length);
      }
    } catch (e) {}

    return contents;
  }

  // u can wait the `close` event to restart
  // but we register again to protect client after 30s
  async keepalive() {
    // 熊猫星颜不需要keepalive
    return;
    clearTimeout(this.keepaliveTimer);
    this.keepaliveTimer = setTimeout(() => {
      this.reg2server();
      this.keepalive();
    }, KEEPALIVE_INTERVAL);
  }

  reg2server() {
    let guidBuf = this.str2Buffer(this.guid);
    let rndBuf = this.str2Buffer(this.serverInfo.rnd);
    let buf = Buffer.alloc(36);
    buf.fill(guidBuf.slice(0, 16), 0, 16);
    buf.fill(rndBuf.slice(0, 20), 16, 36);
    this.write({
      cmd: PROTOCOL.REG,
      buffer: buf
    });
  }

  clientConnHandler() {
    this.on('rawdata', this.clientDataHandler);
    this.reg2server();
  }

  async clientDataHandler(data) {
    if (!this.isLoginReg) {
      let index = _.findIndex(data, {
        cmd: PROTOCOL.REG_SUCCESS
      });
      if (index > -1) {
        this.isLoginReg = true;
        this.keepalive();
      }
    }
    let d = [].concat(data).filter(i => {
      return i && i.data && i.data.to == this.roomId;
    });
    if(d.length){
      // console.log('DATA',JSON.stringify(d));
      this.emit('data', d);
    }
  }

  restart(error) {
    this.isLoginReg = false;
    this.guid = this.genGuid();
    this.buffer = Buffer.alloc(0);
    clearTimeout(this.keepaliveTimer);
    this.removeListener('connect', this.clientConnHandler);
    this.removeListener('rawdata', this.clientDataHandler);
    this.init();
  }

  genGuid() {
    let rand = parseInt(Math.random() * 1000000000).toString(16);
    let timestamp = new Date().getTime().toString(16);
    let thex = ('0000000000000000' + timestamp).substr(-16);
    let rhex = ('000000000000' + rand).substr(-12);
    return '7773' + thex + rhex;
  }

  str2Buffer(str) {
    let length = str.length;
    str = str.replace(/^0x|\s|:/gm, '');
    if ((length & 1) == 1) {
      str = '0' + str;
    }

    let index = 0;
    let bufArr = [];
    while (index < length) {
      bufArr[index / 2] = parseInt(str.substr(index, 2), 16);
      index += 2;
    }

    return Buffer.from(bufArr);
  }
};