const net = require('net');
const JSONSocket = require('json-socket');
const EventEmitter = require('events');
const bluebird = require('bluebird');
const config = require('../../config/config');
const Logger = require('../../config/Logger');
const logger = new Logger('rpc');

const Event = {
  REGISTRY: 'registry',
  ROGER: 'roger',
  CALL: 'call',
  RESPONSE: 'response',
  OK: 'ok'
};

exports.Client = class Client extends EventEmitter {
  constructor(props) {
    super();
    this.props = props;
    this.ready = false;
    this.retry = 0;
    this.ip = '';
    this.timer = null;
    const socket = this.rawSocket = new net.Socket();
    socket.setKeepAlive(true, 15e3);
    socket.on('error', this.errorHandler.bind(this));
    socket.on('close', this.closeHandler.bind(this));
    this.socket = new JSONSocket(socket);
    for (let prop in props) {
      if (prop === 'ip' || typeof this.socket[prop] !== 'undefined') {
        throw new Error(`It is forbidden to define prop '${prop}'`);
      }
    }
    this.socket.on('connect', this.connectHandler.bind(this));
    this.socket.on('message', this.messageHandler.bind(this));
    this.socket.connect(config.nest.rpc_port, config.nest.rpc_host);
  }

  errorHandler(err) {
    logger.error('client error:', 'rpc', err, err.message);
    this.emit('err', err);
  }

  closeHandler() {
    if (this.retry++ > config.opp.bee.max_retry) {
      // TODO alarm
    }
    logger.error('client closed, retry', 'rpc', 'close', this.retry);
    setTimeout(() => {
      this.socket.connect(config.app.rpc_port, config.nest.rpc_host);
    }, config.opp.bee.retry_delay);
    this.emit('close');
  }

  connectHandler() {
    this.ready = true;
    this.retry = 0;
    logger.log('connected to manager');
    this.emit('connect');
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.socket.sendMessage({
        type: Event.OK
      });
    }, 15e3);
  }

  async messageHandler(message) {
    switch (message.type) {
      case Event.ROGER:
        const ip = this.ip = message.ip;
        this.socket.sendMessage({
          type: Event.REGISTRY,
          methods: Object.keys(this.props)
        }, err => {
          if (err) {
            this.emit('err', err);
          } else {
            this.emit('ready', ip);
          }
        });
        break;
      case Event.CALL:
        await this.callHandler(message);
        break;
    }
  }

  async callHandler(message) {
    const method = message.method;
    const index = message.index;
    const args = message.args;
    let result, err = null;
    try {
      result = await this.props[method](...args);
    } catch (e) {
      err = e.message;
      logger.error('exception', 'rpc', e);
      this.emit('err', e);
    }
    this.socket.sendMessage({
      type: Event.RESPONSE,
      index: index,
      error: err,
      data: result
    });
  }
};

exports.Server = class Server extends EventEmitter {
  constructor(cb) {
    super();
    this.callback = {};
    this.callbackIndex = 0;
    this.socket = net.createServer();
    this.socket.on('connection', this.connectHandler.bind(this));
    this.socket.on('error', this.errorHandler.bind(this));
    this.socket.on('close', this.closeHandler.bind(this));
    logger.log(`server listen ${config.app.rpc_port}`);
    this.socket.listen(config.app.rpc_port, config.nest.rpc_host);
    if (typeof cb === 'function') {
      this.on('remote', cb);
    }
  }

  errorHandler(err) {
    // TODO
    logger.error('server error:', 'rpc', err, err.message);
    this.emit('err', err);
  }

  closeHandler() {
    // TODO
    logger.error('rpc', 'rpc', 'server closed');
    this.emit('close');
  }

  connectHandler(socket) {
    const ip = socket.remoteAddress;
    logger.log('remote connect', ip);
    const client = new JSONSocket(socket);
    client.on('message', message => {
      this.remoteMessageHandler(message, client, socket);
    });
    client.on('close', () => {
      this.remoteCloseHandler(ip);
    });
    client.sendMessage({
      type: Event.ROGER,
      ip
    });
    this.emit('remote.connect', socket);
  }

  remoteMessageHandler(message, client, socket) {
    switch (message.type) {
      case Event.REGISTRY:
        this.createRemote(message.methods, client, socket);
        break;
      case Event.RESPONSE:
        this.remoteCallbackHandler(message);
        break;
      case Event.OK:
        // keep alive
        // logger.log('keep alive', socket.remoteAddress);
        break;
    }
  }

  remoteCloseHandler(ip) {
    // TODO
    logger.error('remote close', 'rpc', ip);
    this.emit('remote.close', ip);
  }

  createRemote(methods = [], client, socket) {
    try {
      Object.defineProperty(client, 'ip', {
        enumerable: true,
        value: socket.remoteAddress
      });
      methods.forEach(method => {
        Object.defineProperty(client, method, {
          enumerable: true,
          value: bluebird.promisify((...args) => {
            const index = this.callbackIndex++;
            const cb = args.pop();
            const timer = setTimeout(() => {
              const err = 'call rpc timeout';
              cb(err);
              this.emit('remote.error', err);
            }, 5e3);
            const wrapper = (err, res) => {
              clearTimeout(timer);
              cb(err, res);
            };
            const msg = {
              type: Event.CALL,
              method,
              index,
              args
            };
            this.callback[index] = wrapper;
            client.sendMessage(msg, err => {
              if (err) {
                logger.error('createRemote', 'rpc', err);
                delete this.callback[index];
                wrapper(err);
                this.emit('remote.error', err);
              } else {
                clearTimeout(timer);
              }
            });
          })
        })
      });
      this.emit('remote', client);
    } catch (e) {
      logger.error('createRemote', 'rpc', e);
      this.emit('err', e);
      try {
        socket.destroy();
        socket.end();
      } catch (e) {
      }
    }
  }

  remoteCallbackHandler(message) {
    const cb = this.callback[message.index];
    if (cb) {
      cb(message.error, message.data);
    } else {
      // TODO
      logger.error('remoteCallbackHandler', 'rpc', 'callback not found');
      this.emit('err', 'callback not found');
    }
  }
};
