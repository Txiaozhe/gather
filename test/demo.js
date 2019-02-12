const {
  DanmuClient,
  TYPE
} = require('../danmu');
const util = require('../gather/lib/util');

// node demo https://www.panda.tv/6666

const url = process.argv[2];
const type = util.getType(url);
if (type && TYPE.hasOwnProperty(type)) {
  const c = new DanmuClient(TYPE[type], url)
    .on('monitor_start', data => {
      console.log('start monitor:', data);
    })
    .on('data', data => {
      if(data.type == 'gift'){
        console.log('[D]', (new Date).toLocaleString(), data);
      }
    })
    .on('error', e => {
      console.error('[E]', e && e.message);
      c.restart();
    })
    .on('close', e => {
      console.error('[E] close');
    })
} else if (url) {
  console.error('[E] unsupport url:', url);
} else {
  console.error('[E] missing url param');
}