/**
 * Creator: Tang Xiaoji
 * Time: 2018-02-28
 */

const request = require('request');

const fanxing = url => {
  return new Promise((resolve, reject) => {
    request.get(url, (err, res, body) => {
      if (err || res.statusCode !== 200) {
        resolve({info: '找不到直播间'});
      }
      const reg = body && body.toString().match(/roomId: \'(\S*)\',/);
      const rid = reg ? +reg[1] : null;
      if (!rid || Number.isNaN(rid)) {
        resolve({info: '找不到直播间'});
      } else {
        resolve({rid});
      }
    });
  });
};

module.exports = {
  fanxing
};

// fanxing('http://fanxing.kugou.com/2467872').then(r => console.log(r)).catch(e => console.log(e))
