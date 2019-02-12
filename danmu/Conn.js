const EventEmitter = require('events');
const Socket = require('net').Socket;

const SOCKET_TIMEOUT = 3000;

module.exports = class Conn extends EventEmitter {
  constructor() {
    super();
    this.socket = new Socket();
    this.socket.setNoDelay(true);
    this.socket.setTimeout(SOCKET_TIMEOUT);
    this.socket.on('timeout', this.timeoutHandler.bind(this));
    this.socket.on('connect', this.connectHandler.bind(this));
    this.socket.on('data', this.dataHandler.bind(this));
    this.socket.on('close', this.closeHandler.bind(this));
    this.socket.on('error', this.errorHandler.bind(this));
  }

  get destroyed() {
    return this.socket.destroyed;
  }

  connect(port = '8081', host = '127.0.0.1') {
    this.socket.connect(port, host);
  }

  write(data, raw = false) {
    if (!raw && typeof this.encode == 'function') {
      data = this.encode(data);
    }
    this.socket.write(data);
  }

  destroy() {
    this.removeAllListeners();
    this.socket.removeAllListeners();
    this.socket.destroy();
    this.emit('destroy');
  }

  encode(data) {
    return data;
  }

  decode(buffer) {
    return buffer;
  }

  connectHandler() {
    this.emit('connect');
  }

  timeoutHandler() {
    this.emit('timeout');
  }

  dataHandler(buffer) {
    if (typeof this.encode == 'function') {
      buffer = this.decode(buffer);
    }
    this.emit('rawdata', buffer);
  }

  closeHandler() {
    this.emit('close');
  }

  errorHandler(error) {
    this.emit('error', error);
  }
};
