/**
 * Creator: Tang Xiaoji
 * Time: 2018-05-21
 */

const Danmu = {
  Douyu: require('../danmu/Douyu'),
  Panda: require('../danmu/Panda'),
  XYPanda: require('../danmu/XYPanda'),
  Zhanqi: require('../danmu/Zhanqi'),
  Longzhu: require('../danmu/Longzhu'),
  Chushou: require('../danmu/Chushou'),
  Huya: require('../danmu/HuyaV2'),
  Kugou: require('../danmu/Kugou'),
  YY: require('../danmu/YY')
};

let TYPE = {};

for (let key of Object.keys(Danmu)) {
  TYPE[key] = key;
}

const PATTERN = {
  douyu: /www\.douyu\.com\/\w+(?=\?|$)/i,
  panda: /www\.panda\.tv\/\w+(?=\?|$)/i,
  xypanda: /xingyan\.panda\.tv\/\w+(?=\?|$)/i,
  zhanqi: /www\.zhanqi\.tv\/\w+[\w\/]+(?=\?|$)/i,
  longzhu: /(star|y)\.longzhu\.com\/\w+(?=\?|$)/,
  chushou: /chushou\.tv\/room\/\w+\.htm(?=\?|$)/,
  huya: /www\.huya\.com\/\w+(?=\?|$)/,
  quanmin: /www\.quanmin\.tv\/(\d+|(v|star)\/\w+)(?=\?|$)/,
  fanxing: /fanxing\.kugou\.com\/\w+(?=\?|$)/i,
  yy: /www\.yy\.com\/\w+\/\w+\?tempId=\w+/i
};

getType = url => {
  for (var type in PATTERN) {
    const fn = PATTERN[type];
    if (fn instanceof RegExp && fn.test(url)) {
      return type;
    } else if (typeof fn === 'function' && fn(url)) {
      return type;
    }
  }
};

valid = (plat, url) => {
  const type = getType(url);
  console.log(plat, type)
  return type && TYPE.hasOwnProperty(type) && plat === type.toLowerCase();
};

console.log(valid('yy', "http://www.yy.com/96397497/96397497?tempId=16777217"));
console.log(valid('douyu', "http://www.douyu.com/12341"));
console.log(valid('quanmin', "https://www.quanmin.tv/12116933"));
