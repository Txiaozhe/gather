/**
 * Creator: Tang Xiaoji
 * Time: 2018-05-07
 */

const {DanmuClient, TYPE} = require('../danmu');
const chushou = new DanmuClient(TYPE.chushou, 'https://chushou.tv/room/7919686.htm');

chushou.on('monitor_start', () => {
  console.log('connect')
});

chushou.on('data', (data) => {
  console.log(data)
});

chushou.on('error', (err) => {
  console.log('error', err)
});

chushou.on('close', () => {
  console.log('close')
});
