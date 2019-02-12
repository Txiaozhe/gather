/**
 * Creator: Tang Xiaoji
 * Time: 2018-03-07
 */

const http = require('../../config/http');
const anchor = require('./anchor');
const rp = require('request-promise');

const Plat = {
  douyu: async (url) => {
    const info = await http.Get(url);
    return info.toString().replace(/\r\n/g, '').replace(/\s/g, '').match(/<span>直播公告(\S*)class="columnrec"/, )[1].match(/column-cotent">(\S*)<\/p>/)[1] || '';
  },

  huya: async (url) => {
    const info = await http.Get(url);
    return info.toString().replace(/\r\n/g, '').replace(/\s/g, '').match(/J_roomNoticeText">公告:(\S*)room-player-wrap/)[1].match(/(\S*)<\/span>/)[1] || '';
  },

  longzhu: async (url) => {
    const info = await http.Get(url);
    return info.toString().replace(/\r\n/g, '').replace(/\s/g, '').match(/Desc":"(\S*)","Type"/)[1] || '';
  },

  panda: async (url) => {
    if(url.match(/xingyan/)) {
      const info = await http.Get(url);
      const utf8 = info.toString().replace(/\r\n/g, '').replace(/\s/g, '').match(/signature":"(\S*)","is_anchor/)[1] || '';
      return unescape(utf8.replace(/\\u/g, '%u'));
    }
    const info = await http.Get(url);
    const utf8 = info.toString().replace(/\r\n/g, '').replace(/\s/g, '').match(/bulletin":"(\S*)","details/)[1] || '';
    return unescape(utf8.replace(/\\u/g, '%u'));
  },

  quanmin: async (url) => {
    const info = await http.Get(url);
    const r1 = info.toString().replace(/\r\n/g, '').replace(/\s/g, '').match(/"announcement":"(\S*)","play_at":"\d{4}-\d{2}-\d{4}/)[1] || '';
    if (r1) {
      return r1.match(/(\S*)","play_at":"\d{4}-\d{2}-\d{4}/)[1] || ''
    }

    return ''
  },

  zhanqi: async (url) => {
    const info = await http.Get(url);
    return info.toString().replace(/\r\n/g, '').replace(/\s/g, '').match(/js-room-notice-item">(\S*)js-room-notice-item"/)[1].match(/(\S*)<\/p><pclass="contjs-room-notice-item">/)[1] || '';
  },

  fanxing: async (url) => {
    const res = await anchor.fanxing(url);
    if (res.info) {
      return '';
    }
    const roomInfoUrl = `http://visitor.fanxing.kugou.com/VServices/RoomService.RoomService.getInfo/${res.rid}/`;
    const info = await rp({
      uri: roomInfoUrl,
      headers: {
        'Host': 'visitor.fanxing.kugou.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.7 Safari/537.36',
        'Referer': `http://fanxing.kugou.com/${res.rid}`,
      }
    });
    let data = info.match(/\((.+)\)/)[1];
    data = JSON.parse(data);
    return data.data && data.data.publicMesg || '';
  }
};

const notice = module.exports = async (plat, url) => {
  if(!plat || !Plat[plat]) {
    return '';
  }
  
  try {
    return await Plat[plat](url);
  } catch (e) {
    return ''
  }
};

// notice('quanmin', 'https://www.quanmin.tv/13359230').then(r => console.log(r)).catch(e => console.log(e));
