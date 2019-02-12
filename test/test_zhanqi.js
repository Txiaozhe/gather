/**
 * Creator: Tang Xiaoji
 * Time: 2018-05-23
 */

const Zhanqi = require('../danmu/Zhanqi');
// let connected = 0;
// let closed = 0;

// let tasks = [];
// for(let i = 0; i < 100; i++) {
//   tasks[i] = new Zhanqi('https://www.zhanqi.tv/873062370');
//   console.log('listen', i);
//   tasks[i].on('connect', () => {
//     connected++;
//     // console.log(`connect ${i}`)
//     console.log('connected: ', connected, ' closed: ', closed);
//   });

//   tasks[i].on('data', (data) => {
//     console.log(data)
//   });

//   tasks[i].on('error', (err) => {
//     console.log(`error ${i}`, err)
//   });

//   tasks[i].on('close', () => {
//     closed++;
//     // console.log(`close ${i}`)
//     console.log('connected: ', connected, ' closed: ', closed);
//   });
// }

const zhanqi = new Zhanqi('https://www.zhanqi.tv/8888');
zhanqi.on('connect', () => {
  console.log('connected');
});

zhanqi.on('data', (data) => {
  console.log(data)
});

zhanqi.on('error', (err) => {
  console.log(`error`, err)
});

zhanqi.on('close', () => {
  console.log('connected: ', ' closed: ');
});
