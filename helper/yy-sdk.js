const WebSocket = require('websocket').w3cwebsocket;
const events = require('events');
const util = require('util');
const window = {};
let location;

var u = function() {
  this.maxType,
  this.minType,
  this.buffer,
  this.getInt64 = function() {
      var e = this.buffer.getSI32()
        , t = this.buffer.getSI32();
      return this.addToInt64(e, t)
  }
  ,
  this.getUInt64 = function() {
      var e = this.buffer.getUI32()
        , t = this.buffer.getUI32();
      return this.addToUInt64(e, t)
  }
  ,
  this.getInt32 = function() {
      return this.buffer.getSI32()
  }
  ,
  this.getUI32 = function() {
      return this.buffer.getUI32()
  }
  ,
  this.getUI16 = function() {
      return this.buffer.getUI16()
  }
  ,
  this.getUTF8 = function() {
      return this.buffer.getUTF8(this.buffer.getUI16())
  }
  ,
  this.getStrStrMap = function() {
      for (var e = new Object, t = this.buffer.getUI32(), i = 0; i < t; ++i) {
          var n = this.buffer.getUTF8(this.buffer.getUI16())
            , r = this.buffer.getUTF8(this.buffer.getUI16());
          e[n] = r
      }
      return e
  }
  ,
  this.getUintStrMap = function() {
      for (var e = new Object, t = this.buffer.getUI32(), i = 0; i < t; ++i) {
          var n = this.buffer.getUI32()
            , r = this.buffer.getUTF8(this.buffer.getUI16());
          e[n] = r
      }
      return e
  }
  ,
  this.getStrUintMap = function() {
      for (var e = new Object, t = this.buffer.getUI32(), i = 0; i < t; ++i) {
          var n = this.buffer.getUTF8(this.buffer.getUI16())
            , r = this.buffer.getUI32();
          e[n] = r
      }
      return e
  }
  ,
  this.getUintUintMap = function() {
      for (var e = new Object, t = this.buffer.getUI32(), i = 0; i < t; ++i) {
          var n = this.buffer.getUI32()
            , r = this.buffer.getUI32();
          e[n] = r
      }
      return e
  }
  ,
  this.getListStringStringMap = function() {
      for (var e = [], t = this.buffer.getUI32(), i = 0; i < t; ++i) {
          for (var n = new Object, r = this.buffer.getUI32(), o = 0; o < r; ++o) {
              var s = this.buffer.getUTF8(this.buffer.getUI16())
                , a = this.buffer.getUTF8(this.buffer.getUI16());
              n[s] = a
          }
          e.push(n)
      }
      return e
  }
  ,
  this.getListUintStringMap = function() {
      for (var e = [], t = this.buffer.getUI32(), i = 0; i < t; ++i) {
          for (var n = new Object, r = this.buffer.getUI32(), o = 0; o < r; ++o) {
              var s = this.buffer.getUI32()
                , a = this.buffer.getUTF8(this.buffer.getUI16());
              n[s] = a
          }
          e.push(n)
      }
      return e
  }
  ,
  this.addToInt64 = function(e, t) {
      var i = []
        , n = []
        , r = 0
        , o = 1;
      t && (n = this.get32BytesArr(t)),
      e && (i = this.get32BytesArr(e));
      var s = i.concat(n);
      1 == s[s.length - 1] && (this.notArr(s),
      this.add1Arr(s),
      o = -1);
      for (var a = "", l = s.length - 1; l >= 0; l--)
          a += s[l],
          r += s[l] * Math.pow(2, l);
      return r *= o
  }
  ,
  this.get32BytesArr = function(e) {
      for (var t = [], i = Math.abs(e); i > 0; )
          t.push(i % 2),
          i = Math.floor(i / 2);
      for (; t.length < 32; )
          t.push(0);
      return e < 0 && (this.notArr(t),
      this.add1Arr(t)),
      t
  }
  ,
  this.notArr = function(e) {
      for (var t = 0; t < e.length; t++)
          0 == e[t] ? e[t] = 1 : 1 == e[t] && (e[t] = 0)
  }
  ,
  this.add1Arr = function(e) {
      for (var t = 0; t < e.length; t++)
          if (1 == e[t])
              e[t] = 0;
          else if (0 == e[t]) {
              e[t] = 1;
              break
          }
  }
  ,
  this.addToUInt64 = function(e, t) {
      for (var i = [], n = 0; e > 0; )
          i.push(e % 2),
          e = Math.floor(e / 2);
      for (; i.length < 32; )
          i.push(0);
      for (; t > 0; )
          i.push(t % 2),
          t = Math.floor(t / 2);
      for (var r = i.length - 1; r >= 0; r--)
          n += i[r] * Math.pow(2, r);
      return n
  }
}

var sendResponse = function(e, t, i) {
  var r = new u;
  r.maxType = e,
  r.minType = t,
  r.buffer = i,
  r.buffer._offset = 0;
  return onGiftDataCb(r);
}

var onGiftDataCb = function(e) {
  var MSG_MAX_TYPE = 20;
  var PROPS_BROADCAST_MERGE = 4;
  var FREE_PROPS_BROADCAST_MERGE = 1004;
  var t = e.maxType
    , i = e.minType;
  if (t == MSG_MAX_TYPE) {
    let res;
    switch (i) {
      case PROPS_BROADCAST_MERGE:
        res = onPropsBroadcastMerge(e, 0);
        break;
      case FREE_PROPS_BROADCAST_MERGE:
        res = onPropsBroadcastMerge(e, 1);
        break;
    }
    return res;
  }
}

var onPropsBroadcastMerge = function(t, i) {
  for (var l = t.getUI32(), u = 0; u < l; ++u) {
      var c = new Object;
      c.id = t.getUI32(),
      c.num = t.getUI32(),
      c.fromId = t.getUI32(),
      c.toId = t.getUI32(),
      c.fromName = t.getUTF8(),
      c.toName = t.getUTF8();
      // c.detailInfo = t.getStrStrMap(),
      return c;
  }
}

var i, n, o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
  return typeof t
}
  : function (t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
  }
  , a = "function" == typeof Symbol && "symbol" === o(Symbol.iterator) ? function (t) {
    return void 0 === t ? "undefined" : o(t)
  }
    : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : void 0 === t ? "undefined" : o(t)
    }
  ;

  function t(t, e) {
    if (65537 > e && (t.subarray && V || !t.subarray && W))
      return String.fromCharCode.apply(null, J(t, e));
    for (var s = "", i = 0; i < e; i++)
      s += String.fromCharCode(t[i]);
    return s
  }
  function e(t, e, s, i) {
    var n, o = 65535 & t | 0;
    for (t = t >>> 16 & 65535 | 0; 0 !== s;) {
      s -= n = 2e3 < s ? 2e3 : s;
      do {
        o = o + e[i++] | 0,
          t = t + o | 0
      } while (--n); o %= 65521,
        t %= 65521
    }
    return o | t << 16 | 0
  }
  function s(t, e, s, i) {
    var n = Q;
    for (s = i + s,
      t ^= -1; i < s; i++)
      t = t >>> 8 ^ n[255 & (t ^ e[i])];
    return -1 ^ t
  }
  function i(t, e) {
    return t.msg = jt[e],
      e
  }
  function n(t) {
    for (var e = t.length; 0 <= --e;)
      t[e] = 0
  }
  function o(t) {
    var e = t.state
      , s = e.pending;
    s > t.avail_out && (s = t.avail_out),
      0 !== s && (Z(t.output, e.pending_buf, e.pending_out, s, t.next_out),
        t.next_out += s,
        e.pending_out += s,
        t.total_out += s,
        t.avail_out -= s,
        e.pending -= s,
        0 === e.pending && (e.pending_out = 0))
  }
  function r(t, e) {
    var s = 0 <= t.block_start ? t.block_start : -1
      , i = t.strstart - t.block_start
      , n = 0;
    if (0 < t.level) {
      for (t.strm.data_type === ut && (t.strm.data_type = function (t) {
        var e, s = 4093624447;
        for (e = 0; 31 >= e; e++ ,
          s >>>= 1)
          if (1 & s && 0 !== t.dyn_ltree[2 * e])
            return Dt;
        if (0 !== t.dyn_ltree[18] || 0 !== t.dyn_ltree[20] || 0 !== t.dyn_ltree[26])
          return zt;
        for (e = 32; e < ft; e++)
          if (0 !== t.dyn_ltree[2 * e])
            return zt;
        return Dt
      }(t)),
        F(t, t.l_desc),
        F(t, t.d_desc),
        N(t, t.dyn_ltree, t.l_desc.max_code),
        N(t, t.dyn_dtree, t.d_desc.max_code),
        F(t, t.bl_desc),
        n = _t - 1; 3 <= n && 0 === t.bl_tree[2 * $t[n] + 1]; n--)
        ;
      t.opt_len += 3 * (n + 1) + 14;
      var a = t.opt_len + 3 + 7 >>> 3
        , r = t.static_len + 3 + 7 >>> 3;
      r <= a && (a = r)
    } else
      a = r = i + 5;
    if (i + 4 <= a && -1 !== s)
      k(t, (Ht << 1) + (e ? 1 : 0), 3),
        L(t, s, i, !0);
    else if (t.strategy === ht || r === a)
      k(t, (Pt << 1) + (e ? 1 : 0), 3),
        M(t, te, ee);
    else {
      for (k(t, (Jt << 1) + (e ? 1 : 0), 3),
        s = t.l_desc.max_code + 1,
        i = t.d_desc.max_code + 1,
        n += 1,
        k(t, s - 257, 5),
        k(t, i - 1, 5),
        k(t, n - 4, 4),
        a = 0; a < n; a++)
        k(t, t.bl_tree[2 * $t[a] + 1], 3);
      B(t, t.dyn_ltree, s - 1),
        B(t, t.dyn_dtree, i - 1),
        M(t, t.dyn_ltree, t.dyn_dtree)
    }
    T(t),
      e && x(t),
      t.block_start = t.strstart,
      o(t.strm)
  }
  function h(t, e) {
    t.pending_buf[t.pending++] = e
  }
  function l(t, e) {
    t.pending_buf[t.pending++] = e >>> 8 & 255,
      t.pending_buf[t.pending++] = 255 & e
  }
  function u(t, e) {
    var s = t.max_chain_length
      , i = t.strstart
      , n = t.prev_length
      , o = t.nice_match
      , a = t.strstart > t.w_size - mt ? t.strstart - (t.w_size - mt) : 0
      , r = t.window
      , h = t.w_mask
      , l = t.prev
      , u = t.strstart + It
      , d = r[i + n - 1]
      , c = r[i + n];
    t.prev_length >= t.good_match && (s >>= 2),
      o > t.lookahead && (o = t.lookahead);
    do {
      var f = e;
      if (r[f + n] === c && r[f + n - 1] === d && r[f] === r[i] && r[++f] === r[i + 1]) {
        for (i += 2,
          f++; r[++i] === r[++f] && r[++i] === r[++f] && r[++i] === r[++f] && r[++i] === r[++f] && r[++i] === r[++f] && r[++i] === r[++f] && r[++i] === r[++f] && r[++i] === r[++f] && i < u;)
          ;
        if (f = It - (u - i),
          i = u - It,
          f > n) {
          if (t.match_start = e,
            n = f,
            f >= o)
            break;
          d = r[i + n - 1],
            c = r[i + n]
        }
      }
    } while ((e = l[e & h]) > a && 0 != --s); return n <= t.lookahead ? n : t.lookahead
  }
  function d(t) {
    var i, n = t.w_size;
    do {
      var o = t.window_size - t.lookahead - t.strstart;
      if (t.strstart >= n + (n - mt)) {
        Z(t.window, t.window, n, n, 0),
          t.match_start -= n,
          t.strstart -= n,
          t.block_start -= n;
        var a = i = t.hash_size;
        do {
          var r = t.head[--a];
          t.head[a] = r >= n ? r - n : 0
        } while (--i); a = i = n;
        do {
          r = t.prev[--a],
            t.prev[a] = r >= n ? r - n : 0
        } while (--i); o += n
      }
      if (0 === t.strm.avail_in)
        break;
      a = t.strm,
        i = t.window,
        r = t.strstart + t.lookahead;
      var h = a.avail_in;
      if (h > o && (h = o),
        0 === h ? i = 0 : (a.avail_in -= h,
          Z(i, a.input, a.next_in, h, r),
          1 === a.state.wrap ? a.adler = e(a.adler, i, h, r) : 2 === a.state.wrap && (a.adler = s(a.adler, i, h, r)),
          a.next_in += h,
          a.total_in += h,
          i = h),
        t.lookahead += i,
        t.lookahead + t.insert >= Ut)
        for (o = t.strstart - t.insert,
          t.ins_h = t.window[o],
          t.ins_h = (t.ins_h << t.hash_shift ^ t.window[o + 1]) & t.hash_mask; t.insert && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[o + Ut - 1]) & t.hash_mask,
            t.prev[o & t.w_mask] = t.head[t.ins_h],
            t.head[t.ins_h] = o,
            o++ ,
            t.insert-- ,
            !(t.lookahead + t.insert < Ut));)
          ;
    } while (t.lookahead < mt && 0 !== t.strm.avail_in)
  }
  function c(t, e) {
    for (var s; ;) {
      if (t.lookahead < mt) {
        if (d(t),
          t.lookahead < mt && e === $)
          return 1;
        if (0 === t.lookahead)
          break
      }
      if (s = 0,
        t.lookahead >= Ut && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + Ut - 1]) & t.hash_mask,
          s = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h],
          t.head[t.ins_h] = t.strstart),
        0 !== s && t.strstart - s <= t.w_size - mt && (t.match_length = u(t, s)),
        t.match_length >= Ut)
        if (s = O(t, t.strstart - t.match_start, t.match_length - Ut),
          t.lookahead -= t.match_length,
          t.match_length <= t.max_lazy_match && t.lookahead >= Ut) {
          t.match_length--;
          do {
            t.strstart++ ,
              t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + Ut - 1]) & t.hash_mask,
              t.prev[t.strstart & t.w_mask] = t.head[t.ins_h],
              t.head[t.ins_h] = t.strstart
          } while (0 != --t.match_length); t.strstart++
        } else
          t.strstart += t.match_length,
            t.match_length = 0,
            t.ins_h = t.window[t.strstart],
            t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 1]) & t.hash_mask;
      else
        s = O(t, 0, t.window[t.strstart]),
          t.lookahead-- ,
          t.strstart++;
      if (s && (r(t, !1),
        0 === t.strm.avail_out))
        return 1
    }
    return t.insert = t.strstart < Ut - 1 ? t.strstart : Ut - 1,
      e === tt ? (r(t, !0),
        0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (r(t, !1),
          0 === t.strm.avail_out) ? 1 : 2
  }
  function f(t, e) {
    for (var s, i; ;) {
      if (t.lookahead < mt) {
        if (d(t),
          t.lookahead < mt && e === $)
          return 1;
        if (0 === t.lookahead)
          break
      }
      if (s = 0,
        t.lookahead >= Ut && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + Ut - 1]) & t.hash_mask,
          s = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h],
          t.head[t.ins_h] = t.strstart),
        t.prev_length = t.match_length,
        t.prev_match = t.match_start,
        t.match_length = Ut - 1,
        0 !== s && t.prev_length < t.max_lazy_match && t.strstart - s <= t.w_size - mt && (t.match_length = u(t, s),
          5 >= t.match_length && (1 === t.strategy || t.match_length === Ut && 4096 < t.strstart - t.match_start) && (t.match_length = Ut - 1)),
        t.prev_length >= Ut && t.match_length <= t.prev_length) {
        i = t.strstart + t.lookahead - Ut,
          s = O(t, t.strstart - 1 - t.prev_match, t.prev_length - Ut),
          t.lookahead -= t.prev_length - 1,
          t.prev_length -= 2;
        do {
          ++t.strstart <= i && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + Ut - 1]) & t.hash_mask,
            t.prev[t.strstart & t.w_mask] = t.head[t.ins_h],
            t.head[t.ins_h] = t.strstart)
        } while (0 != --t.prev_length); if (t.match_available = 0,
          t.match_length = Ut - 1,
          t.strstart++ ,
          s && (r(t, !1),
            0 === t.strm.avail_out))
          return 1
      } else if (t.match_available) {
        if ((s = O(t, 0, t.window[t.strstart - 1])) && r(t, !1),
          t.strstart++ ,
          t.lookahead-- ,
          0 === t.strm.avail_out)
          return 1
      } else
        t.match_available = 1,
          t.strstart++ ,
          t.lookahead--
    }
    return t.match_available && (O(t, 0, t.window[t.strstart - 1]),
      t.match_available = 0),
      t.insert = t.strstart < Ut - 1 ? t.strstart : Ut - 1,
      e === tt ? (r(t, !0),
        0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (r(t, !1),
          0 === t.strm.avail_out) ? 1 : 2
  }
  function g(t, e, s, i, n) {
    this.good_length = t,
      this.max_lazy = e,
      this.nice_length = s,
      this.max_chain = i,
      this.func = n
  }
  function p(t, e) {
    if (!t || !t.state || e > et || 0 > e)
      return t ? i(t, nt) : nt;
    var a = t.state;
    if (!t.output || !t.input && 0 !== t.avail_in || 666 === a.status && e !== tt)
      return i(t, 0 === t.avail_out ? at : nt);
    a.strm = t;
    var u = a.last_flush;
    if (a.last_flush = e,
      42 === a.status)
      if (2 === a.wrap)
        t.adler = 0,
          h(a, 31),
          h(a, 139),
          h(a, 8),
          a.gzhead ? (h(a, (a.gzhead.text ? 1 : 0) + (a.gzhead.hcrc ? 2 : 0) + (a.gzhead.extra ? 4 : 0) + (a.gzhead.name ? 8 : 0) + (a.gzhead.comment ? 16 : 0)),
            h(a, 255 & a.gzhead.time),
            h(a, a.gzhead.time >> 8 & 255),
            h(a, a.gzhead.time >> 16 & 255),
            h(a, a.gzhead.time >> 24 & 255),
            h(a, 9 === a.level ? 2 : 2 <= a.strategy || 2 > a.level ? 4 : 0),
            h(a, 255 & a.gzhead.os),
            a.gzhead.extra && a.gzhead.extra.length && (h(a, 255 & a.gzhead.extra.length),
              h(a, a.gzhead.extra.length >> 8 & 255)),
            a.gzhead.hcrc && (t.adler = s(t.adler, a.pending_buf, a.pending, 0)),
            a.gzindex = 0,
            a.status = 69) : (h(a, 0),
              h(a, 0),
              h(a, 0),
              h(a, 0),
              h(a, 0),
              h(a, 9 === a.level ? 2 : 2 <= a.strategy || 2 > a.level ? 4 : 0),
              h(a, 3),
              a.status = 113);
      else {
        var c = dt + (a.w_bits - 8 << 4) << 8;
        c |= (2 <= a.strategy || 2 > a.level ? 0 : 6 > a.level ? 1 : 6 === a.level ? 2 : 3) << 6,
          0 !== a.strstart && (c |= 32),
          a.status = 113,
          l(a, c + (31 - c % 31)),
          0 !== a.strstart && (l(a, t.adler >>> 16),
            l(a, 65535 & t.adler)),
          t.adler = 1
      }
    if (69 === a.status)
      if (a.gzhead.extra) {
        for (c = a.pending; a.gzindex < (65535 & a.gzhead.extra.length) && (a.pending !== a.pending_buf_size || (a.gzhead.hcrc && a.pending > c && (t.adler = s(t.adler, a.pending_buf, a.pending - c, c)),
          o(t),
          c = a.pending,
          a.pending !== a.pending_buf_size));)
          h(a, 255 & a.gzhead.extra[a.gzindex]),
            a.gzindex++;
        a.gzhead.hcrc && a.pending > c && (t.adler = s(t.adler, a.pending_buf, a.pending - c, c)),
          a.gzindex === a.gzhead.extra.length && (a.gzindex = 0,
            a.status = 73)
      } else
        a.status = 73;
    if (73 === a.status)
      if (a.gzhead.name) {
        c = a.pending;
        do {
          if (a.pending === a.pending_buf_size && (a.gzhead.hcrc && a.pending > c && (t.adler = s(t.adler, a.pending_buf, a.pending - c, c)),
            o(t),
            c = a.pending,
            a.pending === a.pending_buf_size)) {
            var f = 1;
            break
          }
          f = a.gzindex < a.gzhead.name.length ? 255 & a.gzhead.name.charCodeAt(a.gzindex++) : 0,
            h(a, f)
        } while (0 !== f); a.gzhead.hcrc && a.pending > c && (t.adler = s(t.adler, a.pending_buf, a.pending - c, c)),
          0 === f && (a.gzindex = 0,
            a.status = 91)
      } else
        a.status = 91;
    if (91 === a.status)
      if (a.gzhead.comment) {
        c = a.pending;
        do {
          if (a.pending === a.pending_buf_size && (a.gzhead.hcrc && a.pending > c && (t.adler = s(t.adler, a.pending_buf, a.pending - c, c)),
            o(t),
            c = a.pending,
            a.pending === a.pending_buf_size)) {
            f = 1;
            break
          }
          f = a.gzindex < a.gzhead.comment.length ? 255 & a.gzhead.comment.charCodeAt(a.gzindex++) : 0,
            h(a, f)
        } while (0 !== f); a.gzhead.hcrc && a.pending > c && (t.adler = s(t.adler, a.pending_buf, a.pending - c, c)),
          0 === f && (a.status = 103)
      } else
        a.status = 103;
    if (103 === a.status && (a.gzhead.hcrc ? (a.pending + 2 > a.pending_buf_size && o(t),
      a.pending + 2 <= a.pending_buf_size && (h(a, 255 & t.adler),
        h(a, t.adler >> 8 & 255),
        t.adler = 0,
        a.status = 113)) : a.status = 113),
      0 !== a.pending) {
      if (o(t),
        0 === t.avail_out)
        return a.last_flush = -1,
          st
    } else if (0 === t.avail_in && (e << 1) - (4 < e ? 9 : 0) <= (u << 1) - (4 < u ? 9 : 0) && e !== tt)
      return i(t, at);
    if (666 === a.status && 0 !== t.avail_in)
      return i(t, at);
    if (0 !== t.avail_in || 0 !== a.lookahead || e !== $ && 666 !== a.status) {
      if (3 !== (u = 2 === a.strategy ? function (t, e) {
        for (var s; ;) {
          if (0 === t.lookahead && (d(t),
            0 === t.lookahead)) {
            if (e === $)
              return 1;
            break
          }
          if (t.match_length = 0,
            s = O(t, 0, t.window[t.strstart]),
            t.lookahead-- ,
            t.strstart++ ,
            s && (r(t, !1),
              0 === t.strm.avail_out))
            return 1
        }
        return t.insert = 0,
          e === tt ? (r(t, !0),
            0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (r(t, !1),
              0 === t.strm.avail_out) ? 1 : 2
      }(a, e) : 3 === a.strategy ? function (t, e) {
        for (var s, i, n, o = t.window; ;) {
          if (t.lookahead <= It) {
            if (d(t),
              t.lookahead <= It && e === $)
              return 1;
            if (0 === t.lookahead)
              break
          }
          if (t.match_length = 0,
            t.lookahead >= Ut && 0 < t.strstart && (i = t.strstart - 1,
              (s = o[i]) === o[++i] && s === o[++i] && s === o[++i])) {
            for (n = t.strstart + It; s === o[++i] && s === o[++i] && s === o[++i] && s === o[++i] && s === o[++i] && s === o[++i] && s === o[++i] && s === o[++i] && i < n;)
              ;
            t.match_length = It - (n - i),
              t.match_length > t.lookahead && (t.match_length = t.lookahead)
          }
          if (t.match_length >= Ut ? (s = O(t, 1, t.match_length - Ut),
            t.lookahead -= t.match_length,
            t.strstart += t.match_length,
            t.match_length = 0) : (s = O(t, 0, t.window[t.strstart]),
              t.lookahead-- ,
              t.strstart++),
            s && (r(t, !1),
              0 === t.strm.avail_out))
            return 1
        }
        return t.insert = 0,
          e === tt ? (r(t, !0),
            0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (r(t, !1),
              0 === t.strm.avail_out) ? 1 : 2
      }(a, e) : yt[a.level].func(a, e)) && 4 !== u || (a.status = 666),
        1 === u || 3 === u)
        return 0 === t.avail_out && (a.last_flush = -1),
          st;
      if (2 === u && (1 === e ? (k(a, Pt << 1, 3),
        w(a, Wt, te),
        16 === a.bi_valid ? (y(a, a.bi_buf),
          a.bi_buf = 0,
          a.bi_valid = 0) : 8 <= a.bi_valid && (a.pending_buf[a.pending++] = 255 & a.bi_buf,
            a.bi_buf >>= 8,
            a.bi_valid -= 8)) : e !== et && (k(a, Ht << 1, 3),
              L(a, 0, 0, !0),
              3 === e && (n(a.head),
                0 === a.lookahead && (a.strstart = 0,
                  a.block_start = 0,
                  a.insert = 0))),
        o(t),
        0 === t.avail_out))
        return a.last_flush = -1,
          st
    }
    return e !== tt ? st : 0 >= a.wrap ? it : (2 === a.wrap ? (h(a, 255 & t.adler),
      h(a, t.adler >> 8 & 255),
      h(a, t.adler >> 16 & 255),
      h(a, t.adler >> 24 & 255),
      h(a, 255 & t.total_in),
      h(a, t.total_in >> 8 & 255),
      h(a, t.total_in >> 16 & 255),
      h(a, t.total_in >> 24 & 255)) : (l(a, t.adler >>> 16),
        l(a, 65535 & t.adler)),
      o(t),
      0 < a.wrap && (a.wrap = -a.wrap),
      0 !== a.pending ? st : it)
  }
  function _(t) {
    return (t >>> 24 & 255) + (t >>> 8 & 65280) + ((65280 & t) << 8) + ((255 & t) << 24)
  }
  function v(t, e, s, i) {
    var n = t.state;
    return null === n.window && (n.wsize = 1 << n.wbits,
      n.wnext = 0,
      n.whave = 0,
      n.window = new Uint8Array(n.wsize)),
      i >= n.wsize ? (Z(n.window, e, s - n.wsize, n.wsize, 0),
        n.wnext = 0,
        n.whave = n.wsize) : ((t = n.wsize - n.wnext) > i && (t = i),
          Z(n.window, e, s - i, t, n.wnext),
          (i -= t) ? (Z(n.window, e, s - i, i, 0),
            n.wnext = i,
            n.whave = n.wsize) : (n.wnext += t,
              n.wnext === n.wsize && (n.wnext = 0),
              n.whave < n.wsize && (n.whave += t))),
      0
  }
  function b(t, i) {
    var n = new Uint8Array(4)
      , o = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
    if (!t || !t.state || !t.output || !t.input && 0 !== t.avail_in)
      return nt;
    var a = t.state;
    a.mode === wt && (a.mode = 13);
    var r = t.next_out
      , h = t.output
      , l = t.avail_out
      , u = t.next_in
      , d = t.input
      , c = t.avail_in
      , f = a.hold
      , g = a.bits
      , p = c
      , b = l
      , U = st;
    t: for (; ;)
      switch (a.mode) {
        case 1:
          if (0 === a.wrap) {
            a.mode = 13;
            break
          }
          for (; 16 > g;) {
            if (0 === c)
              break t;
            c-- ,
              f += d[u++] << g,
              g += 8
          }
          if (2 & a.wrap && 35615 === f) {
            a.check = 0,
              n[0] = 255 & f,
              n[1] = f >>> 8 & 255,
              a.check = s(a.check, n, 2, 0),
              g = f = 0,
              a.mode = 2;
            break
          }
          if (a.flags = 0,
            a.head && (a.head.done = !1),
            !(1 & a.wrap) || (((255 & f) << 8) + (f >> 8)) % 31) {
            t.msg = "incorrect header check",
              a.mode = kt;
            break
          }
          if ((15 & f) !== dt) {
            t.msg = "unknown compression method",
              a.mode = kt;
            break
          }
          g -= 4;
          var I = 8 + (15 & (f >>>= 4));
          if (0 === a.wbits)
            a.wbits = I;
          else if (I > a.wbits) {
            t.msg = "invalid window size",
              a.mode = kt;
            break
          }
          a.dmax = 1 << I,
            t.adler = a.check = 1,
            a.mode = 512 & f ? 10 : wt,
            g = f = 0;
          break;
        case 2:
          for (; 16 > g;) {
            if (0 === c)
              break t;
            c-- ,
              f += d[u++] << g,
              g += 8
          }
          if (a.flags = f,
            (255 & a.flags) !== dt) {
            t.msg = "unknown compression method",
              a.mode = kt;
            break
          }
          if (57344 & a.flags) {
            t.msg = "unknown header flags set",
              a.mode = kt;
            break
          }
          a.head && (a.head.text = f >> 8 & 1),
            512 & a.flags && (n[0] = 255 & f,
              n[1] = f >>> 8 & 255,
              a.check = s(a.check, n, 2, 0)),
            g = f = 0,
            a.mode = 3;
        case 3:
          for (; 32 > g;) {
            if (0 === c)
              break t;
            c-- ,
              f += d[u++] << g,
              g += 8
          }
          a.head && (a.head.time = f),
            512 & a.flags && (n[0] = 255 & f,
              n[1] = f >>> 8 & 255,
              n[2] = f >>> 16 & 255,
              n[3] = f >>> 24 & 255,
              a.check = s(a.check, n, 4, 0)),
            g = f = 0,
            a.mode = 4;
        case 4:
          for (; 16 > g;) {
            if (0 === c)
              break t;
            c-- ,
              f += d[u++] << g,
              g += 8
          }
          a.head && (a.head.xflags = 255 & f,
            a.head.os = f >> 8),
            512 & a.flags && (n[0] = 255 & f,
              n[1] = f >>> 8 & 255,
              a.check = s(a.check, n, 2, 0)),
            g = f = 0,
            a.mode = 5;
        case 5:
          if (1024 & a.flags) {
            for (; 16 > g;) {
              if (0 === c)
                break t;
              c-- ,
                f += d[u++] << g,
                g += 8
            }
            a.length = f,
              a.head && (a.head.extra_len = f),
              512 & a.flags && (n[0] = 255 & f,
                n[1] = f >>> 8 & 255,
                a.check = s(a.check, n, 2, 0)),
              g = f = 0
          } else
            a.head && (a.head.extra = null);
          a.mode = 6;
        case 6:
          if (1024 & a.flags) {
            var m = a.length;
            if (m > c && (m = c),
              m && (a.head && (I = a.head.extra_len - a.length,
                a.head.extra || (a.head.extra = Array(a.head.extra_len)),
                Z(a.head.extra, d, u, m, I)),
                512 & a.flags && (a.check = s(a.check, d, m, u)),
                c -= m,
                u += m,
                a.length -= m),
              a.length)
              break t
          }
          a.length = 0,
            a.mode = 7;
        case 7:
          if (2048 & a.flags) {
            if (0 === c)
              break t;
            m = 0;
            do {
              I = d[u + m++],
                a.head && I && 65536 > a.length && (a.head.name += String.fromCharCode(I))
            } while (I && m < c); if (512 & a.flags && (a.check = s(a.check, d, m, u)),
              c -= m,
              u += m,
              I)
              break t
          } else
            a.head && (a.head.name = null);
          a.length = 0,
            a.mode = 8;
        case 8:
          if (4096 & a.flags) {
            if (0 === c)
              break t;
            m = 0;
            do {
              I = d[u + m++],
                a.head && I && 65536 > a.length && (a.head.comment += String.fromCharCode(I))
            } while (I && m < c); if (512 & a.flags && (a.check = s(a.check, d, m, u)),
              c -= m,
              u += m,
              I)
              break t
          } else
            a.head && (a.head.comment = null);
          a.mode = 9;
        case 9:
          if (512 & a.flags) {
            for (; 16 > g;) {
              if (0 === c)
                break t;
              c-- ,
                f += d[u++] << g,
                g += 8
            }
            if (f !== (65535 & a.check)) {
              t.msg = "header crc mismatch",
                a.mode = kt;
              break
            }
            g = f = 0
          }
          a.head && (a.head.hcrc = a.flags >> 9 & 1,
            a.head.done = !0),
            t.adler = a.check = 0,
            a.mode = wt;
          break;
        case 10:
          for (; 32 > g;) {
            if (0 === c)
              break t;
            c-- ,
              f += d[u++] << g,
              g += 8
          }
          t.adler = a.check = _(f),
            g = f = 0,
            a.mode = 11;
        case 11:
          if (0 === a.havedict)
            return t.next_out = r,
              t.avail_out = l,
              t.next_in = u,
              t.avail_in = c,
              a.hold = f,
              a.bits = g,
              2;
          t.adler = a.check = 1,
            a.mode = wt;
        case wt:
          if (i === et || 6 === i)
            break t;
        case 13:
          if (a.last) {
            f >>>= 7 & g,
              g -= 7 & g,
              a.mode = 27;
            break
          }
          for (; 3 > g;) {
            if (0 === c)
              break t;
            c-- ,
              f += d[u++] << g,
              g += 8
          }
          switch (a.last = 1 & f,
          --g,
          3 & (f >>>= 1)) {
            case 0:
              a.mode = 14;
              break;
            case 1:
              if (I = a,
                Mt) {
                for (xt = new Int32Array(512),
                  Lt = new Int32Array(32),
                  m = 0; 144 > m;)
                  I.lens[m++] = 8;
                for (; 256 > m;)
                  I.lens[m++] = 9;
                for (; 280 > m;)
                  I.lens[m++] = 7;
                for (; 288 > m;)
                  I.lens[m++] = 8;
                for (Rt(Ct, I.lens, 0, 288, xt, 0, I.work, {
                  bits: 9
                }),
                  m = 0; 32 > m;)
                  I.lens[m++] = 5;
                Rt(Tt, I.lens, 0, 32, Lt, 0, I.work, {
                  bits: 5
                }),
                  Mt = !1
              }
              if (I.lencode = xt,
                I.lenbits = 9,
                I.distcode = Lt,
                I.distbits = 5,
                a.mode = 20,
                6 === i) {
                f >>>= 2,
                  g -= 2;
                break t
              }
              break;
            case 2:
              a.mode = 17;
              break;
            case 3:
              t.msg = "invalid block type",
                a.mode = kt
          }
          f >>>= 2,
            g -= 2;
          break;
        case 14:
          for (f >>>= 7 & g,
            g -= 7 & g; 32 > g;) {
            if (0 === c)
              break t;
            c-- ,
              f += d[u++] << g,
              g += 8
          }
          if ((65535 & f) != (f >>> 16 ^ 65535)) {
            t.msg = "invalid stored block lengths",
              a.mode = kt;
            break
          }
          if (a.length = 65535 & f,
            g = f = 0,
            a.mode = 15,
            6 === i)
            break t;
        case 15:
          a.mode = 16;
        case 16:
          if (m = a.length) {
            if (m > c && (m = c),
              m > l && (m = l),
              0 === m)
              break t;
            Z(h, d, u, m, r),
              c -= m,
              u += m,
              l -= m,
              r += m,
              a.length -= m;
            break
          }
          a.mode = wt;
          break;
        case 17:
          for (; 14 > g;) {
            if (0 === c)
              break t;
            c-- ,
              f += d[u++] << g,
              g += 8
          }
          if (a.nlen = 257 + (31 & f),
            f >>>= 5,
            g -= 5,
            a.ndist = 1 + (31 & f),
            f >>>= 5,
            g -= 5,
            a.ncode = 4 + (15 & f),
            f >>>= 4,
            g -= 4,
            286 < a.nlen || 30 < a.ndist) {
            t.msg = "too many length or distance symbols",
              a.mode = kt;
            break
          }
          a.have = 0,
            a.mode = 18;
        case 18:
          for (; a.have < a.ncode;) {
            for (; 3 > g;) {
              if (0 === c)
                break t;
              c-- ,
                f += d[u++] << g,
                g += 8
            }
            a.lens[o[a.have++]] = 7 & f,
              f >>>= 3,
              g -= 3
          }
          for (; 19 > a.have;)
            a.lens[o[a.have++]] = 0;
          if (a.lencode = a.lendyn,
            a.lenbits = 7,
            m = {
              bits: a.lenbits
            },
            U = Rt(St, a.lens, 0, 19, a.lencode, 0, a.work, m),
            a.lenbits = m.bits,
            U) {
            t.msg = "invalid code lengths set",
              a.mode = kt;
            break
          }
          a.have = 0,
            a.mode = 19;
        case 19:
          for (; a.have < a.nlen + a.ndist;) {
            for (; ;) {
              var y = a.lencode[f & (1 << a.lenbits) - 1];
              if (m = y >>> 24,
                y &= 65535,
                m <= g)
                break;
              if (0 === c)
                break t;
              c-- ,
                f += d[u++] << g,
                g += 8
            }
            if (16 > y)
              f >>>= m,
                g -= m,
                a.lens[a.have++] = y;
            else {
              if (16 === y) {
                for (I = m + 2; g < I;) {
                  if (0 === c)
                    break t;
                  c-- ,
                    f += d[u++] << g,
                    g += 8
                }
                if (f >>>= m,
                  g -= m,
                  0 === a.have) {
                  t.msg = "invalid bit length repeat",
                    a.mode = kt;
                  break
                }
                I = a.lens[a.have - 1],
                  m = 3 + (3 & f),
                  f >>>= 2,
                  g -= 2
              } else if (17 === y) {
                for (I = m + 3; g < I;) {
                  if (0 === c)
                    break t;
                  c-- ,
                    f += d[u++] << g,
                    g += 8
                }
                g -= m,
                  I = 0,
                  m = 3 + (7 & (f >>>= m)),
                  f >>>= 3,
                  g -= 3
              } else {
                for (I = m + 7; g < I;) {
                  if (0 === c)
                    break t;
                  c-- ,
                    f += d[u++] << g,
                    g += 8
                }
                g -= m,
                  I = 0,
                  m = 11 + (127 & (f >>>= m)),
                  f >>>= 7,
                  g -= 7
              }
              if (a.have + m > a.nlen + a.ndist) {
                t.msg = "invalid bit length repeat",
                  a.mode = kt;
                break
              }
              for (; m--;)
                a.lens[a.have++] = I
            }
          }
          if (a.mode === kt)
            break;
          if (0 === a.lens[256]) {
            t.msg = "invalid code -- missing end-of-block",
              a.mode = kt;
            break
          }
          if (a.lenbits = 9,
            m = {
              bits: a.lenbits
            },
            U = Rt(Ct, a.lens, 0, a.nlen, a.lencode, 0, a.work, m),
            a.lenbits = m.bits,
            U) {
            t.msg = "invalid literal/lengths set",
              a.mode = kt;
            break
          }
          if (a.distbits = 6,
            a.distcode = a.distdyn,
            m = {
              bits: a.distbits
            },
            U = Rt(Tt, a.lens, a.nlen, a.ndist, a.distcode, 0, a.work, m),
            a.distbits = m.bits,
            U) {
            t.msg = "invalid distances set",
              a.mode = kt;
            break
          }
          if (a.mode = 20,
            6 === i)
            break t;
        case 20:
          a.mode = 21;
        case 21:
          if (6 <= c && 258 <= l) {
            t.next_out = r,
              t.avail_out = l,
              t.next_in = u,
              t.avail_in = c,
              a.hold = f,
              a.bits = g;
            var k = t
              , w = k.state
              , S = k.next_in;
            h = k.input;
            var C = S + (k.avail_in - 5)
              , T = k.next_out;
            d = k.output;
            var x = T - (b - k.avail_out)
              , L = T + (k.avail_out - 257)
              , A = w.dmax;
            y = w.wsize;
            var E = w.whave
              , M = w.wnext
              , F = w.window;
            I = w.hold,
              m = w.bits,
              g = w.lencode,
              f = w.distcode,
              l = (1 << w.lenbits) - 1,
              c = (1 << w.distbits) - 1;
            e: do {
              15 > m && (I += h[S++] << m,
                m += 8,
                I += h[S++] << m,
                m += 8);
              var N = g[I & l];
              s: for (; ;) {
                if (I >>>= r = N >>> 24,
                  m -= r,
                  0 == (r = N >>> 16 & 255))
                  d[T++] = 65535 & N;
                else {
                  if (!(16 & r)) {
                    if (0 == (64 & r)) {
                      N = g[(65535 & N) + (I & (1 << r) - 1)];
                      continue s
                    }
                    32 & r ? w.mode = wt : (k.msg = "invalid literal/length code",
                      w.mode = kt);
                    break e
                  }
                  u = 65535 & N,
                    (r &= 15) && (m < r && (I += h[S++] << m,
                      m += 8),
                      u += I & (1 << r) - 1,
                      I >>>= r,
                      m -= r),
                    15 > m && (I += h[S++] << m,
                      m += 8,
                      I += h[S++] << m,
                      m += 8),
                    N = f[I & c];
                  i: for (; ;) {
                    if (I >>>= r = N >>> 24,
                      m -= r,
                      !(16 & (r = N >>> 16 & 255))) {
                      if (0 == (64 & r)) {
                        N = f[(65535 & N) + (I & (1 << r) - 1)];
                        continue i
                      }
                      k.msg = "invalid distance code",
                        w.mode = kt;
                      break e
                    }
                    var B = 65535 & N;
                    if (m < (r &= 15) && (I += h[S++] << m,
                      (m += 8) < r && (I += h[S++] << m,
                        m += 8)),
                      (B += I & (1 << r) - 1) > A) {
                      k.msg = "invalid distance too far back",
                        w.mode = kt;
                      break e
                    }
                    if (I >>>= r,
                      m -= r,
                      B > (r = T - x)) {
                      if ((r = B - r) > E && w.sane) {
                        k.msg = "invalid distance too far back",
                          w.mode = kt;
                        break e
                      }
                      var O = 0;
                      if (N = F,
                        0 === M) {
                        if (O += y - r,
                          r < u) {
                          u -= r;
                          do {
                            d[T++] = F[O++]
                          } while (--r); O = T - B,
                            N = d
                        }
                      } else if (M < r) {
                        if (O += y + M - r,
                          (r -= M) < u) {
                          u -= r;
                          do {
                            d[T++] = F[O++]
                          } while (--r); if (O = 0,
                            M < u) {
                            u -= r = M;
                            do {
                              d[T++] = F[O++]
                            } while (--r); O = T - B,
                              N = d
                          }
                        }
                      } else if (O += M - r,
                        r < u) {
                        u -= r;
                        do {
                          d[T++] = F[O++]
                        } while (--r); O = T - B,
                          N = d
                      }
                      for (; 2 < u;)
                        d[T++] = N[O++],
                          d[T++] = N[O++],
                          d[T++] = N[O++],
                          u -= 3;
                      u && (d[T++] = N[O++],
                        1 < u && (d[T++] = N[O++]))
                    } else {
                      O = T - B;
                      do {
                        d[T++] = d[O++],
                          d[T++] = d[O++],
                          d[T++] = d[O++],
                          u -= 3
                      } while (2 < u); u && (d[T++] = d[O++],
                        1 < u && (d[T++] = d[O++]))
                    }
                    break
                  }
                }
                break
              }
            } while (S < C && T < L); S -= u = m >> 3,
              m -= u << 3,
              k.next_in = S,
              k.next_out = T,
              k.avail_in = S < C ? C - S + 5 : 5 - (S - C),
              k.avail_out = T < L ? L - T + 257 : 257 - (T - L),
              w.hold = I & (1 << m) - 1,
              w.bits = m,
              r = t.next_out,
              h = t.output,
              l = t.avail_out,
              u = t.next_in,
              d = t.input,
              c = t.avail_in,
              f = a.hold,
              g = a.bits,
              a.mode === wt && (a.back = -1);
            break
          }
          for (a.back = 0; y = a.lencode[f & (1 << a.lenbits) - 1],
            m = y >>> 24,
            I = y >>> 16 & 255,
            y &= 65535,
            !(m <= g);) {
            if (0 === c)
              break t;
            c-- ,
              f += d[u++] << g,
              g += 8
          }
          if (I && 0 == (240 & I)) {
            for (F = m,
              M = I,
              E = y; y = a.lencode[E + ((f & (1 << F + M) - 1) >> F)],
              m = y >>> 24,
              I = y >>> 16 & 255,
              y &= 65535,
              !(F + m <= g);) {
              if (0 === c)
                break t;
              c-- ,
                f += d[u++] << g,
                g += 8
            }
            f >>>= F,
              g -= F,
              a.back += F
          }
          if (f >>>= m,
            g -= m,
            a.back += m,
            a.length = y,
            0 === I) {
            a.mode = 26;
            break
          }
          if (32 & I) {
            a.back = -1,
              a.mode = wt;
            break
          }
          if (64 & I) {
            t.msg = "invalid literal/length code",
              a.mode = kt;
            break
          }
          a.extra = 15 & I,
            a.mode = 22;
        case 22:
          if (a.extra) {
            for (I = a.extra; g < I;) {
              if (0 === c)
                break t;
              c-- ,
                f += d[u++] << g,
                g += 8
            }
            a.length += f & (1 << a.extra) - 1,
              f >>>= a.extra,
              g -= a.extra,
              a.back += a.extra
          }
          a.was = a.length,
            a.mode = 23;
        case 23:
          for (; y = a.distcode[f & (1 << a.distbits) - 1],
            m = y >>> 24,
            I = y >>> 16 & 255,
            y &= 65535,
            !(m <= g);) {
            if (0 === c)
              break t;
            c-- ,
              f += d[u++] << g,
              g += 8
          }
          if (0 == (240 & I)) {
            for (F = m,
              M = I,
              E = y; y = a.distcode[E + ((f & (1 << F + M) - 1) >> F)],
              m = y >>> 24,
              I = y >>> 16 & 255,
              y &= 65535,
              !(F + m <= g);) {
              if (0 === c)
                break t;
              c-- ,
                f += d[u++] << g,
                g += 8
            }
            f >>>= F,
              g -= F,
              a.back += F
          }
          if (f >>>= m,
            g -= m,
            a.back += m,
            64 & I) {
            t.msg = "invalid distance code",
              a.mode = kt;
            break
          }
          a.offset = y,
            a.extra = 15 & I,
            a.mode = 24;
        case 24:
          if (a.extra) {
            for (I = a.extra; g < I;) {
              if (0 === c)
                break t;
              c-- ,
                f += d[u++] << g,
                g += 8
            }
            a.offset += f & (1 << a.extra) - 1,
              f >>>= a.extra,
              g -= a.extra,
              a.back += a.extra
          }
          if (a.offset > a.dmax) {
            t.msg = "invalid distance too far back",
              a.mode = kt;
            break
          }
          a.mode = 25;
        case 25:
          if (0 === l)
            break t;
          if (m = b - l,
            a.offset > m) {
            if ((m = a.offset - m) > a.whave && a.sane) {
              t.msg = "invalid distance too far back",
                a.mode = kt;
              break
            }
            m > a.wnext ? (m -= a.wnext,
              I = a.wsize - m) : I = a.wnext - m,
              m > a.length && (m = a.length),
              F = a.window
          } else
            F = h,
              I = r - a.offset,
              m = a.length;
          m > l && (m = l),
            l -= m,
            a.length -= m;
          do {
            h[r++] = F[I++]
          } while (--m); 0 === a.length && (a.mode = 21);
          break;
        case 26:
          if (0 === l)
            break t;
          h[r++] = a.length,
            l-- ,
            a.mode = 21;
          break;
        case 27:
          if (a.wrap) {
            for (; 32 > g;) {
              if (0 === c)
                break t;
              c-- ,
                f |= d[u++] << g,
                g += 8
            }
            if (b -= l,
              t.total_out += b,
              a.total += b,
              b && (t.adler = a.check = a.flags ? s(a.check, h, b, r - b) : e(a.check, h, b, r - b)),
              b = l,
              (a.flags ? f : _(f)) !== a.check) {
              t.msg = "incorrect data check",
                a.mode = kt;
              break
            }
            g = f = 0
          }
          a.mode = 28;
        case 28:
          if (a.wrap && a.flags) {
            for (; 32 > g;) {
              if (0 === c)
                break t;
              c-- ,
                f += d[u++] << g,
                g += 8
            }
            if (f !== (4294967295 & a.total)) {
              t.msg = "incorrect length check",
                a.mode = kt;
              break
            }
            g = f = 0
          }
          a.mode = 29;
        case 29:
          U = it;
          break t;
        case kt:
          U = ot;
          break t;
        case 31:
          return -4;
        default:
          return nt
      }
    return t.next_out = r,
      t.avail_out = l,
      t.next_in = u,
      t.avail_in = c,
      a.hold = f,
      a.bits = g,
      (a.wsize || b !== t.avail_out && a.mode < kt && (27 > a.mode || i !== tt)) && v(t, t.output, t.next_out, b - t.avail_out) ? (a.mode = 31,
        -4) : (p -= t.avail_in,
          b -= t.avail_out,
          t.total_in += p,
          t.total_out += b,
          a.total += b,
          a.wrap && b && (t.adler = a.check = a.flags ? s(a.check, h, b, t.next_out - b) : e(a.check, h, b, t.next_out - b)),
          t.data_type = a.bits + (a.last ? 64 : 0) + (a.mode === wt ? 128 : 0) + (20 === a.mode || 15 === a.mode ? 256 : 0),
          (0 === p && 0 === b || i === tt) && U === st && (U = at),
          U)
  }
  function U(t, s) {
    var i = s.length;
    if (!t || !t.state)
      return nt;
    var n = t.state;
    if (0 !== n.wrap && 11 !== n.mode)
      return nt;
    if (11 === n.mode) {
      var o = e(1, s, i, 0);
      if (o !== n.check)
        return ot
    }
    return v(t, s, i, i) ? (n.mode = 31,
      -4) : (n.havedict = 1,
        st)
  }
  function I(t, e, s, i, n) {
    this.static_tree = t,
      this.extra_bits = e,
      this.extra_base = s,
      this.elems = i,
      this.max_length = n,
      this.has_stree = t && t.length
  }
  function m(t, e) {
    this.dyn_tree = t,
      this.max_code = 0,
      this.stat_desc = e
  }
  function y(t, e) {
    t.pending_buf[t.pending++] = 255 & e,
      t.pending_buf[t.pending++] = e >>> 8 & 255
  }
  function k(t, e, s) {
    t.bi_valid > Zt - s ? (t.bi_buf |= e << t.bi_valid & 65535,
      y(t, t.bi_buf),
      t.bi_buf = e >> Zt - t.bi_valid,
      t.bi_valid += s - Zt) : (t.bi_buf |= e << t.bi_valid & 65535,
        t.bi_valid += s)
  }
  function w(t, e, s) {
    k(t, s[2 * e], s[2 * e + 1])
  }
  function S(t, e) {
    var s = 0;
    do {
      s |= 1 & t,
        t >>>= 1,
        s <<= 1
    } while (0 < --e); return s >>> 1
  }
  function C(t, e, s) {
    var i, n = Array(bt + 1), o = 0;
    for (i = 1; i <= bt; i++)
      n[i] = o = o + s[i - 1] << 1;
    for (s = 0; s <= e; s++)
      0 !== (o = t[2 * s + 1]) && (t[2 * s] = S(n[o]++, o))
  }
  function T(t) {
    var e;
    for (e = 0; e < gt; e++)
      t.dyn_ltree[2 * e] = 0;
    for (e = 0; e < pt; e++)
      t.dyn_dtree[2 * e] = 0;
    for (e = 0; e < _t; e++)
      t.bl_tree[2 * e] = 0;
    t.dyn_ltree[2 * Wt] = 1,
      t.opt_len = t.static_len = 0,
      t.last_lit = t.matches = 0
  }
  function x(t) {
    8 < t.bi_valid ? y(t, t.bi_buf) : 0 < t.bi_valid && (t.pending_buf[t.pending++] = t.bi_buf),
      t.bi_buf = 0,
      t.bi_valid = 0
  }
  function L(t, e, s, i) {
    x(t),
      i && (y(t, s),
        y(t, ~s)),
      Z(t.pending_buf, t.window, e, s, t.pending),
      t.pending += s
  }
  function A(t, e, s, i) {
    var n = 2 * e
      , o = 2 * s;
    return t[n] < t[o] || t[n] === t[o] && i[e] <= i[s]
  }
  function E(t, e, s) {
    for (var i = t.heap[s], n = s << 1; n <= t.heap_len && (n < t.heap_len && A(e, t.heap[n + 1], t.heap[n], t.depth) && n++ ,
      !A(e, i, t.heap[n], t.depth));)
      t.heap[s] = t.heap[n],
        s = n,
        n <<= 1;
    t.heap[s] = i
  }
  function M(t, e, s) {
    var i = 0;
    if (0 !== t.last_lit)
      do {
        var n = t.pending_buf[t.d_buf + 2 * i] << 8 | t.pending_buf[t.d_buf + 2 * i + 1]
          , o = t.pending_buf[t.l_buf + i];
        if (i++ ,
          0 === n)
          w(t, o, e);
        else {
          var a = ie[o];
          w(t, a + ft + 1, e);
          var r = Kt[a];
          0 !== r && (o -= ne[a],
            k(t, o, r)),
            a = 256 > --n ? se[n] : se[256 + (n >>> 7)],
            w(t, a, s),
            0 !== (r = Xt[a]) && (n -= oe[a],
              k(t, n, r))
        }
      } while (i < t.last_lit); w(t, Wt, e)
  }
  function F(t, e) {
    var s, i = e.dyn_tree, n = e.stat_desc.static_tree, o = e.stat_desc.has_stree, a = e.stat_desc.elems, r = -1;
    for (t.heap_len = 0,
      t.heap_max = vt,
      s = 0; s < a; s++)
      0 !== i[2 * s] ? (t.heap[++t.heap_len] = r = s,
        t.depth[s] = 0) : i[2 * s + 1] = 0;
    for (; 2 > t.heap_len;) {
      var h = t.heap[++t.heap_len] = 2 > r ? ++r : 0;
      i[2 * h] = 1,
        t.depth[h] = 0,
        t.opt_len-- ,
        o && (t.static_len -= n[2 * h + 1])
    }
    for (e.max_code = r,
      s = t.heap_len >> 1; 1 <= s; s--)
      E(t, i, s);
    h = a;
    do {
      s = t.heap[1],
        t.heap[1] = t.heap[t.heap_len--],
        E(t, i, 1),
        n = t.heap[1],
        t.heap[--t.heap_max] = s,
        t.heap[--t.heap_max] = n,
        i[2 * h] = i[2 * s] + i[2 * n],
        t.depth[h] = (t.depth[s] >= t.depth[n] ? t.depth[s] : t.depth[n]) + 1,
        i[2 * s + 1] = i[2 * n + 1] = h,
        t.heap[1] = h++ ,
        E(t, i, 1)
    } while (2 <= t.heap_len); t.heap[--t.heap_max] = t.heap[1],
      s = e.dyn_tree,
      h = e.max_code;
    var l = e.stat_desc.static_tree
      , u = e.stat_desc.has_stree
      , d = e.stat_desc.extra_bits
      , c = e.stat_desc.extra_base
      , f = e.stat_desc.max_length
      , g = 0;
    for (a = 0; a <= bt; a++)
      t.bl_count[a] = 0;
    for (s[2 * t.heap[t.heap_max] + 1] = 0,
      n = t.heap_max + 1; n < vt; n++)
      if (o = t.heap[n],
        (a = s[2 * s[2 * o + 1] + 1] + 1) > f && (a = f,
          g++),
        s[2 * o + 1] = a,
        !(o > h)) {
        t.bl_count[a]++;
        var p = 0;
        o >= c && (p = d[o - c]);
        var _ = s[2 * o];
        t.opt_len += _ * (a + p),
          u && (t.static_len += _ * (l[2 * o + 1] + p))
      }
    if (0 !== g) {
      do {
        for (a = f - 1; 0 === t.bl_count[a];)
          a--;
        t.bl_count[a]-- ,
          t.bl_count[a + 1] += 2,
          t.bl_count[f]-- ,
          g -= 2
      } while (0 < g); for (a = f; 0 !== a; a--)
        for (o = t.bl_count[a]; 0 !== o;)
          (l = t.heap[--n]) > h || (s[2 * l + 1] !== a && (t.opt_len += (a - s[2 * l + 1]) * s[2 * l],
            s[2 * l + 1] = a),
            o--)
    }
    C(i, r, t.bl_count)
  }
  function N(t, e, s) {
    var i, n = -1, o = e[1], a = 0, r = 7, h = 4;
    for (0 === o && (r = 138,
      h = 3),
      e[2 * (s + 1) + 1] = 65535,
      i = 0; i <= s; i++) {
      var l = o;
      o = e[2 * (i + 1) + 1],
        ++a < r && l === o || (a < h ? t.bl_tree[2 * l] += a : 0 !== l ? (l !== n && t.bl_tree[2 * l]++ ,
          t.bl_tree[2 * Vt]++) : 10 >= a ? t.bl_tree[2 * Gt]++ : t.bl_tree[2 * qt]++ ,
          a = 0,
          n = l,
          0 === o ? (r = 138,
            h = 3) : l === o ? (r = 6,
              h = 3) : (r = 7,
                h = 4))
    }
  }
  function B(t, e, s) {
    var i, n = -1, o = e[1], a = 0, r = 7, h = 4;
    for (0 === o && (r = 138,
      h = 3),
      i = 0; i <= s; i++) {
      var l = o;
      if (o = e[2 * (i + 1) + 1],
        !(++a < r && l === o)) {
        if (a < h)
          do {
            w(t, l, t.bl_tree)
          } while (0 != --a);
        else
          0 !== l ? (l !== n && (w(t, l, t.bl_tree),
            a--),
            w(t, Vt, t.bl_tree),
            k(t, a - 3, 2)) : 10 >= a ? (w(t, Gt, t.bl_tree),
              k(t, a - 3, 3)) : (w(t, qt, t.bl_tree),
                k(t, a - 11, 7));
        a = 0,
          n = l,
          0 === o ? (r = 138,
            h = 3) : l === o ? (r = 6,
              h = 3) : (r = 7,
                h = 4)
      }
    }
  }
  function O(t, e, s) {
    return t.pending_buf[t.d_buf + 2 * t.last_lit] = e >>> 8 & 255,
      t.pending_buf[t.d_buf + 2 * t.last_lit + 1] = 255 & e,
      t.pending_buf[t.l_buf + t.last_lit] = 255 & s,
      t.last_lit++ ,
      0 === e ? t.dyn_ltree[2 * s]++ : (t.matches++ ,
        e-- ,
        t.dyn_ltree[2 * (ie[s] + ft + 1)]++ ,
        t.dyn_dtree[2 * (256 > e ? se[e] : se[256 + (e >>> 7)])]++),
      t.last_lit === t.lit_bufsize - 1
  }
  function R() {
    this.input = null,
      this.total_in = this.avail_in = this.next_in = 0,
      this.output = null,
      this.total_out = this.avail_out = this.next_out = 0,
      this.msg = "",
      this.state = null,
      this.data_type = 2,
      this.adler = 0
  }
  function j(t) {
    if (!(this instanceof j))
      return new j(t);
    (t = this.options = P({
      level: rt,
      method: dt,
      chunkSize: 16384,
      windowBits: 15,
      memLevel: 8,
      strategy: lt,
      to: ""
    }, t || {})).raw && 0 < t.windowBits ? t.windowBits = -t.windowBits : t.gzip && 0 < t.windowBits && 16 > t.windowBits && (t.windowBits += 16),
      this.err = 0,
      this.msg = "",
      this.ended = !1,
      this.chunks = [],
      this.strm = new R,
      this.strm.avail_out = 0;
    var s = this.strm
      , o = t.level
      , a = t.method
      , r = t.windowBits
      , h = t.memLevel
      , l = t.strategy;
    if (s) {
      var u = 1;
      if (o === rt && (o = 6),
        0 > r ? (u = 0,
          r = -r) : 15 < r && (u = 2,
            r -= 16),
        1 > h || 9 < h || a !== dt || 8 > r || 15 < r || 0 > o || 9 < o || 0 > l || l > ht)
        s = i(s, nt);
      else {
        8 === r && (r = 9);
        var c = new function () {
          this.strm = null,
            this.status = 0,
            this.pending_buf = null,
            this.wrap = this.pending = this.pending_out = this.pending_buf_size = 0,
            this.gzhead = null,
            this.gzindex = 0,
            this.method = dt,
            this.last_flush = -1,
            this.w_mask = this.w_bits = this.w_size = 0,
            this.window = null,
            this.window_size = 0,
            this.head = this.prev = null,
            this.nice_match = this.good_match = this.strategy = this.level = this.max_lazy_match = this.max_chain_length = this.prev_length = this.lookahead = this.match_start = this.strstart = this.match_available = this.prev_match = this.match_length = this.block_start = this.hash_shift = this.hash_mask = this.hash_bits = this.hash_size = this.ins_h = 0,
            this.dyn_ltree = new Uint16Array(2 * vt),
            this.dyn_dtree = new Uint16Array(2 * (2 * pt + 1)),
            this.bl_tree = new Uint16Array(2 * (2 * _t + 1)),
            n(this.dyn_ltree),
            n(this.dyn_dtree),
            n(this.bl_tree),
            this.bl_desc = this.d_desc = this.l_desc = null,
            this.bl_count = new Uint16Array(bt + 1),
            this.heap = new Uint16Array(2 * gt + 1),
            n(this.heap),
            this.heap_max = this.heap_len = 0,
            this.depth = new Uint16Array(2 * gt + 1),
            n(this.depth),
            this.bi_valid = this.bi_buf = this.insert = this.matches = this.static_len = this.opt_len = this.d_buf = this.last_lit = this.lit_bufsize = this.l_buf = 0
        }
          ;
        if (s.state = c,
          c.strm = s,
          c.wrap = u,
          c.gzhead = null,
          c.w_bits = r,
          c.w_size = 1 << c.w_bits,
          c.w_mask = c.w_size - 1,
          c.hash_bits = h + 7,
          c.hash_size = 1 << c.hash_bits,
          c.hash_mask = c.hash_size - 1,
          c.hash_shift = ~~((c.hash_bits + Ut - 1) / Ut),
          c.window = new Uint8Array(2 * c.w_size),
          c.head = new Uint16Array(c.hash_size),
          c.prev = new Uint16Array(c.w_size),
          c.lit_bufsize = 1 << h + 6,
          c.pending_buf_size = 4 * c.lit_bufsize,
          c.pending_buf = new Uint8Array(c.pending_buf_size),
          c.d_buf = 1 * c.lit_bufsize,
          c.l_buf = 3 * c.lit_bufsize,
          c.level = o,
          c.strategy = l,
          c.method = a,
          s && s.state) {
          if (s.total_in = s.total_out = 0,
            s.data_type = ut,
            (o = s.state).pending = 0,
            o.pending_out = 0,
            0 > o.wrap && (o.wrap = -o.wrap),
            o.status = o.wrap ? 42 : 113,
            s.adler = 2 === o.wrap ? 0 : 1,
            o.last_flush = $,
            !le) {
            for (a = Array(bt + 1),
              h = l = 0; h < ct - 1; h++)
              for (ne[h] = l,
                r = 0; r < 1 << Kt[h]; r++)
                ie[l++] = h;
            for (ie[l - 1] = h,
              h = l = 0; 16 > h; h++)
              for (oe[h] = l,
                r = 0; r < 1 << Xt[h]; r++)
                se[l++] = h;
            for (l >>= 7; h < pt; h++)
              for (oe[h] = l << 7,
                r = 0; r < 1 << Xt[h] - 7; r++)
                se[256 + l++] = h;
            for (r = 0; r <= bt; r++)
              a[r] = 0;
            for (r = 0; 143 >= r;)
              te[2 * r + 1] = 8,
                r++ ,
                a[8]++;
            for (; 255 >= r;)
              te[2 * r + 1] = 9,
                r++ ,
                a[9]++;
            for (; 279 >= r;)
              te[2 * r + 1] = 7,
                r++ ,
                a[7]++;
            for (; 287 >= r;)
              te[2 * r + 1] = 8,
                r++ ,
                a[8]++;
            for (C(te, gt + 1, a),
              r = 0; r < pt; r++)
              ee[2 * r + 1] = 5,
                ee[2 * r] = S(r, 5);
            ae = new I(te, Kt, ft + 1, gt, bt),
              re = new I(ee, Xt, 0, pt, bt),
              he = new I([], Qt, 0, _t, Yt),
              le = !0
          }
          o.l_desc = new m(o.dyn_ltree, ae),
            o.d_desc = new m(o.dyn_dtree, re),
            o.bl_desc = new m(o.bl_tree, he),
            o.bi_buf = 0,
            o.bi_valid = 0,
            T(o),
            o = st
        } else
          o = i(s, nt);
        o === st && ((s = s.state).window_size = 2 * s.w_size,
          n(s.head),
          s.max_lazy_match = yt[s.level].max_lazy,
          s.good_match = yt[s.level].good_length,
          s.nice_match = yt[s.level].nice_length,
          s.max_chain_length = yt[s.level].max_chain,
          s.strstart = 0,
          s.block_start = 0,
          s.lookahead = 0,
          s.insert = 0,
          s.match_length = s.prev_length = Ut - 1,
          s.match_available = 0,
          s.ins_h = 0),
          s = o
      }
    } else
      s = nt;
    if (s !== st)
      throw Error(jt[s]);
    if (t.header && (s = this.strm) && s.state && 2 === s.state.wrap && (s.state.gzhead = t.header),
      t.dictionary) {
      if (s = "string" == typeof t.dictionary ? K(t.dictionary) : "[object ArrayBuffer]" === ue.call(t.dictionary) ? new Uint8Array(t.dictionary) : t.dictionary,
        t = this.strm,
        u = (l = s).length,
        t && t.state)
        if (s = t.state,
          2 === (o = s.wrap) || 1 === o && 42 !== s.status || s.lookahead)
          s = nt;
        else {
          for (1 === o && (t.adler = e(t.adler, l, u, 0)),
            s.wrap = 0,
            u >= s.w_size && (0 === o && (n(s.head),
              s.strstart = 0,
              s.block_start = 0,
              s.insert = 0),
              a = new Uint8Array(s.w_size),
              Z(a, l, u - s.w_size, s.w_size, 0),
              l = a,
              u = s.w_size),
            a = t.avail_in,
            r = t.next_in,
            h = t.input,
            t.avail_in = u,
            t.next_in = 0,
            t.input = l,
            d(s); s.lookahead >= Ut;) {
            l = s.strstart,
              u = s.lookahead - (Ut - 1);
            do {
              s.ins_h = (s.ins_h << s.hash_shift ^ s.window[l + Ut - 1]) & s.hash_mask,
                s.prev[l & s.w_mask] = s.head[s.ins_h],
                s.head[s.ins_h] = l,
                l++
            } while (--u); s.strstart = l,
              s.lookahead = Ut - 1,
              d(s)
          }
          s.strstart += s.lookahead,
            s.block_start = s.strstart,
            s.insert = s.lookahead,
            s.lookahead = 0,
            s.match_length = s.prev_length = Ut - 1,
            s.match_available = 0,
            t.next_in = r,
            t.input = h,
            t.avail_in = a,
            s.wrap = o,
            s = st
        }
      else
        s = nt;
      if (s !== st)
        throw Error(jt[s]);
      this._dict_set = !0
    }
  }
  function D(t) {
    if (!(this instanceof D))
      return new D(t);
    var e = this.options = P({
      chunkSize: 16384,
      windowBits: 0,
      to: ""
    }, t || {});
    if (e.raw && 0 <= e.windowBits && 16 > e.windowBits && (e.windowBits = -e.windowBits,
      0 === e.windowBits && (e.windowBits = -15)),
      !(0 <= e.windowBits && 16 > e.windowBits) || t && t.windowBits || (e.windowBits += 32),
      15 < e.windowBits && 48 > e.windowBits && 0 == (15 & e.windowBits) && (e.windowBits |= 15),
      this.err = 0,
      this.msg = "",
      this.ended = !1,
      this.chunks = [],
      this.strm = new R,
      this.strm.avail_out = 0,
      t = this.strm,
      e = e.windowBits,
      t) {
      var s = new function () {
        this.mode = 0,
          this.last = !1,
          this.wrap = 0,
          this.havedict = !1,
          this.total = this.check = this.dmax = this.flags = 0,
          this.head = null,
          this.wnext = this.whave = this.wsize = this.wbits = 0,
          this.window = null,
          this.extra = this.offset = this.length = this.bits = this.hold = 0,
          this.distcode = this.lencode = null,
          this.have = this.ndist = this.nlen = this.ncode = this.distbits = this.lenbits = 0,
          this.next = null,
          this.lens = new Uint16Array(320),
          this.work = new Uint16Array(288),
          this.distdyn = this.lendyn = null,
          this.was = this.back = this.sane = 0
      }
        ;
      if (t.state = s,
        s.window = null,
        t && t.state) {
        var i = t.state;
        0 > e ? (s = 0,
          e = -e) : (s = 1 + (e >> 4),
            48 > e && (e &= 15)),
          e && (8 > e || 15 < e) ? e = nt : (null !== i.window && i.wbits !== e && (i.window = null),
            i.wrap = s,
            i.wbits = e,
            t && t.state ? ((e = t.state).wsize = 0,
              e.whave = 0,
              e.wnext = 0,
              t && t.state ? (e = t.state,
                t.total_in = t.total_out = e.total = 0,
                t.msg = "",
                e.wrap && (t.adler = 1 & e.wrap),
                e.mode = 1,
                e.last = 0,
                e.havedict = 0,
                e.dmax = 32768,
                e.head = null,
                e.hold = 0,
                e.bits = 0,
                e.lencode = e.lendyn = new Int32Array(At),
                e.distcode = e.distdyn = new Int32Array(Et),
                e.sane = 1,
                e.back = -1,
                e = st) : e = nt) : e = nt)
      } else
        e = nt;
      e !== st && (t.state = null),
        t = e
    } else
      t = nt;
    if (t !== X.Z_OK)
      throw Error(jt[t]);
    this.header = new function () {
      this.os = this.xflags = this.time = this.text = 0,
        this.extra = null,
        this.extra_len = 0,
        this.comment = this.name = "",
        this.hcrc = 0,
        this.done = !1
    }
      ,
      e = this.strm,
      t = this.header,
      e && e.state && 0 != (2 & (e = e.state).wrap) && (e.head = t,
        t.done = !1)
  }
  function z(t, e) {
    if (!(t instanceof e))
      throw new TypeError("Cannot call a class as a function")
  }
  var H = "function" == typeof Symbol && "symbol" === a(Symbol.iterator) ? function (t) {
    return void 0 === t ? "undefined" : a(t)
  }
    : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : void 0 === t ? "undefined" : a(t)
    }
    , P = function (t) {
      for (var e = Array.prototype.slice.call(arguments, 1); e.length;) {
        var s = e.shift();
        if (s) {
          if ("object" !== (void 0 === s ? "undefined" : H(s)))
            throw new TypeError(s + "must be non-object");
          for (var i in s)
            s.hasOwnProperty(i) && (t[i] = s[i])
        }
      }
      return t
    }
    , J = function (t, e) {
      return t.length === e ? t : t.subarray ? t.subarray(0, e) : (t.length = e,
        t)
    }
    , Z = function (t, e, s, i, n) {
      if (e.subarray && t.subarray)
        t.set(e.subarray(s, s + i), n);
      else
        for (var o = 0; o < i; o++)
          t[n + o] = e[s + o]
    }
    , Y = function (t) {
      var e, s, i = s = 0;
      for (e = t.length; i < e; i++)
        s += t[i].length;
      var n = new Uint8Array(s);
      for (i = s = 0,
        e = t.length; i < e; i++) {
        var o = t[i];
        n.set(o, s),
          s += o.length
      }
      return n
    }
    , W = !0
    , V = !0;
  try {
    String.fromCharCode.apply(null, [0])
  } catch (t) {
    W = !1
  }
  try {
    String.fromCharCode.apply(null, new Uint8Array(1))
  } catch (t) {
    V = !1
  }
  for (var G = new Uint8Array(256), q = 0; 256 > q; q++)
    G[q] = 252 <= q ? 6 : 248 <= q ? 5 : 240 <= q ? 4 : 224 <= q ? 3 : 192 <= q ? 2 : 1;
  G[254] = G[254] = 1;
  var K = function (t) {
    var e, s, i = t.length, n = 0;
    for (e = 0; e < i; e++) {
      var o = t.charCodeAt(e);
      if (55296 == (64512 & o) && e + 1 < i) {
        var a = t.charCodeAt(e + 1);
        56320 == (64512 & a) && (o = 65536 + (o - 55296 << 10) + (a - 56320),
          e++)
      }
      n += 128 > o ? 1 : 2048 > o ? 2 : 65536 > o ? 3 : 4
    }
    var r = new Uint8Array(n);
    for (e = s = 0; s < n; e++)
      55296 == (64512 & (o = t.charCodeAt(e))) && e + 1 < i && 56320 == (64512 & (a = t.charCodeAt(e + 1))) && (o = 65536 + (o - 55296 << 10) + (a - 56320),
        e++),
        128 > o ? r[s++] = o : (2048 > o ? r[s++] = 192 | o >>> 6 : (65536 > o ? r[s++] = 224 | o >>> 12 : (r[s++] = 240 | o >>> 18,
          r[s++] = 128 | o >>> 12 & 63),
          r[s++] = 128 | o >>> 6 & 63),
          r[s++] = 128 | 63 & o);
    return r
  };
  t = function t(e) {
    return t(e, e.length)
  }
    ;
  var X = {
    Z_NO_FLUSH: 0,
    Z_PARTIAL_FLUSH: 1,
    Z_SYNC_FLUSH: 2,
    Z_FULL_FLUSH: 3,
    Z_FINISH: 4,
    Z_BLOCK: 5,
    Z_TREES: 6,
    Z_OK: 0,
    Z_STREAM_END: 1,
    Z_NEED_DICT: 2,
    Z_ERRNO: -1,
    Z_STREAM_ERROR: -2,
    Z_DATA_ERROR: -3,
    Z_BUF_ERROR: -5,
    Z_NO_COMPRESSION: 0,
    Z_BEST_SPEED: 1,
    Z_BEST_COMPRESSION: 9,
    Z_DEFAULT_COMPRESSION: -1,
    Z_FILTERED: 1,
    Z_HUFFMAN_ONLY: 2,
    Z_RLE: 3,
    Z_FIXED: 4,
    Z_DEFAULT_STRATEGY: 0,
    Z_BINARY: 0,
    Z_TEXT: 1,
    Z_UNKNOWN: 2,
    Z_DEFLATED: 8
  }
    , Q = function () {
      for (var t, e = [], s = 0; 256 > s; s++) {
        t = s;
        for (var i = 0; 8 > i; i++)
          t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;
        e[s] = t
      }
      return e
    }()
    , $ = 0
    , tt = 4
    , et = 5
    , st = 0
    , it = 1
    , nt = -2
    , ot = -3
    , at = -5
    , rt = -1
    , ht = 4
    , lt = 0
    , ut = 2
    , dt = 8
    , ct = 29
    , ft = 256
    , gt = ft + 1 + ct
    , pt = 30
    , _t = 19
    , vt = 2 * gt + 1
    , bt = 15
    , Ut = 3
    , It = 258
    , mt = It + Ut + 1
    , yt = [new g(0, 0, 0, 0, function (t, e) {
      var s = 65535;
      for (s > t.pending_buf_size - 5 && (s = t.pending_buf_size - 5); ;) {
        if (1 >= t.lookahead) {
          if (d(t),
            0 === t.lookahead && e === $)
            return 1;
          if (0 === t.lookahead)
            break
        }
        t.strstart += t.lookahead,
          t.lookahead = 0;
        var i = t.block_start + s;
        if ((0 === t.strstart || t.strstart >= i) && (t.lookahead = t.strstart - i,
          t.strstart = i,
          r(t, !1),
          0 === t.strm.avail_out))
          return 1;
        if (t.strstart - t.block_start >= t.w_size - mt && (r(t, !1),
          0 === t.strm.avail_out))
          return 1
      }
      return t.insert = 0,
        e === tt ? (r(t, !0),
          0 === t.strm.avail_out ? 3 : 4) : (t.strstart > t.block_start && r(t, !1),
            1)
    }
    ), new g(4, 4, 8, 4, c), new g(4, 5, 16, 8, c), new g(4, 6, 32, 32, c), new g(4, 4, 16, 16, f), new g(8, 16, 32, 32, f), new g(8, 16, 128, 128, f), new g(8, 32, 128, 256, f), new g(32, 128, 258, 1024, f), new g(32, 258, 258, 4096, f)]
    , kt = 30
    , wt = 12
    , St = 0
    , Ct = 1
    , Tt = 2;
  tt = 4,
    et = 5,
    st = 0,
    it = 1,
    nt = -2,
    ot = -3,
    at = -5,
    dt = 8,
    wt = 12,
    kt = 30;
  var xt, Lt, At = 852, Et = 592, Mt = !0;
  At = 852,
    Et = 592,
    St = 0,
    Ct = 1,
    Tt = 2;
  var Ft = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0]
    , Nt = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78]
    , Bt = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0]
    , Ot = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64]
    , Rt = function (t, e, s, i, n, o, a, r) {
      var h, l, u, d, c, f, g, p = r.bits, _ = 0, v = new Uint16Array(16), b = new Uint16Array(16), U = 0;
      for (h = 0; 15 >= h; h++)
        v[h] = 0;
      for (l = 0; l < i; l++)
        v[e[s + l]]++;
      var I = p;
      for (u = 15; 1 <= u && 0 === v[u]; u--)
        ;
      if (I > u && (I = u),
        0 === u)
        return n[o++] = 20971520,
          n[o++] = 20971520,
          r.bits = 1,
          0;
      for (p = 1; p < u && 0 === v[p]; p++)
        ;
      for (I < p && (I = p),
        h = d = 1; 15 >= h; h++)
        if (d <<= 1,
          0 > (d -= v[h]))
          return -1;
      if (0 < d && (t === St || 1 !== u))
        return -1;
      for (b[1] = 0,
        h = 1; 15 > h; h++)
        b[h + 1] = b[h] + v[h];
      for (l = 0; l < i; l++)
        0 !== e[s + l] && (a[b[e[s + l]]++] = l);
      if (t === St)
        var m = g = a
          , y = 19;
      else
        t === Ct ? (m = Ft,
          _ -= 257,
          g = Nt,
          U -= 257,
          y = 256) : (m = Bt,
            g = Ot,
            y = -1);
      l = c = 0,
        h = p;
      var k = o;
      i = I,
        b = 0;
      var w = -1
        , S = 1 << I
        , C = S - 1;
      if (t === Ct && S > At || t === Tt && S > Et)
        return 1;
      for (; ;) {
        var T = h - b;
        if (a[l] < y)
          var x = 0
            , L = a[l];
        else
          a[l] > y ? (x = g[U + a[l]],
            L = m[_ + a[l]]) : (x = 96,
              L = 0);
        d = 1 << h - b,
          p = f = 1 << i;
        do {
          n[k + (c >> b) + (f -= d)] = T << 24 | x << 16 | L | 0
        } while (0 !== f); for (d = 1 << h - 1; c & d;)
          d >>= 1;
        if (0 !== d ? (c &= d - 1,
          c += d) : c = 0,
          l++ ,
          0 == --v[h]) {
          if (h === u)
            break;
          h = e[s + a[l]]
        }
        if (h > I && (c & C) !== w) {
          for (0 === b && (b = I),
            k += p,
            d = 1 << (i = h - b); i + b < u && !(0 >= (d -= v[i + b]));)
            i++ ,
              d <<= 1;
          if (S += 1 << i,
            t === Ct && S > At || t === Tt && S > Et)
            return 1;
          n[w = c & C] = I << 24 | i << 16 | k - o | 0
        }
      }
      return 0 !== c && (n[k + c] = h - b << 24 | 4194304),
        r.bits = I,
        0
    }
    , jt = {
      2: "need dictionary",
      1: "stream end",
      0: "",
      "-1": "file error",
      "-2": "stream error",
      "-3": "data error",
      "-4": "insufficient memory",
      "-5": "buffer error",
      "-6": "incompatible version"
    };
  ht = 4;
  var Dt = 0
    , zt = 1;
  ut = 2;
  var Ht = 0
    , Pt = 1
    , Jt = 2;
  Ut = 3,
    It = 258,
    pt = 30,
    _t = 19,
    vt = 2 * (gt = 1 + (ft = 256) + (ct = 29)) + 1,
    bt = 15;
  var Zt = 16
    , Yt = 7
    , Wt = 256
    , Vt = 16
    , Gt = 17
    , qt = 18
    , Kt = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
    , Xt = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
    , Qt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
    , $t = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
    , te = Array(2 * (gt + 2));
  n(te);
  var ee = Array(2 * pt);
  n(ee);
  var se = Array(512);
  n(se);
  var ie = Array(It - Ut + 1);
  n(ie);
  var ne = Array(ct);
  n(ne);
  var oe = Array(pt);
  n(oe);
  var ae, re, he, le = !1, ue = Object.prototype.toString;
  $ = 0,
    tt = 4,
    st = 0,
    it = 1,
    rt = -1,
    lt = 0,
    dt = 8,
    j.prototype.push = function (e, s) {
      var n = this.strm
        , o = this.options.chunkSize;
      if (this.ended)
        return !1;
      var a = s === ~~s ? s : !0 === s ? tt : $;
      "string" == typeof e ? n.input = K(e) : "[object ArrayBuffer]" === ue.call(e) ? n.input = new Uint8Array(e) : n.input = e,
        n.next_in = 0,
        n.avail_in = n.input.length;
      do {
        0 === n.avail_out && (n.output = new Uint8Array(o),
          n.next_out = 0,
          n.avail_out = o);
        var r = p(n, a);
        if (r !== it && r !== st)
          return this.onEnd(r),
            this.ended = !0,
            !1;
        0 !== n.avail_out && (0 !== n.avail_in || a !== tt && 2 !== a) || ("string" === this.options.to ? this.onData(t(J(n.output, n.next_out))) : this.onData(J(n.output, n.next_out)))
      } while ((0 < n.avail_in || 0 === n.avail_out) && r !== it); return a === tt ? ((n = this.strm) && n.state ? 42 !== (o = n.state.status) && 69 !== o && 73 !== o && 91 !== o && 103 !== o && 113 !== o && 666 !== o ? r = i(n, nt) : (n.state = null,
        r = 113 === o ? i(n, ot) : st) : r = nt,
        this.onEnd(r),
        this.ended = !0,
        r === st) : (2 === a && (this.onEnd(st),
          n.avail_out = 0),
          !0)
    }
    ,
    j.prototype.onData = function (t) {
      this.chunks.push(t)
    }
    ,
    j.prototype.onEnd = function (t) {
      t === st && (this.result = "string" === this.options.to ? this.chunks.join("") : Y(this.chunks)),
        this.chunks = [],
        this.err = t,
        this.msg = this.strm.msg
    }
    ,
    ue = Object.prototype.toString,
    D.prototype.push = function (e, s) {
      var i, n = this.strm, o = this.options.chunkSize, a = this.options.dictionary, r = !1;
      if (this.ended)
        return !1;
      var h = s === ~~s ? s : !0 === s ? X.Z_FINISH : X.Z_NO_FLUSH;
      if ("string" == typeof e) {
        var l = new Uint8Array(e.length)
          , u = 0;
        for (i = l.length; u < i; u++)
          l[u] = e.charCodeAt(u);
        n.input = l
      } else
        "[object ArrayBuffer]" === ue.call(e) ? n.input = new Uint8Array(e) : n.input = e;
      n.next_in = 0,
        n.avail_in = n.input.length;
      do {
        if (0 === n.avail_out && (n.output = new Uint8Array(o),
          n.next_out = 0,
          n.avail_out = o),
          (l = b(n, X.Z_NO_FLUSH)) === X.Z_NEED_DICT && a && (l = "string" == typeof a ? K(a) : "[object ArrayBuffer]" === ue.call(a) ? new Uint8Array(a) : a,
            l = U(this.strm, l)),
          l === X.Z_BUF_ERROR && !0 === r && (l = X.Z_OK,
            r = !1),
          l !== X.Z_STREAM_END && l !== X.Z_OK)
          return this.onEnd(l),
            this.ended = !0,
            !1;
        if (n.next_out && (0 === n.avail_out || l === X.Z_STREAM_END || 0 === n.avail_in && (h === X.Z_FINISH || h === X.Z_SYNC_FLUSH)))
          if ("string" === this.options.to) {
            i = n.output;
            var d = (d = n.next_out) || i.length;
            for (d > i.length && (d = i.length),
              u = d - 1; 0 <= u && 128 == (192 & i[u]);)
              u--;
            u = 0 > u ? d : 0 === u ? d : u + G[i[u]] > d ? u : d,
              i = n.next_out - u;
            var c, f, g = n.output, p = u || g.length, _ = Array(2 * p);
            for (f = c = 0; f < p;) {
              var v = g[f++];
              if (128 > v)
                _[c++] = v;
              else if (4 < (d = G[v]))
                _[c++] = 65533,
                  f += d - 1;
              else {
                for (v &= 2 === d ? 31 : 3 === d ? 15 : 7; 1 < d && f < p;)
                  v = v << 6 | 63 & g[f++],
                    d--;
                1 < d ? _[c++] = 65533 : 65536 > v ? _[c++] = v : (v -= 65536,
                  _[c++] = 55296 | v >> 10 & 1023,
                  _[c++] = 56320 | 1023 & v)
              }
            }
            d = t(_, c),
              n.next_out = i,
              n.avail_out = o - i,
              i && Z(n.output, n.output, u, i, 0),
              this.onData(d)
          } else
            this.onData(J(n.output, n.next_out));
        0 === n.avail_in && 0 === n.avail_out && (r = !0)
      } while ((0 < n.avail_in || 0 === n.avail_out) && l !== X.Z_STREAM_END); return l === X.Z_STREAM_END && (h = X.Z_FINISH),
        h === X.Z_FINISH ? ((n = this.strm) && n.state ? ((o = n.state).window && (o.window = null),
          n.state = null,
          l = st) : l = nt,
          this.onEnd(l),
          this.ended = !0,
          l === X.Z_OK) : (h === X.Z_SYNC_FLUSH && (this.onEnd(X.Z_OK),
            n.avail_out = 0),
            !0)
    }
    ,
    D.prototype.onData = function (t) {
      this.chunks.push(t)
    }
    ,
    D.prototype.onEnd = function (t) {
      t === X.Z_OK && (this.result = "string" === this.options.to ? this.chunks.join("") : Y(this.chunks)),
        this.chunks = [],
        this.err = t,
        this.msg = this.strm.msg
    }
    ;
  var de = function () {
    this.topSid = this.uid = 0,
      this.marshal = function (t) {
        t.setUI32(this.uid),
          t.setUI32(this.topSid)
      }
  };
  de = function () {
    this.topSid = this.uid = 0,
      this.marshal = function (t) {
        t.setUI32(this.uid),
          t.setUI32(this.topSid)
      }
  }
    ;
  var ce = function () {
    this.sid = this.uid = 0,
      this.reason = "",
      this.mode = this.kickType = this.toChannel = this.admin = this.seconds = 0,
      this.uinfos = [],
      this.unmarshal = function (t) {
        this.uid = t.getUI32(),
          this.sid = t.getUI32();
        var e = t.getUI16();
        this.reason = t.getUTF8(e),
          this.seconds = t.getUI32(),
          this.admin = t.getUI32(),
          this.toChannel = t.getUI32(),
          this.kickType = t.getUI32(),
          this.mode = t.getUI8();
        for (var s = t.getUI32(), i = 0; i < s; ++i) {
          var n = {};
          n.uid = t.getUI32(),
            e = t.getUI16(),
            n.nick = t.getUTF8(e),
            e = t.getUI16(),
            n.sign = t.getUTF8(e),
            n.pid = t.getUI32(),
            n.jifen = t.getUI32(),
            n.sjifen = t.getUI32(),
            n.gender = t.getUI8(),
            n.rolers = [];
          for (var o = t.getUI32(), a = 0; a < o; a++) {
            var r = {};
            r.cid = t.getUI32(),
              r.roler = t.getUI16(),
              n.rolers.push(r)
          }
          for (n.ip = t.getUI32(),
            e = t.getUI16(),
            n.pcInfo = t.getUTF8(e),
            n.extInfo = {},
            o = t.getUI32(),
            a = 0; a < o; ++a)
            r = t.getUI8(),
              e = t.getUI16(),
              e = t.getUTF8(e),
              n.extInfo[r.toString()] = e;
          this.uinfos.push(n)
        }
      }
  }
    , fe = function () {
      this.fontEffects = 0,
        this.fontName = "",
        this.color = 0,
        this.height = 16,
        this.msg = "",
        this.sd = 0,
        this.marshal = function (t) {
          t.setUI32(this.fontEffects),
            t.setUTF8(this.fontName, 32),
            t.setUI32(this.color),
            t.setUI32(this.height),
            t.setUCS2(this.msg, 32),
            t.setUI32(this.sd)
        }
        ,
        this.unmarshal = function (t) {
          this.fontEffects = t.getUI32();
          var e = t.getUI32();
          this.fontName = t.getUTF8(e),
            this.color = t.getUI32(),
            this.height = t.getUI32(),
            e = t.getUI32(),
            this.msg = t.getUCS2(e),
            this.sd = t.getUI32()
        }
    }
    , ge = function () {
      this.subSid = this.topSid = this.from = 0,
        this.chat = null,
        this.nick = this.reserve2 = this.reserve1 = "",
        this.yyid = 0,
        this.extra = {},
        this.marshal = function (t) {
          t.setUI32(this.from),
            t.setUI32(this.topSid),
            t.setUI32(this.subSid);
          var e = new Te(null, 0, 0, 0, 0);
          t.save(e),
            t.setUI16(0),
            t.setMarshal(this.chat);
          var s = new Te(null, 0, 0, 0, 0);
          for (t.save(s),
            t.restore(e),
            t.setUI32(s.length - e.length - 2),
            t.restore(s),
            t.setUTF8(this.reserve1, 16),
            t.setUTF8(this.reserve2, 16),
            t.setUTF8(this.nick, 16),
            e = Object.keys(this.extra),
            t.setUI32(e.length),
            s = 0; s < e.length; ++s)
            t.setUI16(parseInt(e[s])),
              t.setUTF8(this.extra[e[s]], 16)
        }
        ,
        this.unmarshal = function (t) {
          this.from = t.getUI32(),
            this.topSid = t.getUI32(),
            this.subSid = t.getUI32(),
            t.getUI16(),
            this.chat = new fe,
            t.getMarshal(this.chat);
          var e = t.getUI16();
          this.reserve1 = t.getUTF8(e),
            e = t.getUI16(),
            this.reserve2 = t.getUTF8(e),
            e = t.getUI16(),
            this.nick = t.getUTF8(e);
          for (var s = t.getUI32(), i = 0; i < s; ++i) {
            var n = t.getUI16();
            e = t.getUI16(),
              e = t.getUTF8(e),
              this.extra[n.toString()] = e
          }
          this.yyid = this.extra[4]
        }
    }
    , pe = function () {
      this.us = {},
        this.unmarshal = function (t) {
          for (var e = t.getUI32(), s = 0; s < e; ++s)
            for (var i = t.getUI32(), n = 0; n < i; ++n) {
              var o = t.getUI32()
                , a = t.getUI32();
              void 0 === this.us[o.toString()] && (this.us[o.toString()] = []),
                this.us[o.toString()].push(a)
            }
        }
    }
    , _e = function () {
      this.uid = 0,
        this.disable = !1,
        this.mode = this.admin = this.subSid = 0,
        this.uinfos = [],
        this.reason = "",
        this.unmarshal = function (t) {
          this.uid = t.getUI32(),
            this.disable = t.getUI8(),
            this.subSid = t.getUI32(),
            this.admin = t.getUI32(),
            this.mode = t.getUI8()
        }
    }
    , ve = function () {
      this.from = "",
        this.res_code = this.ruri = 0,
        this.payload = "",
        this.uid = this.appid = this.realUri = 0,
        this.vecProxyId = [],
        this.vecS2SId = [],
        this.routeNum = this.clientPort = this.clientIp = this.codec = 0,
        this.srvName = "",
        this.clientFromType = 0,
        this.clientFromExt = "",
        this.extentProps = {},
        this.clientCtx = "",
        this.marshal = function (t) {
          t.setUTF8(this.from, 16),
            t.setUI32(this.ruri),
            t.setUI16(this.res_code),
            t.packPayload(this.payload, 32);
          var e = new Te(null, 0, 0, 0, 0);
          t.save(e),
            t.setUI32(0),
            t.setUI32(16777224),
            t.setUI32(this.realUri),
            t.setUI32(33554448),
            t.setUI32(this.appid),
            t.setUI32(this.uid),
            t.setUI32(0);
          var s = 8 * this.vecProxyId.length + 12 + 8 * this.vecS2SId.length;
          t.setUI32(67108864 | 16777215 & s),
            t.setUI32(this.vecProxyId.length);
          for (var i = 0; i < this.vecProxyId.length; ++i)
            t.setUI64(this.vecProxyId[i]);
          for (t.setUI32(this.vecS2SId.length),
            i = 0; i < this.vecS2SId.length; ++i)
            t.setUI64(this.vecS2SId[i]);
          t.setUI32(83886088),
            t.setUI32(this.codec),
            s = 16 + Ce.sizeof(this.srvName) + 4 + 2 + Ce.sizeof(this.clientFromExt),
            t.setUI32(100663296 | 16777215 & s),
            t.setUI32(this.clientIp),
            t.setUI16(this.clientPort),
            t.setUI32(this.routeNum),
            t.setUTF8(this.srvName, 16),
            t.setUI32(this.clientFromType),
            t.setUTF8(this.clientFromExt, 16),
            s = 8;
          var n = Object.keys(this.extentProps);
          for (i = 0; i < n.length; ++i)
            s += 4,
              s += 2 + this.extentProps[n[i]].byteLength;
          for (t.setUI32(117440512 | 16777215 & s),
            t.setUI32(n.length),
            i = 0; i < n.length; ++i)
            t.setUI32(parseInt(n[i])),
              t.setBytes(this.extentProps[n[i]], 16);
          s = 6 + Ce.sizeof(this.clientCtx),
            t.setUI32(134217728 | 16777215 & s),
            t.setUTF8(this.clientCtx, 16),
            t.setUI32(4286085240),
            i = new Te(null, 0, 0, 0, 0),
            t.save(i),
            t.restore(e),
            s = 0 | i.length - e.length - 4 & 268435455,
            t.setUI32(s),
            t.restore(i)
        }
        ,
        this.unmarshal = function (t) {
          var e = t.getUI16();
          for (this.from = t.getUTF8(e),
            this.ruri = t.getUI32(),
            this.res_code = t.getUI16(),
            e = t.getUI32(),
            this.payload = t.getBytes(e),
            t.getUI32(),
            e = (e = t.getUI32()) >> 24 & 255; 255 != e;) {
            switch (e) {
              case 1:
                this.realUri = t.getUI32();
                break;
              case 2:
                this.appid = t.getUI32(),
                  this.uid = t.getUI32(),
                  t.getUI32();
                break;
              case 4:
                var s = t.getUI32();
                for (e = 0; e < s; ++e)
                  this.vecProxyId.push(t.getUI64());
                for (s = t.getUI32(),
                  e = 0; e < s; ++e)
                  this.vecS2SId.push(t.getUI64());
                break;
              case 5:
                this.codec = t.getUI32();
                break;
              case 6:
                this.clientIp = t.getUI32(),
                  this.clientPort = t.getUI16(),
                  this.routeNum = t.getUI32(),
                  e = t.getUI16(),
                  this.srvName = t.getUTF8(e),
                  this.clientFromType = t.getUI32(),
                  e = t.getUI16(),
                  this.clientFromExt = t.getUTF8(e);
                break;
              case 7:
                for (s = t.getUI32(),
                  e = 0; e < s; ++e) {
                  var i = t.getUI32()
                    , n = t.getUI16();
                  n = t.getBytes(n),
                    this.extentProps[i.toString()] = n
                }
                break;
              case 8:
                e = t.getUI16(),
                  this.clientCtx = t.getUTF8(e)
            }
            e = (e = t.getUI32()) >> 24 & 255
          }
        }
    }
    , be = function () {
      this.uid = 0,
        this.grpIdSet = [],
        this.extraInfo = "",
        this.marshal = function (t) {
          t.setUI32(this.uid),
            t.setUI32(0),
            t.setUI32(this.grpIdSet.length);
          for (var e = 0; e < this.grpIdSet.length; ++e)
            t.setUI32(this.grpIdSet[e].grpTypeLow),
              t.setUI32(this.grpIdSet[e].grpTypeHigh),
              t.setUI32(this.grpIdSet[e].grpIdLow),
              t.setUI32(this.grpIdSet[e].grpIdHigh);
          t.setUTF8(this.extraInfo, 16)
        }
        ,
        this.unmarshal = function (t) {
          this.uid = t.getUI32(),
            t.getUI32();
          for (var e = t.getUI32(), s = 0; s < e; ++s) {
            var i = {};
            i.grpType = t.getUI64(),
              i.grpId = t.getUI64(),
              this.grpIdSet.push(i)
          }
          e = t.getUI16(),
            this.extraInfo = t.getUTF8(e)
        }
    }
    , Ue = function () {
      this.grpId = this.grpType = "",
        this.appid = 0,
        this.srvId = this.seqNum = this.msg = "",
        this.ruri = 0,
        this.subSvcName = "",
        this.unmarshal = function (t) {
          this.grpType = t.getUI64(),
            this.grpId = t.getUI64(),
            this.appid = t.getUI32();
          var e = t.getUI32();
          this.msg = new Uint8Array(t.getBytes(e)),
            t.empty() || (this.seqNum = t.getUI64()),
            t.empty() || (this.srvId = t.getUI64()),
            t.empty() || (this.ruri = t.getUI32()),
            t.empty() || (e = t.getUI16(),
              this.subSvcName = t.getUTF8(e))
        }
    }
    , Ie = function () {
      this.uid = 0,
        this.appids = [],
        this.marshal = function (t) {
          t.setUI32(this.uid),
            t.setUI32(0),
            t.setUI32(this.appids.length);
          for (var e = 0; e < this.appids.length; ++e)
            t.setUI32(this.appids[e])
        }
    }
    , me = function () {
      this.uid = 0,
        this.sign = this.nick = "",
        this.gender = 1,
        this.yyid = 0,
        this.sname = "",
        this.unmarshal = function (t) {
          this.uid = t.getUI32();
          var e = t.getUI16();
          this.nick = t.getUTF8(e),
            e = t.getUI16(),
            this.sign = t.getUTF8(e),
            this.yyid = t.getUI32(),
            e = t.getUI16(),
            this.sname = t.getUTF8(e),
            this.gender = t.getUI8()
        }
    }
    , ye = function () {
      this.props = {},
        this.unmarshal = function (t) {
          for (var e = t.getUI32(), s = 0; s < e; ++s) {
            var i = t.getUI8()
              , n = t.getUI32();
            5 == i ? this.props.contribution = n : 3 == i && (this.props.subSid = n)
          }
          for (e = t.getUI32(),
            s = 0; s < e; ++s)
            if (i = t.getUI8(),
              n = t.getUI16(),
              n = t.getBytes(n),
              17 == i) {
              this.props.role = [],
                i = new xe(n),
                n = i.getUI32();
              for (var o = 0; o < n; ++o) {
                var a = i.getUI32()
                  , r = i.getUI16();
                this.props.role.push({
                  subSid: a,
                  role: r
                })
              }
            } else
              18 == i && (this.props.nick = Ce.decode(n))
        }
    }
    , ke = function () {
      function t(t, e) {
        for (var s = 0; s < e.length; s++) {
          var i = e[s];
          i.enumerable = i.enumerable || !1,
            i.configurable = !0,
            "value" in i && (i.writable = !0),
            Object.defineProperty(t, i.key, i)
        }
      }
      return function (e, s, i) {
        return s && t(e.prototype, s),
          i && t(e, i),
          e
      }
    }()
    , we = function () {
      function t() {
        z(this, t)
      }
      return ke(t, null, [{
        key: "read",
        value: function (t, e, s, i, n) {
          var o = 8 * n - i - 1
            , a = (1 << o) - 1
            , r = a >> 1
            , h = -7;
          n = s ? n - 1 : 0;
          var l = s ? -1 : 1
            , u = t[e + n];
          for (n += l,
            s = u & (1 << -h) - 1,
            u >>= -h,
            h += o; 0 < h; s = 256 * s + t[e + n],
            n += l,
            h -= 8)
            ;
          for (o = s & (1 << -h) - 1,
            s >>= -h,
            h += i; 0 < h; o = 256 * o + t[e + n],
            n += l,
            h -= 8)
            ;
          if (0 === s)
            s = 1 - r;
          else {
            if (s === a)
              return o ? NaN : 1 / 0 * (u ? -1 : 1);
            o += Math.pow(2, i),
              s -= r
          }
          return (u ? -1 : 1) * o * Math.pow(2, s - i)
        }
      }, {
        key: "write",
        value: function (t, e, s, i, n, o) {
          var a, r = 8 * o - n - 1, h = (1 << r) - 1, l = h >> 1, u = 23 === n ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
          o = i ? 0 : o - 1;
          var d = i ? 1 : -1
            , c = 0 > e || 0 === e && 0 > 1 / e ? 1 : 0;
          for (e = Math.abs(e),
            isNaN(e) || 1 / 0 === e ? (e = isNaN(e) ? 1 : 0,
              i = h) : (i = Math.floor(Math.log(e) / Math.LN2),
                1 > e * (a = Math.pow(2, -i)) && (i-- ,
                  a *= 2),
                2 <= (e = 1 <= i + l ? e + u / a : e + u * Math.pow(2, 1 - l)) * a && (i++ ,
                  a /= 2),
                i + l >= h ? (e = 0,
                  i = h) : 1 <= i + l ? (e = (e * a - 1) * Math.pow(2, n),
                    i += l) : (e = e * Math.pow(2, l - 1) * Math.pow(2, n),
                      i = 0)); 8 <= n; t[s + o] = 255 & e,
                      o += d,
                      e /= 256,
            n -= 8)
            ;
          for (i = i << n | e,
            r += n; 0 < r; t[s + o] = 255 & i,
            o += d,
            i /= 256,
            r -= 8)
            ;
          t[s + o - d] |= 128 * c
        }
      }]),
        t
    }()
    , Se = function () {
      function t() {
        z(this, t)
      }
      return ke(t, null, [{
        key: "sizeof",
        value: function (t) {
          return 2 * t.length
        }
      }, {
        key: "encode",
        value: function (e) {
          for (var s = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 1, i = 0, n = (2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null) || new Uint8Array(t.sizeof(e)), o = 0; o < e.length; ++o) {
            var a = e.charCodeAt(o);
            1 === s ? (n[i++] = a,
              n[i++] = a >> 8) : (n[i++] = a >> 8,
                n[i++] = a)
          }
          return n
        }
      }, {
        key: "decode",
        value: function (t) {
          var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 1;
          if (1 == (1 & t.length))
            throw new RangeError("Invalid buffer length.");
          for (var s, i = "", n = 0; n < t.length; n += 2)
            s = 1 === e ? t[n] | t[n + 1] << 8 : t[n] << 8 | t[n + 1],
              i += String.fromCharCode(s);
          return i
        }
      }]),
        t
    }()
    , Ce = function () {
      function t() {
        z(this, t)
      }
      return ke(t, null, [{
        key: "sizeof",
        value: function (t) {
          for (var e = 0, s = 0; s < t.length; ++s) {
            var i = t.charCodeAt(s);
            if (55296 <= i && 56319 >= i && s + 1 < t.length) {
              var n = t.charCodeAt(s + 1);
              if (56320 <= n && 57343 >= n) {
                ++s,
                  e += 4;
                continue
              }
            }
            e += 127 >= i ? 1 : 2047 >= i ? 2 : 3
          }
          return e
        }
      }, {
        key: "encode",
        value: function (e) {
          for (var s = (1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null) || new Uint8Array(t.sizeof(e)), i = 0, n = 0; n < e.length; ++n) {
            var o = e.charCodeAt(n);
            if (55296 <= o && 56319 >= o && n + 1 < e.length) {
              var a = e.charCodeAt(n + 1);
              56320 <= a && 57343 >= a && (++n,
                o = 65536 + ((1023 & o) << 10 | 1023 & a))
            }
            55296 <= o && 57343 >= o && (o = 65533),
              127 >= o ? s[i++] = o : (2047 >= o ? s[i++] = 192 + (o >>> 6) : (65535 >= o ? s[i++] = 224 + (o >>> 12) : (s[i++] = 240 + (o >>> 18),
                s[i++] = 128 + (o >>> 12 & 63)),
                s[i++] = 128 + (o >>> 6 & 63)),
                s[i++] = 128 + (63 & o))
          }
          return s
        }
      }, {
        key: "decode",
        value: function (t) {
          for (var e = "", s = 0; s < t.length; ++s) {
            var i = t[s];
            if (128 <= i) {
              var n = 0;
              if (194 > i || 244 < i)
                i = 65533;
              else
                switch (!0) {
                  case 240 == (240 & i):
                    s + 2 >= t.length ? (i = 65533,
                      n = 0) : (n = t[s + 1],
                        240 == i && 144 > n || 244 == i && 143 < n ? (i = 65533,
                          n = 0) : (i &= 7,
                            n = 3));
                    break;
                  case 224 == (224 & i):
                    s + 2 >= t.length ? (i = 65533,
                      n = 0) : (n = t[s + 1],
                        224 == i && 160 > n || 237 == i && 159 < n ? (i = 65533,
                          n = 0) : (i &= 15,
                            n = 2));
                    break;
                  case 192 == (192 & i):
                    s + 1 >= t.length ? (i = 65533,
                      n = 0) : (i &= 31,
                        n = 1);
                    break;
                  default:
                    i = 65533
                }
              for (var o = s, a = 1; a <= n; ++a) {
                var r = t[a + o];
                if (!(128 <= r && 191 >= r)) {
                  i = 65533;
                  break
                }
                ++s,
                  i = i << 6 | 63 & r
              }
            }
            65536 <= i ? e += String.fromCharCode(55232 + (i >> 10), 56320 + (1023 & i)) : 65279 != i && (e += String.fromCharCode(i))
          }
          return e
        }
      }]),
        t
    }()
    , Te = function t() {
      var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : null
        , s = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0
        , i = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 0
        , n = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : 0
        , o = 4 < arguments.length && void 0 !== arguments[4] ? arguments[4] : 0;
      z(this, t),
        this.buffer = e,
        this.points = s,
        this.offlen = i,
        this.offset = n,
        this.length = o
    }
    , xe = function () {
      function t() {
        z(this, t),
          this._buffer = t.from.apply(t, arguments),
          this._offlen = this._offset = 0,
          this._length = this._buffer.length,
          this._chunks = [this._buffer],
          this._points = 0,
          this._totals = this._buffer.length,
          this._endian = t.LITTLE_ENDIAN
      }
      return ke(t, null, [{
        key: "from",
        value: function () {
          var t = 0 >= arguments.length ? void 0 : arguments[0];
          if (0 == arguments.length || null === t || void 0 === t)
            return new Uint8Array(0);
          if ("number" == typeof t || Array.isArray(t))
            return new Uint8Array(t);
          if (t instanceof ArrayBuffer) {
            var e = 1 >= arguments.length ? null : arguments[1]
              , s = 2 >= arguments.length ? void 0 : arguments[2];
            return null != e && null != s ? new Uint8Array(t, e, s) : null != e ? new Uint8Array(t, e) : null != s ? new Uint8Array(t, 0, s) : new Uint8Array(t)
          }
          return t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Uint16Array || t instanceof Uint32Array || t instanceof Int8Array || t instanceof Int16Array || t instanceof Int32Array || t instanceof Float32Array || t instanceof Float64Array || t instanceof DataView ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : new Uint8Array(t >> 0)
        }
      }, {
        key: "dispose",
        value: function () {
          t.__SWAP_ARRAY__ = new Uint8Array(32)
        }
      }]),
        ke(t, [{
          key: "alloc",
          value: function (e) {
            this._totals >= e || (e = new Uint8Array(t.__CHUNK_SIZE__ * Math.ceil((e - this._totals) / t.__CHUNK_SIZE__)),
              this._chunks.push(e),
              this._totals += e.length,
              this.position = this.position)
          }
        }, {
          key: "reset",
          value: function () {
            this._chunks = [this._buffer = new Uint8Array(0)],
              this._totals = this._points = this._length = this._offlen = this._offset = 0
          }
        }, {
          key: "save",
          value: function () {
            var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : null;
            return t ? (t.buffer = this._buffer,
              t.points = this._points,
              t.offlen = this._offlen,
              t.offset = this._offset,
              t.length = this._length,
              t) : new Te(this._buffer, this._points, this._offlen, this._offset, this._length)
          }
        }, {
          key: "restore",
          value: function (t) {
            if (t.buffer !== this._chunks[t.points])
              throw Error("Invaild buffer state");
            this._offlen = t.offlen,
              this._offset = t.offset,
              this._points = t.points,
              this._length = t.length,
              this._buffer = this._chunks[this._points],
              this.position = this.position
          }
        }, {
          key: "push",
          value: function () {
            var e = t.from.apply(t, arguments);
            0 < e.length && (this.reduce(),
              this._chunks.push(e),
              this._length += e.length,
              this._totals += e.length,
              this.position = this.position)
          }
        }, {
          key: "reduce",
          value: function () {
            this._totals > this._length && (this._totals = this._length,
              this._chunks = this.chunks,
              this._chunks.length || this._chunks.push(new Uint8Array(0)),
              this._offset = this.position,
              this._points = this._offlen = 0,
              this._buffer = this._chunks[0],
              this._onval(this._offset))
          }
        }, {
          key: "concat",
          value: function () {
            this._offset = this._offlen + this._offset,
              this._points = this._offlen = 0;
            var t = this.chunks
              , e = 0;
            if (1 == t.length)
              this._buffer = t[0],
                this._chunks = [this._buffer];
            else {
              this._buffer = new Uint8Array(this._length),
                this._chunks = [this._buffer];
              for (var s = 0; s < t.length; ++s)
                this._buffer.set(t[s], (e += t[s].length) - t[s].length)
            }
          }
        }, {
          key: "toArrayBuffer",
          value: function () {
            return this.concat(),
              this._buffer.buffer.slice(0, this._length)
          }
        }, {
          key: "toTypedBuffer",
          value: function () {
            return this.concat(),
              this._buffer.subarray(0, this._length)
          }
        }, {
          key: "empty",
          value: function () {
            return 0 == this._length - this._offset
          }
        }, {
          key: "compress",
          value: function () {
            var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : t.ZLIB
              , s = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null;
            if (e === t.LZMA)
              throw Error('The "LZMA" algorithm does not supported');
            e === t.DEFLATE && ((s = s || {}).raw = !0),
              e = this.avails;
            var i = []
              , n = new j(s);
            for (n.onData = function (t) {
              i.push(t)
            }
              ,
              n.onEnd = function (t) {
                if (t)
                  throw Error(n.strm.msg || t)
              }
              ,
              s = 0; s < e.length; ++s)
              n.push(e[s], s == e.length - 1);
            return i
          }
        }, {
          key: "decompress",
          value: function () {
            var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : t.ZLIB
              , s = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null;
            if (e === t.LZMA)
              throw Error('The "LZMA" algorithm does not supported');
            e === t.DEFLATE && ((s = s || {}).raw = !0),
              e = this.avails;
            var i = []
              , n = new D(s);
            for (n.onData = function (t) {
              i.push(t)
            }
              ,
              n.onEnd = function (t) {
                if (t)
                  throw Error(n.strm.msg || t)
              }
              ,
              s = 0; s < e.length; ++s)
              n.push(e[s], s == e.length - 1);
            return i
          }
        }, {
          key: "dump",
          value: function () {
            var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 256;
            if (0 > t || 256 < t)
              throw new RangeError('Dump "size" must be positive value and less than "256"');
            var e = "[Buffer remain=" + this.remain + ", position=" + this.position + ", length=" + this.length + "]\n";
            e = e + "  Properties:\n    _points: " + this._points + "\n",
              e += "    _offset: " + this._offset + "\n",
              e += "    _offlen: " + this._offlen + "\n",
              e += "    _length: " + this._length + "\n",
              e += "    _totals: " + this._totals + "\n",
              e += "  Chunks(" + this._chunks.length + "):\n";
            for (var s = 0; s < this._chunks.length; ++s)
              e += "    [" + s + "]: " + this._chunks[s].length + " bytes\n";
            if (0 < t) {
              e += ".======================================================.\n| RC | 00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f |\n|------------------------------------------------------|\n";
              var i = [];
              for (s = this.save(); t-- && this.remain;)
                i.push(("0" + this.getUI8().toString(16)).slice(-2));
              for (this.restore(s),
                s = (16 - i.length % 16) % 16; 0 < s; --s)
                i.push("  ");
              for (t = s = 0; s + 16 <= i.length; s += 16,
                ++t)
                e += "| " + ("0" + t.toString(16)).slice(-2) + " | ",
                  e += i.slice(s, s + 16).join(" "),
                  e += " |\n";
              0 >= i.length && (e += "| 00 | No values                                       |\n"),
                e += "'======================================================'\n"
            }
            return e
          }
        }, {
          key: "_onget",
          value: function (t) {
            if (t > this.remain)
              throw new RangeError("Offset is outside the bounds of the buffer")
          }
        }, {
          key: "_onset",
          value: function (t) {
            t > this.remain && (this.length = this.position + t)
          }
        }, {
          key: "_onval",
          value: function (t) {
            for (; this._offset >= this._buffer.length && this._points + 1 < this._chunks.length;) {
              var e = this._buffer.length;
              this._offlen += e,
                this._offset -= e,
                this._buffer = this._chunks[++this._points]
            }
            return t
          }
        }, {
          key: "_slice",
          value: function () {
            for (var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0, e = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 0, s = [], i = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0; 0 < e && i < this._chunks.length; ++i,
              e -= o) {
              var n = this._chunks[i];
              if (0 == t) {
                var o = n.length;
                n = o <= e ? n : n.subarray(0, e)
              } else
                o = n.length - t,
                  n = o <= e ? n.subarray(t) : n.subarray(t, t + e),
                  t = 0;
              0 < n.length && s.push(n)
            }
            return s
          }
        }, {
          key: "getBool",
          value: function () {
            return this._onget(1),
              !!this._onval(this._buffer[this._offset++])
          }
        }, {
          key: "setBool",
          value: function (t) {
            this._onset(1),
              this._onval(this._buffer[this._offset++] = t ? 1 : 0)
          }
        }, {
          key: "getUI8",
          value: function () {
            return this._onget(1),
              this._onval(this._buffer[this._offset++])
          }
        }, {
          key: "setUI8",
          value: function (t) {
            this._onset(1),
              this._onval(this._buffer[this._offset++] = t)
          }
        }, {
          key: "getSI8",
          value: function () {
            return this._onget(1),
              this._onval(this._buffer[this._offset++]) << 24 >> 24
          }
        }, {
          key: "setSI8",
          value: function (t) {
            this._onset(1),
              this._onval(this._buffer[this._offset++] = t)
          }
        }, {
          key: "getUI16",
          value: function () {
            this._onget(2);
            var e = this._onval(this._buffer[this._offset++])
              , s = this._onval(this._buffer[this._offset++]);
            return this._endian === t.LITTLE_ENDIAN ? e | s << 8 : s | e << 8
          }
        }, {
          key: "setUI16",
          value: function (e) {
            this._onset(2),
              this._endian === t.LITTLE_ENDIAN ? (this._onval(this._buffer[this._offset++] = e),
                this._onval(this._buffer[this._offset++] = e >> 8)) : (this._onval(this._buffer[this._offset++] = e >> 8),
                  this._onval(this._buffer[this._offset++] = e))
          }
        }, {
          key: "getSI16",
          value: function () {
            this._onget(2);
            var e = this._onval(this._buffer[this._offset++])
              , s = this._onval(this._buffer[this._offset++]);
            return this._endian === t.LITTLE_ENDIAN ? (e | s << 8) << 16 >> 16 : (s | e << 8) << 16 >> 16
          }
        }, {
          key: "setSI16",
          value: function (e) {
            this._onset(2),
              this._endian === t.LITTLE_ENDIAN ? (this._onval(this._buffer[this._offset++] = e),
                this._onval(this._buffer[this._offset++] = e >> 8)) : (this._onval(this._buffer[this._offset++] = e >> 8),
                  this._onval(this._buffer[this._offset++] = e))
          }
        }, {
          key: "getUI24",
          value: function () {
            this._onget(3);
            var e = this._onval(this._buffer[this._offset++])
              , s = this._onval(this._buffer[this._offset++])
              , i = this._onval(this._buffer[this._offset++]);
            return this._endian === t.LITTLE_ENDIAN ? e | s << 8 | i << 16 : i | s << 8 | e << 16
          }
        }, {
          key: "setUI24",
          value: function (e) {
            this._onset(3),
              this._endian === t.LITTLE_ENDIAN ? (this._onval(this._buffer[this._offset++] = e),
                this._onval(this._buffer[this._offset++] = e >> 8),
                this._onval(this._buffer[this._offset++] = e >> 16)) : (this._onval(this._buffer[this._offset++] = e >> 16),
                  this._onval(this._buffer[this._offset++] = e >> 8),
                  this._onval(this._buffer[this._offset++] = e))
          }
        }, {
          key: "getUI32",
          value: function () {
            this._onget(4);
            var e = this._onval(this._buffer[this._offset++])
              , s = this._onval(this._buffer[this._offset++])
              , i = this._onval(this._buffer[this._offset++])
              , n = this._onval(this._buffer[this._offset++]);
            return this._endian === t.LITTLE_ENDIAN ? (e | s << 8 | i << 16 | n << 24) >>> 0 : (n | i << 8 | s << 16 | e << 24) >>> 0
          }
        }, {
          key: "setUI32",
          value: function (e) {
            this._onset(4),
              this._endian === t.LITTLE_ENDIAN ? (this._onval(this._buffer[this._offset++] = e),
                this._onval(this._buffer[this._offset++] = e >> 8),
                this._onval(this._buffer[this._offset++] = e >> 16),
                this._onval(this._buffer[this._offset++] = e >> 24)) : (this._onval(this._buffer[this._offset++] = e >> 24),
                  this._onval(this._buffer[this._offset++] = e >> 16),
                  this._onval(this._buffer[this._offset++] = e >> 8),
                  this._onval(this._buffer[this._offset++] = e))
          }
        }, {
          key: "getUI64",
          value: function () {
            this._onget(8);
            var t = this._onval(this._buffer[this._offset++])
              , e = this._onval(this._buffer[this._offset++])
              , s = this._onval(this._buffer[this._offset++])
              , i = this._onval(this._buffer[this._offset++])
              , n = this._onval(this._buffer[this._offset++])
              , o = this._onval(this._buffer[this._offset++])
              , a = this._onval(this._buffer[this._offset++])
              , r = this._onval(this._buffer[this._offset++]);
            return t.toString(16) + ":" + e.toString(16) + ":" + s.toString(16) + ":" + i.toString(16) + ":" + n.toString(16) + ":" + o.toString(16) + ":" + a.toString(16) + ":" + r.toString(16)
          }
        }, {
          key: "setUI64",
          value: function (t) {
            if (this._onset(8),
              8 != (t = t.split(":")).length)
              throw new RangeError("input string invalid");
            for (var e = 0; e < t.length; ++e)
              this._onval(this._buffer[this._offset++] = parseInt(t[e], 16))
          }
        }, {
          key: "getSI32",
          value: function () {
            this._onget(4);
            var e = this._onval(this._buffer[this._offset++])
              , s = this._onval(this._buffer[this._offset++])
              , i = this._onval(this._buffer[this._offset++])
              , n = this._onval(this._buffer[this._offset++]);
            return this._endian === t.LITTLE_ENDIAN ? e | s << 8 | i << 16 | n << 24 : n | i << 8 | s << 16 | e << 24
          }
        }, {
          key: "setSI32",
          value: function (e) {
            this._onset(4),
              this._endian === t.LITTLE_ENDIAN ? (this._onval(this._buffer[this._offset++] = e),
                this._onval(this._buffer[this._offset++] = e >> 8),
                this._onval(this._buffer[this._offset++] = e >> 16),
                this._onval(this._buffer[this._offset++] = e >> 24)) : (this._onval(this._buffer[this._offset++] = e >> 24),
                  this._onval(this._buffer[this._offset++] = e >> 16),
                  this._onval(this._buffer[this._offset++] = e >> 8),
                  this._onval(this._buffer[this._offset++] = e))
          }
        }, {
          key: "getFL32",
          value: function () {
            return this._onget(4),
              4 <= this._buffer.length - this._offset ? we.read(this._buffer, this._onval((this._offset += 4) - 4), this._endian === t.LITTLE_ENDIAN, 23, 4) : we.read(this.getBytes(4), 0, this._endian === t.LITTLE_ENDIAN, 23, 4)
          }
        }, {
          key: "setFL32",
          value: function (e) {
            this._onset(4),
              4 <= this._buffer.length - this._offset ? we.write(this._buffer, e, this._onval((this._offset += 4) - 4), this._endian === t.LITTLE_ENDIAN, 23, 4) : (we.write(t.__SWAP_ARRAY__, e, 0, this._endian === t.LITTLE_ENDIAN, 23, 4),
                this.setBytes(t.__SWAP_ARRAY__.subarray(0, 4)))
          }
        }, {
          key: "getFL64",
          value: function () {
            return this._onget(8),
              8 <= this._buffer.length - this._offset ? we.read(this._buffer, this._onval((this._offset += 8) - 8), this._endian === t.LITTLE_ENDIAN, 52, 8) : we.read(this.getBytes(8), 0, this._endian === t.LITTLE_ENDIAN, 52, 8)
          }
        }, {
          key: "setFL64",
          value: function (e) {
            this._onset(8),
              8 <= this._buffer.length - this._offset ? we.write(this._buffer, e, this._onval((this._offset += 8) - 8), this._endian === t.LITTLE_ENDIAN, 52, 8) : (we.write(t.__SWAP_ARRAY__, e, 0, this._endian === t.LITTLE_ENDIAN, 52, 8),
                this.setBytes(t.__SWAP_ARRAY__.subarray(0, 8)))
          }
        }, {
          key: "getUTF8",
          value: function (e) {
            return t.__HAS_TEXT_ENCODER__ ? t.__UTF8_TEXT_DECODER__.decode(this.getBytes(e)) : Ce.decode(this.getBytes(e))
          }
        }, {
          key: "setUTF8",
          value: function (e) {
            var s = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : t.NO_LEN;
            if (t.__HAS_TEXT_ENCODER__)
              this.setBytes(t.__UTF8_TEXT_ENCODER__.encode(e), s);
            else {
              var i = Ce.sizeof(e);
              i > t.__SWAP_ARRAY__.length && (t.__SWAP_ARRAY__ = new Uint8Array(i)),
                this.setBytes(Ce.encode(e, t.__SWAP_ARRAY__.subarray(0, i)), s)
            }
          }
        }, {
          key: "getUCS2",
          value: function (t) {
            return Se.decode(this.getBytes(t), this._endian)
          }
        }, {
          key: "setUCS2",
          value: function (e) {
            var s = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : t.NO_LEN
              , i = Se.sizeof(e);
            i > t.__SWAP_ARRAY__.length && (t.__SWAP_ARRAY__ = new Uint8Array(i)),
              this.setBytes(Se.encode(e, this._endian, t.__SWAP_ARRAY__.subarray(0, i)), s)
          }
        }, {
          key: "getBytes",
          value: function (e) {
            if (0 > e)
              throw new RangeError("Offset is outside the bounds of the buffer");
            this._onget(e);
            var s = this._buffer.length - this._offset;
            if (s >= e)
              return this._onval(this._buffer.subarray(this._offset, this._offset += e));
            for (e > t.__SWAP_ARRAY__.length && (t.__SWAP_ARRAY__ = new Uint8Array(e)),
              t.__SWAP_ARRAY__.set(this._buffer.subarray(this._offset), 0),
              this._offlen += this._buffer.length,
              this._offset = 0,
              this._buffer = this._chunks[++this._points]; this._buffer.length < e - s;)
              t.__SWAP_ARRAY__.set(this._buffer, s),
                s += this._buffer.length,
                this._offlen += this._buffer.length,
                this._buffer = this._chunks[++this._points];
            return t.__SWAP_ARRAY__.set(this._buffer.subarray(0, this._onval(this._offset = e - s)), s),
              t.__SWAP_ARRAY__.subarray(0, e)
          }
        }, {
          key: "setBytes",
          value: function (e) {
            var s = e.length
              , i = this._buffer.length - this._offset;
            switch (1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : t.NO_LEN) {
              case t.LEN_UINT16:
                if (this._onset(2 + s),
                  65535 < s)
                  throw new RangeError('The length of bytes is large than "0xFFFF"');
                this.setUI16(s);
                break;
              case t.LEN_UINT32:
                if (this._onset(4 + s),
                  4294967295 < s)
                  throw new RangeError('The length of bytes is large than "0xFFFFFFFF"');
                this.setUI32(s);
                break;
              default:
                this._onset(s)
            }
            if (i >= s)
              this._buffer.set(e, this._onval((this._offset += s) - s));
            else
              for (i = 0; i < s;) {
                var n = Math.min(this._buffer.length - this._offset, s - i);
                this._buffer.set(e.subarray(i, i += n), this._onval((this._offset += n) - n))
              }
          }
        }, {
          key: "getMarshal",
          value: function (t) {
            return t.unmarshal(this),
              t
          }
        }, {
          key: "setMarshal",
          value: function (t) {
            t.marshal(this)
          }
        }, {
          key: "packPayload",
          value: function (e) {
            var s = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : t.NO_LEN
              , i = new Te(null, 0, 0, 0, 0);
            switch (this.save(i),
            s) {
              case t.LEN_UINT32:
                s = 4,
                  this.setUI32(0);
                break;
              default:
                s = 2,
                  this.setUI16(0)
            }
            this.setMarshal(e);
            var n = new Te(null, 0, 0, 0, 0);
            this.save(n),
              this.restore(i),
              this.setUI32(n.length - i.length - s),
              this.restore(n)
          }
        }, {
          key: "toString",
          value: function () {
            return "[Buffer remain=" + this.remain + ", position=" + this.position + ", length=" + this.length + "]"
          }
        }, {
          key: "endian",
          get: function () {
            return this._endian
          },
          set: function (e) {
            this._endian = e === t.BIG_ENDIAN ? t.BIG_ENDIAN : t.LITTLE_ENDIAN
          }
        }, {
          key: "position",
          get: function () {
            return this._offlen + this._offset
          },
          set: function (t) {
            if (0 > t)
              throw new RangeError('The "position" of buffer must be positive value');
            t < this._offlen && (this._points = this._offlen = 0,
              this._buffer = this._chunks[this._points]),
              this._onval(this._offset = t - this._offlen)
          }
        }, {
          key: "length",
          get: function () {
            return this._length
          },
          set: function (t) {
            if (0 > t)
              throw new RangeError('The "length" of buffer must be positive value');
            this.alloc(this._length = t)
          }
        }, {
          key: "remain",
          get: function () {
            return Math.max(0, this.length - this.position)
          }
        }, {
          key: "chunks",
          get: function () {
            return this._slice(0, 0, this.length)
          }
        }, {
          key: "avails",
          get: function () {
            return this._slice(this._points, this._offset, this.remain)
          }
        }]),
        t
    }();
  xe.__CHUNK_SIZE__ = 1024,
    xe.__SWAP_ARRAY__ = new Uint8Array(32),
    xe.BIG_ENDIAN = 0,
    xe.LITTLE_ENDIAN = 1,
    xe.DEFLATE = "deflate",
    xe.ZLIB = "zlib",
    xe.LZMA = "lzma",
    xe.NO_LEN = 0,
    xe.LEN_UINT16 = 16,
    xe.LEN_UINT32 = 32,
    xe.STATE = new Te(null, 0, 0, 0, 0),
    xe.__HAS_TEXT_ENCODER__ = "undefined" != typeof TextEncoder && "undefined" != typeof TextDecoder,
    xe.__UTF8_TEXT_ENCODER__ = xe.__HAS_TEXT_ENCODER__ ? new TextEncoder("utf-8") : null,
    xe.__UTF8_TEXT_DECODER__ = xe.__HAS_TEXT_ENCODER__ ? new TextDecoder("utf-8") : null,
    "function" != typeof Object.assign && (Object.assign = function (t) {
      if (void 0 === t || null === t)
        throw new TypeError("Cannot convert undefined or null to object");
      for (var e = Object(t), s = 1; s < arguments.length; s++) {
        var i = arguments[s];
        if (void 0 !== i && null !== i)
          for (var n in i)
            i.hasOwnProperty(n) && (e[n] = i[n])
      }
      return e
    }
    );
  var Le = function () {
    this.uri = 0,
      this.code = 200,
      this.buffer = new xe,
      this.marshal = function (t) {
        var e = new Te(null, 0, 0, 0, 0);
        this.buffer.save(e),
          this.buffer.setUI32(0),
          this.buffer.setUI32(this.uri),
          this.buffer.setUI16(this.code),
          this.buffer.setMarshal(t),
          t = new Te(null, 0, 0, 0, 0),
          this.buffer.save(t);
        var s = this.buffer.length;
        return this.buffer.restore(e),
          this.buffer.setUI32(s),
          this.buffer.restore(t),
          this.buffer.toArrayBuffer()
      }
  }
    , Ae = function (t) {
      if (0 < document.cookie.length) {
        var e = document.cookie.indexOf(t + "=");
        if (-1 != e) {
          e = e + t.length + 1;
          var s = document.cookie.indexOf(";", e);
          return -1 == s && (s = document.cookie.length),
            e = decodeURI(document.cookie.substring(e, s)),
            // console.log(" [svc_sdk] getCookie key:", t, "value:", e),
            e
        }
      }
      return console.log(" [svc_sdk] getCookie key:", t, "empty"),
        ""
    }
    , Ee = function (t, e, s) {
      var i = new Date;
      i.setDate(i.getDate() + s),
        //console.log(" [svc_sdk] setCookie key:", t, "value:", e, "expire:", i),
        document.cookie = t + "=" + encodeURI(e) + (null == s ? "" : ";expires=" + i.toGMTString())
    }
    , MeParent = function () {
      this.udbAppId = "yymwebh5",
        this.udbAppkey = "a8d7eef2",
        this.cookie = this.linkticket = this.ticket = null,
        this.yyid = this.uid = 0,
        this.credit = this.password = this.username = null,
        this.trySubSid = this.tryTopSid = this.subSid = this.topSid = 0,
        this.exclusiveJoin = !1,
        this.asid = 0,
        this.from = "yytianlaitv",
        this.channelJoined = this.loginedUDB = !1,
        this.userType = this.lastSentJoinChl = 0,
        this.nick = "",
        this.channelInfo = null,
        this.channelUserCount = {},
        this.micList = {},
        this.userInfos = {},
        this.bNeedOnlineChanUser = !1,
        this.wxappid = "",
        this.uuid = function (t) {
          var e = "";
          try {
            var s = document.createElement("canvas")
              , i = s.getContext("2d");
            i.fillStyle = "#f60",
              i.fillRect(0, 0, 8, 10),
              i.fillStyle = "#FF0000",
              i.fillText(t, 4, 17);
            var n, o = s.toDataURL().replace("data:image/png;base64,", ""), a = atob(o).slice(-16, -12);
            t = "";
            var r = 0;
            for (n = (a += "").length; r < n; r++) {
              var h = a.charCodeAt(r).toString(16);
              t += 2 > h.length ? "0" + h : h
            }
            e = t
              // console.log(" [svc_sdk] canvas uuid:", e)
          } catch (t) {
            for (e = [],
              a = 0; 8 > a; a++)
              e[a] = "0123456789abcdef".substr(Math.floor(16 * Math.random()), 1);
            e = e.join("")
              // console.log(" [svc_sdk] draw uuid canvas error. use random insted:", e)
          }
          for (r = [],
            a = 0; 28 > a; a++)
            r[a] = "0123456789abcdef".substr(Math.floor(16 * Math.random()), 1);
          return r[6] = "4",
            r[11] = "0123456789abcdef".substr(3 & r[19] | 8, 1),
            r[0] = r[5] = r[10] = r[15] = "-",
            e += r.join(""),
            // console.log(" [svc_sdk] final uuid:", e),
            e
        }("yy.com"),
        this.appidSubs = {},
        this.appidUnsubs = {},
        this.logout = function () {
          this.cookie = this.linkticket = this.ticket = null,
            this.yyid = this.uid = 0,
            this.credit = this.password = this.username = null,
            this.asid = this.trySubSid = this.tryTopSid = this.subSid = this.topSid = 0,
            this.from = "",
            this.channelJoined = this.loginedUDB = !1,
            this.userType = this.lastSentJoinChl = 0,
            this.nick = "",
            this.channelInfo = null,
            this.channelUserCount = {},
            this.micList = {},
            this.userInfos = {},
            this.appidSubs = {},
            this.appidUnsubs = {}
        }
    }
    , Fe = null
    , Ne = null
    , Be = function (t, e, Me) {
      this.appid = e,
        this.mod = t,
        259 == this.appid ? (this.wsAddr = "wss://h5chl.yy.com/websocket?appid=" + Me.udbAppId + "&version=" + encodeURIComponent("1.31.17") + "&uuid=" + encodeURIComponent(Me.uuid),
          console.log(" [svc_sdk] appid:259 wsAddr:", this.wsAddr)) : (this.wsAddr = "wss://h5svc.yy.com/websocket?appid=" + Me.udbAppId + "&version=" + encodeURIComponent("1.31.17") + "&uuid=" + encodeURIComponent(Me.uuid),
            console.log(" [svc_sdk] appid:260 wsAddr:", this.wsAddr)),
        this.wsState = "init",
        this.logined = !1,
        this.timer = null,
        this.lastTimerCheck = Date.now(),
        this.last_login_ts = 0,
        this.lastRecvPong = Date.now(),
        this.sendBuf = [],
        this.clearSendBuf = function () {
          500 < this.sendBuf.length && (this.sendBuf = [])
        }
        ,
        this.appidReady = function () {
          return this.wsSock && "connected" == this.wsState && this.logined
        }
        ,
        this.resetWsState = function () {
          // console.log(" [svc_sdk] reset websocket state.", this.wsSock),
            this.wsState = "closed",
            this.wsSock && (this.wsSock.onopen = null,
              this.wsSock.onclose = null,
              this.wsSock.onerror = null,
              this.wsSock = this.wsSock.onmessage = null),
            this.logined = !1,
            this.clearSendBuf()
        }
        ,
        this.reportLog = function (t, e, s) {
          var i = new function () {
            this.uid = 0,
              this.uuid = "",
              this.subSid = this.topSid = 0,
              this.result = this.action = this.source = "",
              this.ext = {},
              this.marshal = function (t) {
                t.setUI32(this.uid),
                  t.setUTF8(this.uuid, 16),
                  t.setUI32(this.topSid),
                  t.setUI32(this.subSid),
                  t.setUTF8(this.source),
                  t.setUTF8(this.action),
                  t.setUTF8(this.result);
                var e = Object.keys(this.ext);
                t.setUI32(e.length);
                for (var s = 0; s < e.length; ++s)
                  t.setUTF8(e[s]),
                    t.setUTF8(this.ext[e[s]])
              }
          }
            ;
          i.uid = Me.uid,
            i.uuid = Me.uuid,
            i.topSid = Me.topSid,
            i.subSid = Me.subSid,
            i.source = location ? location.host : Me.wxappid ? Me.thirdUdbAppId.toString() + "_" + Me.wxappid : "unknown",
            i.action = t,
            i.result = e,
            s && (i.ext = s)
        }
        ,
        this.onopen = function (t) {
          // console.log(" [svc_sdk] h5 websocket open. appid:", this.appLayer.appid),
            this.appLayer.wsState = "connected",
            this.appLayer.mod.onApOpen(),
            Me.loginedUDB && this.appLayer.loginAp()
        }
        ,
        this.onclose = function (t) {
          // console.log(" [svc_sdk] h5 websocket onclose", t, "appid:", this.appLayer.appid),
            this.appLayer.resetWsState()
        }
        ,
        this.onerror = function (t) {
          // console.log(" [svc_sdk] h5 websocket onerror", JSON.stringify(t), "appid:", this.appLayer.appid),
            this.appLayer.resetWsState()
        }
        ,
        this.send = function (t) {
          this.wsSock && "connected" == this.wsState ? this.wsSock.send(t) : console.log(" [svc_sdk] send failed. ", this.appid)
        }
        ,
        this.bufSend = function (t) {
          this.appidReady() ? this.send(t) : (console.log(" [svc_sdk]ap not ready, cache it.", this.appid),
            this.sendBuf.push(t))
        }
        ,
        this.sendApRouter = function (t, e, s, i) {
          var n = new ve;
          n.appid = this.appid,
            n.uid = Me.uid,
            n.realUri = e,
            n.srvName = t,
            n.ruri = e,
            i && (n.extentProps = i),
            n.payload = s,
            (t = new Le).uri = 512011,
            n = t.marshal(n),
            this.bufSend(n)
        }
        ,
        this.connect = function () {
          this.wsSock ? (console.log(" [svc_sdk] close existing socket before connecting"),
            this.close()) : "connecting" != this.wsState ? (console.log(" [svc_sdk] start to connect ws.", this.appid, this.wsAddr),
              this.wsSock = new WebSocket(this.wsAddr),
              this.wsState = "connecting",
              this.wsSock.destroy = false,
              this.wsSock.binaryType = "arraybuffer",
              this.wsSock.appLayer = this,
              this.wsSock.onopen = this.onopen,
              this.wsSock.onclose = this.onclose,
              this.wsSock.onerror = this.onerror,
              this.wsSock.onmessage = this.onmessage) : console.log(" [svc_sdk] websocket is connecting...")
        }
        ,
        this.close = function () {
          "closing" == this.wsState ? console.log(" [svc_sdk] websocket is closing...") : (console.log(" [svc_sdk] require to close ws.", this.appid),
            this.wsState = "closing",
            this.wsSock.destroy = true,
            this.wsSock.appLayer = null,
            this.wsSock.onopen = null,
            this.wsSock.onclose = null,
            this.wsSock.onerror = null,
            this.wsSock.onmessage = null,
            this.stopTimer(),
            this.wsSock && this.wsSock.close())
        }
        ,
        this.onmessage = function (t) {
          (t = new xe(t.data)).getUI32();
          var e = t.getUI32();
          if (t.getUI16(),
            775940 == e)
            if (e = new function () {
              this.resCode = 0,
                this.context = "",
                this.unmarshal = function (t) {
                  var e = new Te(null, 0, 0, 0, 0);
                  t.save(e),
                    t.setUI32(0),
                    this.resCode = t.getUI32();
                  var s = t.getUI16();
                  this.context = t.getUTF8(s),
                    s = new Te(null, 0, 0, 0, 0),
                    t.save(s),
                    t.restore(e),
                    t.setUI32(0 | s.length - e.length - 4 & 268435455),
                    t.restore(s)
                }
            }
              ,
              t.getMarshal(e),
              t = e.context,
              this.appLayer.appidReady());
              // console.log(" [svc_sdk] appid is ready, ignore login resp", t, e.resCode, this.appLayer.wsState, this.appLayer.logined);
            else if (200 == e.resCode) {
              if (console.log(" [svc_sdk] login AP success", this.appLayer.appid),
                this.appLayer.logined = !0,
                0 != this.appLayer.sendBuf.length) {
                for (console.log(" [svc_sdk] flush cached buffer:", this.appLayer.sendBuf.length, "appid:", this.appLayer.appid),
                  t = 0; t < this.appLayer.sendBuf.length; ++t)
                  this.appLayer.send(this.appLayer.sendBuf[t]);
                this.appLayer.sendBuf = []
              }
              this.appLayer.mod.onLoginAp()
            } else
              409 == e.resCode ? (console.log("409 resource conflict. change route.", this.appLayer.appid, e.resCode),
                this.appLayer.start(this.appLayer)) : 401 == e.resCode ? (console.log("401 validation failed. maybe ticket expires. re-login udb", this.appid, e.resCode),
                  this.appLayer.mod.restart()) : console.log(" [svc_sdk] login AP failed:", e.resCode, this.appLayer.appid);
          else
            794372 == e ? this.lastRecvPong = Date.now() : this.appLayer.mod.onmessage(e, t)
        }
        ,
        this.timerCheck = function (t) {
          if ("closed" != !t.wsState && t.wsSock) {
            if ("connected" == t.wsState) {
              var e = Date.now();
              5e3 <= e - t.lastTimerCheck && (t.lastTimerCheck = e,
                Me.loginedUDB ? t.logined ? t.pingAP() : t.loginAp() : 259 == t.appid && t.mod.loginUDB())
            }
          } else
            // console.log(" [svc_sdk] timer check ap not ready. re-connect.", t.wsState, t.wsSock, t.appid),
              t.connect();
          t.startTimer(t.timerCheck, t)
        }
        ,
        this.pingAP = function () {
          var t = new function () {
            this.marshal = function (t) {
              t.setUI32(0)
            }
          }
            , e = new Le;
          e.uri = 794116,
            this.bufSend(e.marshal(t))
        }
        ,
        this.loginAp = function () {
          if (this.logined)
            console.log(" [svc_sdk] already logined. appid:", this.appid);
          else {
            var t = Date.now();
            if (2e3 > t - this.last_login_ts)
              console.log(" [svc_sdk] ignore frequently login request.", this.appid, t, this.last_login_ts);
            else {
              this.last_login_ts = t,
                (t = new function () {
                  this.password = this.account = null,
                    this.cliLcid = this.cliVer = this.cliType = 0,
                    this.instance = this.cliVerStr = this.cliInfo = this.from = "",
                    this.uid = this.appid = 0,
                    this.bRelogin = !1,
                    this.ticket = new Uint8Array,
                    this.cookie = new Uint8Array,
                    this.context = "",
                    this.marshal = function (t) {
                      var e = new Te(null, 0, 0, 0, 0);
                      t.save(e),
                        t.setUI32(0),
                        t.setBytes(this.account, 16),
                        this.fromWeb ? t.setUTF8(this.password, 16) : t.setBytes(this.password, 16),
                        t.setUI32(this.cliType),
                        t.setUI32(this.cliVer),
                        t.setUI32(this.cliLcid),
                        t.setUTF8(this.from, 16),
                        t.setUTF8(this.cliInfo, 16),
                        t.setUTF8(this.cliVerStr, 16),
                        t.setUI32(0),
                        t.setUI32(0),
                        t.setUI32(0),
                        t.setUI32(0),
                        t.setUTF8(this.instance, 16);
                      var s = new Te(null, 0, 0, 0, 0);
                      t.save(s),
                        t.restore(e),
                        t.setUI32(0 | s.length - e.length - 4 & 268435455),
                        t.restore(s),
                        t.setUI32(this.appid),
                        t.setUI32(this.uid),
                        t.setUI32(0),
                        t.setBool(this.bRelogin),
                        t.setBytes(this.ticket, 16),
                        t.setBytes(this.cookie, 16),
                        this.context = this.appid.toString(),
                        t.setUTF8(this.context, 16)
                    }
                }
                ).appid = this.appid,
                t.uid = Me.uid,
                t.cookie = Me.cookie,
                Me.linkticket && (t.ticket = Me.linkticket),
                t.account = Me.username,
                t.password = Me.password,
                t.from = "yytianlaitv",
                t.cliInfo = "B8-97-5A-17-AD-4D",
                t.instance = Me.uuid,
                t.fromWeb = Me.userType;
                // console.log(" [svc_sdk] start to login ap... appid:", t.appid);
              var e = new Le;
              e.uri = 775684,
                this.send(e.marshal(t))
            }
          }
        }
        ,
        this.startTimer = function (t, e) {
          clearTimeout(this.timer),
            this.timer = setTimeout(function () {
              t(e)
            }, 500)
        }
        ,
        this.stopTimer = function () {
          // console.log(" [svc_sdk] stop timer."),
            clearTimeout(this.timer)
        }
        ,
        this.start = function () {
          // console.log(" [svc_sdk] start ApH5.", this.appid),
            this.connect(),
            this.stopTimer(),
            this.startTimer(this.timerCheck, this)
        }
    }
    , Oe = function (t, Me) {
      this.serviceH5 = t,
        this.ap = new Be(this, 259, Me),
        Me.everJoinChannel = !1,
        this.h5EventCbs = [],
        this.h5ChannelEventCbs = [],
        this.h5MaixuCbs = [],
        this.getGlobals = function () {
          return Me
        }
        ,
        this.setH5EventCb = function (t, e) {
          if (e)
            this.h5EventCbs = [];
          else
            for (var s = 0; s < this.h5EventCbs.length; ++s)
              if (this.h5EventCbs[s] == t)
                return;
          this.h5EventCbs.push(t)
        }
        ,
        this.setChannelEventCb = function (t, e) {
          if (e)
            this.h5ChannelEventCbs = [];
          else
            for (var s = 0; s < this.h5ChannelEventCbs.length; ++s)
              if (this.h5ChannelEventCbs[s] == t)
                return;
          this.h5ChannelEventCbs.push(t)
        }
        ,
        this.setH5MaixuCb = function (t, e) {
          if (e)
            this.h5MaixuCbs = [];
          else
            for (var s = 0; s < this.h5MaixuCbs.length; ++s)
              if (this.h5MaixuCbs[s] == t)
                return;
          this.h5MaixuCbs.push(t)
        }
        ,
        this.enableChanUserPush = function () {
          Me.bNeedOnlineChanUser = !0
        }
        ,
        this.start = function (t, e, s, i, n, o) {
          t && (Me.udbAppId = t),
            e && (Me.udbAppkey = e),
            Me.uid = s,
            Me.credit = i,
            Me.username = n,
            Me.password = o,
            Me.userType = Me.credit || n && o ? 1 : 0,
            // console.log(" [svc_sdk] channel h5 start udbAppId:", t, "udbAppkey:", e, "uid:", s, "credit:", i, "username:", n, "udb_l:", o),
            this.ap || (this.ap = new Be(this, 259, Me)),
            this.ap.start()
        }
        ,
        this.restart = function () {
          // console.log(" [svc_sdk] restart login udb and ap."),
            Me.loginedUDB = !1,
            this.ap && this.ap.close(),
            this.ap || (this.ap = new Be(this, 259, Me)),
            this.ap.start()
        }
        ,
        this.login = function (t, e, s, i) {
          var n = Me.topSid
            , o = Me.subSid;
          this.logout(),
            console.log(" [svc_sdk] re-login... uid:", t, "credit:", e, "udbAppId:", Me.udbAppId, "udbAppkey:", Me.udbAppkey, "username:", s, "udb_l:", i),
            this.ap.reportLog("re-login", "start"),
            this.start(Me.udbAppId, Me.udbAppkey, t, e, s, i),
            n && o && (console.log(" [svc_sdk] re-join channel by login", n, o),
              this.joinChannel(n, o, null, null, Me.exclusiveJoin))
        }
        ,
        this.stop = function (t, e) {
          // console.log(" [svc_sdk] stop h5. uid:", t, "reason:", e),
            this.ap.reportLog("stop", "start"),
            Me.logout(),
            this.ap && (this.ap.close(),
              this.ap.stopTimer()),
            this.serviceH5.ap && (this.serviceH5.ap.close(),
              this.serviceH5.ap.stopTimer())
        }
        ,
        this.onLoginUDB = function (t, e, s, i) {
          0 == t && (Me.loginedUDB = !0,
            this.ap.loginAp(),
            this.serviceH5.login());
          for (var n = 0; n < this.h5EventCbs.length; ++n)
            this.h5EventCbs[n](Object({
              type: 0,
              code: t,
              isAnonymous: e,
              baseInfo: s,
              errMsg: i
            }))
        }
        ,
        this.anonyousLoginUDB = function () {
          var t = new function () {
            this.context = "",
              this.ruri = 0,
              this.payload = null,
              this.marshal = function (t) {
                t.setUTF8(this.context, 16),
                  t.setUI32(this.ruri);
                var e = new Te(null, 0, 0, 0, 0);
                t.save(e),
                  t.setUI32(0),
                  t.setMarshal(this.payload);
                var s = new Te(null, 0, 0, 0, 0);
                t.save(s),
                  t.restore(e),
                  t.setUI32(s.length - e.length - 4),
                  t.restore(s)
              }
          }
            ;
          t.ruri = 19822;
          var e = new function () {
            this.context = "",
              this.version = 0,
              this.macAddr = this.pcInfo = "",
              this.cliFrom = 0,
              this.cliExtension = "",
              this.marshal = function (t) {
                t.setUTF8(this.context, 16),
                  t.setUI32(this.version),
                  t.setUTF8(this.pcInfo, 16),
                  t.setUTF8(this.macAddr, 16),
                  t.setUI32(this.cliFrom),
                  t.setUTF8(this.cliExtension, 16)
              }
          }
            ;
          e.cliExtension = Me.udbAppId,
            e.pcInfo = "B8-97-5A-17-AD-4D",
            e.macAddr = "B8-97-5A-17-AD-4D",
            t.payload = e,
            // console.log(" [svc_sdk] start to anonyous login udb:", JSON.stringify(e)),
            this.ap.reportLog("anonyous_login_udb", "start"),
            (e = new Le).uri = 778244,
            this.ap.send(e.marshal(t))
        }
        ,
        this.normalLoginUDB = function () {
          var t = new function () {
            this.context = "",
              this.ruri = 0,
              this.payload = null,
              this.marshal = function (t) {
                t.setUTF8(this.context, 16),
                  t.setUI32(this.ruri);
                var e = new Te(null, 0, 0, 0, 0);
                t.save(e),
                  t.setUI32(0),
                  t.setMarshal(this.payload);
                var s = new Te(null, 0, 0, 0, 0);
                t.save(s),
                  t.restore(e),
                  t.setUI32(s.length - e.length - 4),
                  t.restore(s)
              }
          }
            ;
          t.ruri = 335570153;
          var e = new function () {
            this.protoVersion = 0,
              this.context = "",
              this.appType = 6,
              this.sign = this.appid = "",
              this.appVer = "1.0.0",
              this.clientIp = this.sdkVer = "",
              this.clientPort = 0,
              this.reserve = this.channel = "",
              this.appidlist = [],
              this.tokenType = 1,
              this.username = "",
              this.uid = 0,
              this.protoTicket = this.protoCredit = this.protoPasswd = "",
              this.strategy = 0,
              this.antiCode = this.bizName = this.sessionData = this.straToken = "",
              this.marshal = function (t) {
                var e = new Te(null, 0, 0, 0, 0);
                t.save(e),
                  t.setUI16(0),
                  t.setUI32(this.protoVersion),
                  t.setUTF8(this.context, 16);
                var s = new Te(null, 0, 0, 0, 0);
                t.save(s),
                  t.setUI16(0),
                  t.setUI16(this.appType),
                  t.setUTF8(this.appid, 16),
                  t.setUTF8(this.sign, 16),
                  t.setUTF8(this.appVer, 16),
                  t.setUTF8(this.sdkVer, 16),
                  t.setUTF8(this.clientIp, 16),
                  t.setUI32(this.clientPort);
                var i = new Te(null, 0, 0, 0, 0);
                t.save(i),
                  t.setUI16(0),
                  t.setUTF8("iPhone X", 16),
                  t.setUTF8("xx-xx-xx-xx", 16),
                  t.setUTF8("xx-xx-xx-xx", 16),
                  t.setUTF8("xx-xx-xx-xx", 16),
                  t.setUI32(0),
                  t.setUI32(0),
                  t.setUTF8("iOS", 16),
                  t.setUTF8("11", 16),
                  t.setUTF8("", 16),
                  t.setUTF8("", 16),
                  t.setUTF8("", 16);
                var n = new Te(null, 0, 0, 0, 0);
                for (t.save(n),
                  t.restore(i),
                  t.setUI16(n.length - i.length - 2),
                  t.restore(n),
                  t.setUTF8(this.channel, 16),
                  t.setUTF8(this.reserve, 16),
                  t.setUI32(this.appidlist.length),
                  i = 0; i < this.appidlist.length; ++i)
                  t.setUTF8(this.appidlist[i], 16);
                i = new Te(null, 0, 0, 0, 0),
                  t.save(i),
                  t.restore(s),
                  t.setUI16(i.length - s.length - 2),
                  t.restore(i),
                  s = new Te(null, 0, 0, 0, 0),
                  t.save(s),
                  t.setUI16(0),
                  t.setUI32(this.tokenType),
                  2 == this.tokenType ? (i = new Te(null, 0, 0, 0, 0),
                    t.save(i),
                    t.setUI16(0),
                    t.setUTF8(this.username, 16),
                    t.setUI32(0),
                    t.setUTF8(this.protoPasswd, 16),
                    n = new Te(null, 0, 0, 0, 0),
                    t.save(n),
                    t.restore(i),
                    t.setUI16(n.length - i.length - 2),
                    t.restore(n)) : 1 == this.tokenType ? (i = new Te(null, 0, 0, 0, 0),
                      t.save(i),
                      t.setUI16(0),
                      t.setUI32(this.uid),
                      t.setUI32(0),
                      t.setUTF8(this.protoCredit, 16),
                      t.setUI32(1),
                      n = new Te(null, 0, 0, 0, 0),
                      t.save(n),
                      t.restore(i),
                      t.setUI16(n.length - i.length - 2),
                      t.restore(n)) : 3 == this.tokenType ? (i = new Te(null, 0, 0, 0, 0),
                        t.save(i),
                        t.setUI16(0),
                        t.setUI32(this.uid),
                        t.setUTF8(this.protoTicket, 16),
                        t.setUTF8("0", 16),
                        n = new Te(null, 0, 0, 0, 0),
                        t.save(n),
                        t.restore(i),
                        t.setUI16(n.length - i.length - 2),
                        t.restore(n)) : 4 == this.tokenType ? (i = new Te(null, 0, 0, 0, 0),
                          t.save(i),
                          t.setUI16(0),
                          t.setUTF8(this.username, 16),
                          t.setUTF8(this.protoPasswd, 16),
                          t.setUTF8("", 16),
                          n = new Te(null, 0, 0, 0, 0),
                          t.save(n),
                          t.restore(i),
                          t.setUI16(n.length - i.length - 2),
                          t.restore(n)) : 5 == this.tokenType && (t.setUI32(4),
                            t.setUI32(0)),
                  t.setUI32(this.strategy),
                  t.setUTF8(this.straToken, 16),
                  i = new Te(null, 0, 0, 0, 0),
                  t.save(i),
                  t.restore(s),
                  t.setUI16(i.length - s.length - 2),
                  t.restore(i),
                  t.setUTF8(this.sessionData, 16),
                  s = new Te(null, 0, 0, 0, 0),
                  t.save(s),
                  t.setUI16(0),
                  t.setUTF8(this.bizName, 16),
                  t.setUTF8(this.antiCode, 16),
                  i = new Te(null, 0, 0, 0, 0),
                  t.save(i),
                  t.restore(s),
                  t.setUI16(i.length - s.length - 2),
                  t.restore(i),
                  s = new Te(null, 0, 0, 0, 0),
                  t.save(s),
                  t.restore(e),
                  t.setUI16(s.length - e.length - 2),
                  t.restore(s)
              }
          }
            ;
          e.appid = Me.udbAppId,
            e.sign = Me.udbAppkey,
            e.protoVersion = 0,
            e.appType = 6,
            e.tokenType = 1,
            e.uid = Me.uid,
            Me.credit ? (e.tokenType = 1,
              e.protoCredit = Me.credit,
              // console.log(" [svc_sdk] start to normal login udb using credit", JSON.stringify(e)),
              this.ap.reportLog("credit_login_udb", "start")) : (e.tokenType = 4,
                e.username = Me.username,
                e.protoPasswd = Me.password,
                // console.log(" [svc_sdk] start to normal login udb using ticket", JSON.stringify(e)),
                this.ap.reportLog("ticket_login_udb", "start")),
            t.payload = e,
            (e = new Le).uri = 779268,
            this.ap.send(e.marshal(t))
        }
        ,
        this.joinChannel = function (t, e, s, i, n, o, a) {
          if (!t || !e)
            return console.log(" [svc_sdk] ignore invalid topSid or subSid:", Me.uid, JSON.stringify(arguments)),
              this.ap.reportLog("join_channel", "invalid", {
                topSid: t,
                subSid: e
              }),
              !1;
          if (!a && Me.topSid == t && Me.subSid == e)
            return console.log(" [svc_sdk] ignore duplicate join channel request. uid:", Me.uid, JSON.stringify(arguments)),
              this.ap.reportLog("join_channel", "dupliated"),
              !0;
          var r = Date.now();
          if (2e3 > r - Me.lastSentJoinChl)
            return console.log(" [svc_sdk] ignore too often join channel request. uid:", Me.uid, JSON.stringify(arguments)),
              this.ap.reportLog("join_channel", "frequently"),
              !1;
          if (!a && t == Me.topSid)
            return this.jumpSubChannel(e, o);
          if (Me.channelJoined && (console.log(" [svc_sdk] firstly leave channel topSid:", Me.topSid, "subSid:", Me.subSid),
            this.leaveChannel()),
            Me.tryTopSid = t,
            Me.trySubSid = e,
            Me.everJoinChannel = !0,
            Me.exclusiveJoin = n,
            console.log(" [svc_sdk] start to join channel. uid:", Me.uid, JSON.stringify(arguments)),
            this.ap.reportLog("join_channel", "start", {
              topSid: t,
              subSid: e
            }),
            this.ap.appidReady()) {
            Me.lastSentJoinChl = r,
              (r = new function () {
                this.subSid = this.topSid = this.uid = 0,
                  this.joinProps = {},
                  this.marshal = function (t) {
                    t.setUI32(this.uid),
                      t.setUI32(this.topSid),
                      t.setUI32(this.subSid);
                    var e = Object.keys(this.joinProps);
                    t.setUI32(Object.keys(this.joinProps).length);
                    for (var s = 0; s < e.length; ++s)
                      t.setUI32(parseInt(e[s])),
                        "6" == e[s] ? t.setBytes(this.joinProps[e[s]], 16) : t.setUTF8(this.joinProps[e[s]], 16)
                  }
              }
              ).uid = Me.uid,
              r.topSid = t,
              r.subSid = e,
              s && (r.joinProps[5] = s),
              i && (r.joinProps[6] = new Uint8Array(i)),
              n && (r.joinProps[2] = "0",
                r.joinProps[3] = "1"),
              null != o && void 0 !== o && 0 != o.length && (r.joinProps[1] = o);
            var h = new xe;
            h.setUI32(t);
            var l = {};
            l[1] = h.toTypedBuffer(),
              this.ap.sendApRouter("channelAuther", 2048258, r, l)
          } else
            console.log(" [svc_sdk] delay. join channel request will be sent after ap ready.")
        }
        ,
        this.jumpSubChannel = function (t, e) {
          Me.trySubSid = t,
            Me.everJoinChannel = !0;
          var s = Date.now();
          Me.lastSentJoinChl = s,
            (s = new function () {
              this.toSid = this.fromSid = 0,
                this.password = "",
                this.marshal = function (t) {
                  t.setUI32(this.fromSid),
                    t.setUI32(this.toSid),
                    t.setUTF8(this.password, 16)
                }
            }
            ).fromSid = Me.subSid,
            s.toSid = t,
            e && (s.password = e);
          var i = new xe;
          i.setUI32(Me.topSid);
          var n = {};
          n[1] = i.toTypedBuffer(),
            // console.log(" [svc_sdk] start to change subSid from", Me.subSid, "to", t, ".topSid:", Me.topSid, "uid:", Me.uid, JSON.stringify(s)),
            this.ap.reportLog("jump_sub_channel", "start"),
            this.ap.sendApRouter("channelAuther", 25090, s, n)
        }
        ,
        this.changeChannelBc = function (t, e, s, i) {
          (i = {
            grpTypeLow: 1,
            grpTypeHigh: 0
          }).grpIdLow = e,
            i.grpIdHigh = 0;
          var n = {
            grpTypeLow: 2,
            grpTypeHigh: 0
          };
          n.grpIdLow = s,
            n.grpIdHigh = 0;
          var o = {
            grpTypeLow: 1024,
            grpTypeHigh: 259
          };
          o.grpIdLow = s,
            o.grpIdHigh = e,
            (s = {
              grpTypeLow: 768,
              grpTypeHigh: 259,
              grpIdLow: 0
            }).grpIdHigh = e;
          var a = {
            grpTypeLow: 256,
            grpTypeHigh: 259,
            grpIdLow: 0
          };
          a.grpIdHigh = e,
            (e = new be).uid = Me.uid,
            e.grpIdSet.push(i),
            e.grpIdSet.push(n),
            e.grpIdSet.push(o),
            e.grpIdSet.push(s),
            e.grpIdSet.push(a),
            Me.bNeedOnlineChanUser && ((i = {
              grpTypeLow: 769,
              grpTypeHigh: 259,
              grpIdLow: 0
            }).grpIdHigh = Me.topSid,
              e.grpIdSet.push(i)),
            (i = new Le).uri = t,
            this.ap.send(i.marshal(e))
        }
        ,
        this.joinChannelBc = function () {
          // console.log(" [svc_sdk] start to join channel broadcast group."),
            this.ap.reportLog("join_user_group_chl", "start", {
              topSid: Me.topSid,
              subSid: Me.subSid
            }),
            this.changeChannelBc(642648, Me.topSid, Me.subSid, Me.bNeedOnlineChanUser)
        }
        ,
        this.leaveChannel = function () {
          if (0 == Me.topSid || 0 == Me.subSid)
            // console.log(" [svc_sdk] sid zero. no action.", Me.topSid, Me.subSid),
              this.ap.reportLog("leave_channel", "invalid");
          else {
            var t = new de;
            t.uid = Me.uid,
              t.topSid = Me.topSid;
            var e = new xe;
            e.setUI32(Me.topSid);
            var s = {};
            s[1] = e.toTypedBuffer(),
              // console.log(" [svc_sdk] leave channel. topSid:", Me.topSid, "subSid:", Me.subSid),
              this.ap.reportLog("leave_channel", "start"),
              this.ap.sendApRouter("channelAuther", 2049794, t, s),
              this.leaveChannelBc(),
              this.serviceH5.leaveServiceBc(),
              Me.topSid = 0,
              Me.subSid = 0,
              Me.tryTopSid = 0,
              Me.trySubSid = 0,
              Me.asid = 0,
              Me.channelJoined = !1,
              Me.lastSentJoinChl = 0,
              Me.channelInfo = null,
              Me.channelUserCount = {},
              Me.micList = {},
              Me.userInfos = {}
          }
        }
        ,
        this.leaveChannelBc = function () {
          // console.log(" [svc_sdk] start to leave channel broadcast group."),
            this.ap.reportLog("leave_user_group_chl", "start"),
            this.changeChannelBc(642904, Me.topSid, Me.subSid, Me.bNeedOnlineChanUser)
        }
        ,
        this.logout = function () {
          console.log(" [svc_sdk] logout. uid:", Me.uid);
          var t = Me.topSid
            , e = Me.subSid;
          this.ap.reportLog("logout", "start"),
            this.leaveChannel();
          var s = this.isGuestLogin();
          Me.logout(),
            this.ap && this.ap.close(),
            this.serviceH5.ap && this.serviceH5.ap.close();
            // s || (this.start(Me.udbAppId, Me.udbAppkey, null, null),
            //   t && e && (console.log(" [svc_sdk] re-join channel by logout", t, e),
            //     this.joinChannel(t, e)))
        }
        ,
        this.getUDBCredit = function () {
          return Me.credit
        }
        ,
        this.getChannelUserCount = function () {
          // console.log(" [svc_sdk] start to get channel user count.");
          var t = new function () {
            this.topSid = 0,
              this.sidlist = [],
              this.marshal = function (t) {
                t.setUI32(this.topSid),
                  t.setUI32(this.sidlist.length);
                for (var e = 0; e < this.sidlist.length; ++e)
                  t.setUI32(this.sidlist[e])
              }
          }
            ;
          t.topSid = Me.topSid;
          var e = new xe;
          e.setUI32(Me.topSid);
          var s = {};
          s[1] = e.toTypedBuffer(),
            this.ap.sendApRouter("channelUserInfo", 3125250, t, s)
        }
        ,
        this.getMaixuList = function () {
          // console.log(" [svc_sdk] start to get maixu list"),
            this.ap.reportLog("get_maixu", "start");
          var t = new function () {
            this.uid = this.subSid = this.topSid = 0,
              this.marshal = function (t) {
                t.setUI32(this.topSid),
                  t.setUI32(this.subSid),
                  t.setUI32(this.uid)
              }
          }
            ;
          t.uid = Me.uid,
            t.topSid = Me.topSid,
            t.subSid = Me.subSid;
          var e = new xe;
          e.setUI32(Me.topSid);
          var s = {};
          s[1] = e.toTypedBuffer(),
            this.ap.sendApRouter("channelMaixu", 3854338, t, s)
        }
        ,
        this.getCurSubSidRole = function (t, e, s, i) {
          var n = 25
            , o = !1;
          if (s) {
            for (var a = 0, r = 0; r < s.length; ++r)
              if (parseInt(t) == parseInt(s[r].subSid) && (a = s[r].role,
                o = !0),
                parseInt(e) == parseInt(s[r].subSid)) {
                n = s[r].role,
                  o = !0;
                break
              }
            25 == n && a && (n = a)
          }
          return !o && i && (n = i),
            n
        }
        ,
        this.procMaixuSerialPack = function (t) {
          (t = new xe(t.cmd)).getUI32();
          var e = t.getUI32();
          switch (t.getUI16(),
          e) {
            case 20482:
              for (e = new function () {
                this.uids = [],
                  this.unmarshal = function (t) {
                    for (var e = t.getUI32(), s = 0; s < e; ++s)
                      this.uids.push(t.getUI32())
                  }
              }
                ,
                t.getMarshal(e),
                t = 0; t < e.uids.length; ++t)
                this.addMicList(e.uids[t]);
              for (t = 0; t < this.h5MaixuCbs.length; ++t)
                this.h5MaixuCbs[t](Object({
                  type: 1,
                  microphones: e.uids
                }));
              break;
            case 13058:
              for (e = new function () {
                this.uid = 0,
                  this.unmarshal = function (t) {
                    this.uid = t.getUI32()
                  }
              }
                ,
                t.getMarshal(e),
                this.removeMicList(e.uid),
                t = 0; t < this.h5MaixuCbs.length; ++t)
                this.h5MaixuCbs[t](Object({
                  type: 2,
                  uid: e.uid
                }));
              break;
            case 13314:
              for (e = new function () {
                this.admin = this.uid = 0,
                  this.unmarshal = function (t) {
                    this.uid = t.getUI32(),
                      this.admin = t.getUI32()
                  }
              }
                ,
                t.getMarshal(e),
                this.removeMicList(e.uid),
                t = 0; t < this.h5MaixuCbs.length; ++t)
                this.h5MaixuCbs[t](Object({
                  type: 5,
                  uid: e.uid,
                  admin: e.admin
                }));
              break;
            case 13570:
              for (e = new function () {
                this.time = this.admin = this.uid = 0,
                  this.unmarshal = function (t) {
                    this.uid = t.getUI32(),
                      this.admin = t.getUI32(),
                      this.time = t.getUI32()
                  }
              }
                ,
                t.getMarshal(e),
                t = 0; t < this.h5MaixuCbs.length; ++t)
                this.h5MaixuCbs[t](Object({
                  type: 6,
                  uid: e.uid,
                  admin: e.admin,
                  time: e.time
                }));
              break;
            case 13826:
              for (e = new function () {
                this.time = this.uid = 0,
                  this.mute = !0,
                  this.unmarshal = function (t) {
                    this.uid = t.getUI32(),
                      this.time = t.getUI32(),
                      this.mute = t.getBool()
                  }
              }
                ,
                t.getMarshal(e),
                t = 0; t < this.h5MaixuCbs.length; ++t)
                this.h5MaixuCbs[t](Object({
                  type: 7,
                  uid: e.uid,
                  time: e.time
                }));
              break;
            case 14082:
              for (e = new function () {
                this.uid = 0,
                  this.down = !1,
                  this.unmarshal = function (t) {
                    this.uid = t.getUI32(),
                      this.down = t.getBool()
                  }
              }
                ,
                t.getMarshal(e),
                t = 0; t < this.h5MaixuCbs.length; ++t)
                this.h5MaixuCbs[t](Object({
                  type: 8,
                  uid: e.uid,
                  down: e.down
                }));
              break;
            case 14338:
              for (e = new function () {
                this.time = this.uid = 0,
                  this.unmarshal = function (t) {
                    this.uid = t.getUI32(),
                      this.time = t.getUI32()
                  }
              }
                ,
                t.getMarshal(e),
                t = 0; t < this.h5MaixuCbs.length; ++t)
                this.h5MaixuCbs[t](Object({
                  type: 9,
                  uid: e.uid,
                  time: e.time
                }));
              break;
            case 14594:
              for (e = new function () {
                this.uid = 0,
                  this.unmarshal = function (t) {
                    this.uid = t.getUI32()
                  }
              }
                ,
                t.getMarshal(e),
                this.removeMicList(e.uid),
                t = 0; t < this.h5MaixuCbs.length; ++t)
                this.h5MaixuCbs[t](Object({
                  type: 10,
                  uid: e.uid
                }));
              break;
            case 14850:
              for (e = new function () {
                this.uid = 0,
                  this.disable = !0,
                  this.unmarshal = function (t) {
                    this.uid = t.getUI32(),
                      this.disable = t.getBool()
                  }
              }
                ,
                t.getMarshal(e),
                t = 0; t < this.h5MaixuCbs.length; ++t)
                this.h5MaixuCbs[t](Object({
                  type: 11,
                  uid: e.uid,
                  disable: e.disable
                }));
              break;
            case 15362:
              for (e = new function () {
                this.admin = this.uid = 0,
                  this.unmarshal = function (t) {
                    this.uid = t.getUI32(),
                      this.admin = t.getUI32()
                  }
              }
                ,
                t.getMarshal(e),
                this.addMicList(e.uid),
                t = 0; t < this.h5MaixuCbs.length; ++t)
                this.h5MaixuCbs[t](Object({
                  type: 12,
                  uid: e.uid,
                  admin: e.admin
                }));
              break;
            case 17922:
              e = new function () {
                this.admin = 0,
                  this.unmarshal = function (t) {
                    this.admin = t.getUI32()
                  }
              }
                ,
                t.getMarshal(e);
                // console.log(" [svc_sdk] got KickAllMaixuURI:", JSON.stringify(e));
              var s = Me.micList.micList.slice();
              for (t = 0; t < s.length; ++t)
                this.removeMicList(s[t]);
              for (t = 0; t < this.h5MaixuCbs.length; ++t)
                this.h5MaixuCbs[t](Object({
                  type: 13,
                  admin: e.admin
                }));
              break;
            case 18178:
              for (e = new function () {
                this.uid = 0,
                  this.unmarshal = function (t) {
                    this.uid = t.getUI32()
                  }
              }
                ,
                t.getMarshal(e),
                t = 0; t < this.h5MaixuCbs.length; ++t)
                this.h5MaixuCbs[t](Object({
                  type: 14,
                  uid: e.uid
                }));
              break;
            case 3379202:
              for (e = new function () {
                this.invitee = this.micFirst = this.admin = this.subSid = this.topSid = 0,
                  this.unmarshal = function (t) {
                    this.topSid = t.getUI32(),
                      this.subSid = t.getUI32(),
                      this.admin = t.getUI32(),
                      this.micFirst = t.getUI32(),
                      this.invitee = t.getUI32()
                  }
              }
                ,
                t.getMarshal(e),
                this.addChorusList(e.invitee),
                t = 0; t < this.h5MaixuCbs.length; ++t)
                this.h5MaixuCbs[t](Object({
                  type: 15,
                  uid: e.invitee,
                  admin: e.admin,
                  mic_first: e.micFirst
                }));
              break;
            case 3379714:
              for (e = new function () {
                this.mode = this.invitee = this.micFirst = this.res = this.subSid = this.topSid = 0,
                  this.uinfos = [],
                  this.unmarshal = function (t) {
                    this.topSid = t.getUI32(),
                      this.subSid = t.getUI32(),
                      this.res = t.getUI32(),
                      this.micFirst = t.getUI32(),
                      this.invitee = t.getUI32()
                  }
              }
                ,
                t.getMarshal(e),
                this.addChorusList(e.invitee),
                t = 0; t < this.h5MaixuCbs.length; ++t)
                this.h5MaixuCbs[t](Object({
                  type: 16,
                  uid: e.invitee,
                  admin: e.admin,
                  mic_first: e.micFirst
                }));
              break;
            case 3379970:
              for (e = new function () {
                this.invitee = this.micFirst = this.oper = this.subSid = this.topSid = 0,
                  this.unmarshal = function (t) {
                    this.topSid = t.getUI32(),
                      this.subSid = t.getUI32(),
                      this.oper = t.getUI32(),
                      this.micFirst = t.getUI32(),
                      this.invitee = t.getUI32()
                  }
              }
                ,
                t.getMarshal(e),
                this.removeChorusList(e.invitee),
                t = 0; t < this.h5MaixuCbs.length; ++t)
                this.h5MaixuCbs[t](Object({
                  type: 17,
                  uid: e.invitee,
                  operator: e.oper,
                  mic_first: e.micFirst
                }));
              break;
            default:
              console.log(" [svc_sdk] unrecognized MaixuSerialPack ruri:", e / 256, "|", e % 256)
          }
        }
        ,
        this.procUserGroupMsg = function (t) {
          (t = new xe(t.msg)).getUI32();
          var e = t.getUI32();
          switch (t.getUI16(),
          e) {
            case 3100418:
              e = new function () {
                this.serialH32 = this.serialL32 = 0,
                  this.cmd = null,
                  this.unmarshal = function (t) {
                    this.serialL32 = t.getUI32(),
                      this.serialH32 = t.getUI32();
                    var e = t.getUI32();
                    this.cmd = t.getBytes(e)
                  }
              }
                ,
                t.getMarshal(e),
                this.procMaixuSerialPack(e);
              break;
            case 3139586:
              for (e = new function () {
                this.totalCount = 0,
                  this.subCount = {},
                  this.unmarshal = function (t) {
                    this.totalCount = t.getUI32();
                    for (var e = t.getUI32(), s = 0; s < e; ++s) {
                      var i = t.getUI32()
                        , n = t.getUI32();
                      this.subCount[i.toString()] = n
                    }
                  }
              }
                ,
                t.getMarshal(e),
                Me.channelUserCount.totalUserCount = e.totalCount,
                Me.channelUserCount.sid2count = e.subCount,
                t = 0; t < this.h5ChannelEventCbs.length; ++t)
                this.h5ChannelEventCbs[t](Object({
                  type: 1,
                  total: e.totalCount,
                  sid2count: e.subCount
                }));
              break;
            case 79106:
              for (e = new ce,
                t.getMarshal(e),
                // console.log(" [svc_sdk] got ChannelKickOffURI:", JSON.stringify(e)),
                Me.uid == e.uid && (0 == e.toChannel ? (this.ap.reportLog("be_kicked_channel", "leave", {
                  notify_uid: e.uid
                }),
                  this.leaveChannel()) : (this.ap.reportLog("be_kicked_sub_channel", "leave", {
                    notify_uid: e.uid
                  }),
                    this.leaveChannelBc(),
                    this.serviceH5.leaveServiceBc(),
                    Me.micList = {},
                    Me.subSid = e.toChannel,
                    this.joinChannelBc(),
                    this.serviceH5.joinServiceBc(),
                    // console.log("be kicked to subChannel:", e.toChannel),
                    this.getMaixuList())),
                t = 0; t < this.h5ChannelEventCbs.length; ++t)
                this.h5ChannelEventCbs[t](Object({
                  type: 7,
                  reason: e.reason,
                  seconds: e.seconds,
                  uid: e.uid,
                  admin: e.admin,
                  oldSid: e.sid,
                  newSid: e.toChannel,
                  kickType: e.kickType
                }));
              break;
            case 2440706:
            case 16647:
              e = new function () {
                this.updator = this.sid = 0,
                  this.infos = {},
                  this.unmarshal = function (t) {
                    this.sid = t.getUI32(),
                      this.updator = t.getUI32();
                    for (var e = t.getUI32(), s = 0; s < e; ++s) {
                      var i = t.getUI16()
                        , n = t.getUI16();
                      n = t.getUTF8(n),
                        this.infos[i.toString()] = n
                    }
                  }
              }
                ,
                t.getMarshal(e);
                // console.log(" [svc_sdk] got PChannelInfoUpdateURI:", JSON.stringify(e));
              var s = Object.keys(e.infos);
              for (t = 0; t < s.length; ++t)
                Me.channelInfo.baseInfo[e.sid.toString()][s[t]] = e.infos[s[t]];
              for (t = 0; t < this.h5ChannelEventCbs.length; ++t)
                this.h5ChannelEventCbs[t](Object({
                  type: 5,
                  sub_sid: e.sid,
                  updator: e.updator,
                  infos: e.infos
                }));
              break;
            case 2440450:
              for (e = new function () {
                this.subSid = 0,
                  this.props = {},
                  this.mode = this.creator = 0,
                  this.infos = [],
                  this.unmarshal = function (t) {
                    this.subSid = t.getUI32();
                    for (var e = t.getUI32(), s = 0; s < e; ++s) {
                      var i = t.getUI16()
                        , n = t.getUI16()
                        , o = t.getUTF8(n);
                      this.props[i.toString()] = o
                    }
                    if (this.creator = t.getUI32(),
                      !t.empty())
                      for (this.mode = t.getUI8(),
                        e = t.getUI32(),
                        s = 0; s < e; ++s) {
                        for ((o = {}).uid = t.getUI32(),
                          n = t.getUI16(),
                          o.nick = t.getUTF8(n),
                          n = t.getUI16(),
                          o.sign = t.getUTF8(n),
                          o.pid = t.getUI32(),
                          o.jifen = t.getUI32(),
                          o.sjifen = t.getUI32(),
                          o.gender = t.getUI8(),
                          o.rolers = [],
                          s = t.getUI32(),
                          i = 0; i < s; i++) {
                          var a = {};
                          a.cid = t.getUI32(),
                            a.roler = t.getUI16(),
                            o.rolers.push(a)
                        }
                        for (o.ip = t.getUI32(),
                          n = t.getUI16(),
                          o.pcInfo = t.getUTF8(n),
                          o.extInfo = {},
                          a = t.getUI32(),
                          s = 0; s < a; ++s)
                          i = t.getUI8(),
                            n = t.getUI16(),
                            n = t.getUTF8(n),
                            o.extInfo[i.toString()] = n;
                        this.infos.push(o)
                      }
                  }
              }
                ,
                t.getMarshal(e),
                Me.channelInfo.baseInfo[e.subSid.toString()] = e.props,
                Me.channelInfo.subs.push(e.subSid),
                // console.log(" [svc_sdk] got PSubChannelAddInfoURI:", JSON.stringify(e)),
                t = 0; t < this.h5ChannelEventCbs.length; ++t)
                this.h5ChannelEventCbs[t](Object({
                  type: 6,
                  code: 0,
                  add: e
                }));
              break;
            case 8706:
              for (e = new function () {
                this.mode = this.uid = this.pid = this.subSid = 0,
                  this.infos = [],
                  this.opMode = 0,
                  this.unmarshal = function (t) {
                    if (this.subSid = t.getUI32(),
                      this.pid = t.getUI32(),
                      this.uid = t.getUI32(),
                      !t.empty()) {
                      this.mode = t.getUI8(),
                        sz = t.getUI32();
                      for (var e = 0; e < sz; ++e) {
                        var s = {};
                        s.uid = t.getUI32();
                        var i = t.getUI16();
                        s.nick = t.getUTF8(i),
                          i = t.getUI16(),
                          s.sign = t.getUTF8(i),
                          s.pid = t.getUI32(),
                          s.jifen = t.getUI32(),
                          s.sjifen = t.getUI32(),
                          s.gender = t.getUI8(),
                          s.rolers = [],
                          e = t.getUI32();
                        for (var n = 0; n < e; n++) {
                          var o = {};
                          o.cid = t.getUI32(),
                            o.roler = t.getUI16(),
                            s.rolers.push(o)
                        }
                        for (s.ip = t.getUI32(),
                          i = t.getUI16(),
                          s.pcInfo = t.getUTF8(i),
                          s.extInfo = {},
                          n = t.getUI32(),
                          e = 0; e < n; ++e)
                          o = t.getUI8(),
                            i = t.getUI16(),
                            i = t.getUTF8(i),
                            s.extInfo[o.toString()] = i;
                        this.infos.push(s)
                      }
                    }
                    t.empty() || (this.opMode = t.getUI8())
                  }
              }
                ,
                t.getMarshal(e),
                delete Me.channelInfo.baseInfo[e.subSid.toString()],
                t = 0; t < Me.channelInfo.subs.length; ++t)
                if (Me.channelInfo.subs[t] == e.subSid) {
                  Me.channelInfo.subs.splice(t, 1);
                  break
                }
              for (console.log(" [svc_sdk] got PSubChannelRmInfoURI:", JSON.stringify(e)),
                t = 0; t < this.h5ChannelEventCbs.length; ++t)
                this.h5ChannelEventCbs[t](Object({
                  type: 6,
                  code: 1,
                  remove: e
                }));
              break;
            case 3140610:
              if (t.getUI32(),
                t.getUI32(),
                1 == (e = t.decompress()).length)
                t = new xe(e[0]);
              else {
                var i = e[0];
                for (t = 1; t < e.length; ++t)
                  i = i.concat(e[t]);
                t = new xe(i)
              }
              for (e = new function () {
                this.topSid = 0,
                  this.admins = {},
                  this.removes = [],
                  this.unmarshal = function (t) {
                    this.topSid = t.getUI32();
                    for (var e = t.getUI32(), s = 0; s < e; ++s) {
                      var i = t.getUI32()
                        , n = new ye;
                      t.getMarshal(n),
                        this.admins[i.toString()] = n.props
                    }
                    for (e = t.getUI32(),
                      s = 0; s < e; ++s)
                      this.removes.push(t.getUI32())
                  }
              }
                ,
                t.getMarshal(e),
                // console.log(" [svc_sdk] got channel admins push:", JSON.stringify(e)),
                i = {},
                s = Object.keys(e.admins),
                t = 0; t < s.length; ++t) {
                var n = s[t];
                Me.userInfos[n] || (Me.userInfos[n] = {}),
                  Object.assign(Me.userInfos[n], e.admins[n]),
                  Me.userInfos[n].chl = !0,
                  i[n] = {
                    uid: n,
                    role: this.getCurSubSidRole(Me.topSid, Me.subSid, e.admins[n].role, Me.userInfos[n].roler)
                  }
              }
              this.serviceH5.dataRecvCbs(6, i);
              break;
            case 16903:
              e = new function () {
                this.op = this.roler = this.admin = this.uid = this.topSid = 0,
                  this.nick = "",
                  this.gender = 0,
                  this.unmarshal = function (t) {
                    this.topSid = t.getUI32(),
                      this.uid = t.getUI32(),
                      this.admin = t.getUI32(),
                      this.roler = t.getUI16(),
                      this.op = t.getUI16();
                    var e = t.getUI16();
                    this.nick = t.getUTF8(e),
                      this.gender = t.getUI16()
                  }
              }
                ,
                t.getMarshal(e),
                // console.log(" [svc_sdk] got channel member update:", JSON.stringify(e)),
                t = e.uid.toString(),
                void 0 === Me.userInfos[t] && (Me.userInfos[t] = {}),
                Me.userInfos[t].roler = e.roler,
                150 > e.roler && delete Me.userInfos[t].role,
                Me.userInfos[t].chl = !0,
                i = {},
                n = e.uid.toString(),
                i[n] = {
                  admin: e.admin
                },
                i[n].role = this.getCurSubSidRole(Me.topSid, Me.subSid, Me.userInfos[t].role, e.roler),
                i[n].uid = e.uid,
                i[n].op = e.op,
                this.serviceH5.dataRecvCbs(6, i);
              break;
            case 3137794:
              if (t.getUI32(),
                t.getUI32(),
                1 == (e = t.decompress()).length)
                t = new xe(e[0]);
              else {
                for (i = e[0],
                  t = 1; t < e.length; ++t)
                  i = i.concat(e[t]);
                t = new xe(i)
              }
              for (e = new function () {
                this.version = this.topSid = 0,
                  this.updates = {},
                  this.removes = [],
                  this.unmarshal = function (t) {
                    this.topSid = t.getUI32(),
                      this.version = t.getUI32();
                    for (var e = t.getUI32(), s = 0; s < e; ++s) {
                      var i = t.getUI32();
                      t.getUI32();
                      var n = new ye;
                      t.getMarshal(n),
                        this.updates[i.toString()] = n
                    }
                    for (e = t.getUI32(),
                      s = 0; s < e; ++s)
                      this.removes.push(t.getUI32()),
                        t.getUI32()
                  }
              }
                ,
                t.getMarshal(e),
                // console.log(" [svc_sdk] got channel user push notification:", JSON.stringify(e)),
                t = 0; t < this.h5ChannelEventCbs.length; ++t)
                this.h5ChannelEventCbs[t](Object({
                  type: 8,
                  updates: e.updates,
                  removes: e.removes
                }));
              break;
            case 12290:
              for (e = new _e,
                t.getMarshal(e),
                Me.userInfos[e.uid] || (Me.userInfos[e.uid] = {}),
                Me.userInfos[e.uid].disableVoice = 1,
                // console.log(" [svc_sdk] disable user voice:", JSON.stringify(e)),
                t = 0; t < this.h5ChannelEventCbs.length; ++t)
                this.h5ChannelEventCbs[t](Object({
                  type: 10,
                  code: 0,
                  uid: e.uid,
                  admin: e.admin,
                  disable: e.disable,
                  subSid: e.subSid
                }));
              break;
            case 12546:
              for (e = new _e,
                t.getMarshal(e),
                Me.userInfos[e.uid] || (Me.userInfos[e.uid] = {}),
                Me.userInfos[e.uid].disableText = 1,
                // console.log(" [svc_sdk] disable user text:", JSON.stringify(e)),
                t = 0; t < this.h5ChannelEventCbs.length; ++t)
                this.h5ChannelEventCbs[t](Object({
                  type: 10,
                  code: 1,
                  uid: e.uid,
                  admin: e.admin,
                  disable: e.disable,
                  subSid: e.subSid
                }));
              break;
            case 43010:
              for (e = new function () {
                this.status = this.admin = this.subSid = 0,
                  this.unmarshal = function (t) {
                    this.subSid = t.getUI32(),
                      this.admin = t.getUI32(),
                      this.status = t.getUI32()
                  }
              }
                ,
                t.getMarshal(e),
                this.updateSubChanInfo(e.subSid, "disableText", e.status),
                // console.log(" [svc_sdk] got SetChannelTextURI:", JSON.stringify(e)),
                t = 0; t < this.h5ChannelEventCbs.length; ++t)
                this.h5ChannelEventCbs[t](Object({
                  type: 11,
                  status: e.status,
                  admin: e.admin,
                  subSid: e.subSid
                }))
          }
        }
        ,
        this.addMicList = function (t) {
          Me.micList.micList.push(t)
            // console.log(" [svc_sdk] after addMicList... ", JSON.stringify(Me.micList))
        }
        ,
        this.removeMicList = function (t) {
          for (var e = !1, s = 0; s < Me.micList.micList.length; ++s)
            if (Me.micList.micList[s] == t) {
              Me.micList.micList.splice(s, 1),
                e = !0;
              break
            }
          if (e)
            for (s = 0; s < Me.micList.linkedMicList.length; ++s)
              if (Me.micList.linkedMicList[s] == t) {
                Me.micList.linkedMicList.splice(s, 1),
                  1 == Me.micList.linkedMicList.length && Me.micList.linkedMicList[0] == Me.micList.micList[0] && Me.micList.linkedMicList.splice(0, 1);
                break
              }
          // console.log(" [svc_sdk] after removeMicList... uid:", t, JSON.stringify(Me.micList))
        }
        ,
        this.addChorusList = function (t) {
          0 == Me.micList.linkedMicList.length && Me.micList.linkedMicList.push(Me.micList.micList[0]),
            Me.micList.linkedMicList.push(t)
            // console.log(" [svc_sdk] after addChorusList... ", JSON.stringify(Me.micList))
        }
        ,
        this.removeChorusList = function (t) {
          for (var e = 0; e < Me.micList.linkedMicList.length; ++e)
            if (Me.micList.linkedMicList[e] == t) {
              Me.micList.linkedMicList.splice(e, 1);
              break
            }
          1 == Me.micList.linkedMicList.length && Me.micList.linkedMicList[0] == Me.micList.micList[0] && Me.micList.linkedMicList.splice(0, 1)
            // console.log(" [svc_sdk] after removeChorusList... ", JSON.stringify(Me.micList))
        }
        ,
        this.procAPRouter = function (t) {
          switch (t.ruri) {
            case 2048514:
              var e = new xe(t.payload)
                , s = new function () {
                  this.loginStatus = this.loginTs = this.asid = this.subSid = this.uid = this.topSid = 0,
                    this.errInfo = "",
                    this.expiredTs = 0,
                    this.joinProps = {},
                    this.unmarshal = function (t) {
                      this.topSid = t.getUI32(),
                        this.uid = t.getUI32(),
                        this.subSid = t.getUI32(),
                        this.asid = t.getUI32(),
                        this.loginTs = t.getUI32(),
                        this.loginStatus = t.getUI8();
                      var e = t.getUI16();
                      this.errInfo = t.getUTF8(e),
                        this.expiredTs = t.getUI32();
                      for (var s = t.getUI32(), i = 0; i < s; ++i) {
                        var n = t.getUI32();
                        e = t.getUI16(),
                          e = t.getUTF8(e),
                          this.joinProps[n.toString()] = e
                      }
                    }
                }
                ;
              if (e.getMarshal(s),
                4 == s.loginStatus)
                Me.channelJoined = !0,
                  Me.topSid = s.topSid,
                  Me.subSid = s.subSid,
                  Me.asid = s.asid,
                  // console.log(" [svc_sdk] join channel success.", JSON.stringify(s)),
                  this.ap.reportLog("join_channel", "success"),
                  this.joinChannelBc(),
                  this.serviceH5.joinServiceBc(),
                  (s = new function () {
                    this.chnlInfoMode = 0,
                      this.md5 = "",
                      this.topSid = 0,
                      this.marshal = function (t) {
                        t.setUI8(this.chnlInfoMode),
                          t.setUTF8(this.md5, 16),
                          t.setUI32(this.topSid)
                      }
                  }
                  ).topSid = Me.topSid,
                  (t = new xe).setUI32(Me.topSid),
                  (e = {})[1] = t.toTypedBuffer(),
                  this.ap.sendApRouter("channelInfo", 3096834, s, e),
                  (s = new function () {
                    this.topSid = 0,
                      this.marshal = function (t) {
                        t.setUI32(this.topSid)
                      }
                  }
                  ).topSid = Me.topSid,
                  this.ap.sendApRouter("chatCtrl", 3143682, s, e),
                  this.serviceH5.getUserRoleInfo([Me.uid]);
              else
                for (console.log(" [svc_sdk] join channel failed.", JSON.stringify(s)),
                  this.ap.reportLog("join_channel", "fail", {
                    code: s.loginStatus,
                    topSid: s.topSid,
                    subSid: s.subSid
                  }),
                  e = 0; e < this.h5ChannelEventCbs.length; ++e)
                  this.h5ChannelEventCbs[e](Object({
                    type: 0,
                    code: s.loginStatus,
                    uid: s.uid,
                    top_sid: s.topSid,
                    sub_sid: s.subSid,
                    msg: s.errInfo
                  }));
              break;
            case 2439426:
              for (e = new xe(t.payload),
                s = new function () {
                  this.rank = this.resCode = this.uid = this.toSid = this.fromSid = 0,
                    this.sid2Change = [],
                    this.seq = 0,
                    this.unmarshal = function (t) {
                      this.fromSid = t.getUI32(),
                        this.toSid = t.getUI32(),
                        this.uid = t.getUI32(),
                        this.resCode = t.getUI32(),
                        this.rank = t.getUI32();
                      for (var e = t.getUI32(), s = 0; s < e; ++s) {
                        var i = t.getUI32()
                          , n = t.getUI32();
                        this.sid2Change.push({
                          first: i,
                          second: n
                        })
                      }
                      this.seq = t.getUI64()
                    }
                }
                ,
                e.getMarshal(s),
                200 == s.resCode ? (this.leaveChannelBc(),
                  this.serviceH5.leaveServiceBc(),
                  Me.micList = {},
                  Me.subSid = s.toSid,
                  this.joinChannelBc(),
                  this.serviceH5.joinServiceBc(),
                  // console.log("jump subChannel success.", JSON.stringify(s)),
                  this.ap.reportLog("jump_sub_channel", "success"),
                  s.resCode = 4,
                  this.getMaixuList()) : (console.log("jump subChannel failed.", JSON.stringify(s)),
                    this.ap.reportLog("jump_sub_channel", "fail")),
                e = 0; e < this.h5ChannelEventCbs.length; ++e)
                this.h5ChannelEventCbs[e](Object({
                  type: 0,
                  code: s.resCode,
                  uid: s.uid,
                  top_sid: Me.topSid,
                  sub_sid: s.toSid
                }));
              break;
            case 2050050:
              for (e = new xe(t.payload),
                s = new function () {
                  this.topSid = this.uid = 0,
                    this.marshal = function (t) {
                      t.setUI32(this.uid),
                        t.setUI32(this.topSid)
                    }
                }
                ,
                e.getMarshal(s),
                // console.log(" [svc_sdk] leave channel rsp.", JSON.stringify(s)),
                this.ap.reportLog("leave_channel", "success", {
                  topSid: s.topSid
                }),
                Me.topSid == s.topSid && (Me.channelJoined = !1,
                  Me.topSid = 0,
                  Me.subSid = 0,
                  Me.asid = 0,
                  Me.everJoinChannel = !1),
                e = 0; e < this.h5ChannelEventCbs.length; ++e)
                this.h5ChannelEventCbs[e](Object({
                  type: 4,
                  top_sid: s.topSid
                }));
              break;
            case 3125506:
              for (e = new xe(t.payload),
                s = new function () {
                  this.totalCount = this.topSid = 0,
                    this.sid2Count = {},
                    this.unmarshal = function (t) {
                      this.topSid = t.getUI32(),
                        this.totalCount = t.getUI32();
                      for (var e = t.getUI32(), s = 0; s < e; ++s) {
                        var i = t.getUI32()
                          , n = t.getUI32();
                        this.sid2Count[i.toString()] = n
                      }
                    }
                }
                ,
                e.getMarshal(s),
                // console.log(" [svc_sdk] got ChannelUserCountResURI:", JSON.stringify(s)),
                Me.channelUserCount.totalUserCount = s.totalCount,
                Me.channelUserCount.sid2count = s.sid2Count,
                e = 0; e < this.h5ChannelEventCbs.length; ++e)
                this.h5ChannelEventCbs[e](Object({
                  type: 1,
                  total: s.totalCount,
                  sid2count: s.sid2Count
                }));
              break;
            case 3854594:
              for (e = new xe(t.payload),
                s = new function () {
                  this.disable = this.mute = !1,
                    this.validring = this.count = this.ring = 0,
                    this.userlist = [],
                    this.subSid = this.topSid = 0,
                    this.choruslist = [],
                    this.unmarshal = function (t) {
                      this.mute = t.getBool(),
                        this.disable = t.getBool(),
                        this.ring = t.getUI32(),
                        this.count = t.getUI32(),
                        this.validring = t.getUI32();
                      for (var e = t.getUI32(), s = 0; s < e; ++s)
                        this.userlist.push(t.getUI32());
                      for (this.topSid = t.getUI32(),
                        this.subSid = t.getUI32(),
                        e = t.getUI32(),
                        s = 0; s < e; ++s)
                        this.choruslist.push(t.getUI32())
                    }
                }
                ,
                e.getMarshal(s),
                // console.log(" [svc_sdk] got maixu list:", JSON.stringify(s)),
                this.ap.reportLog("get_maixu", "success"),
                Me.micList.micList = s.userlist,
                Me.micList.linkedMicList = s.choruslist,
                0 != s.choruslist.length && Me.micList.linkedMicList.unshift(s.userlist[0]),
                // console.log(" [svc_sdk] globals mic list:", JSON.stringify(Me.micList.micList)),
                // console.log(" [svc_sdk] globals linked mic list:", JSON.stringify(Me.micList.linkedMicList)),
                e = 0; e < this.h5MaixuCbs.length; ++e)
                this.h5MaixuCbs[e](Object({
                  type: 0,
                  microphones: s.userlist,
                  chorus: s.choruslist
                }));
              break;
            case 533080:
              e = new xe(t.payload),
                s = new Ue,
                e.getMarshal(s),
                this.procUserGroupMsg(s);
              break;
            case 3123714:
              for (e = new xe(t.payload),
                s = new function () {
                  this.receptionSid = this.topSid = 0,
                    this.baseInfo = {},
                    this.subs = [],
                    this.authes = [],
                    this.resCode = 0,
                    this.unmarshal = function (t) {
                      this.topSid = t.getUI32(),
                        this.receptionSid = t.getUI32();
                      for (var e = t.getUI32(), s = 0; s < e; ++s) {
                        var i = t.getUI32().toString();
                        this.baseInfo[i] = {};
                        for (var n = t.getUI32(), o = 0; o < n; ++o) {
                          var a = t.getUI16()
                            , r = t.getUI16();
                          r = t.getUTF8(r),
                            this.baseInfo[i][a] = r
                        }
                      }
                      for (e = t.getUI32(),
                        s = 0; s < e; ++s)
                        this.subs.push(t.getUI32());
                      for (e = t.getUI32(),
                        s = 0; s < e; ++s)
                        (i = {}).sess_from_role = t.getUI32(),
                          i.sess_to_role = t.getUI32(),
                          i.auth_code = t.getUI32(),
                          this.authes.push(i);
                      this.resCode = t.getUI32()
                    }
                }
                ,
                e.getMarshal(s),
                this.ap.reportLog("get_channel_info", "success"),
                this.getChannelUserCount(),
                this.getMaixuList(),
                Me.channelInfo = s,
                e = 0; e < this.h5ChannelEventCbs.length; ++e)
                this.h5ChannelEventCbs[e](Object({
                  type: 0,
                  code: 4,
                  uid: t.uid,
                  top_sid: Me.topSid,
                  sub_sid: Me.subSid
                }));
              break;
            case 3126018:
              for (e = new xe(t.payload),
                s = new function () {
                  this.users = {},
                    this.unmarshal = function (t) {
                      t.getUI32();
                      for (var e = t.getUI32(), s = 0; s < e; ++s) {
                        var i = t.getUI32()
                          , n = new ye;
                        t.getMarshal(n),
                          n.props.uid = i,
                          n.props.chl = !0,
                          this.users[i.toString()] = n.props
                      }
                    }
                    ,
                    this.onlySubChannel = function (t, e, s) {
                      for (var i = {}, n = Object.keys(this.users), o = 0; o < n.length; ++o) {
                        for (var a = {}, r = this.users[n[o]], h = Object.keys(r), l = 0; l < h.length; ++l)
                          "role" != h[l] && "roler" != h[l] && (a[h[l]] = r[h[l]]);
                        a.role = s(t, e, r.role, 25),
                          i[n[o]] = a
                      }
                      return i
                    }
                }
                ,
                e.getMarshal(s),
                t = Object.keys(s.users),
                e = 0; e < t.length; ++e) {
                var i = t[e];
                void 0 === Me.userInfos[i] && (Me.userInfos[i] = {}),
                  Object.assign(Me.userInfos[i], s.users[i])
              }
              0 != Object.keys(s.users).length && this.serviceH5.dataRecvCbs(6, s.onlySubChannel(Me.topSid, Me.subSid, this.getCurSubSidRole));
              break;
            case 3126530:
              e = new xe(t.payload),
                s = new function () {
                  this.pos = this.subSid = this.topSid = 0,
                    this.users = {},
                    this.unmarshal = function (t) {
                      this.topSid = t.getUI32(),
                        this.subSid = t.getUI32(),
                        this.pos = t.getUI32();
                      for (var e = t.getUI32(), s = 0; s < e; ++s) {
                        var i = t.getUI32()
                          , n = new ye;
                        t.getMarshal(n),
                          n.props.uid = i,
                          n.props.chl = !0,
                          this.users[i.toString()] = n.props
                      }
                    }
                }
                ,
                e.getMarshal(s),
                t = Object.keys(s.users);
              var n = [];
              for (e = 0; e < t.length; ++e)
                i = t[e],
                  n.push(i),
                  void 0 === Me.userInfos[i] && (Me.userInfos[i] = {}),
                  Object.assign(Me.userInfos[i], s.users[i]);
              for (e = 0; e < this.h5ChannelEventCbs.length; ++e)
                this.h5ChannelEventCbs[e](Object({
                  type: 2,
                  uids: n,
                  topSid: s.topSid,
                  subSid: s.subSid
                }));
              break;
            case 3148802:
              if (e = new xe(t.payload),
                s = new function () {
                  this.topSid = this.type = 0,
                    this.msg = "",
                    this.seqId = this.serverId = 0,
                    this.unmarshal = function (t) {
                      this.type = t.getUI32(),
                        this.topSid = t.getUI32();
                      var e = t.getUI32();
                      this.msg = t.getBytes(e)
                    }
                }
                ,
                e.getMarshal(s),
                e = new xe(s.msg),
                s = e.getUI32(),
                t = e.getUI32(),
                e.getUI16(),
                2051330 == t)
                for (s = new function () {
                  this.uid = this.from = 0,
                    this.reason = "",
                    this.unmarshal = function (t) {
                      this.from = t.getUI32(),
                        this.uid = t.getUI32();
                      var e = t.getUI16();
                      this.reason = t.getUTF8(e)
                    }
                }
                  ,
                  e.getMarshal(s),
                  this.leaveChannel(),
                  // console.log(" [svc_sdk] PMutiJoinKick:", JSON.stringify(s)),
                  this.ap.reportLog("multi_join_kick", "ok"),
                  e = 0; e < this.h5ChannelEventCbs.length; ++e)
                  this.h5ChannelEventCbs[e](Object({
                    type: 3,
                    uid: s.uid
                  }));
              else if (79106 == t)
                for (s = new ce,
                  e.getMarshal(s),
                  // console.log(" [svc_sdk] got unicast ChannelKickOffURI:", JSON.stringify(s)),
                  Me.uid == s.uid && (0 == s.toChannel ? (this.ap.reportLog("be_kicked_channel", "leave", {
                    notify_uid: s.uid
                  }),
                    this.leaveChannel()) : (this.ap.reportLog("be_kicked_sub_channel", "leave", {
                      notify_uid: s.uid
                    }),
                      this.leaveChannelBc(),
                      this.serviceH5.leaveServiceBc(),
                      Me.micList = {},
                      Me.subSid = s.toChannel,
                      this.joinChannelBc(),
                      this.serviceH5.joinServiceBc(),
                      // console.log("be kicked to subChannel:", s.toChannel),
                      this.getMaixuList())),
                  e = 0; e < this.h5ChannelEventCbs.length; ++e)
                  this.h5ChannelEventCbs[e](Object({
                    type: 7,
                    reason: s.reason,
                    seconds: s.seconds,
                    uid: s.uid,
                    admin: s.admin,
                    oldSid: s.sid,
                    newSid: s.toChannel,
                    kickType: s.kickType
                  }));
              else if (11266 == t)
                for (s = new function () {
                  this.mode = this.admin = this.toSid = this.fromSid = this.uid = 0,
                    this.uinfos = [],
                    this.unmarshal = function (t) {
                      this.uid = t.getUI32(),
                        this.fromSid = t.getUI32(),
                        this.toSid = t.getUI32(),
                        this.admin = t.getUI32(),
                        this.mode = t.getUI8();
                      for (var e = t.getUI32(), s = 0; s < e; ++s) {
                        var i = {};
                        i.uid = t.getUI32();
                        var n = t.getUI16();
                        i.nick = t.getUTF8(n),
                          n = t.getUI16(),
                          i.sign = t.getUTF8(n),
                          i.pid = t.getUI32(),
                          i.jifen = t.getUI32(),
                          i.sjifen = t.getUI32(),
                          i.gender = t.getUI8(),
                          i.rolers = [],
                          s = t.getUI32();
                        for (var o = 0; o < s; o++) {
                          var a = {};
                          a.cid = t.getUI32(),
                            a.roler = t.getUI16(),
                            i.rolers.push(a)
                        }
                        for (i.ip = t.getUI32(),
                          n = t.getUI16(),
                          i.pcInfo = t.getUTF8(n),
                          i.extInfo = {},
                          o = t.getUI32(),
                          s = 0; s < o; ++s)
                          a = t.getUI8(),
                            n = t.getUI16(),
                            n = t.getUTF8(n),
                            i.extInfo[a.toString()] = n;
                        this.uinfos.push(i)
                      }
                    }
                }
                  ,
                  e.getMarshal(s),
                  s.uid == Me.uid && (this.leaveChannelBc(),
                    this.serviceH5.leaveServiceBc(),
                    Me.micList = {},
                    Me.subSid = s.toSid,
                    this.joinChannelBc(),
                    this.serviceH5.joinServiceBc(),
                    // console.log("recv tuoren notify to subChannel:", s.toSid),
                    this.getMaixuList()),
                  e = 0; e < this.h5ChannelEventCbs.length; ++e)
                  this.h5ChannelEventCbs[e](Object({
                    type: 12,
                    admin: s.admin,
                    uid: s.uid,
                    fromSid: s.fromSid,
                    toSid: s.toSid,
                    uinfos: s.uinfos,
                    mode: s.mode
                  }));
              else
                console.log(" [svc_sdk] unknown POnUniCast ruri:", t / 256, "|", t % 256, "len:", s);
              break;
            case 3144194:
              if ((e = new xe(t.payload)).getUI32(),
                e.getUI32(),
                1 == (s = e.decompress()).length)
                e = new xe(s[0]);
              else {
                for (t = s[0],
                  e = 1; e < s.length; ++e)
                  t = t.concat(s[e]);
                e = new xe(t)
              }
              for (s = new function () {
                this.topSid = 0,
                  this.speakableList = this.disableText = this.disableVoice = null,
                  this.chTextDisabled = [],
                  this.disableVisitorTextChs = [],
                  this.unmarshal = function (t) {
                    this.topSid = t.getUI32();
                    var e = new pe;
                    t.getMarshal(e),
                      this.disableVoice = e.us,
                      e = new pe,
                      t.getMarshal(e),
                      this.disableText = e.us,
                      e = new pe,
                      t.getMarshal(e),
                      this.speakableList = e.us,
                      e = t.getUI32();
                    for (var s = 0; s < e; ++s)
                      this.chTextDisabled.push(t.getUI32());
                    for (e = t.getUI32(),
                      s = 0; s < e; ++s)
                      this.disableVisitorTextChs.push(t.getUI32())
                  }
              }
                ,
                e.getMarshal(s),
                // console.log(" [svc_sdk] got channel chat control res:", JSON.stringify(s)),
                e = 0; e < this.h5ChannelEventCbs.length; ++e)
                this.h5ChannelEventCbs[e](Object({
                  type: 9,
                  topSid: s.topSid,
                  disableVoice: s.disableVoice,
                  disableText: s.disableText,
                  speakableList: s.speakableList,
                  chTextDisabled: s.chTextDisabled,
                  disableVisitorTextChs: s.disableVisitorTextChs
                }))
          }
        }
        ,
        this.loginUDB = function () {
          0 == Me.userType ? this.anonyousLoginUDB() : this.normalLoginUDB()
        }
        ,
        this.onApOpen = function (t) {
          Me.loginedUDB || (console.log(" [svc_sdk] start to login UDB:"),
            this.loginUDB())
        }
        ,
        this.onLoginAp = function () {
          1 == Me.everJoinChannel && (console.log(" [svc_sdk] start to re-join channel"),
            this.ap.reportLog("rejoin_channel", "start"),
            Me.channelJoined ? this.joinChannel(Me.topSid, Me.subSid, null, null, Me.exclusiveJoin, null, !0) : this.joinChannel(Me.tryTopSid, Me.trySubSid, null, null, Me.exclusiveJoin));
          for (var t = 0; t < this.h5EventCbs.length; ++t)
            this.h5EventCbs[t](Object({
              type: 1,
              code: 0
            }))
        }
        ,
        this.onmessage = function (t, e) {
          if (512011 == t) {
            var s = new ve;
            e.getMarshal(s),
              this.procAPRouter(s)
          } else if (778500 == t)
            if (s = new function () {
              this.context = "",
                this.ruri = this.resCode = 0,
                this.payload = "",
                this.unmarshal = function (t) {
                  var e = t.getUI16();
                  this.context = t.getUTF8(e),
                    this.resCode = t.getUI32(),
                    this.ruri = t.getUI32(),
                    e = t.getUI32(),
                    this.payload = t.getBytes(e)
                }
            }
              ,
              e.getMarshal(s),
              20078 == s.ruri) {
              var i = new xe(s.payload)
                , n = new function () {
                  this.context = "",
                    this.yyid = this.uid = this.resCode = 0,
                    this.ticket = this.cookie = this.password = this.passport = "",
                    this.unmarshal = function (t) {
                      var e = t.getUI16();
                      this.context = t.getUTF8(e),
                        this.resCode = t.getUI32(),
                        this.uid = t.getUI32(),
                        this.yyid = t.getUI32(),
                        e = t.getUI16(),
                        this.passport = t.getBytes(e),
                        e = t.getUI16(),
                        this.password = t.getBytes(e),
                        e = t.getUI16(),
                        this.cookie = t.getBytes(e),
                        e = t.getUI16(),
                        this.ticket = t.getBytes(e)
                    }
                }
                ;
              i.getMarshal(n),
                0 != n.resCode && 200 != n.resCode ? (console.log(" [svc_sdk] anonyous login UDB failed. res:", n),
                  this.ap.reportLog("anonyous_login_udb", "fail", {
                    code: s.resCode
                  }),
                  this.onLoginUDB(s.resCode, !0)) : (console.log(" [svc_sdk] anonyous login UDB success."),
                    this.ap.reportLog("anonyous_login_udb", "success"),
                    Me.uid = n.uid,
                    Me.ticket = n.ticket,
                    Me.cookie = n.cookie,
                    Me.username = n.passport,
                    Me.password = n.password,
                    Me.yyid = n.yyid,
                    this.userType = 0,
                    this.onLoginUDB(n.resCode, !0, {
                      uid: n.uid,
                      yyid: n.yyid
                    }))
            } else
              19054 == s.ruri || 19566 == s.ruri ? (i = new xe(s.payload),
                s = new function () {
                  this.context = "",
                    this.yyid = this.uid = this.resCode = 0,
                    this.ticket = this.cookie = this.email = this.passport = "",
                    this.errCode = 0,
                    this.errMsg = "",
                    this.unmarshal = function (t) {
                      var e = t.getUI16();
                      this.context = t.getUTF8(e),
                        this.resCode = t.getUI32(),
                        this.uid = t.getUI32(),
                        this.yyid = t.getUI32(),
                        e = t.getUI16(),
                        this.passport = t.getBytes(e),
                        e = t.getUI16(),
                        this.email = t.getUTF8(e),
                        e = t.getUI16(),
                        this.cookie = t.getBytes(e),
                        e = t.getUI16(),
                        this.ticket = t.getBytes(e),
                        this.errCode = t.getUI32(),
                        e = t.getUI16(),
                        this.errMsg = t.getUTF8(e)
                    }
                }
                ,
                i.getMarshal(s),
                0 != s.resCode && 200 != s.resCode ? (console.log(" [svc_sdk] normal login UDB failed. res:", s),
                  this.ap.reportLog("normal_login_udb", "fail", {
                    code: s.resCode
                  }),
                  this.onLoginUDB(s.resCode, !1)) : (console.log(" [svc_sdk] normal login UDB success.", s),
                    this.ap.reportLog("normal_login_udb", "success"),
                    Me.uid = s.uid,
                    Me.yyid = s.yyid,
                    Me.ticket = s.ticket,
                    Me.cookie = s.cookie,
                    Me.username = s.passport,
                    this.userType = 1,
                    this.onLoginUDB(s.resCode, !1, {
                      uid: s.uid,
                      yyid: s.yyid
                    }))) : console.log(" [svc_sdk] unhandle ruri in CliAPLoginAuthRes:", s.ruri / 256, "|", s.ruri % 256);
          else if (779524 == t)
            s = new function () {
              this.context = "",
                this.ruri = this.resCode = 0,
                this.payload = "",
                this.unmarshal = function (t) {
                  var e = t.getUI16();
                  this.context = t.getUTF8(e),
                    this.resCode = t.getUI32(),
                    this.ruri = t.getUI32(),
                    e = t.getUI32(),
                    this.payload = t.getBytes(e)
                }
            }
              ,
              e.getMarshal(s),
              352347369 == s.ruri ? (i = new xe(s.payload),
                s = new function () {
                  this.protoVersion = 0,
                    this.context = "",
                    this.errCode = 0,
                    this.description = this.errMsg = "",
                    this.yyid = this.uid = this.strategy = 0,
                    this.credit = this.passport = "",
                    this.loginParams = {},
                    this.emailMask = this.mobileMask = "",
                    this.nowTime = 0,
                    this.sessionData = "",
                    this.protoStrategyDetail = [],
                    this.linkTicket = this.cookie = this.ticket = this.url = "",
                    this.unmarshal = function (t) {
                      t.getUI16(),
                        this.protoVersion = t.getUI32();
                      var e = t.getUI16();
                      this.context = t.getUTF8(e),
                        this.errCode = t.getUI32(),
                        e = t.getUI16(),
                        this.errMsg = t.getUTF8(e),
                        e = t.getUI16(),
                        this.description = t.getUTF8(e),
                        this.strategy = t.getUI32(),
                        t.getUI16(),
                        this.uid = t.getUI32(),
                        t.getUI32(),
                        this.yyid = t.getUI32(),
                        t.getUI32(),
                        e = t.getUI16(),
                        this.passport = t.getBytes(e),
                        e = t.getUI16(),
                        this.credit = t.getUTF8(e);
                      for (var s = t.getUI32(), i = 0; i < s; ++i) {
                        e = t.getUI16();
                        var n = t.getUTF8(e);
                        e = t.getUI16(),
                          e = t.getUTF8(e),
                          this.loginParams[n] = e
                      }
                      for (e = t.getUI16(),
                        this.mobileMask = t.getUTF8(e),
                        e = t.getUI16(),
                        this.emailMask = t.getUTF8(e),
                        this.nowTime = t.getUI32(),
                        e = t.getUI16(),
                        this.sessionData = t.getUTF8(e),
                        s = t.getUI32(),
                        i = 0; i < s; ++i)
                        t.getUI16(),
                          (n = {}).strategy = t.getUI32(),
                          e = t.getUI16(),
                          n.selectTitle = t.getUTF8(e),
                          e = t.getUI16(),
                          n.promptTitle = t.getUTF8(e),
                          e = t.getUI16(),
                          n.promptContent = t.getUTF8(e),
                          n.dataType = t.getUI32(),
                          e = t.getUI16(),
                          n.data = t.getUTF8(e),
                          n.promptBoxHigh = t.getUI32(),
                          n.promptBoxLength = t.getUI32(),
                          this.protoStrategyDetail.push(n);
                      e = t.getUI16(),
                        this.url = t.getUTF8(e),
                        e = t.getUI16(),
                        this.ticket = t.getBytes(e),
                        e = t.getUI16(),
                        this.cookie = t.getBytes(e),
                        t.empty() || (e = t.getUI16(),
                          this.linkTicket = t.getBytes(e))
                    }
                }
                ,
                i.getMarshal(s),
                0 != s.errCode ? (console.log(" [svc_sdk] YYLoginRes login UDB failed. res:", JSON.stringify(s)),
                  this.ap.reportLog("normal_login_udb", "fail", {
                    code: s.resCode
                  }),
                  this.onLoginUDB(s.errCode, !1, {}, s.errMsg)) : (console.log(" [svc_sdk] YYLoginRes login UDB success. res:", s),
                    this.ap.reportLog("normal_login_udb", "success"),
                    Me.uid = s.uid,
                    Me.yyid = s.yyid,
                    Me.ticket = s.ticket,
                    Me.linkticket = s.linkTicket,
                    Me.cookie = s.cookie,
                    Me.username = s.passport,
                    Me.credit = s.credit,
                    Me.wxappid && (Ee("yyuid", s.uid),
                      Ee("udb_c", s.credit)),
                    Me.password = s.credit,
                    this.userType = 1,
                    this.onLoginUDB(s.errCode, !1, {
                      uid: s.uid,
                      yyid: s.yyid
                    }))) : console.log(" [svc_sdk] unhandle ruri in CliAPLoginAuth2Res:", s.ruri / 256, "|", s.ruri % 256);
          else if (795140 == t)
            for (s = new function () {
              this.appid = 0,
                this.reason = "",
                this.uid2 = this.uid = this.appkey = this.routeNum = this.code = 0,
                this.unmarshal = function (t) {
                  t.getUI32(),
                    this.appid = t.getUI32();
                  var e = t.getUI16();
                  this.reason = t.getUTF8(e),
                    this.code = t.getUI32(),
                    this.routeNum = t.getUI32(),
                    this.appkey = t.getUI32(),
                    t.empty() || (this.uid = t.getUI32()),
                    t.empty() || (this.uid2 = t.getUI32())
                }
            }
              ,
              e.getMarshal(s),
              // console.log(" [svc_sdk] force out:", JSON.stringify(s)),
              this.ap.reportLog("ap_force_out", "stop"),
              this.stop(s.uid, s.reason),
              i = 0; i < this.h5EventCbs.length; ++i)
              this.h5EventCbs[i](Object({
                type: 3,
                code: s.code,
                reason: s.reason
              }));
          else
            console.log(" [svc_sdk] unhandle channel uri:", t / 256, "|", t % 256)
        }
        ,
        this.myInfo = function () {
          var t = {
            uid: Me.uid,
            yyid: Me.yyid,
            top_sid: Me.topSid,
            sub_sid: Me.subSid
          };
          return 0 != Me.nick.length && (t.nick = Me.nick),
            t
        }
        ,
        this.getChannelInfo = function (t) {
          if (null == Me.channelInfo || void 0 === Me.channelInfo)
            return console.log(" [svc_sdk] channel info not ready"),
              null;
          var e = Me.channelInfo.baseInfo;
          if (null == e || void 0 === e)
            return null;
          var s = {};
          return null == (e = e[t]) || void 0 === e ? s.name = "" : (s.name = e[256],
            s.textLimitTime = e[289],
            s.micListMode = e[275],
            s.pid = e[262],
            s.guestWaitTime = e[294],
            s.guestTextMaxLen = e[295],
            s.sendUrlText = e[308],
            s.memberSendUrlText = e[318],
            s.sendTextBindMobile = e[323],
            s.templateId = e[8196],
            s.disableText = e.disableText,
            s.disalbeVoice = e.disableVoice),
            e = null,
            Me.channelUserCount.sid2count && (e = Me.channelUserCount.sid2count[t]),
            t = Me.channelUserCount.totalUserCount,
            s.userCount = e,
            s.totalUserCount = t,
            s
        }
        ,
        this.getCurrentChannelInfo = function () {
          if (null == Me.channelInfo || void 0 === Me.channelInfo)
            return console.log(" [svc_sdk] channel info not ready"),
              null;
          var t = Me.channelInfo.baseInfo;
          if (null == t || void 0 === t)
            return null;
          var e = {};
          return null == (t = t[Me.topSid]) || void 0 === t ? e.name = 0 : (e.name = t[256],
            e.textLimitTime = t[289],
            e.channelType = t[278],
            e.channelTypeStr = t[279],
            e.micListMode = t[275],
            e.jifen = t[280],
            e.guestWaitTime = t[294],
            e.guestTextMaxLen = t[295],
            e.sendUrlText = t[308],
            e.memberSendUrlText = t[318],
            e.sendTextBindMobile = t[323],
            e.templateId = t[8196],
            e.disableText = t.disableText,
            e.disalbeVoice = t.disableVoice,
            e.owner = t[263]),
            e.totalUserCount = Me.channelUserCount.totalUserCount,
            e.asid = Me.asid,
            e
        }
        ,
        this.getChannelTreeInfo = function () {
          return Me.channelInfo
        }
        ,
        this.updateSubChanInfo = function (t, e, s) {
          Me.channelInfo.baseInfo[t][e] = s
        }
        ,
        this.getUserList = function (t, e, s) {
          var i = new function () {
            this.pos = this.num = this.subSid = this.topSid = 0,
              this.marshal = function (t) {
                t.setUI32(this.topSid),
                  t.setUI32(this.subSid),
                  t.setUI32(this.num),
                  t.setUI32(this.pos)
              }
          }
            ;
          i.topSid = Me.topSid,
            i.subSid = null != s && void 0 !== s && 0 != s ? s : Me.subSid,
            i.num = e,
            i.pos = t,
            // console.log(" [svc_sdk] getUserList num:", i.num, "pos:", i.pos),
            (t = new xe).setUI32(Me.topSid),
            (e = {})[1] = t.toTypedBuffer(),
            this.ap.sendApRouter("channelUserInfo", 3126274, i, e)
        }
        ,
        this.getMicListMode = function () {
          if (null == Me.channelInfo || void 0 === Me.channelInfo)
            return console.log(" [svc_sdk] channel info not ready"),
              null;
          var t = this.channelInfo.baseInfo;
          return null == t || void 0 === t ? null : null == (t = t[Me.subSid]) || void 0 === t ? null : t[275]
        }
        ,
        this.getLinkedMicList = function () {
          return Me.micList.linkedMicList
        }
        ,
        this.getMicList = function () {
          return Me.micList.micList
        }
        ,
        this.isGuestLogin = function () {
          return 0 == Me.userType
        }
        ,
        this.isInChannel = function () {
          return 0 != Me.topSid && 0 != Me.subSid ? {
            code: 1,
            topSid: Me.topSid,
            subSid: Me.subSid
          } : {
              code: 0
            }
        }
    }
    , Re = function (Me, t) {
      events.EventEmitter.call(this);
      this.channelH5 = t,
        this.ap = new Be(this, 260, Me),
        this.h5EventCbs = [],
        this.h5DataRecvCbs = [],
        this.h5ChatRecvCbs = [],
        this.setChlH5 = function (t) {
          this.channelH5 = t
        }
        ,
        this.setH5EventCb = function (t, e) {
          if (e)
            this.h5EventCbs = [];
          else
            for (var s = 0; s < this.h5EventCbs.length; ++s)
              if (this.h5EventCbs[s] == t)
                return;
          this.h5EventCbs.push(t)
        }
        ,
        this.setH5DataRecvCb = function (t, e) {
          if (e)
            this.h5DataRecvCbs = [];
          else
            for (var s = 0; s < this.h5DataRecvCbs.length; ++s)
              if (this.h5DataRecvCbs[s] == t)
                return;
          this.h5DataRecvCbs.push(t)
        }
        ,
        this.setH5ChatRecvCb = function (t, e) {
          if (e)
            this.h5ChatRecvCbs = [];
          else
            for (var s = 0; s < this.h5ChatRecvCbs.length; ++s)
              if (this.h5ChatRecvCbs[s] == t)
                return;
          this.h5ChatRecvCbs.push(t)
        }
        ,
        this.dataRecvCbs = function (t, e) {
          try {
            var COMBO_SRV_APP_ACTION_ZIP = 120;
            var COMBO_SRV_APP_ACTION_ZIP_123 = 123;
            var f = new xe(e);
            var d = (f.getUI32(),
            f.getUI32());
            f.getUI16();
            if (d != COMBO_SRV_APP_ACTION_ZIP_123) {
              var N = (f.getUI32(),
              f.getUI32(),
              !1);
              if (d == COMBO_SRV_APP_ACTION_ZIP)
                var N = f.getBool();
              if (!N) {
                for (var x = f.getUI32(), i = 0; i < x; i++)
                  var b = f.getUI32(),
                  v = f.getUI32(),
                  y = f.getUI32(),
                  _ = f.getBytes(f.getUI16()),
                  f = new xe(_),
                  gift = sendResponse(v, y, f);
                  this.emit('gift', gift);
              } else {
                var x = f.getUI32()
                  , M = (f.getUI32(),
                f.decompress());
                var P;
                if (1 == M.length)
                    P = new xe(M[0]);
                else {
                    for (var L = M[0], i = 1; i < M.length; ++i)
                        L = L.concat(M[i]);
                    P = new xe(L)
                }
                for (var D = P.getUI32(), i = 0; i < D; ++i) {
                    for (var b = P.getUI32(), v = P.getUI32(), y = P.getUI32(), F = P.getUI16(), B = P.getBytes(F), j = P.getUI32(), T = 0; T < j; ++T)
                        var A = P.getUI32()
                          , G = P.getUI16()
                          , E = P.getUTF8(G);
                    f = new xe(B),
                    gift = sendResponse(v, y, f);
                    this.emit('gift', gift);
                }
              }
            }
          } catch (e) {
            
          }
          for (var s = 0; s < this.h5DataRecvCbs.length; ++s) {
            this.h5DataRecvCbs[s](t, e)
          }
        }
        ,
        this.login = function () {
          this.ap || (this.ap = new Be(this, 260, Me)),
            this.ap.start()
        }
        ,
        this.changeServiceBc = function (t, e, s) {
          var i = {
            grpTypeLow: 1,
            grpTypeHigh: 0
          };
          i.grpIdLow = e,
            i.grpIdHigh = 0,
            (e = {
              grpTypeLow: 2,
              grpTypeHigh: 0
            }).grpIdLow = s,
            e.grpIdHigh = 0,
            (s = new be).uid = Me.uid,
            s.grpIdSet.push(i),
            s.grpIdSet.push(e),
            (i = new Le).uri = t,
            this.ap.bufSend(i.marshal(s))
        }
        ,
        this.joinServiceBc = function () {
          this.changeServiceBc(642648, Me.topSid, Me.subSid),
            // console.log(" [svc_sdk] start to join service broadcast group. topSid:", Me.topSid, "subSid:", Me.subSid),
            this.ap.reportLog("join_user_group_svc", "start")
        }
        ,
        this.joinSvcUserGroup = function (t, e) {
          var s = {};
          s.grpTypeLow = t,
            s.grpTypeHigh = 0,
            s.grpIdLow = e,
            s.grpIdHigh = 0;
          var i = new be;
          i.uid = Me.uid,
            i.grpIdSet.push(s),
            (s = new Le).uri = 642648,
            this.ap.bufSend(s.marshal(i))
        }
        ,
        this.leaveServiceBc = function () {
          this.changeServiceBc(642904, Me.topSid, Me.subSid),
            // console.log(" [svc_sdk] start to leave service broadcast group. topSid:", Me.topSid, "subSid:", Me.subSid),
            this.ap.reportLog("leave_user_group_svc", "start")
        }
        ,
        this.leaveSvcUserGroup = function (t, e) {
          var s = {};
          s.grpTypeLow = t,
            s.grpTypeHigh = 0,
            s.grpIdLow = e,
            s.grpIdHigh = 0;
          var i = new be;
          i.uid = Me.uid,
            i.grpIdSet.push(s),
            (s = new Le).uri = 642904,
            this.ap.bufSend(s.marshal(i))
        }
        ,
        this.procDlByUid = function (t) {
          var e = new function () {
            this.uid = this.appid = 0,
              this.seqId = this.suid = this.msg = "",
              this.unmarshal = function (t) {
                this.appid = t.getUI16(),
                  this.uid = t.getUI32();
                var e = t.getUI32();
                this.msg = new Uint8Array(t.getBytes(e)),
                  t.empty() || (this.suid = t.getUI64()),
                  t.empty() || (this.seqId = t.getUI64())
              }
          }
            ;
          if (t.getMarshal(e),
            31 == e.appid)
            if ((e = new xe(e.msg)).getUI32(),
              t = e.getUI32(),
              e.getUI16(),
              3115608 == t)
              for (t = new function () {
                this.reason = this.subSid = this.uid = this.topSid = 0,
                  this.props = {},
                  this.props2 = {},
                  this.unmarshal = function (t) {
                    this.topSid = t.getUI32(),
                      this.uid = t.getUI32(),
                      this.subSid = t.getUI32(),
                      this.reason = t.getUI8();
                    for (var e = t.getUI32(), s = 0; s < e; ++s) {
                      var i = t.getUI32()
                        , n = t.getUI16();
                      n = t.getUTF8(n),
                        this.props[i.toString()] = n
                    }
                    for (e = t.getUI32(),
                      s = 0; s < e; ++s)
                      i = t.getUI32(),
                        n = t.getUI16(),
                        n = t.getUTF8(n),
                        this.props2[i.toString()] = n
                  }
              }
                ,
                e.getMarshal(t),
                // console.log(" [svc_sdk] got chat exception msg:", JSON.stringify(t)),
                this.ap.reportLog("chat_exception", "ignore", {
                  code: t.reason
                }),
                e = 0; e < this.h5ChatRecvCbs.length; ++e)
                this.h5ChatRecvCbs[e](Object({
                  code: t.reason,
                  props: t.props2
                }));
            else
              console.log(" [svc_sdk] unknown chat service uri:", t / 256, "|", t % 256);
          else if (6 == e.appid)
            if ((e = new xe(e.msg)).getUI32(),
              t = e.getUI32(),
              e.getUI16(),
              283480 == t) {
              t = new function () {
                this.users = {},
                  this.unmarshal = function (t) {
                    for (var e = t.getUI32(), s = 0; s < e; ++s) {
                      var i = new me;
                      t.getMarshal(i),
                        i.svc = !0,
                        this.users[i.uid] = i
                    }
                  }
              }
                ,
                e.getMarshal(t);
              var s = Object.keys(t.users);
              for (e = 0; e < s.length; ++e) {
                var i = s[e];
                void 0 === Me.userInfos[i] && (Me.userInfos[i] = {}),
                  Object.assign(Me.userInfos[i], t.users[i])
              }
              null != (e = t.users[Me.uid]) && void 0 !== e && (Me.nick = e.nick),
                this.dataRecvCbs(6, t.users)
            } else
              console.log(" [svc_sdk] unknown uinfo service uri:", t / 256, "|", t % 256);
          else
            this.dataRecvCbs(e.appid, e.msg)
        }
        ,
        this.procUserGroupMsg = function (t) {
          switch (t.ruri) {
            case 80216:
              t = new xe(t.msg),
                this.procDlByUid(t)
          }
        }
        ,
        this.procAPRouter = function (t) {
          switch (t.ruri) {
            case 533080:
              t = new xe(t.payload);
              var e = new Ue;
              t.getMarshal(e),
                this.procUserGroupMsg(e);
              break;
            case 80216:
              t = new xe(t.payload),
                this.procDlByUid(t)
          }
        }
        ,
        this.onApOpen = function (t) { }
        ,
        this.onLoginAp = function () {
          if (console.log(" [svc_sdk] login service ap success. start to join user group etc."),
            this.ap.reportLog("login_svc_ap", "success"),
            Me.appidSubs) {
            var t = Object.keys(Me.appidSubs);
            // console.log(" [svc_sdk] re-subs appids:", JSON.stringify(t)),
              this.subsAppids(t)
          }
          for (Me.appidUnsubs && (t = Object.keys(Me.appidUnsubs),
            // console.log(" [svc_sdk] re-unsubs appids:", JSON.stringify(t)),
            this.unsubsAppids(t)),
            t = 0; t < this.h5EventCbs.length; ++t)
            this.h5EventCbs[t](Object({
              type: 2,
              code: 0
            })),
              this.getSvcUserInfo([Me.uid])
        }
        ,
        this.onmessage = function (t, e) {
          if (512011 == t) {
            var s = new ve;
            e.getMarshal(s),
              this.procAPRouter(s)
          } else if (28760 == t)
            if (s = new function () {
              this.topSid = this.appid = 0,
                this.msg = "",
                this.unmarshal = function (t) {
                  this.appid = t.getUI16(),
                    this.topSid = t.getUI32();
                  var e = t.getUI16();
                  this.msg = new Uint8Array(t.getBytes(e))
                }
            }
              ,
              e.getMarshal(s),
              31 == s.appid) {
              var i = new xe(s.msg);
              if (i.getUI32(),
                t = i.getUI32(),
                i.getUI16(),
                3104600 == t)
                for (s = new ge,
                  i.getMarshal(s),
                  // 弹幕 danmu
                  this.receiveDanmu(Object({
                    code: 0,
                    yyid: s.yyid,
                    from_uid: s.from,
                    nick: s.nick,
                    msg: s.chat.msg,
                    top_sid: s.topSid,
                    sub_sid: s.subSid
                  })),
                  i = 0; i < this.h5ChatRecvCbs.length; ++i) {
                    // this.h5ChatRecvCbs[i](Object({
                    //   code: 0,
                    //   yyid: s.yyid,
                    //   from_uid: s.from,
                    //   nick: s.nick,
                    //   msg: s.chat.msg,
                    //   top_sid: s.topSid,
                    //   sub_sid: s.subSid
                    // }));
                  }
              else
                console.log(" [svc_sdk] unknown chat service uri:", t / 256, "|", t % 256)
            } else
              this.dataRecvCbs(s.appid, s.msg);
          else
            80216 == t ? this.procDlByUid(e) : 533080 == t ? (s = new Ue,
              e.getMarshal(s),
              this.dataRecvCbs(s.appid, s.msg)) : 643928 != t && console.log(" [svc_sdk] unhandle service uri:", t / 256, "|", t % 256)
        },

        this.receiveDanmu = function (obj) {
          this.emit('data', obj);
        }
        
        ,
        this.sendChatMsg = function (t, e) {
          var s = new ge;
          s.from = Me.uid,
            s.topSid = Me.topSid,
            s.subSid = Me.subSid;
          var i = new fe;
          i.msg = e,
            s.chat = i,
            0 != t.length && (s.nick = t,
              s.extra[8] = t),
            s.extra[2] = "25",
            s.extra[3] = "1",
            s.extra[4] = Me.yyid.toString(),
            s.extra[4] = "0",
            s.extra[6] = "0",
            s.extra[7] = "0",
            // console.log(" [svc_sdk] sending chat msg. nick:", t, "msg:", e),
            this.ap.reportLog("send_chat", "start", {
              msg: e
            }),
            (i = new Le).uri = 3104344,
            this.sendAppData(31, i.marshal(s))
        }
        ,
        this.sendAppData = function (t, e) {
          var s = new function () {
            this.uid = this.topSid = this.appid = 0,
              this.payload = null,
              this.suid = this.subSid = this.statType = this.termType = this.clientIp = 0,
              this.ext = {},
              this.marshal = function (t) {
                t.setUI16(this.appid),
                  t.setUI32(this.topSid),
                  t.setUI32(this.uid),
                  "string" == typeof this.payload ? t.setUTF8(this.payload, 32) : t.setBytes(this.payload, 32),
                  t.setUI32(this.clientIp),
                  t.setUI8(this.termType),
                  t.setUI8(this.statType),
                  t.setUI32(this.subSid),
                  t.setUI32(0),
                  t.setUI32(0);
                var e = Object.keys(this.ext);
                t.setUI32(e.length);
                for (var s = 0; s < e.length; ++s)
                  t.setUI32(parseInt(e[s])),
                    t.setUTF8(this.ext[e[s]], 16)
              }
          }
            ;
          s.appid = t,
            s.topSid = Me.topSid,
            s.subSid = Me.subSid,
            s.uid = Me.uid,
            s.payload = "string" == typeof e ? e : new Uint8Array(e),
            s.statType = t,
            this.ap.sendApRouter("", 79960, s, null)
        }
        ,
        this.sendAppSender = function (t, e, s) {
          var i = new Le;
          i.uri = e,
            this.sendAppData(t, i.marshal(s))
        }
        ,
        this.getSvcUserInfo = function (t) {
          if (0 != t.length) {
            var e = new function () {
              this.topSid = this.uid = 0,
                this.uids = [],
                this.connType = 1,
                this.marshal = function (t) {
                  t.setUI32(this.uid),
                    t.setUI32(this.topSid),
                    t.setUI32(this.uids.length);
                  for (var e = 0; e < this.uids.length; ++e)
                    t.setUI32(this.uids[e]);
                  t.setUI8(this.connType)
                }
            }
              ;
            e.uid = Me.uid,
              e.topSid = Me.topSid,
              e.uids = t,
              // console.log(" [svc_sdk] getting userinfo of uids:", t),
              (t = new Le).uri = 282968,
              this.sendAppData(6, t.marshal(e))
          }
        }
        ,
        this.getUserRoleInfo = function (t) {
          if (0 != t.length) {
            var e = new function () {
              this.topSid = 0,
                this.uids = [],
                this.type = 0,
                this.marshal = function (t) {
                  t.setUI32(this.topSid);
                  var e = this.uids.length;
                  t.setUI32(e);
                  for (var s = 0; s < e; ++s)
                    t.setUI32(this.uids[s]);
                  t.setUI32(this.type)
                }
            }
              ;
            e.topSid = Me.topSid,
              e.uids = t,
              // console.log(" [svc_sdk] getting user role info of uids:", t),
              (t = new xe).setUI32(Me.topSid);
            var s = {};
            s[1] = t.toTypedBuffer(),
              this.channelH5.ap.sendApRouter("channelUserInfo", 3125762, e, s)
          }
        }
        ,
        this.getUserInfo = function (t) {
          if (0 != t.length) {
            for (var e = [], s = [], i = {}, n = 0; n < t.length; ++n) {
              var o = t[n].toString()
                , a = Me.userInfos[o];
              void 0 === a || null == a ? (e.push(o),
                s.push(o)) : (void 0 === a.svc ? e.push(o) : i[o] = a,
                  void 0 === a.chl ? s.push(o) : i[o] = a)
            }
            if (0 != Object.keys(i).length && 0 != this.h5DataRecvCbs.length) {
              for (t = {},
                o = Object.keys(i),
                n = 0; n < o.length; ++n) {
                a = {};
                for (var r = i[o[n]], h = Object.keys(r), l = 0; l < h.length; ++l)
                  "role" != h[l] && "roler" != h[l] && (a[h[l]] = r[h[l]]);
                a.role = this.channelH5.getCurSubSidRole(Me.topSid, Me.subSid, r.role, r.roler),
                  t[o[n]] = a
              }
              this.dataRecvCbs(6, t)
            }
            this.getSvcUserInfo(e),
              this.getUserRoleInfo(s)
          }
        }
        ,
        this.subsAppids = function (t) {
          if (this.ap.appidReady()) {
            // console.log(" [svc_sdk] subscribe appids:", t),
              this.ap.reportLog("subs_appids", t.toString());
            var e = new Ie;
            e.uid = Me.uid,
              e.appids = t,
              (t = new Le).uri = 643160,
              this.ap.bufSend(t.marshal(e))
          } else
            for (console.log(" [svc_sdk] ap not ready, delay subs.", JSON.stringify(t)),
              e = 0; e < t.length; ++e)
              Me.appidSubs[t[e]] = 1
        }
        ,
        this.unsubsAppids = function (t) {
          if (this.ap.appidReady()) {
            // console.log(" [svc_sdk] unsubscribe appids:", t),
              this.ap.reportLog("unsubs_appids", t.toString());
            var e = new Ie;
            e.uid = Me.uid,
              e.appids = t,
              (t = new Le).uri = 643416,
              this.ap.bufSend(t.marshal(e))
          } else
            for (console.log(" [svc_sdk] ap not ready, delay unsubs.", JSON.stringify(t)),
              e = 0; e < t.length; ++e)
              Me.appidUnsubs[t[e]] = 1
        }
    }
    , je = function (t, e, s, Me) {
      // console.log(" [svc_sdk] location:", JSON.stringify(location));
      var i = location.search
        , n = {};
      if (-1 != i.indexOf("?")) {
        i = i.substr(1).split("&");
        for (var o = 0; o < i.length; o++)
          n[i[o].split("=")[0]] = unescape(i[o].split("=")[1])
      }
      // console.log(" [svc_sdk] current page request:", JSON.stringify(n)),
        i = Ae("udb_c"),
        o = Ae("yyuid");
      var a = Ae("username")
        , r = Ae("udb_l");
      i && o && "undefined" != i && "undefined" != o ? (console.log("  [svc_sdk] cookie existssss... ... ..." + i + "    " + o),
        s && s.start(null, null, o, i, a, r)) : n.code && n.state ? (t = "https://thirdlogin.yy.com/open/thirdtokenlogin.do?source=qq&third_sub_sys=wechatU&udb_appid=" + t + "&tokenid=" + n.code + "&third_appkey=" + e + "&oauth_url=&oauth_type=0&domainlist_flag=&version=2&term_type=6&ticket_type=1&device_id=" + e + "&callback_id=udbResCb",
          // console.log(" [svc_sdk] udb request path:", t),
          function (t) {
            var e = (t = t || {}).jsonp ? function (t) {
              var e = t.jsonp
                , s = document.getElementsByTagName("head")[0]
                , i = document.createElement("script");
              s.appendChild(i),
                window[e] = function (n) {
                  // console.log("jsonp success:", JSON.stringify(n)),
                    s.removeChild(i),
                    clearTimeout(i.timer),
                    window[e] = null,
                    t.success && t.success(n, t.handler)
                }
                ,
                i.src = t.url,
                // console.log("jsonp url:", i.src),
                t.time && (i.timer = setTimeout(function () {
                  window[e] = null,
                    s.removeChild(i),
                    t.error && t.error({
                      message: "time out"
                    })
                }, t.time))
            }(t) : e(t)
          }({
            url: t,
            jsonp: "udbResCb",
            time: 3e3,
            handler: s,
            success: function (t, e) {
              "1" == t.rcode ? (console.log("  [svc_sdk] udb response success and set cookie:", JSON.stringify(t)),
                Ee("yyuid", t.yyuid),
                Ee("username", t.username),
                Ee("password", t.password),
                Ee("account_token", t.account_token),
                Ee("accountinfo", t.accountinfo),
                Ee("stoken", t.stoken),
                Ee("udb_l", t.udb_l),
                Ee("udb_n", t.udb_n),
                Ee("udb_c", t.udb_c),
                Ee("udb_oar", t.udb_oar),
                Ee("partner_uid", t.partner_uid),
                Ee("partner_nickname", t.partner_nickname),
                Ee("partner_gender", t.partnerGender),
                Ee("partner_image", t.partnerImage),
                e && e.start(null, null, t.yyuid, t.udb_c, t.username, t.udb_l)) : (console.log("  [svc_sdk] udb response failed. rcode:", t.rcode, JSON.stringify(t)),
                  e && e.start())
            },
            error: function (t) {
              console.log(" [svc_sdk] udb response fail:", JSON.stringify(t))
            }
          })) : (console.log("  [svc_sdk] cookie not exists... ... ..." + i + "    " + o),
            s = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + e + "&redirect_uri=" + encodeURIComponent(location.href) + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect",
            // console.log("  [svc_sdk] wxAuthPath:", s),
            window.location.href = s),
        Me.wxappid = e
    }
    , De = function (t, e, s, i, n, o, a) {
      var Me = new MeParent();
      var Fe, Ne;
      return Me.wxappid && (s && i || (i = Ae("udb_c"),
        s = Ae("yyuid")),
        n && o || (n = Ae("username"),
          o = Ae("udb_l"))),
        console.log(" [svc_sdk] NewH5:", JSON.stringify(arguments), "uuid:", Me.uuid),
        Fe || (Fe = new Re(Me),
          console.log(" [svc_sdk] new Service H5... ... ...")),
        (console.log(" [svc_sdk] version:", "1.31.17"),
            Ne = new Oe(Fe, Me),
            console.log(" [svc_sdk] new Channel H5... ... ..."),
            Fe.setChlH5(Ne),
            a || Ne.start(t, e, s, i, n, o)),
        window.onbeforeunload = function (t) {
          Ne.leaveChannel(),
            console.log(" [svc_sdk] window.onbeforeunload evt:", JSON.stringify(t))
        }
        ,
        {
          setH5EventCb: function (t, e) {
            Fe.setH5EventCb(t, e),
              Ne.setH5EventCb(t, e)
          },
          setChannelEventCb: function (t, e) {
            Ne.setChannelEventCb(t, e)
          },
          setH5MaixuCb: function (t, e) {
            Ne.setH5MaixuCb(t, e)
          },
          setH5DataRecvCb: function (t, e) {
            Fe.setH5DataRecvCb(t, e)
          },
          setH5ChatRecvCb: function (t, e) {
            Fe.setH5ChatRecvCb(t, e)
          },
          enableChanUserPush: function () {
            Ne.enableChanUserPush()
          },
          sendAppData: function (t, e) {
            Fe.sendAppData(t, e)
          },
          sendAppSender: function (t, e, s) {
            Fe.sendAppSender(t, e, s)
          },
          joinChannel: function (t, e, s, i, n, o) {
            Ne.joinChannel(t, e, s, i, n, o)
          },
          leaveChannel: function () {
            Ne.leaveChannel()
          },
          sendChatMsg: function (t, e) {
            Fe.sendChatMsg(t, e)
          },
          subsAppids: function (t) {
            Fe.subsAppids(t)
          },
          unsubsAppids: function (t) {
            Fe.unsubsAppids(t)
          },
          joinSvcUserGroup: function (t, e) {
            Fe.joinSvcUserGroup(t, e)
          },
          leaveSvcUserGroup: function (t, e) {
            Fe.leaveSvcUserGroup(t, e)
          },
          getUDBCredit: function () {
            return Ne.getUDBCredit()
          },
          getUserInfo: function (t) {
            Fe.getUserInfo(t)
          },
          getUserList: function (t, e, s) {
            Ne.getUserList(t, e, s)
          },
          myInfo: function () {
            return Ne.myInfo()
          },
          getChannelInfo: function (t) {
            return Ne.getChannelInfo(t)
          },
          getCurrentChannelInfo: function () {
            return Ne.getCurrentChannelInfo()
          },
          getChannelTreeInfo: function () {
            return Ne.getChannelTreeInfo()
          },
          getMicListMode: function () {
            return Ne.getMicListMode()
          },
          getLinkedMicList: function () {
            return Ne.getLinkedMicList()
          },
          getMicList: function () {
            return Ne.getMicList()
          },
          isGuestLogin: function () {
            return Ne.isGuestLogin()
          },
          isInChannel: function () {
            return Ne.isInChannel()
          },
          start: function (t, e, s, i, n, o) {
            Ne.start(t, e, s, i, n, o)
          },
          login: function (t, e) {
            return Ne.login(t, e)
          },
          logout: function () {
            return Ne.logout()
          },
          agent: function () {
            return Fe
          }
        }
    };

// var s = new De(null, null, null, null, null, null, false);
// s.joinChannel(54880976, 54880976)

util.inherits(Re, events.EventEmitter);

module.exports = De;