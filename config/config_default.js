/**
 * Creator: Tang Xiaoji
 * Time: 2018-06-12
 */

'use strict';

const config = {
  app: {
    host: require('ip').address(),
    rpc_port: 6970,
    http_sub_port: 6971
  },
  db_name: {
    fentuan: 'db_fentuan'
  },
  tbl_name: {
    db_fentuan_anchor_info: 'db_fentuan.ods_anchor_disc_i_tbl',
    db_fentuan_taskv2: 'db_fentuan.ods_task_tbl_v2',
    db_fentuan_monitor_v2: 'db_fentuan.ods_task_monitor_tbl_v2',
    db_fentuan_giftlist_v2: 'db_fentuan.ods_gift_list_tbl_v2',
    db_fentuan_anchor_start_time: 'db_fentuan.ods_wb_anchor_start_time_info_tbl',
    db_fentuan_anchor_start_time_history: 'db_fentuan.ods_wb_anchor_start_time_history_info_tbl',
    db_fentuan_anchor_att: 'db_fentuan.ods_anchor_att_i_tbl',
    db_rpt_fentuan_anchor_info_explore: 'db_rpt_fentuan.rpt_dws_anchor_info_explore_a_tbl_i_d',
    db_user_all_room_bind: 'db_user.all_room_bind',
    db_user_operation_info: 'db_user.operation_info',
    db_user_user_room_bind: 'db_user.user_room_bind',
  },
  blockList: [
    'quanmin'
  ],
  // 需要延时重启的平台
  delayList: [
    'chushou',
    'douyu'
  ],
  timeout: {
    nest_check_task: 3 * 1000, // nest 扫描任务的时间间隔 3s
    quanmin_check_task: 5 * 1000, // quanmin扫描任务时间间隔 5s
    recycle_fail_task: 30 * 1000, // 回收失败任务的时间间隔 30s
    no_data_recycle: 5 * 60 * 1000, // 没有数据接收到时回收的时延 5min
    fail_task_wait: 5 * 60 * 1000, // 任务出错时将任务置为错误时的时延 5min
    fail_task_ime: 60 * 1000, // 任务出错时将任务立即置为错误时的时延 1min
    wait_recycle: 8 * 1000, // 机器掉线时回收任务的时延 8s
    quanmin_get_gift: 5 * 60 * 1000, // quanmin更新礼物信息间隔 5min
    update_system_info: 30 * 1000, // 更新cpu、内存信息时间间隔 30s
    check_sub_list: 10 * 60 * 1000, // 检查需长连接的队列 10mim
    quanmin_init_subs: 60 * 60 * 1000 // 全民检查订阅列表
  },
  plat_effective: {
    douyu: 10 * 60,
    huya: 10 * 60,
    quanmin: 10 * 60,
    panda: 10 * 60,
    longzhu: 10 * 60,
    chushou: 20 * 60,
    zhanqi: 10 * 60,
    // yy: 10 * 60, TODO: 开启yy
    fanxing: 10 * 60,
    huoshan: 20 * 60
  },
  plat: {
    douyu: 'douyu',
    quanmin: 'quanmin',
    huya: 'huya',
    panda: 'panda',
    xypanda: 'xypanda',
    longzhu: 'longzhu',
    chushou: 'chushou',
    zhanqi: 'zhanqi',
    yy: 'yy',
    fanxing: 'fanxing',
    huoshan: 'huoshan'
  },
  plat_no: {
    douyu: 1,
    quanmin: 2,
    huya: 3,
    panda: 4,
    xypanda: 4,
    longzhu: 6,
    chushou: 7,
    zhanqi: 8,
    yy: 12,
    fanxing: 14,
    kugou: 14,
    huoshan: 15
  },
  no_plat: {
    1: 'douyu',
    2: 'quanmin',
    3: 'huya',
    4: 'panda',
    6: 'longzhu',
    7: 'chushou',
    8: 'zhanqi',
    12: 'yy',
    14: 'fanxing',
    15: 'huoshan'
  },
  plat_pattern: {
    douyu: /www\.douyu\.com\/\w+(?=\?|$)/i,
    panda: /www\.panda\.tv\/\w+(?=\?|$)/i,
    xypanda: /xingyan\.panda\.tv\/\w+(?=\?|$)/i,
    zhanqi: /www\.zhanqi\.tv\/\w+[\w\/]+(?=\?|$)/i,
    longzhu: /(star|y)\.longzhu\.com\/\w+(?=\?|$)/,
    chushou: /chushou\.tv\/room\/\w+\.htm(?=\?|$)/,
    huya: /www\.huya\.com\/\w+(?=\?|$)/,
    quanmin: /www\.quanmin\.tv\/(\d+|(v|star)\/\w+)(?=\?|$)/,
    fanxing: /fanxing\.kugou\.com\/\w+(?=\?|$)/i,
    // yy: /www\.yy\.com\/\w+\/\w+\?tempId=\w+/i,  todo: 开启yy
    huoshan: /reflow\.huoshan\.com\/share\/(room|user)\/\w+(?=\?|$)/i,
  },
  status: {
    ACCEPT: 0,
    RUNNING: 1,
    CLOSED: 2,
    FAILED: 3
  },
  task_type: {
    START: 'start',
    STOP: 'stop'
  },
  quanmin: {
    target: '10.4.20.70',
    cid: 39,
    appId: 'qmfeb3ecafda826617',
    appSecret: '4032707ac356eba0c0fb2c57dd991b8d',
    host: '101.132.85.192',
    port: '8700',
    gift_key: 'GIFT:KEY:',
    type: {
      AUTH: 1001,
      SUB: 1002,
      UNSUB: 1003,
      HB: 1004,
      BAR: 1005,
      GIFT: 1006
    }
  }
};

// 开关播有序集合
config.SORTED_SET_TASK = function (plat) {
  if (!this.plat[plat]) {
    throw new Error(`plat error: ${plat}`);
  }
  return `ZSET:GATHER-SCAN:LIVING:${plat.toUpperCase()}`;
};

// 开关播主播信息
config.STRING_TASK_INFO = function (plat, rid) {
  if (!this.plat[plat] || !rid) {
    throw new Error(`plat or rid error: ${plat}, ${rid}`);
  }
  return `HASH:GATHER-SCAN:ROOM:${plat.toUpperCase()}:${rid}`;
};

config.HASH_GIFT_MAP = function (plat, gift_id) {
  if (!this.plat[plat] || !gift_id) {
    throw new Error(`plat or rid error: ${plat}, ${gift_id}`);
  }

  return `HASH:GIFT:${plat}:${gift_id}`;
};

config.HASH_DOUYU_GIFT_MAP = function (rid, gid) {
  if (!rid || !gid) {
    throw new Error('room_id or gift_id error');
  }

  return `HASH:DOUYU:GIFT:${rid}:${gid}`;
};

config.STRING_SUB_TASK_KEY = function (plat, rid) {
  if (!plat || !rid || !this.plat[plat]) {
    throw new Error('plat and rid error');
  }
  return `STRING:SUB:TASK:${plat}:${rid}`;
};

config.SET_SUB_TASK_KEY = function (plat) {
  if (!plat || !this.plat[plat]) {
    throw new Error('plat error');
  }
  return `SET:SUB:TASK:${plat}`;
};

config.HUYA_CHAT_ROOMINFO_KRY = function (rid) {
  if (!rid) {
    throw new Error('rid error');
  }
  return `STR:REQ:ROOM_INFO:HUYA:${rid}`;
};

config.TASK_LATEST_UPDATE_TIME_KEY = function (plat) {
  if (!this.plat.hasOwnProperty(plat)) {
    throw new Error('plat error');
  }

  return `STR:GATHER-SCAN-V2:${plat}`;
};

// 礼物任务键
config.LIST_GIFT_TASK_KEY = function (plat) {
  if (!plat) {
    throw new Error('plat error');
  }

  return `LIST:GIFT:TASK:${this.app.host}:${plat}`;
};

config.SET_GATHER_STREAM_NEW = function (plat) {
  if (!plat) {
    throw new Error('plat error');
  }

  return `SET:GATHER:STREAM:NEW:${plat.toUpperCase()}`;
};

config.LIST_ANCHOR_LIVE_REPORT = () => 'LIST:ANCHOR:LIVE:REPORT';

config.getType = function (url) {
  for (let type in this.plat_pattern) {
    const fn = this.plat_pattern[type];
    if (fn instanceof RegExp && fn.test(url)) {
      if (type === this.plat.xypanda) {
        return this.plat.panda;
      }
      return type
    }
  }
};

config.getRealType = function (url) {
  for (let type in this.plat_pattern) {
    const fn = this.plat_pattern[type];
    if (fn instanceof RegExp && fn.test(url)) {
      return type
    }
  }
};

module.exports = config;
