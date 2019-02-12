module.exports = function pair(content, linesep, sep) {
  let kvs = {};
  content = content.toString("utf-8").split(linesep);
  content.forEach(item => {
    item = item.split(sep);
    if (item.length == 2) {
      kvs[item[0]] = item[1];
    }
  });
  return kvs;
};
