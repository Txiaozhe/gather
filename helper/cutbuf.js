module.exports = function(buffer, skip = 0) {
  let stack = 0;
  let contents = [];

  label: for (; buffer.length; ) {
    buffer = buffer.slice(skip);
    for (let i = 0, len = buffer.length; i < len; i++) {
      if (buffer[i] == 0x7b) {
        stack += 1;
      } else if (buffer[i] == 0x7d) {
        stack -= 1;
      }

      if (!stack) {
        contents.push(buffer.slice(0, i + 1).toString("utf-8"));
        buffer = buffer.slice(i + 1);
        continue label;
      }
    }
  }

  return contents;
};
