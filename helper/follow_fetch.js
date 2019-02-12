/**
 * Creator: Tang Xiaoji
 * Time: 2018-05-28
 */

const redis = require('../gather/lib/redisClient').getInstance();
const Follow_Redis_Key = 'RID:PLAT:FOLLOW';
const http = require('./http');
const rp = require('request-promise');

const _getFollowFromRedis = async function (rid, plat) {
  try {
    const follow = await redis.get(`${Follow_Redis_Key}:${rid}:${plat.toUpperCase()}`);
    return [null, parseInt(follow) || 0];
  } catch (e) {
    return [e];
  }
};

const _setFollowToRedis = async function (rid, plat, follow) {
  try {
    const res = await redis.set(`${Follow_Redis_Key}:${rid}:${plat.toUpperCase()}`, follow);
    return [null, res];
  } catch (e) {
    return [e];
  }
};

/**
 *
 * @param task {room_id, anchor_id, url, plat}
 * @returns {Promise<*>}
 */
const chushou = async function (task) {
  try {
    let res;
    try {
      res = await http.Get(task.url);
    } catch (e) {
      res = await retry(task.url);
    }
    if(!res) {
      return await _getFollowFromRedis(task.room_id, task.plat);
    }

    let follow = res.text.match(/data-subscribercount="(\S*)">/)[1];
    follow = parseInt(follow);
    if(follow >= 0) {
      await _setFollowToRedis(task.room_id, task.plat, follow);
      return [null, follow];
    } else {
      return await _getFollowFromRedis(task.room_id, task.plat);
    }
  } catch (e) {
    return await _getFollowFromRedis(task.room_id, task.plat);
  }
};

const douyu = async function (task) {
  const url = `http://open.douyucdn.cn/api/RoomApi/room/${task.room_id}`;
  try {
    let res;
    try {
      res = await http.Get(url);
    } catch (e) {
      res = await retry(url);
    }
    if(!res) {
      return await _getFollowFromRedis(task.room_id, task.plat);
    }

    let follow = parseInt(res.body.data.fans_num);
    if(follow >= 0) {
      await _setFollowToRedis(task.room_id, task.plat, follow);
      return [null, follow];
    }

    return await _getFollowFromRedis(task.room_id, task.plat);
  } catch (e) {
    return await _getFollowFromRedis(task.room_id, task.plat);
  }
};

const fanxing = async function (task) {
  try {
    const opts = {
      uri: 'http://fanxing.kugou.com/index.php',
      qs: {
        action: 'userFans',
        id: task.anchor_id
      },
      headers: encodeURIComponent('酷狗直播 3.95.2 rv:3.95.0.1 (iPhone; iPhone OS 9.3.2; zh_CN)')
    };

    const res = await rp(opts);
    let count = res.match(/<em>TA的粉丝<\/em><em style="margin:0 5px 0 10px;">(\S*)<\/em>/)[1];
    count = parseInt(count);
    if(count >= 0) {
      await _setFollowToRedis(task.room_id, task.plat, count);
      return [null, count];
    }

    return await _getFollowFromRedis(task.room_id, task.plat);
  } catch (e) {
    return await _getFollowFromRedis(task.room_id, task.plat);
  }
};

const huya = async function (task) {
  try {
    const queryParams = {
      from_key: '',
      from_type: 1,
      to_key: parseInt(task.anchor_id),
      to_type: 2,
      _: + new Date()
    };

    let res;
    try {
      res = await http.Get(`http://api.huya.com/subscribe/getSubscribeStatus`, '', queryParams);
    } catch (e) {
      res = await retry(`http://api.huya.com/subscribe/getSubscribeStatus`, '', queryParams);
    }
    if(!res) {
      return await _getFollowFromRedis(task.room_id, task.plat);
    }

    const follow = parseInt(JSON.parse(res.text)['subscribe_count']);
    if(follow >= 0) {
      await _setFollowToRedis(task.room_id, task.plat, follow);
      return [null, follow];
    }

    return await _getFollowFromRedis(task.room_id, task.plat);
  } catch (e) {
    return await _getFollowFromRedis(task.room_id, task.plat);
  }
};

const longzhu = async function (task) {
  try {
    const domain = task.url.match(/star.longzhu.com\/(\S*)/)[1];
    let res;
    let url = `http://yoyo-api.longzhu.com/api/room/init?domain=${domain}`;
    try {
      res = await http.Get(url);
    } catch (e) {
      res = await retry(url);
    }
    if(!res) {
      return await _getFollowFromRedis(task.room_id, task.plat);
    }

    const follow = parseInt(JSON.parse(res.text).data.baseInfo.followCnt);
    if(follow >= 0) {
      await _setFollowToRedis(task.room_id, task.plat, follow);
      return [null, follow];
    }

    return await _getFollowFromRedis(task.room_id, task.plat);
  } catch (e) {
    return await _getFollowFromRedis(task.room_id, task.plat);
  }
};

const panda = async function (task) {
  if(task.plat !== 'panda') {
    task.plat = 'panda';
  }
  try {
    if (task.url.match(/xingyan/)) {
      const queryParams = {
        xid: parseInt(task.room_id),
        _: + new Date()
      };

      let res;
      try {
        res = await http.Get('https://web.api.xingyan.panda.tv/room/baseinfo', '', queryParams);
      } catch (e) {
        res = await retry('https://web.api.xingyan.panda.tv/room/baseinfo', '', queryParams);
      }
      if(!res) {
        return await _getFollowFromRedis(task.room_id, task.plat);
      }

      const follow = parseInt(JSON.parse(res.text)['data']['fansnum']);
      if(follow >= 0) {
        return [null, follow];
      }

      return await _getFollowFromRedis(task.room_id, task.plat);
    } else {
      const queryParams = {
        token: '',
        roomid: parseInt(task.room_id),
        _: + new Date()
      };

      let res;
      try {
        res = await http.Get('https://www.panda.tv/room_followinfo', '', queryParams);
      } catch (e) {
        res = await retry('https://www.panda.tv/room_followinfo', '', queryParams);
      }
      if(!res) {
        return await _getFollowFromRedis(task.room_id, task.plat);
      }

      const follow = parseInt(JSON.parse(res.text)['data']['fans']);
      if(follow >= 0) {
        return [null, follow];
      }

      return await _getFollowFromRedis(task.room_id, task.plat);
    }
  } catch (e) {
    return await _getFollowFromRedis(task.room_id, task.plat);
  }
};

const quanmin = async function (task) {
  try {
    let res;
    try {
      res = await http.Get(task.url);//"room_w-title_favnum c-icon_favnum"
    } catch (e) {
      res = await retry(task.url);
    }
    if(!res) {
      return await _getFollowFromRedis(task.room_id, task.plat);
    }

    let follow = res.text.match(/room_w-title_favnum c-icon_favnum">(\S*)<\/span>/)[1];
    follow = parseInt(follow.replace(/,/g,''));
    if(follow >= 0) {
      return [null, follow];
    }

    return await _getFollowFromRedis(task.room_id, task.plat);
  } catch (e) {
    return await _getFollowFromRedis(task.room_id, task.plat);
  }
};

const zhanqi = async function (task) {
  try {
    let res;
    try {
      res = await http.Get(task.url);
    } catch (e) {
      res = await retry(task.url);
    }
    if(!res) {
      return await _getFollowFromRedis(task.room_id, task.plat);
    }

    let match = res.text.match(/"follows":\s*"([\s\S]+?)"/i);
    let follow = (match && match[1]) ? match[1] : 0;
    if(follow >= 0) {
      return [null, follow];
    }

    return await _getFollowFromRedis(task.room_id, task.plat);
  } catch (e) {
    return await _getFollowFromRedis(task.room_id, task.plat);
  }
};

async function retry(args) {
  const max_retry = 3;
  for(let i = 0; i < max_retry; i++) {
    try {
      return await http.Get(...args);
    } catch (e) {

    }
  }
  return 0;
}

const fetch = {
  chushou,
  douyu,
  fanxing,
  huya,
  longzhu,
  panda,
  quanmin,
  zhanqi,
  yy: null
};

const query = module.exports = (task) => {
  if(!task.room_id || !task.anchor_id || !task.url || !task.plat) {
    return [new Error('param error')]
  }

  if(task.plat === 'xypanda') {
    return fetch['panda'](task);
  }

  if(typeof fetch[task.plat] !== 'function') {
    return Promise.reject('not a function');
  }

  return fetch[task.plat](task);
};

// const task = {
//   room_id: 2132118,
//   anchor_id: 2132118,
//   url: 'http://star.longzhu.com/777777',
//   plat: 'longzhu'
// };
//
// const res = query(task).then(res => {
//   const [err, follow] = res;
//   if(err) {
//     console.log(err)
//   } else {
//     console.log(follow)
//   }
// }).catch(e => {
//   console.log(e)
// });
