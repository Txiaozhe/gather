const EventEmitter = require('events');
const config = require('../config/config');
const Logger = require('../config/Logger');
const logger = new Logger('danmuindex');
const Danmu = {
  douyu: require('./Douyu'),
  panda: require('./Panda'),
  xypanda: require('./XYPanda'),
  zhanqi: require('./Zhanqi'),
  longzhu: require('./Longzhu'),
  chushou: require('./Chushou'),
  huya: require('./HuyaV2'),
  fanxing: require('./KugouH5'),
  yy: require('./YY'),
  huoshan: require('./Huoshan')
};

let TYPE = {};

for (let key of Object.keys(Danmu)) {
  TYPE[key] = key;
}

class DanmuClient extends EventEmitter {
  constructor(type, url, opts) {
    super();
    if (!config.plat.hasOwnProperty(type) || !url) {
      this.initErrorHandler('url error or plat error')
    } else {
      this.type = type;
      this.url = url;
      this.opts = opts;
      this.SocketClass = this.getClient(type, url);
      this.listen();
    }
  }

  getClient(plat, url) {
    try {
      plat = config.plat[config.getRealType(url)] || plat;
      return Danmu[plat];
    } catch (e) {
      logger.error('nothis danmu client', plat, e);
    }
  }

  listen() {
    if(!this.SocketClass) return;
    this.client = new this.SocketClass(this.url, this.opts);
    this.client.on('initerror', this.initErrorHandler.bind(this));
    this.client.on('connect', this.connHandler.bind(this));
    this.client.on('data', this.dataHandler.bind(this));
    this.client.on('error', this.errorHandler.bind(this));
    this.client.on('close', this.closeHandler.bind(this));
    this.client.on('destroy', this.destroyHandler.bind(this));
  }

  restart() {
    if (this.client) {
      this.client.restart();
    }

    return !!this.client;
  }

  // todo： this.client null
  destroy() {
    this.removeAllListeners();
    this.client && this.client.destroy();
  }

  initErrorHandler(error) {
    this.emit('initerror', error);
  }

  connHandler() {
    this.emit('monitor_start');
  }

  dataHandler(data) {
    this.emit('data', data);
  }

  errorHandler(error) {
    this.emit('error', error);
  }

  closeHandler(error) {
    this.emit('close', error);
  }

  destroyHandler() {
    this.emit('monitor_stop');
    this.client = null;
  }
}

module.exports = {
  TYPE,
  DanmuClient
};
