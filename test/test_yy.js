/**
 * Creator: Tang Xiaoji
 * Time: 2018-05-07
 */

const danmu = require('../danmu');
const huya = new danmu.DanmuClient(danmu.TYPE.YY, 'http://www.yy.com/25271902/25271902?tempId=16777217');

huya.on('connect', () => {
  console.log('connect');
});

huya.on('data', (data) => {
  // console.log(data)
});

huya.on('error', (err) => {
  console.log('err: ', err);
});
