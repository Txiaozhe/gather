/**
 * Creator: Tang Xiaoji
 * Time: 2018-07-20
 */

'use strict';


// const Huya = require('../danmu/H');
// const client = new Huya('https://www.huya.com/kaerlol');

const danmu = require('../danmu');
const client = new danmu.DanmuClient(danmu.TYPE.huya, 'http://www.huya.com/baozha');

client.on('monitor_start', () => {
  console.log(`已连接huya 房间弹幕~`)
});

client.on('data', data => {
  console.log(data)
});

client.on('error', e => {
  console.log(e)
});

client.on('close', () => {
  console.log('close')
});

client.on('initerror', e => {
  console.log(e)
});
 