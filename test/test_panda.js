/**
 * Creator: Tang Xiaoji
 * Time: 2018-05-11
 */

const Panda = require('../danmu/Panda');
const moment = require('moment');

const panda = new Panda('https://www.panda.tv/2115408');

panda.on('connect', () => {
  console.log('connect')
});

panda.on('data', (data) => {
  console.log(data[0].data)
});

panda.on('error', (err) => {
  console.log('error', err)
});

panda.on('close', () => {
  console.log('close');
  console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
});
