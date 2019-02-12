const HuoshanApi = require('../helper/huoshan/api');
const a = require('./Huoshan');

(async () => {
    await a()
    await HuoshanApi.delay(2000);
    await a()
})()