/**
 * Creator: Tang Xiaoji
 * Time: 2018-05-07
 */

const danmu = require('../danmu');

// let tasks = [];
// let connected = 0;
// let closed = 0;
//
// for(let i = 0; i < 1; i++) {
//   tasks[i] = new danmu.DanmuClient(danmu.TYPE.Fanxing, 'http://fanxing.kugou.com/1428462');
//
//   tasks[i].on('connect', () => {
//     console.log('connect');
//     connected++;
//     console.log('connected: ', connected, ' closed: ', closed);
//   });
//
//   tasks[i].on('data', (data) => {
//     // console.log(data)
//   });
//
//   tasks[i].on('error', (err) => {
//     console.log('err: ', err);
//     closed++;
//     console.log('connected: ', connected, ' closed: ', closed);
//   });
//
//   tasks[i].on('close', () => {
//     console.log('close')
//   });
// }

const fanxing = new danmu.DanmuClient(danmu.TYPE.fanxing, 'http://fanxing.kugou.com/2517805');
console.log(fanxing)

fanxing.on('connect', () => {
  console.log('connect');
});

fanxing.on('data', (data) => {
  console.log(data)
});

fanxing.on('error', (err) => {
  console.log('err: ', err);
});

fanxing.on('close', () => {
  console.log('close')
});

// const Kugou = require('../danmu/KugouH5');
//
// const kugou = new Kugou('http://fanxing.kugou.com/1428462');
//
// kugou.on('connect', () => {
//   console.log(`connect`)
// });
//
// kugou.on('data', (data) => {
//   console.log(data)
// });
//
// kugou.on('error', (err) => {
//   console.log(`error: `, err)
// });
//
// kugou.on('close', () => {
//   console.log('close')
// });