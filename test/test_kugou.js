/**
 * Creator: Tang Xiaoji
 * Time: 2018-05-07
 */

const danmu = require('../danmu');
const fanxing = new danmu.DanmuClient(danmu.TYPE.Fanxing, 'http://fanxing.kugou.com/19191919');

fanxing.on('connect', () => {
  console.log('connect');
});

fanxing.on('data', (data) => {
  // console.log(data)
});

fanxing.on('error', (err) => {
  console.log('err: ', err);
});
