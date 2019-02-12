const EventEmitter = require('events');
const WebSocket = require('websocket').client;

const SOCKET_TIMEOUT = 3000;

module.exports = class WSConn extends EventEmitter {
  constructor() {
    super();
    this.destroyed = false;
    this.connection = null;
    this.socket = new WebSocket();
    this.socket.on('connect', this.connectHandler.bind(this));
    this.socket.on('connectFailed', this.connectFaildHandler.bind(this));
  }

  connect(url = '') {
    this.destroyed = false;
    this.socket.connect(url);
  }

  write(data, raw = false) {
    if (!raw && typeof this.encode == 'function') {
      data = this.encode(data);
    }
    this.socket.write(data);
  }

  destroy() {
    this.destroyed = true;
    if (this.connection) {
      this.connection.removeAllListeners();
      this.connection.close();
    }
    this.socket.removeAllListeners();
    this.socket.abort();
    this.emit('destroy');
    this.removeAllListeners();
  }

  encode(data) {
    return data;
  }

  decode(buffer) {
    return buffer;
  }

  connectHandler(connection) {
    connection.on('message', this.dataHandler.bind(this));
    connection.on('close', this.closeHandler.bind(this));
    connection.on('error', this.errorHandler.bind(this));

    if (this.connection) {
      this.connection.removeAllListeners();
      this.connection = null;
    }

    this.connection = connection;
    this.emit('connect');
  }

  connectFaildHandler() {
    this.destroyed = true;
    this.emit('error', new Error('connect failded'));
    this.emit('close');
  }

  dataHandler(buffer) {
    if (typeof this.decode == 'function') {
      buffer = this.decode(buffer);
    }
    this.emit('rawdata', buffer);
  }

  closeHandler() {
    this.destroyed = true;
    this.emit('close');
  }

  errorHandler(error) {
    this.destroyed = true;
    this.emit('error', error);
  }
};
