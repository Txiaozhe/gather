/**
 * Creator: Tang Xiaoji
 * Time: 2018-07-17
 */

'use strict';

const Router = require('koa-router');
const router = new Router();

const hdl_sub = require('./handler')();

router.post('/sub', hdl_sub.sub);
router.post('/unsub', hdl_sub.unSub);

module.exports = router;
 