const Conn = require('./Conn');
const request = require('superagent');
const _ = require('lodash');
const base64 = require('base-64');
const voca = require('voca');
const config = require('../config/config');
const Logger = require('../config/Logger');
const logger = new Logger('Zhanqi/danmu');
const Gift = require('../gather/lib/gift');
const giftHelper = Gift.getInstance();
const { proxyRequest } = require('../helper/proxy');

const ROOMINFO_URL = 'https://www.zhanqi.tv/api/public/room.viewer';
const GIFTINFO_URL = 'https://www.zhanqi.tv/api/static/v2.2/gifts/%s.json';
const OROOM_REG = /window.oPageConfig.oRoom\s*=\s*([\s\S]+?);\n/g;
const KEEPALIVE_INTERVAL = 3000;
const REQ_TIMEOUT = 6000;

module.exports = class Zhanqi extends Conn {
  constructor(url = '') {
    super();
    this.url = url;
    this.oroom = null;
    this.roomInfo = null;
    this.serverAddress = null;
    this.isLoginReg = false;
    this.buffer = Buffer.alloc(0);
    this.clientConnHandler = this.clientConnHandler.bind(this);
    this.clientDataHandler = this.clientDataHandler.bind(this);
    this.init();
  }

  async init() {
    let serverAddress, roomInfo, giftInfo;
    try {
      serverAddress = await this.requestServerAddress();
      logger.log('serverAddress: ', serverAddress);
      roomInfo = await this.requestRoomInfo();
      giftInfo = await this.requestGiftInfo();
    } catch (e) {
      logger.error('init', config.plat.zhanqi, e);
      this.emit('initerror', e);
      return;
    }

    if (serverAddress && roomInfo && giftInfo) {
      logger.log('to connect====> ', serverAddress);
      this.on('connect', this.clientConnHandler);
      this.connect(serverAddress.port, serverAddress.ip);
    }
  }

  async requestServerAddress() {
    let res = await request.get(this.url).timeout({
      response: REQ_TIMEOUT
    });
    if (res.status != 200 && !res.text) {
      throw new Error('request error');
    }

    let match = res.text.match(OROOM_REG);
    if (!match || !match.length) {
      throw new Error('request error');
    }

    let body = null;
    try {
      match = match[0];
      match = match.slice(match.indexOf('=') + 1);
      body = JSON.parse(RegExp['$1']);
    } catch (e) {
      throw e;
    }

    this.oroom = body;
    let list = null;
    try {
      let servers = base64.decode(body.flashvars.Servers);
      servers = JSON.parse(servers);
      list = servers.list || [];
    } catch (e) {
      throw e;
    }

    let rand = Math.floor(Math.random() * list.length);
    this.serverAddress = list;
    return list[rand];
  }

  async requestRoomInfo() {
    // const ip = await asyncGetRealIp();
    const targetOptions = {
      // proxy: 'http://' + ip,
      method: 'GET',
      url: ROOMINFO_URL,
      timeout: 8000,
      encoding: null,
    };

    const body = await proxyRequest(targetOptions, 15 * 1000);
    try {
      this.roomInfo = body.data || {};
      this.roomInfo.detail = this.oroom;
    } catch (e) {
      throw e;
    }

    let detail = this.oroom;
    this.monitorInfo = {
      user_id: detail.id,
      user_nick: detail.nickname,
      room_id: detail.id,
      room_nick: detail.nickname,
      cate_id: `${detail.classId}-${detail.gameId}`,
      cate_name: `${detail.className}-${detail.gameName}`
    };

    return this.roomInfo;
  }

  async requestGiftInfo() {
    let url = voca.sprintf(GIFTINFO_URL, this.oroom.id);
    logger.log('gift url: ', GIFTINFO_URL, this.oroom.id, url);
    let res = await request.get(url).timeout({
      response: REQ_TIMEOUT
    });
    let body = null;
    try {
      body = JSON.parse(res.text);
      let giftList = body.data;
      giftList = giftList.map(gift => {
        return {
          plat: config.plat.zhanqi,
          gift_id: gift.id,
          gift_cost: gift.price,
          isBroadcast: 0,
          token_type: 0,
          gift_name: gift.name,
          gift_img: gift.icon
        }
      });

      giftHelper.push(...giftList);
    } catch (e) {
      throw e;
    }

    return body.data;
  }

  destroy() {
    clearTimeout(this.keepaliveTimer);
    super.destroy();
  }

  encode(data) {
    data = JSON.stringify(data);
    let length = data.length;
    let buffer = Buffer.alloc(2 + 4 + 4 + 2 + length);
    buffer.fill(Buffer.from([0xbb, 0xcc, 0x00, 0x00, 0x00, 0x00]), 0, 6);
    buffer.writeUInt32LE(length, 6);
    buffer.fill(Buffer.from([0x10, 0x27]), 10, 12);
    buffer.write(data.toString('ascii'), 12);
    return buffer;
  }

  decode(buffer) {
    let contents = [];
    this.buffer = Buffer.concat([this.buffer, buffer]);

    try {
      label: for (; ;) {
        let pad = this.buffer.readInt16LE(0);
        let ext = this.buffer.readInt32LE(2);
        let length = this.buffer.readUInt32LE(6);
        let cpad = this.buffer.readUInt16LE(12);
        let content = this.buffer.slice(12, 12 + length);
        contents.push(JSON.parse(content));
        this.buffer = this.buffer.slice(2 + 4 + 4 + 2 + length);
      }
    } catch (e) { }

    return contents;
  }

  async keepalive() {
    logger.log('keepalive');
    this.keepaliveTimer = setTimeout(() => {
      this.write(
        Buffer.from([
          0xbb,
          0xcc,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x59,
          0x27
        ]),
        true
      );
      this.keepalive();
    }, KEEPALIVE_INTERVAL);
  }

  clientConnHandler() {
    let roomInfo = this.roomInfo;
    this.on('rawdata', this.clientDataHandler);
    this.write({
      nickname: '',
      roomid: parseInt(this.oroom.id),
      gid: roomInfo.gid,
      sid: roomInfo.sid,
      ssid: roomInfo.sid,
      timestamp: roomInfo.timestamp,
      cmdid: 'loginreq',
      develop_date: '2015-06-07',
      fhost: 'zhanqi.tool',
      fx: 0,
      t: 0,
      thirdacount: '',
      uid: 0,
      ver: 2,
      vod: 0
    });
    logger.log('request...');
  }

  clientDataHandler(data) {
    if (!this.isLoginReg) {
      let index = _.findIndex(data, {
        cmdid: 'getuc'
      });
      if (index > -1) {
        this.isLoginReg = true;
        this.keepalive();
      }
    }

    this.emit('data', data);
  }

  async restart(error) {
    this.isLoginReg = false;
    this.buffer = Buffer.alloc(0);
    clearTimeout(this.keepaliveTimer);
    this.removeListener('connect', this.clientConnHandler);
    this.removeListener('rawdata', this.clientDataHandler);
    this.init();
  }
};
