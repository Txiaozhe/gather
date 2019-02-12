/**
 *
 * @type {number}
 */

const BUFFER_FLUSH_INTERVAL = 10 * 1000;

class Queue {
  constructor(size, onFlush, recall = true) {
    this.size = size;
    this.onFlush = onFlush;
    this.timer = null;
    this.buffer = [];
    this.recall = recall;
  }

  push(...items) {
    if (items && items.length) {
      this.buffer.push(...items);
    }
    clearTimeout(this.timer);
    if (this.buffer.length >= this.size) {
      this.flush();
    } else {
      if (this.recall) {
        this.timer = setTimeout(this.push.bind(this), BUFFER_FLUSH_INTERVAL);
      }
    }
  }

  /**
   * @param onFlush: (buf: [], err: () => {}) => {}
   */
  flush(onFlush = this.onFlush) {
    const tmp = this.buffer;
    this.buffer = [];
    onFlush && onFlush(tmp, () => {
      this.buffer = this.buffer.concat(tmp);
    });
  }
}

module.exports = Queue;
