/**
 * 
 */

const Inke = require('../danmu/Inke');
let inke = new Inke('http://www.inke.cn/live.html?uid=707750875&id=1534318348133212');

inke.on('connect', () => {
  console.log('connect2');
});

inke.on('data', (data) => {
  console.log(data)
});

inke.on('error', (err) => {
  console.log('err: ', err);
});

inke.on('initerror', (err) => {
  console.log('initerr: ', err);
});

inke.on('close', (err) => {
  console.log('close: ', err);
});

inke.on('destroy', (err) => {
  console.log('destroy: ', err);
});