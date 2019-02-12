const Log4js = require('log4js');
const moment = require('moment');
Log4js.addLayout('json', function () {
  return function (logEvent) {
    logEvent.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    for (let key in logEvent.data[0]) {
      if (logEvent.data[0].hasOwnProperty(key)) {
        logEvent[key] = logEvent.data[0][key];
      }
    }
    logEvent.timestamp = (moment().unix()).toString();
    delete logEvent.startTime;
    delete logEvent.pid;
    delete logEvent.data;
    delete logEvent.categoryName;
    delete logEvent.level;
    delete logEvent.context;
    return JSON.stringify(logEvent)
  }
});

Log4js.configure({
  appenders: {
    out: {
      type: 'stdout'
    },
    json_broadcast: {
      type: "file",
      layout: {
        type: 'json'
      },
      filename: "/root/logs/logtail/broadcast.log",
      maxLogSize: 512 * 1024 * 1024,
      backups: 4
    },
    json_alarm: {
      type: "file",
      layout: {
        type: 'json'
      },
      filename: "/root/logs/logtail/alarm.log",
      maxLogSize: 512 * 1024 * 1024,
      backups: 4
    },
    json_data_native: {
      type: "file",
      layout: {
        type: 'json'
      },
      filename: `/root/logs/logtail/data-native.log`,
      maxLogSize: 512 * 1024 * 1024,
      backups: 4
    },
    json_data_native_douyu: {
      type: "file",
      layout: {
        type: 'json'
      },
      filename: `/root/logs/logtail/data-native-douyu.log`,
      maxLogSize: 512 * 1024 * 1024,
      backups: 4
    },
    json_data_native_huya: {
      type: "file",
      layout: {
        type: 'json'
      },
      filename: `/root/logs/logtail/data-native-huya.log`,
      maxLogSize: 512 * 1024 * 1024,
      backups: 4
    },
    json_data_native_longzhu: {
      type: "file",
      layout: {
        type: 'json'
      },
      filename: `/root/logs/logtail/data-native-longzhu.log`,
      maxLogSize: 512 * 1024 * 1024,
      backups: 4
    },
    json_data_native_quanmin: {
      type: "file",
      layout: {
        type: 'json'
      },
      filename: `/root/logs/logtail/data-native-quanmin.log`,
      maxLogSize: 512 * 1024 * 1024,
      backups: 4
    },
    json_data_native_zhanqi: {
      type: "file",
      layout: {
        type: 'json'
      },
      filename: `/root/logs/logtail/data-native-zhanqi.log`,
      maxLogSize: 512 * 1024 * 1024,
      backups: 4
    },
    json_data_native_chushou: {
      type: "file",
      layout: {
        type: 'json'
      },
      filename: `/root/logs/logtail/data-native-chushou.log`,
      maxLogSize: 512 * 1024 * 1024,
      backups: 4
    },
    json_data_native_panda: {
      type: "file",
      layout: {
        type: 'json'
      },
      filename: `/root/logs/logtail/data-native-panda.log`,
      maxLogSize: 512 * 1024 * 1024,
      backups: 4
    },
    json_data_native_fanxing: {
      type: "file",
      layout: {
        type: 'json'
      },
      filename: `/root/logs/logtail/data-native-fanxing.log`,
      maxLogSize: 512 * 1024 * 1024,
      backups: 4
    },
    json_data_native_huoshan: {
      type: "file",
      layout: {
        type: 'json'
      },
      filename: `/root/logs/logtail/data-native-huoshan.log`,
      maxLogSize: 512 * 1024 * 1024,
      backups: 4
    },
    json_data_native_yy: {
      type: "file",
      layout: {
        type: 'json'
      },
      filename: `/root/logs/logtail/data-native-yy.log`,
      maxLogSize: 512 * 1024 * 1024,
      backups: 4
    }
  },
  categories: {
    default: {
      appenders: ['out'],
      level: 'info'
    },
    logtail_broadcast: {
      appenders: ['json_broadcast'],
      level: 'info'
    },
    logtail_alarm: {
      appenders: ['json_alarm'],
      level: 'info'
    },
    logtail_data_native: {
      appenders: ['json_data_native'],
      level: 'info'
    },
    logtail_data_native_douyu: {
      appenders: ['json_data_native_douyu'],
      level: 'info'
    },
    logtail_data_native_huya: {
      appenders: ['json_data_native_huya'],
      level: 'info'
    },
    logtail_data_native_longzhu: {
      appenders: ['json_data_native_longzhu'],
      level: 'info'
    },
    logtail_data_native_zhanqi: {
      appenders: ['json_data_native_zhanqi'],
      level: 'info'
    },
    logtail_data_native_quanmin: {
      appenders: ['json_data_native_quanmin'],
      level: 'info'
    },
    logtail_data_native_chushou: {
      appenders: ['json_data_native_chushou'],
      level: 'info'
    },
    logtail_data_native_fanxing: {
      appenders: ['json_data_native_fanxing'],
      level: 'info'
    },
    logtail_data_native_huoshan: {
      appenders: ['json_data_native_huoshan'],
      level: 'info'
    },
    logtail_data_native_yy: {
      appenders: ['json_data_native_yy'],
      level: 'info'
    },
    logtail_data_native_panda: {
      appenders: ['json_data_native_panda'],
      level: 'info'
    },
    logtail_data_native_xypanda: {
      appenders: ['json_data_native_panda'],
      level: 'info'
    }
  }
});

module.exports = Log4js;
