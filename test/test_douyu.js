/**
 *
 * @type {module.Douyu|*}
 */

// const Douyu = require('../danmu/Douyu');
// let connected = 0;
// let closed = 0;
//
// let tasks = [];
// for(let i = 0; i < 600; i++) {
//   tasks[i] = new Douyu('http://www.douyu.com/4601529');
//
//   tasks[i].on('connect', () => {
//     connected++;
//     // console.log(`connect ${i}`)
//     console.log('connected: ', connected, ' closed: ', closed);
//   });
//
//   tasks[i].on('data', (data) => {
//     // console.log(data)
//   });
//
//   tasks[i].on('error', (err) => {
//     // console.log(`error ${i}`, err)
//   });
//
//   tasks[i].on('close', () => {
//     closed++;
//     // console.log(`close ${i}`)
//     console.log('connected: ', connected, ' closed: ', closed);
//   });
// }

const {DanmuClient, TYPE} = require('../danmu');
const douyu = new DanmuClient(TYPE.douyu, 'https://www.douyu.com/1655193');

douyu.on('monitor_start', () => {
  console.log('connect')
});

douyu.on('data', (data) => {
  console.log(data)
});

douyu.on('error', (err) => {
  console.log('error', err)
});

douyu.on('close', () => {
  console.log('close')
});
