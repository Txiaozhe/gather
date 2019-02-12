/**
 * Creator: Tang Xiaoji
 * Time: 2018-07-05
 */

'use strict';

// const Gift = require('../gather/lib/gift');

// const giftHelper = Gift.getInstance();

// giftHelper.initGift(8888888832032291, 'xypanda').then(r => console.log(r)).catch(e => console.log(e));

const fs = require('fs');
const util = require('../gather/lib/util');
util.getGiftList().then(r => {
  const gifts = JSON.parse(r.text).data;
  console.log(gifts)
  fs.writeFile('./gift.json', JSON.stringify(gifts.list), () => {})
}).catch(e => console.log(e))