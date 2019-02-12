/**
 * Creator: Tang Xiaoji
 * Time: 2018-07-21
 */

'use strict';

const md5 = require('md5')
const ws = require('ws')
const config = require('../config/config');
const events = require('events')
const request = require('request-promise')
const to_arraybuffer = require('to-arraybuffer')
const socks_agent = require('socks-proxy-agent')
const { Taf, TafMx, HUYA, List } = require('./lib')
const Gift = require('../gather/lib/gift');
const giftHelper = Gift.getInstance();

const timeout = 30000
const heartbeat_interval = 60000
const fresh_gift_interval = 60 * 60 * 1000
const r = request.defaults({ json: true, gzip: true, timeout: timeout, headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Mobile Safari/537.36' } })

class HuyaV2 extends events {
  constructor(url) {
    super();
    this._emitter = new events.EventEmitter();
    try {
      this._roomid = url.match(/www.huya.com\/(\S*)/)[1];
    } catch (e) {
      this._emitter.emit('initerror', e);
    }
    this._gift_info = {};
    this.msg_list = new List();

    this.start();
  }

  set_proxy(proxy) {
    this._agent = new socks_agent(proxy)
  }

  async _get_chat_info() {
    try {
      let body = await r({
        url: `https://m.huya.com/${this._roomid}`,
        agent: this._agent
      })
      let info = {}
      let subsid_array = body.match(/var SUBSID = '(.*)';/)
      let topsid_array = body.match(/var TOPSID = '(.*)';/)
      let yyuid_array = body.match(/ayyuid: '(.*)',/)
      if (!subsid_array || !topsid_array || !yyuid_array) return
      info.subsid = subsid_array[1] === '' ? 0 : parseInt(subsid_array[1])
      info.topsid = topsid_array[1] === '' ? 0 : parseInt(topsid_array[1])
      info.yyuid = parseInt(yyuid_array[1])
      return info
    } catch (e) {
      this.emit('error', new Error('Fail to get info'))
    }
  }

  async start() {
    if (this._starting) return
    this._starting = true
    this._info = await this._get_chat_info()
    if (!this._info) return this.emit('close', 'noinfo')
    this._main_user_id = new HUYA.UserId()
    this._main_user_id.lUid = this._info.yyuid
    this._main_user_id.sHuYaUA = "webh5&1.0.0&websocket"
    this._start_ws()
  }

  _start_ws() {
    this._client = new ws('ws://ws.api.huya.com', {
      perMessageDeflate: false,
      agent: this._agent
    })
    this._client.on('open', () => {
      this._get_gift_list()
      this._bind_ws_info()
      this._heartbeat()
      this._heartbeat_timer = setInterval(this._heartbeat.bind(this), heartbeat_interval)
      this._fresh_gift_list_timer = setInterval(this._get_gift_list.bind(this), fresh_gift_interval)
      this.emit('connect')
    })
    this._client.on('error', err => {
      this.emit('error', err)
    })
    this._client.on('close', async () => {
      this._stop()
      this.emit('close')
    })
    this._client.on('message', this._on_mes.bind(this))
  }

  _get_gift_list() {
    let prop_req = new HUYA.GetPropsListReq()
    prop_req.tUserId = this._main_user_id
    prop_req.iTemplateType = HUYA.EClientTemplateType.TPL_MIRROR
    this._send_wup("PropsUIServer", "getPropsList", prop_req)
  }

  _bind_ws_info() {
    let ws_user_info = new HUYA.WSUserInfo;
    ws_user_info.lUid = this._info.yyuid
    ws_user_info.bAnonymous = 0 == this._info.yyuid
    ws_user_info.sGuid = this._main_user_id.sGuid
    ws_user_info.sToken = ""
    ws_user_info.lTid = this._info.topsid
    ws_user_info.lSid = this._info.subsid
    ws_user_info.lGroupId = this._info.yyuid
    ws_user_info.lGroupType = 3
    let jce_stream = new Taf.JceOutputStream()
    ws_user_info.writeTo(jce_stream)
    let ws_command = new HUYA.WebSocketCommand()
    ws_command.iCmdType = HUYA.EWebSocketCommandType.EWSCmd_RegisterReq
    ws_command.vData = jce_stream.getBinBuffer()
    jce_stream = new Taf.JceOutputStream()
    ws_command.writeTo(jce_stream)
    this._client.send(jce_stream.getBuffer())
  }

  _heartbeat() {
    let heart_beat_req = new HUYA.UserHeartBeatReq()
    let user_id = new HUYA.UserId()
    user_id.sHuYaUA = "webh5&1.0.0&websocket"
    heart_beat_req.tId = user_id
    heart_beat_req.lTid = this._info.topsid
    heart_beat_req.lSid = this._info.subsid
    heart_beat_req.lPid = this._info.yyuid
    heart_beat_req.eLineType = 1
    this._send_wup("onlineui", "OnUserHeartBeat", heart_beat_req)
  }

  _on_mes(data) {
    try {
      data = to_arraybuffer(data)
      let stream = new Taf.JceInputStream(data)
      let command = new HUYA.WebSocketCommand()
      command.readFrom(stream)
      switch (command.iCmdType) {
        case HUYA.EWebSocketCommandType.EWSCmd_WupRsp:
          let wup = new Taf.Wup()
          wup.decode(command.vData.buffer)
          let map = new (TafMx.WupMapping[wup.sFuncName])()
          wup.readStruct('tRsp', map, TafMx.WupMapping[wup.sFuncName])
          
          if (wup.sFuncName === 'getPropsList') {
            // 礼物列表
            map.vPropsItemList.value.forEach(gift => {
              let identity = gift.vPropsIdentity || {};
              let value = (identity.value || [])[0];
              let imgsrc = value ? value.sPropsPic24 : '';
              giftHelper.put({
                plat: config.plat.huya,
                gift_id: gift.iPropsId,
                gift_cost: giftHelper.giftCost(gift.iPropsGreenBean, map.iItemCount),
                isBroadcast: 0,
                token_type: 0,
                gift_name: gift.sPropsName,
                gift_img: imgsrc.slice(0, imgsrc.lastIndexOf('&'))
              })
            });
          } else {
            this.emit('data', [].concat({cmd: wup.sFuncName, data: map}));
          }
          break
        case HUYA.EWebSocketCommandType.EWSCmdS2C_MsgPushReq:
          stream = new Taf.JceInputStream(command.vData.buffer)
          let msg = new HUYA.WSPushMessage()
          msg.readFrom(stream)
          stream = new Taf.JceInputStream(msg.sMsg.buffer)
          if (TafMx.UriMapping[msg.iUri]) {
            let map = new (TafMx.UriMapping[msg.iUri])()
            map.readFrom(stream)
            const isPush = this.msg_list.push(md5(JSON.stringify(map)), new Date().getTime());
            isPush && this.emit('data', [].concat({cmd: msg.iUri, data: map}))
          }
          break
        default:
          break
      }
    } catch (e) {
      this.emit('error', e)
    }

  }

  _send_wup(action, callback, req) {
    try {
      let wup = new Taf.Wup()
      wup.setServant(action)
      wup.setFunc(callback)
      wup.writeStruct("tReq", req)
      let command = new HUYA.WebSocketCommand()
      command.iCmdType = HUYA.EWebSocketCommandType.EWSCmd_WupReq
      command.vData = wup.encode()
      let stream = new Taf.JceOutputStream()
      command.writeTo(stream)
      this._client.send(stream.getBuffer())
    } catch (err) {
      this.emit('error', err)
    }
  }

  _stop() {
    this._starting = false
    this._emitter.removeAllListeners()
    clearInterval(this._heartbeat_timer)
    clearInterval(this._fresh_gift_list_timer)
    this._client && this._client.terminate()
  }

  destroy() {
    this.removeAllListeners();
    this._stop();
    this.emit('destroy');
    console.log('--> destroy')
  }
}


module.exports = HuyaV2;
