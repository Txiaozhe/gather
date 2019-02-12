const crypto = require('crypto');
const appSecret= require('../config/config').quanmin.appSecret;

module.exports = function (options) {
  // sign
  let headers = [];
  //1 参数按字典序 排序
  for (let item in options) {
    if (options.hasOwnProperty(item)) {
      headers.push(item);
    }
  }
  headers.sort((a, b) => a < b ? -1 : 1);
  //待加密字符串
  let canonicalizedQueryString = "";
  //2 参数编码
  canonicalizedQueryString = headers.reduce((max, curr) => max + `&${curr}=${options[curr]}`,
    canonicalizedQueryString);
  //3 拼接appSecret
  canonicalizedQueryString +=`&appSecret=${appSecret}`;
  let hash = crypto.createHash('md5');
  hash.update(canonicalizedQueryString.substr(1));
  // logger.trace('options', options);
  return hash.digest().toString('hex').toUpperCase();
};
