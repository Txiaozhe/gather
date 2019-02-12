const WSConn = require('./WSConn');
const request = require('superagent');
const voca = require('voca');
const config = require('../config/config');
const Logger = require('../config/Logger');
const logger = new Logger('Longzhu/danmu');

const ROOMID_URL = 'http://star.longzhu.com/m/%s';
const WS_URL = 'ws://mbgows.plu.cn:8805/?room_id=%s&batch=1&group=0';
const REQ_TIMEOUT = 6000;

module.exports = class Longzhu extends WSConn {
  constructor(url = '') {
    super();
    this.roomId = -1;
    this.url = url;
    this.clientConnHandler = this.clientConnHandler.bind(this);
    this.clientDataHandler = this.clientDataHandler.bind(this);
    this.init();
  }

  async init() {
    let roomId;
    try {
      roomId = await this.requestRoomId();
    } catch (e) {
      logger.error('longzhu init', config.plat.longzhu, e);
      this.emit('initerror', e);
      return false;
    }

    if (roomId) {
      this.on('connect', this.clientConnHandler);
      this.connect(voca.sprintf(WS_URL, this.roomId));
    }
  }

  async requestRoomId() {
    let parts = this.url.split('/');
    let url = voca.sprintf(ROOMID_URL, parts[parts.length - 1]);
    let res = await request.get(url).timeout({
      response: REQ_TIMEOUT
    });

    if (res.status != 200 || !res.text) {
      throw new Error('request error');
    }

    let body = res.text;
    let startIndex = body.indexOf('roomid: "') + 'roomid: "'.length;
    let temp = body.slice(startIndex);
    let endIndex = temp.indexOf('"');
    if (!startIndex || !endIndex) {
      throw new Error('parse error');
    }

    this.roomId = temp.slice(0, endIndex).trim();
    return this.roomId;
  }

  decode(buffer) {
    try {
      buffer = JSON.parse(buffer);
    } catch (e) {}
    return buffer;
  }

  clientConnHandler() {
    this.on('rawdata', this.clientDataHandler);
  }

  clientDataHandler(data) {
    this.emit('data', [].concat(data));
  }

  restart() {
    this.removeListener('connect', this.clientConnHandler);
    this.removeListener('rawdata', this.clientDataHandler);
    this.init();
  }
};