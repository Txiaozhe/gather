/**
 * Creator: Tang Xiaoji
 * Time: 2018-07-16
 */

'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const config = require('../../config/config');
const router = require('./router');
const app = new Koa();
const Logger = require('../../config/Logger');
const logger = new Logger('sub/http');

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(config.app.http_sub_port);
logger.log('sub http server listen in: ', config.app.http_sub_port);

require('./check');
