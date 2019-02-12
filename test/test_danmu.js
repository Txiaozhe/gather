/**
 * Creator: Tang Xiaoji
 * Time: 2018-01-16
 */

const moment = require('moment');
const Socket = require('net').Socket;
const socket = new Socket();

const Log4js = require('../config/log');

const logtail_chat = Log4js.getLogger('logtail_chat');
const logtail_gift = Log4js.getLogger('logtail_gift');

socket.on('error', err => {
  console.log(err);
});

socket.on('timeout', () => {
  console.log('timeout');
});

socket.on('connect', () => {
  console.log('connect');
});

socket.on('data', (buf) => {
  let msg = {};
  let buffer = Buffer.from(buf);
  let offset = 0;
  msg.length = buffer.readInt32LE(offset);
  offset += 4;
  msg.sequence = buffer.readInt32LE(offset);
  offset += 4;
  msg.type = buffer.readInt32LE(offset);
  offset += 4;
  msg.ver = buffer.readInt32LE(offset);
  offset += 4;
  msg.crc = buffer.readInt32LE(offset);
  offset += 4;
  msg.reserve = buffer.readInt32LE(offset);
  offset += 4;
  msg.body = msgPack.decode(buffer.slice(offset, buffer.length));

  switch (msg.type) {
    case 1001: {
      send(1002, {
        owid: []
      });
      offset = 0;
      keepalive();
      break;
    }
    case 1002: {
      offset = 0;
      break;
    }
    case 1004: {
      console.log('心跳...');
      offset = 0;
      break;
    }
    case 1005:
      logtail_chat.info(_trimChat(msg.body));
      offset = 0;
      break;
    case 1006:
      offset = 0;
      break;
  }

  buffer = null;
});

const msgPack = require('msgpack-lite');
const crc32 = require('buffer-crc32');

const request = require('superagent');
const sign = require('../helper/qmSign');
const STRING = 'abcdefghijklmnopqrstuvwxyz0123456789';
const _ = require('lodash');
let n = 8;
let nonceStr = '';
while (n--) {
  nonceStr += STRING.charAt(_.random(0, 35));
}

const options = {
  appId: 'qmfeb3ecafda826617',
  cid: '39',
  nonceStr: nonceStr
};

options.sign = sign(options);

let url = Object.keys(options)
  .reduce((res, curr) => res + `&${curr}=${options[curr]}`, '');
url = 'http://open.quanmin.tv/app/get/token?' + url.substr(1);

console.log(url);

request.get(url).then((res) => {
  const token = res.body.data.token;

  socket.connect('8700', '101.132.85.192');

  send(1001, {
    appId: options.appId,
    token: token
  });
}).catch(err => {
  console.log(err);
});

function send(service, data) {
  let content;
  if (data) {
    content = msgPack.encode(data);
  }
  let tmp = encode({
    service: service,
    content: content
  });
  socket.write(tmp);
}

function encode(data) {
  let {service, content} = data;
  if (!content) {
    content = Buffer.from([]);
  }
  let header = Buffer.alloc(24);
  //length
  header.writeInt32LE(20 + content.length, 0);
  //sequence int随机值
  header.writeInt32LE(_.random(1, Math.pow(2, 31) - 1), 4);
  //type
  header.writeInt32LE(service || 0, 8);
  //ver
  header.writeInt32LE(2, 12);
  //crc
  header.writeUInt32LE(crc32.unsigned(content || 0), 16);
  //reserve
  header.writeUInt32LE(0, 20);
  return Buffer.concat([header, content], 24 + content.length);
}

function keepalive() {
  setTimeout(() => {
    send(1004);
    keepalive();
  }, 10 * 1000);
}

function _trimChat(msg) {
  return JSON.stringify({
    cate_id: -1,
    cate_name: '',
    client_ip: '10.4.20.15',
    datetime: moment().format('YYYY-MM-DD HH-mm-ss'),
    device: 1,
    first_time: -1,
    medal_level: msg.roomAttr.guard,
    plat: 'quanmin',
    room_id: -1,
    room_nick: '',
    timestamp: moment().unix(),
    txt: msg.txt,
    type: 'chat',
    user_id: msg.user.uid,
    user_level: msg.user.level,
    user_nick: msg.user.nickname
  });
}
