/**
 * Creator: Tang Xiaoji
 * Time: 2018-05-07
 */

const danmu = require('../danmu');
const huya = new danmu.DanmuClient(danmu.TYPE.longzhu, 'http://star.longzhu.com/126244?from=challcontent');

huya.on('monitor_start', () => {
  console.log('connect');
});

huya.on('data', (data) => {
  console.log(data)
});

huya.on('error', (err) => {
  console.log('err: ', err);
});

