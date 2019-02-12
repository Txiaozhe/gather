/**
 * Creator: Tang Xiaoji
 * Time: 2018-07-02
 */

'use strict';

var h = global;

function Mb(a) {
  return a[a.length - 1]
}

function m(a) {
  return "string" == typeof a
}

var Nb = Array.prototype
  , r = Nb.indexOf ? function(a, b, c) {
    return Nb.indexOf.call(a, b, c)
  }
  : function(a, b, c) {
    c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
    if (m(a))
      return m(b) && 1 == b.length ? a.indexOf(b, c) : -1;
    for (; c < a.length; c++)
      if (c in a && a[c] === b)
        return c;
    return -1
  }
  , s = Nb.forEach ? function(a, b, c) {
    Nb.forEach.call(a, b, c)
  }
  : function(a, b, c) {
    for (var d = a.length, f = m(a) ? a.split("") : a, g = 0; g < d; g++)
      g in f && b.call(c, f[g], g, a)
  }
  , Ob = Nb.filter ? function(a, b, c) {
    return Nb.filter.call(a, b, c)
  }
  : function(a, b, c) {
    for (var d = a.length, f = [], g = 0, l = m(a) ? a.split("") : a, n = 0; n < d; n++)
      if (n in l) {
        var t = l[n];
        b.call(c, t, n, a) && (f[g++] = t)
      }
    return f
  }
  , u = Nb.map ? function(a, b, c) {
    return Nb.map.call(a, b, c)
  }
  : function(a, b, c) {
    for (var d = a.length, f = Array(d), g = m(a) ? a.split("") : a, l = 0; l < d; l++)
      l in g && (f[l] = b.call(c, g[l], l, a));
    return f
  }
  , Pb = Nb.some ? function(a, b, c) {
    return Nb.some.call(a, b, c)
  }
  : function(a, b, c) {
    for (var d = a.length, f = m(a) ? a.split("") : a, g = 0; g < d; g++)
      if (g in f && b.call(c, f[g], g, a))
        return !0;
    return !1
  }
  , Qb = Nb.every ? function(a, b, c) {
    return Nb.every.call(a, b, c)
  }
  : function(a, b, c) {
    for (var d = a.length, f = m(a) ? a.split("") : a, g = 0; g < d; g++)
      if (g in f && !b.call(c, f[g], g, a))
        return !1;
    return !0
  }
;

function Qq(a, b) {
  this.Ww = [];
  this.gL = a;
  this.AH = b || null;
  this.Oq = this.cn = !1;
  this.yi = void 0;
  this.vE = this.vP = this.Ky = !1;
  this.yx = 0;
  this.wa = null;
  this.Py = 0
}

function Rq() {
  va.call(this)
}

Qq.prototype.cancel = function(a) {
  if (this.cn)
    this.yi instanceof Qq && this.yi.cancel();
  else {
    if (this.wa) {
      var b = this.wa;
      delete this.wa;
      a ? b.cancel(a) : (b.Py--,
      0 >= b.Py && b.cancel())
    }
    this.gL ? this.gL.call(this.AH, this) : this.vE = !0;
    this.cn || (a = new Rq,
      Sq(this),
      Tq(this, !1, a))
  }
}
;
Qq.prototype.eH = function(a, b) {
  this.Ky = !1;
  Tq(this, a, b)
};

function Tq(a, b, c) {
  a.cn = !0;
  a.yi = c;
  a.Oq = !b;
  Uq(a)
}
function Sq(a) {
  if (a.cn) {
    if (!a.vE)
      throw new Vq;
    a.vE = !1
  }
}
Qq.prototype.Sy = function(a) {
  Sq(this);
  Tq(this, !0, a)
}

function cr() {
  if (this && this.rM) {
    var a = this.rM;
    a && "SCRIPT" == a.tagName && dr(a, !0, this.dm)
  }
}

function ea() {}

function M(a) {
  return a && a.parentNode ? a.parentNode.removeChild(a) : null
}

function dr(a, b, c) {
  null != c && h.clearTimeout(c);
  a.onload = ea;
  a.onerror = ea;
  a.onreadystatechange = ea;
  b && window.setTimeout(function() {
    M(a)
  }, 0)
}

var gr = 0
  , fr = 1;
function er(a, b) {
  var c = "Jsloader error (code #" + a + ")";
  b && (c += ": " + b);
  va.call(this, c);
  this.code = a
}

function br(a, b) {
  var c = b || {};
  var d = c.document || document;
  var f = document.createElement("SCRIPT");
  var g = {
    rM: f,
    dm: void 0
  };
  var l = new Qq(cr,g);
  var n = null;
  var t = null != c.timeout ? c.timeout : 5E3;
  0 < t && (n = window.setTimeout(function() {
    dr(f, !0);
    var b = new er(fr,"Timeout reached for loading script " + a);
    Sq(l);
    Tq(l, !1, b)
  }, t),
    g.dm = n);
  f.onload = f.onreadystatechange = function() {
    f.readyState && "loaded" != f.readyState && "complete" != f.readyState || (dr(f, c.SG || !1, n),
      l.Sy(null))
  };
  f.onerror = function() {
    dr(f, !0, n);
    var b = new er(gr,"Error while loading script " + a);
    Sq(l);
    Tq(l, !1, b)
  };
  gf(f, {
    type: "text/javascript",
    charset: "UTF-8",
    src: a
  });
  hr(d).appendChild(f);
  return l
}

function gf(a, b) {
  bd(b, function(b, d) {
    "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : d in hf ? a.setAttribute(hf[d], b) : 0 == d.lastIndexOf("aria-", 0) || 0 == d.lastIndexOf("data-", 0) ? a.setAttribute(d, b) : a[d] = b
  })
}

function bd(a, b, c) {
  for (var d in a)
    b.call(c, a[d], d, a)
}

function hr(a) {
  var b = a.getElementsByTagName("HEAD");
  return b && 0 != b.length ? b[0] : a.documentElement
}

function zs(a) {
  a.qM || (a.qM = new B(function(a, c) {
      Yq(Wq(br("http://r.plures.net/lib/msgpack.min.js"), a), c)
    }
  ));
  return a.qM
}

var Xd = 0
  , Zd = 2
  , $d = 3;

function B(a, b) {
  this.qa = Xd;
  this.yi = void 0;
  this.of = this.wa = null;
  this.Ou = this.$z = !1;
  try {
    var c = this;
    a.call(b, function(a) {
      Yd(c, Zd, a)
    }, function(a) {
      Yd(c, $d, a)
    })
  } catch (d) {
    Yd(this, $d, d)
  }
}

function ka(a) {
  var b = typeof a;
  return "object" == b && null != a || "function" == b
}

function ne(a, b, c) {
  function d(b) {
    g || (g = !0,
      a.NN(b))
  }
  function f(b) {
    g || (g = !0,
      a.MN(b))
  }
  a.qa = 1;
  var g = !1;
  try {
    c.call(b, f, d)
  } catch (l) {
    d(l)
  }
}

function Vd(a, b) {
  this.JR = a;
  this.scope = b
}

function Qd(a, b) {
  Rd || Sd();
  Td || (Rd(),
    Td = !0);
  Ud.push(new Vd(a,b))
}

var yd;
function zd() {
  var a = h.MessageChannel;
  "undefined" === typeof a && "undefined" !== typeof window && window.postMessage && window.addEventListener && (a = function() {
      var a = document.createElement("iframe");
      a.style.display = "none";
      a.src = "";
      document.documentElement.appendChild(a);
      var b = a.contentWindow
        , a = b.document;
      a.open();
      a.write("");
      a.close();
      var c = "callImmediate" + Math.random()
        , d = "file:" == b.location.protocol ? "*" : b.location.protocol + "//" + b.location.host
        , a = p(function(a) {
        if (a.origin == d || a.data == c)
          this.port1.onmessage()
      }, this);
      b.addEventListener("message", a, !1);
      this.port1 = {};
      this.port2 = {
        postMessage: function() {
          b.postMessage(c, d)
        }
      }
    }
  );
  if ("undefined" !== typeof a && !td()) {
    var b = new a
      , c = {}
      , d = c;
    b.port1.onmessage = function() {
      c = c.next;
      var a = c.GG;
      c.GG = null;
      a()
    }
    ;
    return function(a) {
      d.next = {
        GG: a
      };
      d = d.next;
      b.port2.postMessage(0)
    }
  }
  return "undefined" !== typeof document && "onreadystatechange"in document.createElement("script") ? function(a) {
      var b = document.createElement("script");
      b.onreadystatechange = function() {
        b.onreadystatechange = null;
        b.parentNode.removeChild(b);
        b = null;
        a();
        a = null
      }
      ;
      document.documentElement.appendChild(b)
    }
    : function(a) {
      h.setTimeout(a, 0)
    }
}

var Rd;
function Sd() {
  if (h.Promise && h.Promise.resolve) {
    var a = h.Promise.resolve();
    Rd = function() {
      a.then(Wd)
    }
  } else
    Rd = function() {
      var a = Wd;
      !ja(h.setImmediate) || h.Window && h.Window.prototype.setImmediate == h.setImmediate ? (yd || (yd = zd()),
        yd(a)) : h.setImmediate(a)
    }
}
var Td = !1
  , Ud = [];
function Wd() {
  for (; Ud.length; ) {
    var a = Ud;
    Ud = [];
    for (var b = 0; b < a.length; b++) {
      var c = a[b];
      try {
        c.JR.call(c.scope)
      } catch (d) {
        xd(d)
      }
    }
  }
  Td = !1
}

function me(a) {
  a.$z || (a.$z = !0,
    Qd(a.tR, a))
}

function je(a) {
  va.call(this, a)
}

function oe(a, b) {
  a.Ou = !0;
  Qd(function() {
    a.Ou && ge.call(null, b)
  })
}

function xd(a) {
  h.setTimeout(function() {
    throw a;
  }, 0)
}

var ge = xd;
function je(a) {
  va.call(this, a)
}

function Yd(a, b, c) {
  if (a.qa == Xd) {
    if (a == c)
      b = $d,
        c = new TypeError("Promise cannot resolve to itself");
    else {
      if (kb(c)) {
        a.qa = 1;
        c.then(a.MN, a.NN, a);
        return
      }
      if (ka(c))
        try {
          var d = c.then;
          if (ja(d)) {
            ne(a, c, d);
            return
          }
        } catch (f) {
          b = $d,
            c = f
        }
    }
    a.yi = c;
    a.qa = b;
    me(a);
    b != $d || c instanceof je || oe(a, c)
  }
}

function Wq(a, b, c) {
  return Xq(a, b, null, c)
}
function Yq(a, b, c) {
  Xq(a, null, b, c)
}
function Xq(a, b, c, d) {
  a.Ww.push([b, c, d]);
  a.cn && Uq(a);
  return a
}

function fa(a) {
  var b = typeof a;
  if ("object" == b)
    if (a) {
      if (a instanceof Array)
        return "array";
      if (a instanceof Object)
        return b;
      var c = Object.prototype.toString.call(a);
      if ("[object Window]" == c)
        return "object";
      if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice"))
        return "array";
      if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call"))
        return "function"
    } else
      return "null";
  else if ("function" == b && "undefined" == typeof a.call)
    return "object";
  return b
}

function ja(a) {
  return "function" == fa(a)
}

function Zq(a) {
  return Pb(a.Ww, function(a) {
    return ja(a[1])
  })
}
function ba(a) {
  return void 0 !== a
}

function p(a, b, c) {
  p = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? oa : pa;
  return p.apply(null, arguments)
}

function oa(a, b, c) {
  return a.call.apply(a.bind, arguments)
}
function pa(a, b, c) {
  if (!a)
    throw Error();
  if (2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c)
    }
  }
  return function() {
    return a.apply(b, arguments)
  }
}

var $q = {};
function Uq(a) {
  if (a.yx && a.cn && Zq(a)) {
    var b = a.yx
      , c = $q[b];
    c && (h.clearTimeout(c.Ia),
      delete $q[b]);
    a.yx = 0
  }
  a.wa && (a.wa.Py--,
    delete a.wa);
  for (var b = a.yi, d = c = !1; a.Ww.length && !a.Ky; ) {
    var f = a.Ww.shift()
      , g = f[0]
      , l = f[1]
      , f = f[2];
    if (g = a.Oq ? l : g)
      try {
        var n = g.call(f || a.AH, b);
        ba(n) && (a.Oq = a.Oq && (n == b || n instanceof Error),
          a.yi = b = n);
        kb(b) && (d = !0,
          a.Ky = !0)
      } catch (t) {
        b = t,
          a.Oq = !0,
        Zq(a) || (c = !0)
      }
  }
  a.yi = b;
  d && (n = p(a.eH, a, !0),
    d = p(a.eH, a, !1),
    b instanceof Qq ? (Xq(b, n, d),
      b.vP = !0) : b.then(n, d));
  c && (b = new ar(b),
    $q[b.Ia] = b,
    a.yx = b.Ia)
}

function kb(a) {
  if (!a)
    return !1;
  try {
    return !!a.$goog_Thenable
  } catch (b) {
    return !1
  }
}

function Vq() {
  va.call(this)
}
Vq.prototype.message = "Deferred has already fired";
Vq.prototype.name = "AlreadyCalledError";

function va(a) {
  if (Error.captureStackTrace)
    Error.captureStackTrace(this, va);
  else {
    var b = Error().stack;
    b && (this.stack = b)
  }
  a && (this.message = String(a))
}
va.prototype.name = "CustomError";

function As(a, b) {
  console.log(zs(a))
  return zs(a).then(function () {
    try {
      return global.msgpack.decode(b)
    } catch (a) {
      console.log("msgpack\u89e3\u7801\u5931\u8d25!", a)
    }
  })
}

// a: {qM: B}
// b: Uint8Array

var daa = new Uint8Array([129, 178, 115, 121, 115]);

console.log(As({qM: 0}, daa));
 