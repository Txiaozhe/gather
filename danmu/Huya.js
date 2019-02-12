const EventEmitter = require('events');
const request = require('superagent');
const vm = require('vm');
const _ = require('lodash');
const userAgent = require('../helper/useragent');
const redis = require('../config/redis');
const config = require('../config/config');
const {
  HUYA,
  TafHandler
} = require('../helper/m.taf');
const Gift = require('../gather/lib/gift');
const giftHelper = Gift.getInstance();

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3486.0 Safari/537.36';
const PC_ROOMINFO_URL_PREFIX = 'http://www.huya.com/';
const M_ROOMINFO_URL_PREFIX = 'http://m.huya.com/';
const ROOMINFO_REG = /var\s+TT_ROOM_DATA\s+=\s*(.+?);var/im;
const PROFILE_REG = /var\s+TT_PROFILE_INFO\s+=\s*(.+?);/im;
const GAMENAME_REG = /(var gameName\s*=\s*[\s\S]*?)<\/script>/i;
const REQ_TIMEOUT = 6000;

module.exports = class Huya extends EventEmitter {
  constructor(url = '') {
    super();
    this.agent = request.agent();
    this.socket = null;
    this.userId = null;
    this.roomId = -1;
    this.roomInfo = null;
    this.url = url;
    this.clientConnHandler = this.clientConnHandler.bind(this);
    this.clientDataHandler = this.clientDataHandler.bind(this);
    this.init();
  }

  async init() {
    let roomInfo, roomDetail;
    try {
      roomInfo = await this.requestRoomInfo();
      roomDetail = await this.requestRoomDetail();
    } catch (e) {
      this.emit('initerror', e);
      return false;
    }

    if (roomInfo && roomDetail) {
      this.userId = new HUYA.UserId();
      this.socket = new TafHandler();
      this.isYanzhi = this.roomInfo.type === 'yanzhi';
      this.socket.addListener('connect', this.clientConnHandler);
    }
  }

  async requestRoomInfo() {
    let parts = this.url.split('/');
    this.roomId = parts[parts.length - 1];
    let roomInfo;
    roomInfo = await redis.get(`STR:REQ:ROOM_INFO:HUYA:${this.roomId}`);
    if (!roomInfo) {
      let url = `${M_ROOMINFO_URL_PREFIX}${this.roomId}`;
      let res = await this.agent
        .get(url)
        .timeout({
          response: REQ_TIMEOUT
        })
        .set('User-Agent', userAgent.mobile);

      if (res.status != 200 || !res.text) {
        throw new Error(`request error ${this.url}`);
      }

      let matches = res.text.match(GAMENAME_REG);
      res = null;
      if (!matches || matches.length < 2) {
        throw new Error('parse error');
      }
      roomInfo = matches[1];
      await redis.set(`STR:REQ:ROOM_INFO:HUYA:${this.roomId}`, roomInfo, 'EX', 60 * 60 * 24);
    }
    let script = new vm.Script(roomInfo, {
      displayErrors: false,
      timeout: 1000
    });
    let sandbox = this.createSandbox();
    let context = vm.createContext(sandbox);
    script.runInContext(context);

    this.roomInfo = {
      yyuid: sandbox.STATINFO.ayyuid,
      topsid: sandbox.TOPSID,
      subsid: sandbox.SUBSID
    };
    return this.roomInfo;
  }

  async requestRoomDetail() {
    let roomDetail, roomPlayer;
    roomDetail = await redis.get(`STR:REQ:ROOM_DETAIL:HUYA:${this.roomId}`);
    roomPlayer = await redis.get(`STR:REQ:ROOM_PLAYER:HUYA:${this.roomId}`);
    if (!roomDetail || !roomPlayer) {
      let url = `${PC_ROOMINFO_URL_PREFIX}${this.roomId}`;
      let res = await this.agent.get(url);
      if (res.status != 200 || !res.text) {
        throw new Error(`request ${PC_ROOMINFO_URL_PREFIX} error`);
      }

      let matches_info = res.text.match(ROOMINFO_REG);
      if (matches_info.length < 2) {
        throw new Error(`get roomdetail request error ${this.url}`);
      }
      roomDetail = matches_info[1];
      try {
        roomDetail = JSON.parse(roomDetail);
        await redis.set(`STR:REQ:ROOM_DETAIL:HUYA:${this.roomId}`, matches_info[1], 'EX', 60 * 60 * 24);
      } catch (e) {
        throw e;
      }
      let matches_profile = res.text.match(PROFILE_REG);
      res = null;
      if (matches_profile.length < 2) {
        throw new Error(`match error ${this.url}`);
      }
      roomPlayer = matches_profile[1];
      try {
        roomPlayer = JSON.parse(roomPlayer);
        await redis.set(`STR:REQ:ROOM_PLAYER:HUYA:${this.roomId}`, matches_profile[1], 'EX', 60 * 60 * 24);
      } catch (e) {
        throw e;
      }
    }
    this.roomInfo.detail = roomDetail;
    this.roomInfo.player = roomPlayer;
    let {
      detail,
      player
    } = this.roomInfo;
    this.monitorInfo = {
      user_id: player.yyid,
      user_nick: player.nick,
      room_id: player.yyid,
      room_nick: player.nick,
      cate_id: detail.gid,
      cate_name: detail.gameFullName
    };
    return this.roomInfo;
  }

  clientHeartBeat() {
    let req = new HUYA.UserHeartBeatReq;
    let userId = new HUYA.UserId;
    let ua = USER_AGENT.toLowerCase();
    userId.sHuYaUA = /android/g.test(ua) ? "adr_wap" : "ios_wap";
    req.tId = userId;
    req.lTid = this.roomInfo.topsid;
    req.lSid = this.roomInfo.subsid;
    req.lShortTid = 0;
    req.lPid = this.roomInfo.yyuid;
    req.bWatchVideo = true;
    req.eLineType = 1;
    req.iFps = 0;
    req.iAttendee = this.roomInfo.totalCount;
    req.iBandwidth = 0;
    req.iLastHeartElapseTime = 0;
    this.socket.sendWup("onlineui", "OnUserHeartBeat", req);
  }

  clientConnHandler() {
    this.userId.lUid = this.roomInfo.yyuid;
    this.userId.sGuid = '';
    this.userId.sToken = '';
    this.userId.sHuYaUA = 'webh5&1.0.0&websocket';
    this.userId.sCookie = '';

    this.clientHeartBeat();

    clearInterval(this.keepAliveTimer);
    this.keepAliveTimer = setInterval(this.clientHeartBeat.bind(this), 6e4);

    let liveLaunchReq = new HUYA.LiveLaunchReq();
    liveLaunchReq.tId = this.userId;
    liveLaunchReq.tLiveUB.eSource = HUYA.ELiveSource.WEB_HUYA;
    this.socket.sendWup('liveui', 'doLaunch', liveLaunchReq);

    let propsListReq = new HUYA.GetPropsListReq();
    propsListReq.tUserId = this.userId;
    propsListReq.sMd5 = '';
    if (this.isYanzhi) {
      propsListReq.iTemplateType = HUYA.EClientTemplateType.TPL_MIRROR;
    } else {
      propsListReq.iTemplateType = HUYA.EClientTemplateType.TPL_PC;
    }
    propsListReq.sVersion = '';
    this.socket.sendWup('PropsUIServer', 'getPropsList', propsListReq);
    this.socket.addListener('rawdata', this.clientDataHandler);
    this.emit('connect');
  }

  clientDataHandler(data) {
    let ext = data.data;
    switch (data.cmd) {
      case 'doLaunch':
        this.userId.sGuid = ext.sGuid;
        this.register();
        break;
      case 'getPropsList':
        ext.vPropsItemList.value.forEach(gift => {
          let identity = gift.vPropsIdentity || {};
          let value = (identity.value || [])[0];
          let imgsrc = value ? value.sPropsPic24 : '';
          giftHelper.put({
            plat: config.plat.huya,
            gift_id: gift.iPropsId,
            gift_cost: giftHelper.giftCost(gift.iPropsGreenBean, ext.iItemCount),
            isBroadcast: 0,
            token_type: 0,
            gift_name: gift.sPropsName,
            gift_img: imgsrc.slice(0, imgsrc.lastIndexOf('&'))
          })
        });
        break;
      default:
        this.emit('data', [].concat(data));
    }
  }

  restart() {
    this.removeListener('connect', this.clientConnHandler);
    this.removeListener('rawdata', this.clientDataHandler);
    this.socket && this.socket.destroy();
    this.agent = request.agent();
    this.init();
  }

  destroy() {
    clearInterval(this.keepAliveTimer);
    this.emit('destroy');
    this.removeAllListeners();
    this.socket && this.socket.destroy();
  }

  createSandbox() {
    return {
      window: {
        localStorage: {
          getItem: function () {
          }
        }
      }
    };
  }

  register() {
    let wsUserInfo = new HUYA.WSUserInfo();
    wsUserInfo.lUid = this.roomInfo.yyuid;
    wsUserInfo.bAnonymous = 0 == this.roomInfo.yyuid;
    wsUserInfo.sGuid = this.userId.sGuid;
    wsUserInfo.sToken = '';
    wsUserInfo.lTid = this.roomInfo.topsid;
    wsUserInfo.lSid = this.roomInfo.subsid;
    wsUserInfo.lGroupId = 0;
    wsUserInfo.lGroupType = 0;
    this.socket.sendRegister(wsUserInfo);

    const userChannelReq = new HUYA.UserChannelReq();
    userChannelReq.tId = this.userId;
    userChannelReq.lTopcid = this.roomInfo.topsid;
    userChannelReq.lSubcid = this.roomInfo.subsid;
    userChannelReq.sSendContent = '';
    this.socket.sendWup('liveui', 'userIn', userChannelReq);
  }
};
