/**
 * Creator: Tang Xiaoji
 * Time: 2018-07-17
 */

'use strict';

const subs = require('./subs');

module.exports = () => {
  class SubHandler {
    async sub(ctx, next) {
      const {plat, rid} = ctx.request.body;
      if (!rid || !plat) {
        ctx.body = {code: 404, msg: '参数错误'};
        await next();
      } else {
        try {
          await subs.sub(plat, rid);
          ctx.body = {code: 0};
          await next();
        } catch (e) {
          ctx.body = {code: 400, msg: e};
          await next();
        }
      }
    }

    async unSub(ctx, next) {
      const {plat, rid} = ctx.request.body;
      if (!rid || !plat) {
        ctx.body = {code: 404, msg: '参数错误'};
        await next();
      } else {
        try {
          await subs.unSub(plat, rid);
          ctx.body = {code: 0};
          await next();
        } catch (e) {
          ctx.body = {code: 400, msg: e};
          await next();
        }
      }
    }
  }

  return new SubHandler();
};
