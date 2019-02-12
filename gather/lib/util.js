/**
 * tang xiaoji
 */
const request = require('superagent');
const STRING = 'abcdefghijklmnopqrstuvwxyz0123456789';
const sign = require('../../helper/qmSign');
const crc32 = require('buffer-crc32');
const _ = require('lodash');
const config = require('../../config/config');

exports.getIndexName = prefix => {
  const d = new Date();
  return [
    prefix,
    d.getFullYear(),
    ('0' + (d.getMonth() + 1)).slice(-2),
    ('0' + d.getDate()).slice(-2)
  ].join('');
};

exports.fib = n => {
  let stack = [];
  if (n < 3) {
    return 1;
  }
  stack.push(1);
  stack.push(1);
  let i = 3;
  while (i < n) {
    let tmp1 = stack.pop();
    let tmp2 = stack.pop();
    stack.push(tmp2);
    stack.push(tmp1);
    stack.push(tmp1 + tmp2);
    i++;
  }
  return stack.pop() + stack.pop();
};

exports.getToken = async () => {
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

  return await request.get(url);
};

exports.getGiftList = async () => {
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
  url = 'http://open.quanmin.tv/public/gift/list?' + url.substr(1);

  return await request.get(url);
};

exports.encode = (data) => {
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
};

exports.getIndexName = (prefix) => {
  const d = new Date();
  return [
    prefix,
    d.getFullYear(),
    ('0' + (d.getMonth() + 1)).slice(-2),
    ('0' + d.getDate()).slice(-2)
  ].join('');
};

exports.trimNativeDataInfo = (room, info) => {
  const keys = [
    'anchor_id', 'anchor_nick', 'cate_id',
    'cate_name', 'client_ip', 'room_title',
    'info', 'plat', 'room_id', 'url',
    'room_title'
  ];

  let log = {};
  keys.forEach(key => {
    switch (key) {
      case 'info': {
        log['info'] = JSON.stringify(info);
        break;
      }
      case 'client_ip': {
        log['client_ip'] = config.app.host;
        break;
      }
      case 'plat': {
        if (room.plat === config.plat.xypanda) {
          log['plat'] = config.plat.panda;
          break;
        }
      }
      default: {
        if(room.hasOwnProperty(key)) {
          log[key] = room[key]
        } else {
          log[key] = ''
        }
      }
    }
  });

  return log;
};

exports.sleep = (time = 60 * 1000) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
