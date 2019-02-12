var WebSocket = require('websocket').w3cwebsocket;
var Taf = Taf || {};
var DEBUG = false;
Taf.INT8 = function() {
  this._clone = function() {
    return 0;
  };
  this._write = function(t, e, i) {
    return t.writeInt8(e, i);
  };
  this._read = function(t, e, i) {
    return t.readInt8(e, true, i);
  };
  this._className = function() {
    return Taf.CHAR;
  };
};
Taf.INT16 = function() {
  this._clone = function() {
    return 0;
  };
  this._write = function(t, e, i) {
    return t.writeInt16(e, i);
  };
  this._read = function(t, e, i) {
    return t.readInt16(e, true, i);
  };
  this._className = function() {
    return Taf.SHORT;
  };
};
Taf.INT32 = function() {
  this._clone = function() {
    return 0;
  };
  this._write = function(t, e, i) {
    return t.writeInt32(e, i);
  };
  this._read = function(t, e, i) {
    return t.readInt32(e, true, i);
  };
  this._className = function() {
    return Taf.INT32;
  };
};
Taf.INT64 = function() {
  this._clone = function() {
    return 0;
  };
  this._write = function(t, e, i) {
    return t.writeInt64(e, i);
  };
  this._read = function(t, e, i) {
    return t.readInt64(e, true, i);
  };
  this._className = function() {
    return Taf.INT64;
  };
};
Taf.UINT8 = function() {
  this._clone = function() {
    return 0;
  };
  this._write = function(t, e, i) {
    return t.writeInt16(e, i);
  };
  this._read = function(t, e, i) {
    return t.readInt16(e, true, i);
  };
  this._className = function() {
    return Taf.SHORT;
  };
};
Taf.UInt16 = function() {
  this._clone = function() {
    return 0;
  };
  this._write = function(t, e, i) {
    return t.writeInt32(e, i);
  };
  this._read = function(t, e, i) {
    return t.readInt32(e, true, i);
  };
  this._className = function() {
    return Taf.INT32;
  };
};
Taf.UInt32 = function() {
  this._clone = function() {
    return 0;
  };
  this._write = function(t, e, i) {
    return t.writeInt64(e, i);
  };
  this._read = function(t, e, i) {
    return t.readInt64(e, true, i);
  };
  this._className = function() {
    return Taf.INT64;
  };
};
Taf.Float = function() {
  this._clone = function() {
    return 0;
  };
  this._write = function(t, e, i) {
    return t.writeFloat(e, i);
  };
  this._read = function(t, e, i) {
    return t.readFloat(e, true, i);
  };
  this._className = function() {
    return Taf.FLOAT;
  };
};
Taf.Double = function() {
  this._clone = function() {
    return 0;
  };
  this._write = function(t, e, i) {
    return t.writeDouble(e, i);
  };
  this._read = function(t, e, i) {
    return t.readDouble(e, true, i);
  };
  this._className = function() {
    return Taf.DOUBLE;
  };
};
Taf.STRING = function() {
  this._clone = function() {
    return 0;
  };
  this._write = function(t, e, i) {
    return t.writeString(e, i);
  };
  this._read = function(t, e, i) {
    return t.readString(e, true, i);
  };
  this._className = function() {
    return Taf.STRING;
  };
};
Taf.BOOLEAN = function() {
  this._clone = function() {
    return false;
  };
  this._write = function(t, e, i) {
    return t.writeBoolean(e, i);
  };
  this._read = function(t, e, i) {
    return t.readBoolean(e, true, i);
  };
  this._className = function() {
    return Taf.BOOLEAN;
  };
};
Taf.ENUM = function() {
  this._clone = function() {
    return 0;
  };
  this._write = function(t, e, i) {
    return t.writeInt32(e, i);
  };
  this._read = function(t, e, i) {
    return t.readInt32(e, true, i);
  };
};
Taf.Vector = function(t) {
  this.proto = t;
  this.value = new Array();
};
Taf.Vector.prototype._clone = function() {
  return new Taf.Vector(this.proto);
};
Taf.Vector.prototype._write = function(t, e, i) {
  return t.writeVector(e, i);
};
Taf.Vector.prototype._read = function(t, e, i) {
  return t.readVector(e, true, i);
};
Taf.Vector.prototype._className = function() {
  return Taf.TypeHelp.VECTOR.replace('$t', this.proto._className());
};
Taf.Map = function(t, e) {
  this.kproto = t;
  this.vproto = e;
  this.value = new Object();
};
Taf.Map.prototype._clone = function() {
  return new Taf.Map(this.kproto, this.vproto);
};
Taf.Map.prototype._write = function(t, e, i) {
  return t.writeMap(e, i);
};
Taf.Map.prototype._read = function(t, e, i) {
  return t.readMap(e, true, i);
};
Taf.Map.prototype.put = function(t, e) {
  this.value[t] = e;
};
Taf.Map.prototype.get = function(t) {
  return this.value[t];
};
Taf.Map.prototype.remove = function(t) {
  delete this.value[t];
};
Taf.Map.prototype.clear = function() {
  this.value = new Object();
};
Taf.Map.prototype.size = function() {
  var t = 0;
  for (var e in this.value) {
    t++;
  }
  return t;
};
Taf.Vector.prototype._className = function() {
  return Taf.TypeHelp.Map
    .replace('$k', this.kproto._className())
    .replace('$v', this.vproto._className());
};
var Taf = Taf || {};
Taf.DataHelp = {
  EN_INT8: 0,
  EN_INT16: 1,
  EN_INT32: 2,
  EN_INT64: 3,
  EN_FLOAT: 4,
  EN_DOUBLE: 5,
  EN_STRING1: 6,
  EN_STRING4: 7,
  EN_MAP: 8,
  EN_LIST: 9,
  EN_STRUCTBEGIN: 10,
  EN_STRUCTEND: 11,
  EN_ZERO: 12,
  EN_SIMPLELIST: 13
};
Taf.TypeHelp = {
  BOOLEAN: 'bool',
  CHAR: 'char',
  SHORT: 'short',
  INT32: 'int32',
  INT64: 'int64',
  FLOAT: 'float',
  DOUBLE: 'double',
  STRING: 'string',
  VECTOR: 'list<$t>',
  MAP: 'map<$k, $v>'
};
Taf.BinBuffer = function(t) {
  this.buf = null;
  this.vew = null;
  this.len = 0;
  this.position = 0;
  if (t != null && t != undefined && t instanceof Taf.BinBuffer) {
    this.buf = t.buf;
    this.vew = new DataView(this.buf);
    this.len = t.length;
    this.position = t.position;
  }
  if (t != null && t != undefined && t instanceof ArrayBuffer) {
    this.buf = t;
    this.vew = new DataView(this.buf);
    this.len = this.vew.byteLength;
    this.position = 0;
  }
  this.__defineGetter__('length', function() {
    return this.len;
  });
  this.__defineGetter__('buffer', function() {
    return this.buf;
  });
};
Taf.BinBuffer.prototype._write = function(t, e, i) {
  return t.writeBytes(e, i);
};
Taf.BinBuffer.prototype._read = function(t, e, i) {
  return t.readBytes(e, true, i);
};
Taf.BinBuffer.prototype._clone = function() {
  return new Taf.BinBuffer();
};
Taf.BinBuffer.prototype.allocate = function(t) {
  t = this.position + t;
  if (this.buf != null && this.buf.length > t) {
    return;
  }
  var e = new ArrayBuffer(Math.max(256, t * 2));
  if (this.buf != null) {
    new Uint8Array(e).set(new Uint8Array(this.buf));
    this.buf = undefined;
  }
  this.buf = e;
  this.vew = undefined;
  this.vew = new DataView(this.buf);
};
Taf.BinBuffer.prototype.getBuffer = function() {
  var t = new ArrayBuffer(this.len);
  new Uint8Array(t).set(new Uint8Array(this.buf, 0, this.len));
  return t;
};
Taf.BinBuffer.prototype.memset = function(t, e, i) {
  this.allocate(i);
  new Uint8Array(this.buf).set(new Uint8Array(t, e, i), this.position);
};
Taf.BinBuffer.prototype.writeInt8 = function(t) {
  this.allocate(1);
  this.vew.setInt8(this.position, t);
  this.position += 1;
  this.len = this.position;
};
Taf.BinBuffer.prototype.writeUInt8 = function(t) {
  this.allocate(1);
  this.vew.setUint8(this.position++, t);
  this.len = this.position;
};
Taf.BinBuffer.prototype.writeInt16 = function(t) {
  this.allocate(2);
  this.vew.setInt16(this.position, t);
  this.position += 2;
  this.len = this.position;
};
Taf.BinBuffer.prototype.writeUInt16 = function(t) {
  this.allocate(2);
  this.vew.setUint16(this.position, t);
  this.position += 2;
  this.len = this.position;
};
Taf.BinBuffer.prototype.writeInt32 = function(t) {
  this.allocate(4);
  this.vew.setInt32(this.position, t);
  this.position += 4;
  this.len = this.position;
};
Taf.BinBuffer.prototype.writeUInt32 = function(t) {
  this.allocate(4);
  this.vew.setUint32(this.position, t);
  this.position += 4;
  this.len = this.position;
};
Taf.BinBuffer.prototype.writeInt64 = function(t) {
  this.allocate(8);
  this.vew.setUint32(this.position, parseInt(t / 4294967296));
  this.vew.setUint32(this.position + 4, t % 4294967296);
  this.position += 8;
  this.len = this.position;
};
Taf.BinBuffer.prototype.writeFloat = function(t) {
  this.allocate(4);
  this.vew.setFloat32(this.position, t);
  this.position += 4;
  this.len = this.position;
};
Taf.BinBuffer.prototype.writeDouble = function(t) {
  this.allocate(8);
  this.vew.setFloat64(this.position, t);
  this.position += 8;
  this.len = this.position;
};
Taf.BinBuffer.prototype.writeString = function(t) {
  for (var e = [], i = 0; i < t.length; i++) {
    e.push(t.charCodeAt(i) & 255);
  }
  this.allocate(e.length);
  new Uint8Array(this.buf).set(new Uint8Array(e), this.position);
  this.position += e.length;
  this.len = this.position;
};
Taf.BinBuffer.prototype.writeBytes = function(t) {
  if (t.length == 0 || t.buf == null) return;
  this.allocate(t.length);
  new Uint8Array(this.buf).set(
    new Uint8Array(t.buf, 0, t.length),
    this.position
  );
  this.position += t.length;
  this.len = this.position;
};
Taf.BinBuffer.prototype.readInt8 = function() {
  return this.vew.getInt8(this.position++);
};
Taf.BinBuffer.prototype.readInt16 = function() {
  this.position += 2;
  return this.vew.getInt16(this.position - 2);
};
Taf.BinBuffer.prototype.readInt32 = function() {
  this.position += 4;
  return this.vew.getInt32(this.position - 4);
};
Taf.BinBuffer.prototype.readUInt8 = function() {
  this.position += 1;
  return this.vew.getUint8(this.position - 1);
};
Taf.BinBuffer.prototype.readUInt16 = function() {
  this.position += 2;
  return this.vew.getUint16(this.position - 2);
};
Taf.BinBuffer.prototype.readUInt32 = function() {
  this.position += 4;
  return this.vew.getUint32(this.position - 4);
};
Taf.BinBuffer.prototype.readInt64 = function() {
  var t = this.vew.getUint32(this.position);
  var e = this.vew.getUint32(this.position + 4);
  this.position += 8;
  return t * 4294967296 + e;
};
Taf.BinBuffer.prototype.readFloat = function() {
  var t = this.vew.getFloat32(this.position);
  this.position += 4;
  return t;
};
Taf.BinBuffer.prototype.readDouble = function() {
  var t = this.vew.getFloat64(this.position);
  this.position += 8;
  return t;
};
Taf.BinBuffer.prototype.readString = function(t) {
  for (var e = [], i = 0; i < t; i++) {
    e.push(String.fromCharCode(this.vew.getUint8(this.position++)));
  }
  var r = e.join('');
  try {
    r = decodeURIComponent(escape(r));
  } catch (t) {}
  return r;
};
Taf.BinBuffer.prototype.readBytes = function(t) {
  var e = new Taf.BinBuffer();
  e.allocate(t);
  e.memset(this.buf, this.position, t);
  e.position = 0;
  e.len = t;
  this.position = this.position + t;
  return e;
};
Taf.JceOutputStream = function() {
  this.buf = new Taf.BinBuffer();
  this.getBinBuffer = function() {
    return this.buf;
  };
  this.getBuffer = function() {
    return this.buf.getBuffer();
  };
};
Taf.JceOutputStream.prototype.writeTo = function(t, e) {
  if (t < 15) {
    this.buf.writeUInt8(((t << 4) & 240) | e);
  } else {
    this.buf.writeUInt16(((240 | e) << 8) | t);
  }
};
Taf.JceOutputStream.prototype.writeBoolean = function(t, e) {
  this.writeInt8(t, e == true ? 1 : 0);
};
Taf.JceOutputStream.prototype.writeInt8 = function(t, e) {
  if (e == 0) {
    this.writeTo(t, Taf.DataHelp.EN_ZERO);
  } else {
    this.writeTo(t, Taf.DataHelp.EN_INT8);
    this.buf.writeInt8(e);
  }
};
Taf.JceOutputStream.prototype.writeInt16 = function(t, e) {
  if (e >= -128 && e <= 127) {
    this.writeInt8(t, e);
  } else {
    this.writeTo(t, Taf.DataHelp.EN_INT16);
    this.buf.writeInt16(e);
  }
};
Taf.JceOutputStream.prototype.writeInt32 = function(t, e) {
  if (e >= -32768 && e <= 32767) {
    this.writeInt16(t, e);
  } else {
    this.writeTo(t, Taf.DataHelp.EN_INT32);
    this.buf.writeInt32(e);
  }
};
Taf.JceOutputStream.prototype.writeInt64 = function(t, e) {
  if (e >= -2147483648 && e <= 2147483647) {
    this.writeInt32(t, e);
  } else {
    this.writeTo(t, Taf.DataHelp.EN_INT64);
    this.buf.writeInt64(e);
  }
};
Taf.JceOutputStream.prototype.writeUInt8 = function(t, e) {
  this.writeInt16(t, e);
};
Taf.JceOutputStream.prototype.writeUInt16 = function(t, e) {
  this.writeInt32(t, e);
};
Taf.JceOutputStream.prototype.writeUInt32 = function(t, e) {
  this.writeInt64(t, e);
};
Taf.JceOutputStream.prototype.writeFloat = function(t, e) {
  if (e == 0) {
    this.writeTo(t, Taf.DataHelp.EN_ZERO);
  } else {
    this.writeTo(t, Taf.DataHelp.EN_FLOAT);
    this.buf.writeFloat(e);
  }
};
Taf.JceOutputStream.prototype.writeDouble = function(t, e) {
  if (e == 0) {
    this.writeTo(t, Taf.DataHelp.EN_ZERO);
  } else {
    this.writeTo(t, Taf.DataHelp.EN_DOUBLE);
    this.buf.writeDouble(e);
  }
};
Taf.JceOutputStream.prototype.writeStruct = function(t, e) {
  if (e.writeTo == undefined) {
    throw Error('not defined writeTo Function');
  }
  this.writeTo(t, Taf.DataHelp.EN_STRUCTBEGIN);
  e.writeTo(this);
  this.writeTo(0, Taf.DataHelp.EN_STRUCTEND);
};
Taf.JceOutputStream.prototype.writeString = function(t, e) {
  var i = e;
  try {
    i = unescape(encodeURIComponent(i));
  } catch (t) {}
  if (i.length > 255) {
    this.writeTo(t, Taf.DataHelp.EN_STRING4);
    this.buf.writeUInt32(i.length);
  } else {
    this.writeTo(t, Taf.DataHelp.EN_STRING1);
    this.buf.writeUInt8(i.length);
  }
  this.buf.writeString(i);
};
Taf.JceOutputStream.prototype.writeBytes = function(t, e) {
  if (!(e instanceof Taf.BinBuffer)) {
    throw Error('value not instanceof Taf.BinBuffer');
  }
  this.writeTo(t, Taf.DataHelp.EN_SIMPLELIST);
  this.writeTo(0, Taf.DataHelp.EN_INT8);
  this.writeInt32(0, e.length);
  this.buf.writeBytes(e);
};
Taf.JceOutputStream.prototype.writeVector = function(t, e) {
  this.writeTo(t, Taf.DataHelp.EN_LIST);
  this.writeInt32(0, e.value.length);
  for (var i = 0; i < e.value.length; i++) {
    e.proto._write(this, 0, e.value[i]);
  }
};
Taf.JceOutputStream.prototype.writeMap = function(t, e) {
  this.writeTo(t, Taf.DataHelp.EN_MAP);
  this.writeInt32(0, e.size());
  for (var i in e.value) {
    e.kproto._write(this, 0, i);
    e.vproto._write(this, 1, e.value[i]);
  }
};
Taf.JceInputStream = function(t) {
  this.buf = new Taf.BinBuffer(t);
};
Taf.JceInputStream.prototype.readFrom = function() {
  var t = this.buf.readUInt8();
  var e = (t & 240) >> 4;
  var i = t & 15;
  if (e >= 15) e = this.buf.readUInt8();
  return {
    tag: e,
    type: i
  };
};
Taf.JceInputStream.prototype.peekFrom = function() {
  var t = this.buf.position;
  var e = this.readFrom();
  this.buf.position = t;
  return {
    tag: e.tag,
    type: e.type,
    size: e.tag >= 15 ? 2 : 1
  };
};
Taf.JceInputStream.prototype.skipField = function(t) {
  switch (t) {
    case Taf.DataHelp.EN_INT8:
      this.buf.position += 1;
      break;
    case Taf.DataHelp.EN_INT16:
      this.buf.position += 2;
      break;
    case Taf.DataHelp.EN_INT32:
      this.buf.position += 4;
      break;
    case Taf.DataHelp.EN_INT64:
      this.buf.position += 8;
      break;
    case Taf.DataHelp.EN_STRING1:
      var e = this.buf.readUInt8();
      this.buf.position += e;
      break;
    case Taf.DataHelp.EN_STRING4:
      var i = this.buf.readInt32();
      this.buf.position += i;
      break;
    case Taf.DataHelp.EN_STRUCTBEGIN:
      this.skipToStructEnd();
      break;
    case Taf.DataHelp.EN_STRUCTEND:
    case Taf.DataHelp.EN_ZERO:
      break;
    case Taf.DataHelp.EN_MAP: {
      var r = this.readInt32(0, true);
      for (var s = 0; s < r * 2; ++s) {
        var n = this.readFrom();
        this.skipField(n.type);
      }
      break;
    }
    case Taf.DataHelp.EN_SIMPLELIST: {
      var n = this.readFrom();
      if (n.type != Taf.DataHelp.EN_INT8) {
        throw Error(
          'skipField with invalid type, type value: ' + t + ',' + n.type
        );
      }
      var e = this.readInt32(0, true);
      this.buf.position += e;
      break;
    }
    case Taf.DataHelp.EN_LIST: {
      var r = this.readInt32(0, true);
      for (var s = 0; s < r; ++s) {
        var n = this.readFrom();
        this.skipField(n.type);
      }
      break;
    }
    default:
      throw new Error('skipField with invalid type, type value: ' + t);
  }
};
Taf.JceInputStream.prototype.skipToStructEnd = function() {
  for (;;) {
    var t = this.readFrom();
    this.skipField(t.type);
    if (t.type == Taf.DataHelp.EN_STRUCTEND) {
      return;
    }
  }
};
Taf.JceInputStream.prototype.skipToTag = function(t, e) {
  while (this.buf.position < this.buf.length) {
    var i = this.peekFrom();
    if (t <= i.tag || i.type == Taf.DataHelp.EN_STRUCTEND) {
      return i.type == Taf.DataHelp.EN_STRUCTEND ? false : t == i.tag;
    }
    this.buf.position += i.size;
    this.skipField(i.type);
  }
  if (e) throw Error('require field not exist, tag:' + t);
  return false;
};
Taf.JceInputStream.prototype.readBoolean = function(t, e, i) {
  return this.readInt8(t, e, i) == 1 ? true : false;
};
Taf.JceInputStream.prototype.readInt8 = function(t, e, i) {
  if (this.skipToTag(t, e) == false) {
    return i;
  }
  var r = this.readFrom();
  switch (r.type) {
    case Taf.DataHelp.EN_ZERO:
      return 0;
    case Taf.DataHelp.EN_INT8:
      return this.buf.readInt8();
  }
  throw Error('read int8 type mismatch, tag:' + t + ', get type:' + r.type);
};
Taf.JceInputStream.prototype.readInt16 = function(t, e, i) {
  if (this.skipToTag(t, e) == false) {
    return i;
  }
  var r = this.readFrom();
  switch (r.type) {
    case Taf.DataHelp.EN_ZERO:
      return 0;
    case Taf.DataHelp.EN_INT8:
      return this.buf.readInt8();
    case Taf.DataHelp.EN_INT16:
      return this.buf.readInt16();
  }
  throw Error('read int8 type mismatch, tag:' + t + ', get type:' + r.type);
};
Taf.JceInputStream.prototype.readInt32 = function(t, e, i) {
  if (this.skipToTag(t, e) == false) {
    return i;
  }
  var r = this.readFrom();
  switch (r.type) {
    case Taf.DataHelp.EN_ZERO:
      return 0;
    case Taf.DataHelp.EN_INT8:
      return this.buf.readInt8();
    case Taf.DataHelp.EN_INT16:
      return this.buf.readInt16();
    case Taf.DataHelp.EN_INT32:
      return this.buf.readInt32();
  }
  throw Error('read int8 type mismatch, tag:' + t + ', get type:' + r.type);
};
Taf.JceInputStream.prototype.readInt64 = function(t, e, i) {
  if (this.skipToTag(t, e) == false) {
    return i;
  }
  var r = this.readFrom();
  switch (r.type) {
    case Taf.DataHelp.EN_ZERO:
      return 0;
    case Taf.DataHelp.EN_INT8:
      return this.buf.readInt8();
    case Taf.DataHelp.EN_INT16:
      return this.buf.readInt16();
    case Taf.DataHelp.EN_INT32:
      return this.buf.readInt32();
    case Taf.DataHelp.EN_INT64:
      return this.buf.readInt64();
  }
  throw Error('read int64 type mismatch, tag:' + t + ', get type:' + h.type);
};
Taf.JceInputStream.prototype.readFloat = function(t, e, i) {
  if (this.skipToTag(t, e) == false) {
    return i;
  }
  var r = this.readFrom();
  switch (r.type) {
    case Taf.DataHelp.EN_ZERO:
      return 0;
    case Taf.DataHelp.EN_FLOAT:
      return this.buf.readFloat();
  }
  throw Error('read float type mismatch, tag:' + t + ', get type:' + h.type);
};
Taf.JceInputStream.prototype.readDouble = function(t, e, i) {
  if (this.skipToTag(t, e) == false) {
    return i;
  }
  var r = this.readFrom();
  switch (r.type) {
    case Taf.DataHelp.EN_ZERO:
      return 0;
    case Taf.DataHelp.EN_DOUBLE:
      return this.buf.readDouble();
  }
  throw Error('read double type mismatch, tag:' + t + ', get type:' + h.type);
};
Taf.JceInputStream.prototype.readUInt8 = function(t, e, i) {
  return this.readInt16(t, e, i);
};
Taf.JceInputStream.prototype.readUInt16 = function(t, e, i) {
  return this.readInt32(t, e, i);
};
Taf.JceInputStream.prototype.readUInt32 = function(t, e, i) {
  return this.readInt64(t, e, i);
};
Taf.JceInputStream.prototype.readStruct = function(t, e, i) {
  if (this.skipToTag(t, e) == false) {
    return i;
  }
  var r = this.readFrom();
  if (r.type != Taf.DataHelp.EN_STRUCTBEGIN) {
    throw Error(
      'read struct type mismatch, tag: ' + t + ', get type:' + r.type
    );
  }
  i.readFrom(this);
  this.skipToStructEnd();
  return i;
};
Taf.JceInputStream.prototype.readString = function(t, e, i) {
  if (this.skipToTag(t, e) == false) {
    return i;
  }
  var r = this.readFrom();
  if (r.type == Taf.DataHelp.EN_STRING1) {
    return this.buf.readString(this.buf.readUInt8());
  }
  if (r.type == Taf.DataHelp.EN_STRING4) {
    return this.buf.readString(this.buf.readUInt32());
  }
  throw Error(
    "read 'string' type mismatch, tag: " + t + ', get type: ' + r.type + '.'
  );
};
Taf.JceInputStream.prototype.readString2 = function(t, e, i) {
  if (this.skipToTag(t, e) == false) {
    return i;
  }
  var r = this.readFrom();
  if (r.type == Taf.DataHelp.EN_STRING1) {
    return this.buf.readBytes(this.buf.readUInt8());
  }
  if (r.type == Taf.DataHelp.EN_STRING4) {
    return this.buf.readBytes(this.buf.readUInt32());
  }
  throw Error(
    "read 'string' type mismatch, tag: " + t + ', get type: ' + r.type + '.'
  );
};
Taf.JceInputStream.prototype.readBytes = function(t, e, i) {
  if (this.skipToTag(t, e) == false) {
    return i;
  }
  var r = this.readFrom();
  if (r.type == Taf.DataHelp.EN_SIMPLELIST) {
    var s = this.readFrom();
    if (s.type != Taf.DataHelp.EN_INT8) {
      throw Error('type mismatch, tag:' + t + ',type:' + r.type + ',' + s.type);
    }
    var n = this.readInt32(0, true);
    if (n < 0) {
      throw Error('invalid size, tag:' + t + ',type:' + r.type + ',' + s.type);
    }
    return this.buf.readBytes(n);
  }
  if (r.type == Taf.DataHelp.EN_LIST) {
    var n = this.readInt32(0, true);
    return this.buf.readBytes(n);
  }
  throw Error('type mismatch, tag:' + t + ',type:' + r.type);
};
Taf.JceInputStream.prototype.readVector = function(t, e, i) {
  if (this.skipToTag(t, e) == false) {
    return i;
  }
  var r = this.readFrom();
  if (r.type != Taf.DataHelp.EN_LIST) {
    throw Error(
      "read 'vector' type mismatch, tag: " + t + ', get type: ' + r.type
    );
  }
  var s = this.readInt32(0, true);
  if (s < 0) {
    throw Error(
      'invalid size, tag: ' + t + ', type: ' + r.type + ', size: ' + s
    );
  }
  for (var n = 0; n < s; ++n) {
    i.value.push(i.proto._read(this, 0, i.proto._clone()));
  }
  return i;
};
Taf.JceInputStream.prototype.readMap = function(t, e, i) {
  if (this.skipToTag(t, e) == false) {
    return i;
  }
  var r = this.readFrom();
  if (r.type != Taf.DataHelp.EN_MAP) {
    throw Error(
      "read 'map' type mismatch, tag: " + t + ', get type: ' + r.type
    );
  }
  var s = this.readInt32(0, true);
  if (s < 0) {
    throw Error('invalid map, tag: ' + t + ', size: ' + s);
  }
  for (var n = 0; n < s; n++) {
    var o = i.kproto._read(this, 0, i.kproto._clone());
    var a = i.vproto._read(this, 1, i.vproto._clone());
    i.put(o, a);
  }
  return i;
};
var Taf = Taf || {};
Taf.Wup = function() {
  this.iVersion = 3;
  this.cPacketType = 0;
  this.iMessageType = 0;
  this.iRequestId = 0;
  this.sServantName = '';
  this.sFuncName = '';
  this.sBuffer = new Taf.BinBuffer();
  this.iTimeout = 0;
  this.context = new Taf.Map(new Taf.STRING(), new Taf.STRING());
  this.status = new Taf.Map(new Taf.STRING(), new Taf.STRING());
  this.data = new Taf.Map(
    new Taf.STRING(),
    new Taf.Map(new Taf.STRING(), new Taf.BinBuffer())
  );
  this.newdata = new Taf.Map(new Taf.STRING(), new Taf.BinBuffer());
};
Taf.Wup.prototype.setVersion = function(t) {
  this.iVersion = t;
};
Taf.Wup.prototype.getVersion = function(t) {
  return this.iVersion;
};
Taf.Wup.prototype.setServant = function(t) {
  this.sServantName = t;
};
Taf.Wup.prototype.setFunc = function(t) {
  this.sFuncName = t;
};
Taf.Wup.prototype.setRequestId = function(t) {
  this.iRequestId = t ? t : ++this.iRequestId;
};
Taf.Wup.prototype.getRequestId = function() {
  return this.iRequestId;
};
Taf.Wup.prototype.setTimeOut = function(t) {
  this.iTimeout = t;
};
Taf.Wup.prototype.getTimeOut = function() {
  return this.iTimeout;
};
Taf.Wup.prototype.writeTo = function() {
  var t = new Taf.JceOutputStream();
  t.writeInt16(1, this.iVersion);
  t.writeInt8(2, this.cPacketType);
  t.writeInt32(3, this.iMessageType);
  t.writeInt32(4, this.iRequestId);
  t.writeString(5, this.sServantName);
  t.writeString(6, this.sFuncName);
  t.writeBytes(7, this.sBuffer);
  t.writeInt32(8, this.iTimeout);
  t.writeMap(9, this.context);
  t.writeMap(10, this.status);
  return new Taf.BinBuffer(t.getBuffer());
};
Taf.Wup.prototype.encode = function() {
  var t = new Taf.JceOutputStream();
  if (this.iVersion == 3) {
    t.writeMap(0, this.newdata);
  } else {
    t.writeMap(0, this.data);
  }
  this.sBuffer = t.getBinBuffer();
  var e = new Taf.BinBuffer();
  e = this.writeTo();
  var i = new Taf.BinBuffer();
  i.writeInt32(4 + e.len);
  i.writeBytes(e);
  return i;
};
Taf.Wup.prototype.writeBoolean = function(t, e) {
  var i = new Taf.JceOutputStream();
  i.writeBoolean(0, e);
  if (this.iVersion == 3) {
    this.newdata.put(t, new Taf.BinBuffer(i.getBuffer()));
  } else {
    var r = this.data.get(t);
    var s = TAF.TypeHelp.BOOLEAN;
    if (r == undefined) {
      var n = new Taf.Map(Taf.STRING, Taf.STRING);
      r = n;
    }
    r.put(s, new Taf.BinBuffer(i.getBuffer()));
    this.data.put(t, r);
  }
};
Taf.Wup.prototype.writeInt8 = function(t, e) {
  var i = new Taf.JceOutputStream();
  i.writeInt8(0, e);
  if (this.iVersion == 3) {
    this.newdata.put(t, new Taf.BinBuffer(i.getBuffer()));
  } else {
    var r = this.data.get(t);
    var s = TAF.TypeHelp.CHAR;
    if (r == undefined) {
      var n = new Taf.Map(Taf.STRING, Taf.STRING);
      r = n;
    }
    r.put(s, new Taf.BinBuffer(i.getBuffer()));
    this.data.put(t, r);
  }
};
Taf.Wup.prototype.writeInt16 = function(t, e) {
  var i = new Taf.JceOutputStream();
  i.writeInt16(0, e);
  if (this.iVersion == 3) {
    this.newdata.put(t, new Taf.BinBuffer(i.getBuffer()));
  } else {
    var r = this.data.get(t);
    var s = TAF.TypeHelp.SHORT;
    if (r == undefined) {
      var n = new Taf.Map(Taf.STRING, Taf.STRING);
      r = n;
    }
    r.put(s, new Uint8Array(i.getBuffer()));
    this.data.put(t, r);
  }
};
Taf.Wup.prototype.writeInt32 = function(t, e) {
  var i = new Taf.JceOutputStream();
  i.writeInt32(0, e);
  if (this.iVersion == 3) {
    this.newdata.put(t, new Taf.BinBuffer(i.getBuffer()));
  } else {
    var r = this.data.get(t);
    var s = TAF.TypeHelp.INT32;
    if (r == undefined) {
      var n = new Taf.Map(Taf.STRING, Taf.STRING);
      r = n;
    }
    r.put(s, new Uint8Array(i.getBuffer()));
    this.data.put(t, r);
  }
};
Taf.Wup.prototype.writeInt64 = function(t, e) {
  var i = new Taf.JceOutputStream();
  i.writeInt64(0, e);
  if (this.iVersion == 3) {
    this.newdata.put(t, new Taf.BinBuffer(i.getBuffer()));
  } else {
    var r = this.data.get(t);
    var s = TAF.TypeHelp.INT64;
    if (r == undefined) {
      var n = new Taf.Map(Taf.STRING, Taf.STRING);
      r = n;
    }
    r.put(s, new Uint8Array(i.getBuffer()));
    this.data.put(t, r);
  }
};
Taf.Wup.prototype.writeFloat = function(t, e) {
  var i = new Taf.JceOutputStream();
  i.writeFloat(0, e);
  if (this.iVersion == 3) {
    this.newdata.put(t, new Taf.BinBuffer(i.getBuffer()));
  } else {
    var r = this.data.get(t);
    var s = TAF.TypeHelp.FLOAT;
    if (r == undefined) {
      var n = new Taf.Map(Taf.STRING, Taf.STRING);
      r = n;
    }
    r.put(s, new Uint8Array(i.getBuffer()));
    this.data.put(t, r);
  }
};
Taf.Wup.prototype.writeDouble = function(t, e) {
  var i = new Taf.JceOutputStream();
  i.writeDouble(0, e);
  if (this.iVersion == 3) {
    this.newdata.put(t, new Taf.BinBuffer(i.getBuffer()));
  } else {
    var r = this.data.get(t);
    var s = TAF.TypeHelp.DOUBLE;
    if (r == undefined) {
      var n = new Taf.Map(Taf.STRING, Taf.STRING);
      r = n;
    }
    r.put(s, new Uint8Array(i.getBuffer()));
    this.data.put(t, r);
  }
};
Taf.Wup.prototype.writeString = function(t, e) {
  var i = new Taf.JceOutputStream();
  i.writeString(0, e);
  if (this.iVersion == 3) {
    this.newdata.put(t, new Taf.BinBuffer(i.getBuffer()));
  } else {
    var r = this.data.get(t);
    var s = Taf.TypeHelp.STRING;
    if (r == undefined) {
      var n = new Taf.Map(Taf.STRING, Taf.STRING);
      r = n;
    }
    r.put(s, new Uint8Array(i.getBuffer()));
    this.data.put(t, r);
  }
};
Taf.Wup.prototype.writeVector = function(t, e) {
  var i = new Taf.JceOutputStream();
  i.writeVector(0, e);
  if (this.iVersion == 3) {
    this.newdata.put(t, new Taf.BinBuffer(i.getBinBuffer()));
  } else {
    var r = this.data.get(t);
    var s = e._className();
    if (r == undefined) {
      var n = new Taf.Map(Taf.STRING, Taf.STRING);
      r = n;
    }
    r.put(s, new Uint8Array(i.getBuffer()));
    this.data.put(t, r);
  }
};
Taf.Wup.prototype.writeStruct = function(t, e) {
  var i = new Taf.JceOutputStream();
  i.writeStruct(0, e);
  if (this.iVersion == 3) {
    this.newdata.put(t, new Taf.BinBuffer(i.getBuffer()));
  } else {
    var r = this.data.get(t);
    var s = ' ';
    if (r == undefined) {
      var n = new Taf.Map(Taf.STRING, Taf.STRING);
      r = n;
    }
    r.put(s, new Uint8Array(i.getBuffer()));
    this.data.put(t, r);
  }
};
Taf.Wup.prototype.writeBytes = function(t, e) {
  var i = new Taf.JceOutputStream();
  i.writeBytes(0, e);
  if (this.iVersion == 3) {
    this.newdata.put(t, new Taf.BinBuffer(i.getBuffer()));
  } else {
    var r = this.data.get(t);
    var s = 'vec';
    if (r == undefined) {
      var n = new Taf.Map(Taf.STRING, Taf.STRING);
      r = n;
    }
    r.put(s, new Uint8Array(i.getBuffer()));
    this.data.put(t, r);
  }
};
Taf.Wup.prototype.writeMap = function(t, e) {
  var i = new Taf.JceOutputStream();
  i.writeMap(0, e);
  if (this.iVersion == 3) {
    this.newdata.put(t, new Taf.BinBuffer(i.getBuffer()));
  } else {
    var r = this.data.get(t);
    var s = Taf.Util.getClassType(e);
    if (r == undefined) {
      var n = new Taf.Map(Taf.STRING, Taf.STRING);
      r = n;
    }
    r.put(s, new Uint8Array(i.getBuffer()));
    this.data.put(t, r);
  }
};
Taf.Wup.prototype.readFrom = function(t) {
  this.iVersion = t.readInt16(1, true);
  this.cPacketType = t.readInt8(2, true);
  this.iMessageType = t.readInt32(3, true);
  this.iRequestId = t.readInt32(4, true);
  this.sServantName = t.readString(5, true);
  this.sFuncName = t.readString(6, true);
  this.sBuffer = t.readBytes(7, true);
  this.iTimeout = t.readInt32(8, true);
  this.context = t.readMap(9, true);
  this.status = t.readMap(10, true);
};
Taf.Wup.prototype.decode = function(t) {
  var e = new Taf.JceInputStream(t);
  var i = e.buf.vew.getInt32(e.buf.position);
  if (i < 4) {
    throw Error('packet length too short');
  }
  e.buf.position += 4;
  this.readFrom(e);
  e = new Taf.JceInputStream(this.sBuffer.getBuffer());
  if (this.iVersion == 3) {
    this.newdata.clear();
    e.readMap(0, true, this.newdata);
  } else {
    this.data.clear();
    e.readMap(0, true, this.newdata);
  }
};
Taf.Wup.prototype.readBoolean = function(t) {
  var e, i;
  if (this.iVersion == 3) {
    e = this.newdata.get(t);
    if (e == undefined) {
      throw Error('UniAttribute not found key:' + t);
    }
    var r = new Taf.JceInputStream(e.buffer);
    i = r.readBoolean(0, true, i);
  } else {
    e = this.newdata.get(t);
    if (e == undefined) {
      throw Error('UniAttribute not found key:' + t);
    }
    var s = Taf.TypeHelp.BOOLEAN;
    var n = e.get(s);
    if (n == undefined) {
      throw Error('UniAttribute not found type:' + s);
    }
    var r = new Taf.JceInputStream(n);
    i = r.readBoolean(0, true, i);
  }
  return i;
};
Taf.Wup.prototype.readInt8 = function(t) {
  var e, i;
  if (this.iVersion == 3) {
    e = this.newdata.get(t);
    if (e == undefined) {
      throw Error('UniAttribute not found key:' + t);
    }
    var r = new Taf.JceInputStream(e.buffer);
    i = r.readInt8(0, true, i);
  } else {
    e = this.newdata.get(t);
    if (e == undefined) {
      throw Error('UniAttribute not found key:' + t);
    }
    var s = Taf.TypeHelp.CHAR;
    var n = e.get(s);
    if (n == undefined) {
      throw Error('UniAttribute not found type:' + s);
    }
    var r = new Taf.JceInputStream(n);
    i = r.readInt8(0, true, i);
  }
  return i;
};
Taf.Wup.prototype.readInt16 = function(t) {
  var e, i;
  if (this.iVersion == 3) {
    e = this.newdata.get(t);
    if (e == undefined) {
      throw Error('UniAttribute not found key:' + t);
    }
    var r = new Taf.JceInputStream(e.buffer);
    i = r.readInt16(0, true, i);
  } else {
    e = this.newdata.get(t);
    if (e == undefined) {
      throw Error('UniAttribute not found key:' + t);
    }
    var s = Taf.TypeHelp.SHORT;
    var n = e.get(s);
    var r = new Taf.JceInputStream(n);
    if (n == undefined) {
      throw Error('UniAttribute not found type:' + s);
    }
    i = r.readInt16(0, true, i);
  }
  return i;
};
Taf.Wup.prototype.readInt32 = function(t) {
  var e, i;
  if (this.iVersion == 3) {
    e = this.newdata.get(t);
    if (e == undefined) {
      throw Error('UniAttribute not found key:' + t);
    }
    var r = new Taf.JceInputStream(e.buffer);
    i = r.readInt32(0, true, i);
  } else {
    e = this.newdata.get(t);
    if (e == undefined) {
      throw Error('UniAttribute not found key:' + t);
    }
    var s = Taf.TypeHelp.INT32;
    var n = e.get(s);
    if (n == undefined) {
      throw Error('UniAttribute not found type:' + s);
    }
    var r = new Taf.JceInputStream(n);
    i = r.readInt32(0, true, i);
  }
  return i;
};
Taf.Wup.prototype.readInt64 = function(t) {
  var e, i;
  if (this.iVersion == 3) {
    e = this.newdata.get(t);
    if (e == undefined) {
      throw Error('UniAttribute not found key:' + t);
    }
    var r = new Taf.JceInputStream(e.buffer);
    i = r.readInt64(0, true, i);
  } else {
    e = this.newdata.get(t);
    if (e == undefined) {
      throw Error('UniAttribute not found key:' + t);
    }
    var s = Taf.TypeHelp.INT64;
    var n = e.get(s);
    if (n == undefined) {
      throw Error('UniAttribute not found type:' + s);
    }
    var r = new Taf.JceInputStream(n);
    i = r.readInt64(0, true, i);
  }
  return i;
};
Taf.Wup.prototype.readFloat = function(t) {
  var e, i;
  if (this.iVersion == 3) {
    e = this.newdata.get(t);
    if (e == undefined) {
      throw Error('UniAttribute not found key:' + t);
    }
    var r = new Taf.JceInputStream(e.buffer);
    i = r.readFloat(0, true, i);
  } else {
    e = this.newdata.get(t);
    if (e == undefined) {
      throw Error('UniAttribute not found key:' + t);
    }
    var s = Taf.TypeHelp.FLOAT;
    var n = e.get(s);
    if (n == undefined) {
      throw Error('UniAttribute not found type:' + s);
    }
    var r = new Taf.JceInputStream(n);
    i = r.readFloat(0, true, i);
  }
  return i;
};
Taf.Wup.prototype.readDouble = function(t) {
  var e;
  if (this.iVersion == 3) {
    e = this.newdata.get(t);
    if (e == undefined) {
      throw Error('UniAttribute not found key:' + t);
    }
    var i = new Taf.JceInputStream(e.buffer);
    def = i.readDouble(0, true, def);
  } else {
    e = this.newdata.get(t);
    if (e == undefined) {
      throw Error('UniAttribute not found key:' + t);
    }
    var r = Taf.TypeHelp.DOUBLE;
    var s = e.get(r);
    if (s == undefined) {
      throw Error('UniAttribute not found type:' + r);
    }
    var i = new Taf.JceInputStream(s);
    def = i.readDouble(0, true, def);
  }
  return def;
};
Taf.Wup.prototype.readVector = function(t, e, i) {
  var r;
  if (this.iVersion == 3) {
    r = this.newdata.get(t);
    if (r == undefined) {
      throw Error('UniAttribute not found key:' + t);
    }
    var s = new Taf.JceInputStream(r.buffer);
    e = s.readVector(0, true, e);
  } else {
    r = this.newdata.get(t);
    if (r == undefined) {
      throw Error('UniAttribute not found key:' + t);
    }
    var n = r.get(i);
    if (n == undefined) {
      throw Error('UniAttribute not found type:' + i);
    }
    var s = new Taf.JceInputStream(n);
    e = s.readVector(0, true, e);
  }
  return e;
};
Taf.Wup.prototype.readStruct = function(t, e, i) {
  var r;
  if (this.iVersion == 3) {
    r = this.newdata.get(t);
    if (r == undefined) {
      throw Error('UniAttribute not found key:' + t);
    }
    var s = new Taf.JceInputStream(r.buffer);
    e = s.readStruct(0, true, e);
  } else {
    r = this.newdata.get(t);
    if (r == undefined) {
      throw Error('UniAttribute not found key:' + t);
    }
    var n = r.get(i);
    if (n == undefined) {
      throw Error('UniAttribute not found type:' + i);
    }
    var s = new Taf.JceInputStream(n);
    e = s.readStruct(0, true, e);
  }
  return e;
};
Taf.Wup.prototype.readMap = function(t, e, i) {
  var r;
  if (this.iVersion == 3) {
    r = this.newdata.get(t);
    if (r == undefined) {
      throw Error('UniAttribute not found key:' + t);
    }
    var s = new Taf.JceInputStream(r.buffer);
    e = s.readMap(0, true, e);
  } else {
    r = this.newdata.get(t);
    if (r == undefined) {
      throw Error('UniAttribute not found key:' + t);
    }
    var n = r.get(i);
    if (n == undefined) {
      throw Error('UniAttribute not found type:' + i);
    }
    var s = new Taf.JceInputStream(n);
    e = s.readMap(0, true, e);
  }
  return e;
};
Taf.Wup.prototype.readBytes = function(t, e, i) {
  var r;
  if (this.iVersion == 3) {
    r = this.newdata.get(t);
    if (r == undefined) {
      throw Error('UniAttribute not found key:' + t);
    }
    var s = new Taf.JceInputStream(r.buffer);
    e = s.readBytes(0, true, e);
  } else {
    r = this.newdata.get(t);
    if (r == undefined) {
      throw Error('UniAttribute not found key:' + t);
    }
    var n = r.get(i);
    if (n == undefined) {
      throw Error('UniAttribute not found type:' + i);
    }
    var s = new Taf.JceInputStream(n);
    e = s.readBytes(0, true, e);
  }
  return e;
};
var Taf = Taf || {};
Taf.Util = Taf.Util || {};
Taf.Util.jcestream = function(t, e) {
  if (t == null || t == undefined) {
    console.log('Taf.Util.jcestream::value is null or undefined');
    return;
  }
  if (!(t instanceof ArrayBuffer)) {
    console.log('Taf.Util.jcestream::value is not ArrayBuffer');
    return;
  }
  e = e || 16;
  var i = new Uint8Array(t);
  var r = '';
  for (var s = 0; s < i.length; s++) {
    if (s != 0 && s % e == 0) {
      r += '\n';
    } else if (s != 0) {
      r += ' ';
    }
    r += (i[s] > 15 ? '' : '0') + i[s].toString(16);
  }
  console.log(r.toUpperCase());
};
Taf.Util.str2ab = function(t) {
  var e,
    i = t.length,
    r = new Array(i);
  for (e = 0; e < i; ++e) {
    r[e] = t.charCodeAt(e);
  }
  return new Uint8Array(r).buffer;
};
Taf.Util.ajax = function(t, e, i, r) {
  var s = new XMLHttpRequest();
  s.overrideMimeType('text/plain; charset=x-user-defined');
  var n = function() {
    if (s.readyState === 4) {
      if (s.status === 200 || s.status === 304) {
        i(Taf.Util.str2ab(s.response));
      } else {
        r(s.status);
      }
      s.removeEventListener('readystatechange', n);
      s = undefined;
    }
  };
  s.addEventListener('readystatechange', n);
  s.open('post', t);
  s.send(e);
};
var HUYA = HUYA || {};
HUYA.EWebSocketCommandType = {
  EWSCmd_NULL: 0,
  EWSCmd_RegisterReq: 1,
  EWSCmd_RegisterRsp: 2,
  EWSCmd_WupReq: 3,
  EWSCmd_WupRsp: 4,
  EWSCmdC2S_HeartBeat: 5,
  EWSCmdS2C_HeartBeatAck: 6,
  EWSCmdS2C_MsgPushReq: 7,
  EWSCmdC2S_DeregisterReq: 8,
  EWSCmdS2C_DeRegisterRsp: 9,
  EWSCmdC2S_VerifyCookieReq: 10,
  EWSCmdS2C_VerifyCookieRsp: 11,
  EWSCmdC2S_VerifyHuyaTokenReq: 12,
  EWSCmdS2C_VerifyHuyaTokenRsp: 13
};
HUYA.ELiveSource = {
  PC_YY: 0,
  PC_HUYA: 1,
  MOBILE_HUYA: 2,
  WEB_HUYA: 3
};
HUYA.EGender = {
  MALE: 0,
  FEMALE: 1
};
HUYA.EClientTemplateType = {
  TPL_PC: 64,
  TPL_WEB: 32,
  TPL_JIEDAI: 16,
  TPL_TEXAS: 8,
  TPL_MATCH: 4,
  TPL_HUYAAPP: 2,
  TPL_MIRROR: 1
};
HUYA.TemplateType = {
  PRIMARY: 1,
  RECEPTION: 2
};
HUYA.EStreamLineType = {
  STREAM_LINE_OLD_YY: 0,
  STREAM_LINE_WS: 1,
  STREAM_LINE_NEW_YY: 2,
  STREAM_LINE_AL: 3,
  STREAM_LINE_HUYA: 4,
  STREAM_LINE_TX: 5,
  STREAM_LINE_CDN: 8
};
HUYA.eUserOperation = {
  USER_IN: 1,
  USER_OUT: 2,
  USER_MOVE: 3
};
HUYA.WebSocketCommand = function() {
  this.iCmdType = 0;
  this.vData = new Taf.BinBuffer();
};
HUYA.WebSocketCommand.prototype._clone = function() {
  return new HUYA.WebSocketCommand();
};
HUYA.WebSocketCommand.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.WebSocketCommand.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.WebSocketCommand.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iCmdType);
  t.writeBytes(1, this.vData);
};
HUYA.WebSocketCommand.prototype.readFrom = function(t) {
  this.iCmdType = t.readInt32(0, false, this.iCmdType);
  this.vData = t.readBytes(1, false, this.vData);
};
HUYA.WSRegisterRsp = function() {
  this.iResCode = 0;
  this.lRequestId = 0;
  this.sMessage = '';
  this.sBCConnHost = '';
};
HUYA.WSRegisterRsp.prototype._clone = function() {
  return new HUYA.WSRegisterRsp();
};
HUYA.WSRegisterRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.WSRegisterRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.WSRegisterRsp.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iResCode);
  t.writeInt64(1, this.lRequestId);
  t.writeString(2, this.sMessage);
  t.writeString(3, this.sBCConnHost);
};
HUYA.WSRegisterRsp.prototype.readFrom = function(t) {
  this.iResCode = t.readInt32(0, false, this.iResCode);
  this.lRequestId = t.readInt64(1, false, this.lRequestId);
  this.sMessage = t.readString(2, false, this.sMessage);
  this.sBCConnHost = t.readString(3, false, this.sBCConnHost);
};
HUYA.WSPushMessage = function() {
  this.ePushType = 0;
  this.iUri = 0;
  this.sMsg = new Taf.BinBuffer();
  this.iProtocolType = 0;
};
HUYA.WSPushMessage.prototype._clone = function() {
  return new HUYA.WSPushMessage();
};
HUYA.WSPushMessage.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.WSPushMessage.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.WSPushMessage.prototype.writeTo = function(t) {
  t.writeInt32(0, this.ePushType);
  t.writeInt64(1, this.iUri);
  t.writeBytes(2, this.sMsg);
  t.writeInt32(3, this.iProtocolType);
};
HUYA.WSPushMessage.prototype.readFrom = function(t) {
  this.ePushType = t.readInt32(0, false, this.ePushType);
  this.iUri = t.readInt64(1, false, this.iUri);
  this.sMsg = t.readBytes(2, false, this.sMsg);
  this.iProtocolType = t.readInt32(3, false, this.iProtocolType);
};
HUYA.WSHeartBeat = function() {
  this.iState = 0;
};
HUYA.WSHeartBeat.prototype._clone = function() {
  return new HUYA.WSHeartBeat();
};
HUYA.WSHeartBeat.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.WSHeartBeat.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.WSHeartBeat.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iState);
};
HUYA.WSHeartBeat.prototype.readFrom = function(t) {
  this.iState = t.readInt32(0, false, this.iState);
};
HUYA.WSUserInfo = function() {
  this.lUid = 0;
  this.bAnonymous = true;
  this.sGuid = '';
  this.sToken = '';
  this.lTid = 0;
  this.lSid = 0;
  this.lGroupId = 0;
  this.lGroupType = 0;
  this.sAppId = '';
};
HUYA.WSUserInfo.prototype._clone = function() {
  return new HUYA.WSUserInfo();
};
HUYA.WSUserInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.WSUserInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.WSUserInfo.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeBoolean(1, this.bAnonymous);
  t.writeString(2, this.sGuid);
  t.writeString(3, this.sToken);
  t.writeInt64(4, this.lTid);
  t.writeInt64(5, this.lSid);
  t.writeInt64(6, this.lGroupId);
  t.writeInt64(7, this.lGroupType);
  t.writeString(8, this.sAppId);
};
HUYA.WSUserInfo.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.bAnonymous = t.readBoolean(1, false, this.bAnonymous);
  this.sGuid = t.readString(2, false, this.sGuid);
  this.sToken = t.readString(3, false, this.sToken);
  this.lTid = t.readInt64(4, false, this.lTid);
  this.lSid = t.readInt64(5, false, this.lSid);
  this.lGroupId = t.readInt64(6, false, this.lGroupId);
  this.lGroupType = t.readInt64(7, false, this.lGroupType);
  this.sAppId = t.readString(8, false, this.sAppId);
};
HUYA.WSVerifyCookieReq = function() {
  this.lUid = 0;
  this.sUA = '';
  this.sCookie = '';
};
HUYA.WSVerifyCookieReq.prototype._clone = function() {
  return new HUYA.WSVerifyCookieReq();
};
HUYA.WSVerifyCookieReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.WSVerifyCookieReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.WSVerifyCookieReq.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeString(1, this.sUA);
  t.writeString(2, this.sCookie);
};
HUYA.WSVerifyCookieReq.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.sUA = t.readString(1, false, this.sUA);
  this.sCookie = t.readString(2, false, this.sCookie);
};
HUYA.WSVerifyCookieRsp = function() {
  this.iValidate = 0;
};
HUYA.WSVerifyCookieRsp.prototype._clone = function() {
  return new HUYA.WSVerifyCookieRsp();
};
HUYA.WSVerifyCookieRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.WSVerifyCookieRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.WSVerifyCookieRsp.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iValidate);
};
HUYA.WSVerifyCookieRsp.prototype.readFrom = function(t) {
  this.iValidate = t.readInt32(0, false, this.iValidate);
};
HUYA.UserId = function() {
  this.lUid = 0;
  this.sGuid = '';
  this.sToken = '';
  this.sHuYaUA = '';
  this.sCookie = '';
  this.iTokenType = 0;
};
HUYA.UserId.prototype._clone = function() {
  return new HUYA.UserId();
};
HUYA.UserId.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.UserId.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.UserId.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeString(1, this.sGuid);
  t.writeString(2, this.sToken);
  t.writeString(3, this.sHuYaUA);
  t.writeString(4, this.sCookie);
  t.writeInt32(5, this.iTokenType);
};
HUYA.UserId.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.sGuid = t.readString(1, false, this.sGuid);
  this.sToken = t.readString(2, false, this.sToken);
  this.sHuYaUA = t.readString(3, false, this.sHuYaUA);
  this.sCookie = t.readString(4, false, this.sCookie);
  this.iTokenType = t.readInt32(5, false, this.iTokenType);
};
HUYA.EnterChannelReq = function() {
  this.tUserId = new HUYA.UserId();
  this.lTid = 0;
  this.lSid = 0;
  this.iChannelType = 0;
};
HUYA.EnterChannelReq.prototype._clone = function() {
  return new HUYA.EnterChannelReq();
};
HUYA.EnterChannelReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.EnterChannelReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.EnterChannelReq.prototype.writeTo = function(t) {
  t.writeStruct(1, this.tUserId);
  t.writeInt64(2, this.lTid);
  t.writeInt64(3, this.lSid);
  t.writeInt32(4, this.iChannelType);
};
HUYA.EnterChannelReq.prototype.readFrom = function(t) {
  this.tUserId = t.readStruct(1, false, this.tUserId);
  this.lTid = t.readInt64(2, false, this.lTid);
  this.lSid = t.readInt64(3, false, this.lSid);
  this.iChannelType = t.readInt32(4, false, this.iChannelType);
};
HUYA.UserEventReq = function() {
  this.tId = new HUYA.UserId();
  this.lTid = 0;
  this.lSid = 0;
  this.eOp = 0;
  this.sChan = '';
  this.eSource = 0;
  this.lPid = 0;
  this.bWatchVideo = false;
  this.bAnonymous = false;
  this.eTemplateType = HUYA.TemplateType.PRIMARY;
  this.sTraceSource = '';
};
HUYA.UserEventReq.prototype._clone = function() {
  return new HUYA.UserEventReq();
};
HUYA.UserEventReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.UserEventReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.UserEventReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeInt64(1, this.lTid);
  t.writeInt64(2, this.lSid);
  t.writeInt32(4, this.eOp);
  t.writeString(5, this.sChan);
  t.writeInt32(6, this.eSource);
  t.writeInt64(7, this.lPid);
  t.writeBoolean(8, this.bWatchVideo);
  t.writeBoolean(9, this.bAnonymous);
  t.writeInt32(10, this.eTemplateType);
  t.writeString(11, this.sTraceSource);
};
HUYA.UserEventReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.lTid = t.readInt64(1, false, this.lTid);
  this.lSid = t.readInt64(2, false, this.lSid);
  this.eOp = t.readInt32(4, false, this.eOp);
  this.sChan = t.readString(5, false, this.sChan);
  this.eSource = t.readInt32(6, false, this.eSource);
  this.lPid = t.readInt64(7, false, this.lPid);
  this.bWatchVideo = t.readBoolean(8, false, this.bWatchVideo);
  this.bAnonymous = t.readBoolean(9, false, this.bAnonymous);
  this.eTemplateType = t.readInt32(10, false, this.eTemplateType);
  this.sTraceSource = t.readString(11, false, this.sTraceSource);
};
HUYA.UserEventRsp = function() {
  this.lTid = 0;
  this.lSid = 0;
  this.iUserHeartBeatInterval = 60;
  this.iPresentHeartBeatInterval = 60;
};
HUYA.UserEventRsp.prototype._clone = function() {
  return new HUYA.UserEventRsp();
};
HUYA.UserEventRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.UserEventRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.UserEventRsp.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lTid);
  t.writeInt64(1, this.lSid);
  t.writeInt32(2, this.iUserHeartBeatInterval);
  t.writeInt32(3, this.iPresentHeartBeatInterval);
};
HUYA.UserEventRsp.prototype.readFrom = function(t) {
  this.lTid = t.readInt64(0, false, this.lTid);
  this.lSid = t.readInt64(1, false, this.lSid);
  this.iUserHeartBeatInterval = t.readInt32(
    2,
    false,
    this.iUserHeartBeatInterval
  );
  this.iPresentHeartBeatInterval = t.readInt32(
    3,
    false,
    this.iPresentHeartBeatInterval
  );
};
HUYA.UserHeartBeatReq = function() {
  this.tId = new HUYA.UserId();
  this.lTid = 0;
  this.lSid = 0;
  this.lPid = 0;
  this.bWatchVideo = false;
  this.eLineType = HUYA.EStreamLineType.STREAM_LINE_OLD_YY;
  this.iFps = 0;
  this.iAttendee = 0;
  this.iBandwidth = 0;
  this.iLastHeartElapseTime = 0;
};
HUYA.UserHeartBeatReq.prototype._clone = function() {
  return new HUYA.UserHeartBeatReq();
};
HUYA.UserHeartBeatReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.UserHeartBeatReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.UserHeartBeatReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeInt64(1, this.lTid);
  t.writeInt64(2, this.lSid);
  t.writeInt64(4, this.lPid);
  t.writeBoolean(5, this.bWatchVideo);
  t.writeInt32(6, this.eLineType);
  t.writeInt32(7, this.iFps);
  t.writeInt32(8, this.iAttendee);
  t.writeInt32(9, this.iBandwidth);
  t.writeInt32(10, this.iLastHeartElapseTime);
};
HUYA.UserHeartBeatReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.lTid = t.readInt64(1, false, this.lTid);
  this.lSid = t.readInt64(2, false, this.lSid);
  this.lPid = t.readInt64(4, false, this.lPid);
  this.bWatchVideo = t.readBoolean(5, false, this.bWatchVideo);
  this.eLineType = t.readInt32(6, false, this.eLineType);
  this.iFps = t.readInt32(7, false, this.iFps);
  this.iAttendee = t.readInt32(8, false, this.iAttendee);
  this.iBandwidth = t.readInt32(9, false, this.iBandwidth);
  this.iLastHeartElapseTime = t.readInt32(10, false, this.iLastHeartElapseTime);
};
HUYA.UserHeartBeatRsp = function() {
  this.iRet = 0;
};
HUYA.UserHeartBeatRsp.prototype._clone = function() {
  return new HUYA.UserHeartBeatRsp();
};
HUYA.UserHeartBeatRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.UserHeartBeatRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.UserHeartBeatRsp.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iRet);
};
HUYA.UserHeartBeatRsp.prototype.readFrom = function(t) {
  this.iRet = t.readInt32(0, false, this.iRet);
};
HUYA.SendMessageReq = function() {
  this.tUserId = new HUYA.UserId();
  this.lTid = 0;
  this.lSid = 0;
  this.sContent = '';
  this.iShowMode = 0;
  this.tFormat = new HUYA.ContentFormat();
  this.tBulletFormat = new HUYA.BulletFormat();
  this.vAtSomeone = new Taf.Vector(new HUYA.UidNickName());
  this.lPid = 0;
};
HUYA.SendMessageReq.prototype._clone = function() {
  return new HUYA.SendMessageReq();
};
HUYA.SendMessageReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.SendMessageReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.SendMessageReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tUserId);
  t.writeInt64(1, this.lTid);
  t.writeInt64(2, this.lSid);
  t.writeString(3, this.sContent);
  t.writeInt32(4, this.iShowMode);
  t.writeStruct(5, this.tFormat);
  t.writeStruct(6, this.tBulletFormat);
  t.writeVector(7, this.vAtSomeone);
  t.writeInt64(8, this.lPid);
};
HUYA.SendMessageReq.prototype.readFrom = function(t) {
  this.tUserId = t.readStruct(0, false, this.tUserId);
  this.lTid = t.readInt64(1, false, this.lTid);
  this.lSid = t.readInt64(2, false, this.lSid);
  this.sContent = t.readString(3, false, this.sContent);
  this.iShowMode = t.readInt32(4, false, this.iShowMode);
  this.tFormat = t.readStruct(5, false, this.tFormat);
  this.tBulletFormat = t.readStruct(6, false, this.tBulletFormat);
  this.vAtSomeone = t.readVector(7, false, this.vAtSomeone);
  this.lPid = t.readInt64(8, false, this.lPid);
};
HUYA.SendMessageRsp = function() {
  this.iStatus = 0;
  this.tNotice = new HUYA.MessageNotice();
};
HUYA.SendMessageRsp.prototype._clone = function() {
  return new HUYA.SendMessageRsp();
};
HUYA.SendMessageRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.SendMessageRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.SendMessageRsp.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iStatus);
  t.writeStruct(1, this.tNotice);
};
HUYA.SendMessageRsp.prototype.readFrom = function(t) {
  this.iStatus = t.readInt32(0, false, this.iStatus);
  this.tNotice = t.readStruct(1, false, this.tNotice);
};
HUYA.MessageNotice = function() {
  this.tUserInfo = new HUYA.SenderInfo();
  this.lTid = 0;
  this.lSid = 0;
  this.sContent = '';
  this.iShowMode = 0;
  this.tFormat = new HUYA.ContentFormat();
  this.tBulletFormat = new HUYA.BulletFormat();
  this.iTermType = 0;
  this.vDecorationPrefix = new Taf.Vector(new HUYA.DecorationInfo());
  this.vDecorationSuffix = new Taf.Vector(new HUYA.DecorationInfo());
  this.vAtSomeone = new Taf.Vector(new HUYA.UidNickName());
  this.lPid = 0;
};
HUYA.MessageNotice.prototype._clone = function() {
  return new HUYA.MessageNotice();
};
HUYA.MessageNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.MessageNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.MessageNotice.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tUserInfo);
  t.writeInt64(1, this.lTid);
  t.writeInt64(2, this.lSid);
  t.writeString(3, this.sContent);
  t.writeInt32(4, this.iShowMode);
  t.writeStruct(5, this.tFormat);
  t.writeStruct(6, this.tBulletFormat);
  t.writeInt32(7, this.iTermType);
  t.writeVector(8, this.vDecorationPrefix);
  t.writeVector(9, this.vDecorationSuffix);
  t.writeVector(10, this.vAtSomeone);
  t.writeInt64(11, this.lPid);
};
HUYA.MessageNotice.prototype.readFrom = function(t) {
  this.tUserInfo = t.readStruct(0, false, this.tUserInfo);
  this.lTid = t.readInt64(1, false, this.lTid);
  this.lSid = t.readInt64(2, false, this.lSid);
  this.sContent = t.readString(3, false, this.sContent);
  this.iShowMode = t.readInt32(4, false, this.iShowMode);
  this.tFormat = t.readStruct(5, false, this.tFormat);
  this.tBulletFormat = t.readStruct(6, false, this.tBulletFormat);
  this.iTermType = t.readInt32(7, false, this.iTermType);
  this.vDecorationPrefix = t.readVector(8, false, this.vDecorationPrefix);
  this.vDecorationSuffix = t.readVector(9, false, this.vDecorationSuffix);
  this.vAtSomeone = t.readVector(10, false, this.vAtSomeone);
  this.lPid = t.readInt64(11, false, this.lPid);
};
HUYA.ContentFormat = function() {
  this.iFontColor = -1;
  this.iFontSize = 4;
  this.iPopupStyle = 0;
};
HUYA.ContentFormat.prototype._clone = function() {
  return new HUYA.ContentFormat();
};
HUYA.ContentFormat.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.ContentFormat.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.ContentFormat.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iFontColor);
  t.writeInt32(1, this.iFontSize);
  t.writeInt32(2, this.iPopupStyle);
};
HUYA.ContentFormat.prototype.readFrom = function(t) {
  this.iFontColor = t.readInt32(0, false, this.iFontColor);
  this.iFontSize = t.readInt32(1, false, this.iFontSize);
  this.iPopupStyle = t.readInt32(2, false, this.iPopupStyle);
};
HUYA.BulletFormat = function() {
  this.iFontColor = -1;
  this.iFontSize = 4;
  this.iTextSpeed = 0;
  this.iTransitionType = 1;
  this.iPopupStyle = 0;
};
HUYA.BulletFormat.prototype._clone = function() {
  return new HUYA.BulletFormat();
};
HUYA.BulletFormat.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.BulletFormat.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.BulletFormat.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iFontColor);
  t.writeInt32(1, this.iFontSize);
  t.writeInt32(2, this.iTextSpeed);
  t.writeInt32(3, this.iTransitionType);
  t.writeInt32(4, this.iPopupStyle);
};
HUYA.BulletFormat.prototype.readFrom = function(t) {
  this.iFontColor = t.readInt32(0, false, this.iFontColor);
  this.iFontSize = t.readInt32(1, false, this.iFontSize);
  this.iTextSpeed = t.readInt32(2, false, this.iTextSpeed);
  this.iTransitionType = t.readInt32(3, false, this.iTransitionType);
  this.iPopupStyle = t.readInt32(4, false, this.iPopupStyle);
};
HUYA.UidNickName = function() {
  this.lUid = 0;
  this.sNickName = '';
};
HUYA.UidNickName.prototype._clone = function() {
  return new HUYA.UidNickName();
};
HUYA.UidNickName.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.UidNickName.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.UidNickName.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeString(1, this.sNickName);
};
HUYA.UidNickName.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.sNickName = t.readString(1, false, this.sNickName);
};
HUYA.SenderInfo = function() {
  this.lUid = 0;
  this.lImid = 0;
  this.sNickName = '';
  this.iGender = 0;
  this.sAvatarUrl = '';
};
HUYA.SenderInfo.prototype._clone = function() {
  return new HUYA.SenderInfo();
};
HUYA.SenderInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.SenderInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.SenderInfo.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeInt64(1, this.lImid);
  t.writeString(2, this.sNickName);
  t.writeInt32(3, this.iGender);
  t.writeString(4, this.sAvatarUrl);
};
HUYA.SenderInfo.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.lImid = t.readInt64(1, false, this.lImid);
  this.sNickName = t.readString(2, false, this.sNickName);
  this.iGender = t.readInt32(3, false, this.iGender);
  this.sAvatarUrl = t.readString(4, false, this.sAvatarUrl);
};
HUYA.DecorationInfo = function() {
  this.iAppId = 0;
  this.iViewType = 0;
  this.vData = new Taf.BinBuffer();
};
HUYA.DecorationInfo.prototype._clone = function() {
  return new HUYA.DecorationInfo();
};
HUYA.DecorationInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.DecorationInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.DecorationInfo.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iAppId);
  t.writeInt32(1, this.iViewType);
  t.writeBytes(2, this.vData);
};
HUYA.DecorationInfo.prototype.readFrom = function(t) {
  this.iAppId = t.readInt32(0, false, this.iAppId);
  this.iViewType = t.readInt32(1, false, this.iViewType);
  this.vData = t.readBytes(2, false, this.vData);
};
HUYA.EDecorationAppType = {
  kDecorationAppTypeCommon: 100,
  kDecorationAppTypeChannel: 1e4,
  kDecorationAppTypeAdmin: 10100,
  kDecorationAppTypeDaiyanClub: 10150,
  kDecorationAppTypeNoble: 10200,
  kDecorationAppTypeGuard: 10300,
  kDecorationAppTypeFans: 10400,
  kDecorationAppTypeVIP: 10500,
  kDecorationAppTypeUserProfile: 10560,
  kDecorationAppTyperPurpleDiamond: 10600,
  kDecorationAppTypeStamp: 10700,
  KDecorationAppTypeNobleEmoticon: 10800,
  KDecorationAppTypePresenter: 10900
};
HUYA.EDecorationViewType = {
  kDecorationViewTypeCustomized: 0,
  kDecorationViewTypeText: 1,
  kDecorationViewTypeIcon: 2
};
HUYA.MsgCommDecoChannelRoleInfo = function() {
  this.iLevel = 0;
};
HUYA.MsgCommDecoChannelRoleInfo.prototype._clone = function() {
  return new HUYA.MsgCommDecoChannelRoleInfo();
};
HUYA.MsgCommDecoChannelRoleInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.MsgCommDecoChannelRoleInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.MsgCommDecoChannelRoleInfo.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iLevel);
};
HUYA.MsgCommDecoChannelRoleInfo.prototype.readFrom = function(t) {
  this.iLevel = t.readInt32(0, false, this.iLevel);
};
HUYA.GetStampRsp = function() {
  this.lUid = 0;
  this.lStampUid = 0;
  this.sStampNick = '';
  this.lStampTime = 0;
  this.tStampInfo = new HUYA.StampInfo();
  this.lDeadline = 0;
};
HUYA.GetStampRsp.prototype._clone = function() {
  return new HUYA.GetStampRsp();
};
HUYA.GetStampRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetStampRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetStampRsp.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeInt64(1, this.lStampUid);
  t.writeString(2, this.sStampNick);
  t.writeInt64(3, this.lStampTime);
  t.writeStruct(4, this.tStampInfo);
  t.writeInt64(5, this.lDeadline);
};
HUYA.GetStampRsp.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.lStampUid = t.readInt64(1, false, this.lStampUid);
  this.sStampNick = t.readString(2, false, this.sStampNick);
  this.lStampTime = t.readInt64(3, false, this.lStampTime);
  this.tStampInfo = t.readStruct(4, false, this.tStampInfo);
  this.lDeadline = t.readInt64(5, false, this.lDeadline);
};
HUYA.StampInfo = function() {
  this.iId = 0;
  this.sStamp = '';
  this.iLevel = 0;
  this.lStampPrice = 0;
  this.iValidity = 0;
};
HUYA.StampInfo.prototype._clone = function() {
  return new HUYA.StampInfo();
};
HUYA.StampInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.StampInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.StampInfo.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iId);
  t.writeString(1, this.sStamp);
  t.writeInt32(2, this.iLevel);
  t.writeInt64(3, this.lStampPrice);
  t.writeInt32(4, this.iValidity);
};
HUYA.StampInfo.prototype.readFrom = function(t) {
  this.iId = t.readInt32(0, false, this.iId);
  this.sStamp = t.readString(1, false, this.sStamp);
  this.iLevel = t.readInt32(2, false, this.iLevel);
  this.lStampPrice = t.readInt64(3, false, this.lStampPrice);
  this.iValidity = t.readInt32(4, false, this.iValidity);
};
HUYA.MsgCommDecoIcon = function() {
  this.sUrl = '';
};
HUYA.MsgCommDecoIcon.prototype._clone = function() {
  return new HUYA.MsgCommDecoIcon();
};
HUYA.MsgCommDecoIcon.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.MsgCommDecoIcon.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.MsgCommDecoIcon.prototype.writeTo = function(t) {
  t.writeString(0, this.sUrl);
};
HUYA.MsgCommDecoIcon.prototype.readFrom = function(t) {
  this.sUrl = t.readString(0, false, this.sUrl);
};
HUYA.MsgCommDecoText = function() {
  this.sText = '';
  this.iColor = 0;
};
HUYA.MsgCommDecoText.prototype._clone = function() {
  return new HUYA.MsgCommDecoText();
};
HUYA.MsgCommDecoText.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.MsgCommDecoText.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.MsgCommDecoText.prototype.writeTo = function(t) {
  t.writeString(0, this.sText);
  t.writeInt32(1, this.iColor);
};
HUYA.MsgCommDecoText.prototype.readFrom = function(t) {
  this.sText = t.readString(0, false, this.sText);
  this.iColor = t.readInt32(1, false, this.iColor);
};
HUYA.GetUserTypeRsp = function() {
  this.lUid = 0;
  this.lPresenterUid = 0;
  this.iType = 0;
  this.tIsMutedRsp = new HUYA.IsMutedRsp();
};
HUYA.GetUserTypeRsp.prototype._clone = function() {
  return new HUYA.GetUserTypeRsp();
};
HUYA.GetUserTypeRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetUserTypeRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetUserTypeRsp.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeInt64(1, this.lPresenterUid);
  t.writeInt32(3, this.iType);
  t.writeStruct(4, this.tIsMutedRsp);
};
HUYA.GetUserTypeRsp.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.lPresenterUid = t.readInt64(1, false, this.lPresenterUid);
  this.iType = t.readInt32(3, false, this.iType);
  this.tIsMutedRsp = t.readStruct(4, false, this.tIsMutedRsp);
};
HUYA.IsMutedRsp = function() {
  this.bMuted = false;
  this.iMutedTime = 0;
  this.lAutoUnmutedTime = 0;
  this.iMutedType = 0;
};
HUYA.IsMutedRsp.prototype._clone = function() {
  return new HUYA.IsMutedRsp();
};
HUYA.IsMutedRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.IsMutedRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.IsMutedRsp.prototype.writeTo = function(t) {
  t.writeBoolean(0, this.bMuted);
  t.writeInt32(1, this.iMutedTime);
  t.writeInt64(2, this.lAutoUnmutedTime);
  t.writeInt32(3, this.iMutedType);
};
HUYA.IsMutedRsp.prototype.readFrom = function(t) {
  this.bMuted = t.readBoolean(0, false, this.bMuted);
  this.iMutedTime = t.readInt32(1, false, this.iMutedTime);
  this.lAutoUnmutedTime = t.readInt64(2, false, this.lAutoUnmutedTime);
  this.iMutedType = t.readInt32(3, false, this.iMutedType);
};
HUYA.MsgCommDecoGuardInfo = function() {
  this.iLevel = 0;
};
HUYA.MsgCommDecoGuardInfo.prototype._clone = function() {
  return new HUYA.MsgCommDecoGuardInfo();
};
HUYA.MsgCommDecoGuardInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.MsgCommDecoGuardInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.MsgCommDecoGuardInfo.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iLevel);
};
HUYA.MsgCommDecoGuardInfo.prototype.readFrom = function(t) {
  this.iLevel = t.readInt32(0, false, this.iLevel);
};
HUYA.PurpleVipInfo = function() {
  this.lUid = 0;
  this.iIsSuper = 0;
  this.iChargeType = 0;
  this.iVipGrade = 0;
  this.sIconUrl = '';
};
HUYA.PurpleVipInfo.prototype._clone = function() {
  return new HUYA.PurpleVipInfo();
};
HUYA.PurpleVipInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.PurpleVipInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.PurpleVipInfo.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeInt32(1, this.iIsSuper);
  t.writeInt32(2, this.iChargeType);
  t.writeInt32(3, this.iVipGrade);
  t.writeString(4, this.sIconUrl);
};
HUYA.PurpleVipInfo.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.iIsSuper = t.readInt32(1, false, this.iIsSuper);
  this.iChargeType = t.readInt32(2, false, this.iChargeType);
  this.iVipGrade = t.readInt32(3, false, this.iVipGrade);
  this.sIconUrl = t.readString(4, false, this.sIconUrl);
};
HUYA.VipListReq = function() {
  this.tUserId = new HUYA.UserId();
  this.lTid = 0;
  this.lSid = 0;
  this.iStart = 0;
  this.iCount = 0;
  this.lPid = 0;
};
HUYA.VipListReq.prototype._clone = function() {
  return new HUYA.VipListReq();
};
HUYA.VipListReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.VipListReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.VipListReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tUserId);
  t.writeInt64(1, this.lTid);
  t.writeInt64(2, this.lSid);
  t.writeInt32(3, this.iStart);
  t.writeInt32(4, this.iCount);
  t.writeInt64(5, this.lPid);
};
HUYA.VipListReq.prototype.readFrom = function(t) {
  this.tUserId = t.readStruct(0, false, this.tUserId);
  this.lTid = t.readInt64(1, false, this.lTid);
  this.lSid = t.readInt64(2, false, this.lSid);
  this.iStart = t.readInt32(3, false, this.iStart);
  this.iCount = t.readInt32(4, false, this.iCount);
  this.lPid = t.readInt64(5, false, this.lPid);
};
HUYA.VipBarListRsp = function() {
  this.iStart = 0;
  this.iCount = 0;
  this.iTotal = 0;
  this.vVipBarItem = new Taf.Vector(new HUYA.VipBarItem());
  this.sBadgeName = '';
  this.iChangedHighestRank = 0;
  this.lPid = 0;
  this.sVLogo = '';
};
HUYA.VipBarListRsp.prototype._clone = function() {
  return new HUYA.VipBarListRsp();
};
HUYA.VipBarListRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.VipBarListRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.VipBarListRsp.prototype.writeTo = function(t) {
  t.writeInt32(1, this.iStart);
  t.writeInt32(2, this.iCount);
  t.writeInt32(3, this.iTotal);
  t.writeVector(4, this.vVipBarItem);
  t.writeString(5, this.sBadgeName);
  t.writeInt32(6, this.iChangedHighestRank);
  t.writeInt64(7, this.lPid);
  t.writeString(8, this.sVLogo);
};
HUYA.VipBarListRsp.prototype.readFrom = function(t) {
  this.iStart = t.readInt32(1, false, this.iStart);
  this.iCount = t.readInt32(2, false, this.iCount);
  this.iTotal = t.readInt32(3, false, this.iTotal);
  this.vVipBarItem = t.readVector(4, false, this.vVipBarItem);
  this.sBadgeName = t.readString(5, false, this.sBadgeName);
  this.iChangedHighestRank = t.readInt32(6, false, this.iChangedHighestRank);
  this.lPid = t.readInt64(7, false, this.lPid);
  this.sVLogo = t.readString(8, false, this.sVLogo);
};
HUYA.VipBarItem = function() {
  this.lUid = 0;
  this.iTypes = 0;
  this.tNobleInfo = new HUYA.NobleInfo();
  this.tGuardInfo = new HUYA.GuardInfo();
  this.tFansInfo = new HUYA.FansInfo();
  this.sNickName = '';
  this.iSuperPupleLevel = 0;
  this.iPotentialTypes = 0;
  this.sLogo = '';
  this.lExpiredTS = 0;
  this.iUserLevel = 0;
  this.sLon = '';
  this.sLat = '';
  this.sSession = '';
};
HUYA.VipBarItem.prototype._clone = function() {
  return new HUYA.VipBarItem();
};
HUYA.VipBarItem.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.VipBarItem.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.VipBarItem.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeInt32(1, this.iTypes);
  t.writeStruct(2, this.tNobleInfo);
  t.writeStruct(3, this.tGuardInfo);
  t.writeStruct(4, this.tFansInfo);
  t.writeString(5, this.sNickName);
  t.writeInt32(6, this.iSuperPupleLevel);
  t.writeInt32(7, this.iPotentialTypes);
  t.writeString(8, this.sLogo);
  t.writeInt64(9, this.lExpiredTS);
  t.writeInt32(10, this.iUserLevel);
  t.writeString(13, this.sLon);
  t.writeString(14, this.sLat);
  t.writeString(15, this.sSession);
};
HUYA.VipBarItem.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.iTypes = t.readInt32(1, false, this.iTypes);
  this.tNobleInfo = t.readStruct(2, false, this.tNobleInfo);
  this.tGuardInfo = t.readStruct(3, false, this.tGuardInfo);
  this.tFansInfo = t.readStruct(4, false, this.tFansInfo);
  this.sNickName = t.readString(5, false, this.sNickName);
  this.iSuperPupleLevel = t.readInt32(6, false, this.iSuperPupleLevel);
  this.iPotentialTypes = t.readInt32(7, false, this.iPotentialTypes);
  this.sLogo = t.readString(8, false, this.sLogo);
  this.lExpiredTS = t.readInt64(9, false, this.lExpiredTS);
  this.iUserLevel = t.readInt32(10, false, this.iUserLevel);
  this.sLon = t.readString(13, false, this.sLon);
  this.sLat = t.readString(14, false, this.sLat);
  this.sSession = t.readString(15, false, this.sSession);
};
HUYA.WeekRankItem = function() {
  this.lUid = 0;
  this.sNickName = '';
  this.iScore = 0;
  this.iGuardLevel = 0;
  this.iNobleLevel = 0;
  this.sLogo = '';
  this.iUserLevel = 0;
  this.iRank = 0;
};
HUYA.WeekRankItem.prototype._clone = function() {
  return new HUYA.WeekRankItem();
};
HUYA.WeekRankItem.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.WeekRankItem.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.WeekRankItem.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeString(1, this.sNickName);
  t.writeInt32(2, this.iScore);
  t.writeInt32(3, this.iGuardLevel);
  t.writeInt32(4, this.iNobleLevel);
  t.writeString(5, this.sLogo);
  t.writeInt32(6, this.iUserLevel);
  t.writeInt32(7, this.iRank);
};
HUYA.WeekRankItem.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.sNickName = t.readString(1, false, this.sNickName);
  this.iScore = t.readInt32(2, false, this.iScore);
  this.iGuardLevel = t.readInt32(3, false, this.iGuardLevel);
  this.iNobleLevel = t.readInt32(4, false, this.iNobleLevel);
  this.sLogo = t.readString(5, false, this.sLogo);
  this.iUserLevel = t.readInt32(6, false, this.iUserLevel);
  this.iRank = t.readInt32(7, false, this.iRank);
};
HUYA.WeekRankListReq = function() {
  this.tUserId = new HUYA.UserId();
  this.lTid = 0;
  this.lSid = 0;
  this.lPid = 0;
};
HUYA.WeekRankListReq.prototype._clone = function() {
  return new HUYA.WeekRankListReq();
};
HUYA.WeekRankListReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.WeekRankListReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.WeekRankListReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tUserId);
  t.writeInt64(1, this.lTid);
  t.writeInt64(2, this.lSid);
  t.writeInt64(3, this.lPid);
};
HUYA.WeekRankListReq.prototype.readFrom = function(t) {
  this.tUserId = t.readStruct(0, false, this.tUserId);
  this.lTid = t.readInt64(1, false, this.lTid);
  this.lSid = t.readInt64(2, false, this.lSid);
  this.lPid = t.readInt64(3, false, this.lPid);
};
HUYA.WeekRankListRsp = function() {
  this.vWeekRankItem = new Taf.Vector(new HUYA.WeekRankItem());
  this.iStart = 0;
  this.iCount = 0;
  this.iTotal = 0;
  this.lPid = 0;
};
HUYA.WeekRankListRsp.prototype._clone = function() {
  return new HUYA.WeekRankListRsp();
};
HUYA.WeekRankListRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.WeekRankListRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.WeekRankListRsp.prototype.writeTo = function(t) {
  t.writeVector(0, this.vWeekRankItem);
  t.writeInt32(1, this.iStart);
  t.writeInt32(2, this.iCount);
  t.writeInt32(3, this.iTotal);
  t.writeInt64(4, this.lPid);
};
HUYA.WeekRankListRsp.prototype.readFrom = function(t) {
  this.vWeekRankItem = t.readVector(0, false, this.vWeekRankItem);
  this.iStart = t.readInt32(1, false, this.iStart);
  this.iCount = t.readInt32(2, false, this.iCount);
  this.iTotal = t.readInt32(3, false, this.iTotal);
  this.lPid = t.readInt64(4, false, this.lPid);
};
HUYA.WeekRankEnterBanner = function() {
  this.lUid = 0;
  this.sNickName = '';
  this.iRank = 0;
  this.lPid = 0;
};
HUYA.WeekRankEnterBanner.prototype._clone = function() {
  return new HUYA.WeekRankEnterBanner();
};
HUYA.WeekRankEnterBanner.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.WeekRankEnterBanner.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.WeekRankEnterBanner.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeString(1, this.sNickName);
  t.writeInt32(2, this.iRank);
  t.writeInt64(3, this.lPid);
};
HUYA.WeekRankEnterBanner.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.sNickName = t.readString(1, false, this.sNickName);
  this.iRank = t.readInt32(2, false, this.iRank);
  this.lPid = t.readInt64(3, false, this.lPid);
};
HUYA.LiveListRsp = function() {
  this.vGameLiveInfos = new Taf.Vector(new HUYA.GameLiveInfo());
  this.lNextBeginId = 0;
};
HUYA.LiveListRsp.prototype._clone = function() {
  return new HUYA.LiveListRsp();
};
HUYA.LiveListRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.LiveListRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.LiveListRsp.prototype.writeTo = function(t) {
  t.writeVector(0, this.vGameLiveInfos);
  t.writeInt64(1, this.lNextBeginId);
};
HUYA.LiveListRsp.prototype.readFrom = function(t) {
  this.vGameLiveInfos = t.readVector(0, false, this.vGameLiveInfos);
  this.lNextBeginId = t.readInt64(1, false, this.lNextBeginId);
};
HUYA.UserChannelReq = function() {
  this.tId = new HUYA.UserId();
  this.lTopcid = 0;
  this.lSubcid = 0;
  this.sSendContent = '';
};
HUYA.UserChannelReq.prototype._clone = function() {
  return new HUYA.UserChannelReq();
};
HUYA.UserChannelReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.UserChannelReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.UserChannelReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeInt64(1, this.lTopcid);
  t.writeInt64(2, this.lSubcid);
  t.writeString(3, this.sSendContent);
};
HUYA.UserChannelReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.lTopcid = t.readInt64(1, false, this.lTopcid);
  this.lSubcid = t.readInt64(2, false, this.lSubcid);
  this.sSendContent = t.readString(3, false, this.sSendContent);
};
HUYA.BadgeReq = function() {
  this.tUserId = new HUYA.UserId();
  this.lBadgeId = 0;
  this.lToUid = 0;
};
HUYA.BadgeReq.prototype._clone = function() {
  return new HUYA.BadgeReq();
};
HUYA.BadgeReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.BadgeReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.BadgeReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tUserId);
  t.writeInt64(1, this.lBadgeId);
  t.writeInt64(2, this.lToUid);
};
HUYA.BadgeReq.prototype.readFrom = function(t) {
  this.tUserId = t.readStruct(0, false, this.tUserId);
  this.lBadgeId = t.readInt64(1, false, this.lBadgeId);
  this.lToUid = t.readInt64(2, false, this.lToUid);
};
HUYA.BadgeInfo = function() {
  this.lUid = 0;
  this.lBadgeId = 0;
  this.sPresenterNickName = '';
  this.sBadgeName = '';
  this.iBadgeLevel = 0;
  this.iRank = 0;
  this.iScore = 0;
  this.iNextScore = 0;
  this.iQuotaUsed = 0;
  this.iQuota = 0;
  this.lQuotaTS = 0;
  this.lOpenTS = 0;
  this.iVFlag = 0;
  this.sVLogo = '';
  this.tChannelInfo = new HUYA.PresenterChannelInfo();
  this.sPresenterLogo = '';
};
HUYA.BadgeInfo.prototype._clone = function() {
  return new HUYA.BadgeInfo();
};
HUYA.BadgeInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.BadgeInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.BadgeInfo.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeInt64(1, this.lBadgeId);
  t.writeString(2, this.sPresenterNickName);
  t.writeString(3, this.sBadgeName);
  t.writeInt32(4, this.iBadgeLevel);
  t.writeInt32(5, this.iRank);
  t.writeInt32(6, this.iScore);
  t.writeInt32(7, this.iNextScore);
  t.writeInt32(8, this.iQuotaUsed);
  t.writeInt32(9, this.iQuota);
  t.writeInt64(10, this.lQuotaTS);
  t.writeInt64(11, this.lOpenTS);
  t.writeInt32(12, this.iVFlag);
  t.writeString(13, this.sVLogo);
  t.writeStruct(14, this.tChannelInfo);
  t.writeString(15, this.sPresenterLogo);
};
HUYA.BadgeInfo.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.lBadgeId = t.readInt64(1, false, this.lBadgeId);
  this.sPresenterNickName = t.readString(2, false, this.sPresenterNickName);
  this.sBadgeName = t.readString(3, false, this.sBadgeName);
  this.iBadgeLevel = t.readInt32(4, false, this.iBadgeLevel);
  this.iRank = t.readInt32(5, false, this.iRank);
  this.iScore = t.readInt32(6, false, this.iScore);
  this.iNextScore = t.readInt32(7, false, this.iNextScore);
  this.iQuotaUsed = t.readInt32(8, false, this.iQuotaUsed);
  this.iQuota = t.readInt32(9, false, this.iQuota);
  this.lQuotaTS = t.readInt64(10, false, this.lQuotaTS);
  this.lOpenTS = t.readInt64(11, false, this.lOpenTS);
  this.iVFlag = t.readInt32(12, false, this.iVFlag);
  this.sVLogo = t.readString(13, false, this.sVLogo);
  this.tChannelInfo = t.readStruct(14, false, this.tChannelInfo);
  this.sPresenterLogo = t.readString(15, false, this.sPresenterLogo);
};
HUYA.BadgeScoreChanged = function() {
  this.iScoreChanged = 0;
  this.iBadgeLevelChanged = 0;
  this.iOverBadgeCountLimit = 0;
  this.tBadgeInfo = new HUYA.BadgeInfo();
  this.iNewBadge = 0;
};
HUYA.BadgeScoreChanged.prototype._clone = function() {
  return new HUYA.BadgeScoreChanged();
};
HUYA.BadgeScoreChanged.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.BadgeScoreChanged.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.BadgeScoreChanged.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iScoreChanged);
  t.writeInt32(1, this.iBadgeLevelChanged);
  t.writeInt32(2, this.iOverBadgeCountLimit);
  t.writeStruct(3, this.tBadgeInfo);
  t.writeInt32(4, this.iNewBadge);
};
HUYA.BadgeScoreChanged.prototype.readFrom = function(t) {
  this.iScoreChanged = t.readInt32(0, false, this.iScoreChanged);
  this.iBadgeLevelChanged = t.readInt32(1, false, this.iBadgeLevelChanged);
  this.iOverBadgeCountLimit = t.readInt32(2, false, this.iOverBadgeCountLimit);
  this.tBadgeInfo = t.readStruct(3, false, this.tBadgeInfo);
  this.iNewBadge = t.readInt32(4, false, this.iNewBadge);
};
HUYA.FansTips = function() {
  this.iType = 0;
  this.tBadgeInfo = new HUYA.BadgeInfo();
};
HUYA.FansTips.prototype._clone = function() {
  return new HUYA.FansTips();
};
HUYA.FansTips.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.FansTips.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.FansTips.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iType);
  t.writeStruct(1, this.tBadgeInfo);
};
HUYA.FansTips.prototype.readFrom = function(t) {
  this.iType = t.readInt32(0, false, this.iType);
  this.tBadgeInfo = t.readStruct(1, false, this.tBadgeInfo);
};
HUYA.FansInfoNotice = function() {
  this.iFansLevel = 0;
  this.iGreenPopUpCount = 0;
  this.tTips = new HUYA.FansTips();
};
HUYA.FansInfoNotice.prototype._clone = function() {
  return new HUYA.FansInfoNotice();
};
HUYA.FansInfoNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.FansInfoNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.FansInfoNotice.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iFansLevel);
  t.writeInt32(1, this.iGreenPopUpCount);
  t.writeStruct(2, this.tTips);
};
HUYA.FansInfoNotice.prototype.readFrom = function(t) {
  this.iFansLevel = t.readInt32(0, false, this.iFansLevel);
  this.iGreenPopUpCount = t.readInt32(1, false, this.iGreenPopUpCount);
  this.tTips = t.readStruct(2, false, this.tTips);
};
HUYA.BadgeInfoListReq = function() {
  this.tUserId = new HUYA.UserId();
  this.lToUid = 0;
};
HUYA.BadgeInfoListReq.prototype._clone = function() {
  return new HUYA.BadgeInfoListReq();
};
HUYA.BadgeInfoListReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.BadgeInfoListReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.BadgeInfoListReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tUserId);
  t.writeInt64(1, this.lToUid);
};
HUYA.BadgeInfoListReq.prototype.readFrom = function(t) {
  this.tUserId = t.readStruct(0, false, this.tUserId);
  this.lToUid = t.readInt64(1, false, this.lToUid);
};
HUYA.BadgeInfoListRsp = function() {
  this.vBadgeInfo = new Taf.Vector(new HUYA.BadgeInfo());
  this.lUsingBadgeId = 0;
  this.lUid = 0;
};
HUYA.BadgeInfoListRsp.prototype._clone = function() {
  return new HUYA.BadgeInfoListRsp();
};
HUYA.BadgeInfoListRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.BadgeInfoListRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.BadgeInfoListRsp.prototype.writeTo = function(t) {
  t.writeVector(0, this.vBadgeInfo);
  t.writeInt64(1, this.lUsingBadgeId);
  t.writeInt64(2, this.lUid);
};
HUYA.BadgeInfoListRsp.prototype.readFrom = function(t) {
  this.vBadgeInfo = t.readVector(0, false, this.vBadgeInfo);
  this.lUsingBadgeId = t.readInt64(1, false, this.lUsingBadgeId);
  this.lUid = t.readInt64(2, false, this.lUid);
};
HUYA.EnterPushInfo = function() {
  this.tNobleInfo = new HUYA.NobleInfo();
};
HUYA.EnterPushInfo.prototype._clone = function() {
  return new HUYA.EnterPushInfo();
};
HUYA.EnterPushInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.EnterPushInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.EnterPushInfo.prototype.writeTo = function(t) {
  t.writeStruct(1, this.tNobleInfo);
};
HUYA.EnterPushInfo.prototype.readFrom = function(t) {
  this.tNobleInfo = t.readStruct(1, false, this.tNobleInfo);
};
HUYA.GameAdvertisement = function() {
  this.sGameUrl = '';
  this.sPCLogoUrl = '';
  this.iPCLogoHeight = 0;
  this.sGameAdName = '';
  this.iStatus = 0;
  this.sWebLogoUrl = '';
  this.lID = 0;
  this.sActivityName = '';
  this.sAppLogoUrl = '';
};
HUYA.GameAdvertisement.prototype._clone = function() {
  return new HUYA.GameAdvertisement();
};
HUYA.GameAdvertisement.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GameAdvertisement.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GameAdvertisement.prototype.writeTo = function(t) {
  t.writeString(0, this.sGameUrl);
  t.writeString(1, this.sPCLogoUrl);
  t.writeInt32(2, this.iPCLogoHeight);
  t.writeString(3, this.sGameAdName);
  t.writeInt32(4, this.iStatus);
  t.writeString(5, this.sWebLogoUrl);
  t.writeInt64(6, this.lID);
  t.writeString(7, this.sActivityName);
  t.writeString(8, this.sAppLogoUrl);
};
HUYA.GameAdvertisement.prototype.readFrom = function(t) {
  this.sGameUrl = t.readString(0, false, this.sGameUrl);
  this.sPCLogoUrl = t.readString(1, false, this.sPCLogoUrl);
  this.iPCLogoHeight = t.readInt32(2, false, this.iPCLogoHeight);
  this.sGameAdName = t.readString(3, false, this.sGameAdName);
  this.iStatus = t.readInt32(4, false, this.iStatus);
  this.sWebLogoUrl = t.readString(5, false, this.sWebLogoUrl);
  this.lID = t.readInt64(6, false, this.lID);
  this.sActivityName = t.readString(7, false, this.sActivityName);
  this.sAppLogoUrl = t.readString(8, false, this.sAppLogoUrl);
};
HUYA.AdvanceUserEnterNotice = function() {
  this.lUid = 0;
  this.sNickName = '';
  this.iWeekRank = 0;
  this.iGuardLevel = 0;
  this.iNobleLevel = 0;
  this.bFromNearby = false;
  this.dDistance = 0;
  this.sLocation = '';
  this.lPid = 0;
};
HUYA.AdvanceUserEnterNotice.prototype._clone = function() {
  return new HUYA.AdvanceUserEnterNotice();
};
HUYA.AdvanceUserEnterNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.AdvanceUserEnterNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.AdvanceUserEnterNotice.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeString(1, this.sNickName);
  t.writeInt32(2, this.iWeekRank);
  t.writeInt32(3, this.iGuardLevel);
  t.writeInt32(4, this.iNobleLevel);
  t.writeBoolean(5, this.bFromNearby);
  t.writeDouble(6, this.dDistance);
  t.writeString(7, this.sLocation);
  t.writeInt64(8, this.lPid);
};
HUYA.AdvanceUserEnterNotice.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.sNickName = t.readString(1, false, this.sNickName);
  this.iWeekRank = t.readInt32(2, false, this.iWeekRank);
  this.iGuardLevel = t.readInt32(3, false, this.iGuardLevel);
  this.iNobleLevel = t.readInt32(4, false, this.iNobleLevel);
  this.bFromNearby = t.readBoolean(5, false, this.bFromNearby);
  this.dDistance = t.readDouble(6, false, this.dDistance);
  this.sLocation = t.readString(7, false, this.sLocation);
  this.lPid = t.readInt64(8, false, this.lPid);
};
HUYA.FansRankListRsp = function() {
  this.lBadgeId = 0;
  this.sBadgeName = '';
  this.vFansRankItem = new Taf.Vector(new HUYA.FansRankItem());
};
HUYA.FansRankListRsp.prototype._clone = function() {
  return new HUYA.FansRankListRsp();
};
HUYA.FansRankListRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.FansRankListRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.FansRankListRsp.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lBadgeId);
  t.writeString(1, this.sBadgeName);
  t.writeVector(2, this.vFansRankItem);
};
HUYA.FansRankListRsp.prototype.readFrom = function(t) {
  this.lBadgeId = t.readInt64(0, false, this.lBadgeId);
  this.sBadgeName = t.readString(1, false, this.sBadgeName);
  this.vFansRankItem = t.readVector(2, false, this.vFansRankItem);
};
HUYA.UserGiftNotice = function() {
  this.tFansGiftInfo = new HUYA.GiftInfo();
  this.tSuperPupleGiftInfo = new HUYA.GiftInfo();
};
HUYA.UserGiftNotice.prototype._clone = function() {
  return new HUYA.UserGiftNotice();
};
HUYA.UserGiftNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.UserGiftNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.UserGiftNotice.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tFansGiftInfo);
  t.writeStruct(1, this.tSuperPupleGiftInfo);
};
HUYA.UserGiftNotice.prototype.readFrom = function(t) {
  this.tFansGiftInfo = t.readStruct(0, false, this.tFansGiftInfo);
  this.tSuperPupleGiftInfo = t.readStruct(1, false, this.tSuperPupleGiftInfo);
};
HUYA.GrandCeremonyChampionPresenter = function() {
  this.lUid = 0;
  this.sNick = '';
};
HUYA.GrandCeremonyChampionPresenter.prototype._clone = function() {
  return new HUYA.GrandCeremonyChampionPresenter();
};
HUYA.GrandCeremonyChampionPresenter.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GrandCeremonyChampionPresenter.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GrandCeremonyChampionPresenter.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeString(1, this.sNick);
};
HUYA.GrandCeremonyChampionPresenter.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.sNick = t.readString(1, false, this.sNick);
};
HUYA.FansRankItem = function() {
  this.lUid = 0;
  this.sNickName = '';
  this.iScore = 0;
  this.iLevel = 0;
};
HUYA.FansRankItem.prototype._clone = function() {
  return new HUYA.FansRankItem();
};
HUYA.FansRankItem.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.FansRankItem.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.FansRankItem.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeString(1, this.sNickName);
  t.writeInt32(2, this.iScore);
  t.writeInt32(3, this.iLevel);
};
HUYA.FansRankItem.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.sNickName = t.readString(1, false, this.sNickName);
  this.iScore = t.readInt32(2, false, this.iScore);
  this.iLevel = t.readInt32(3, false, this.iLevel);
};
HUYA.GuardInfo = function() {
  this.lUid = 0;
  this.lPid = 0;
  this.iGuardLevel = 0;
  this.lEndTime = 0;
};
HUYA.GuardInfo.prototype._clone = function() {
  return new HUYA.GuardInfo();
};
HUYA.GuardInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GuardInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GuardInfo.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeInt64(1, this.lPid);
  t.writeInt32(2, this.iGuardLevel);
  t.writeInt64(3, this.lEndTime);
};
HUYA.GuardInfo.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.lPid = t.readInt64(1, false, this.lPid);
  this.iGuardLevel = t.readInt32(2, false, this.iGuardLevel);
  this.lEndTime = t.readInt64(3, false, this.lEndTime);
};
HUYA.GetLivingInfoReq = function() {
  this.tId = new HUYA.UserId();
  this.lTopSid = 0;
  this.lSubSid = 0;
  this.lPresenterUid = 0;
  this.sTraceSource = '';
};
HUYA.GetLivingInfoReq.prototype._clone = function() {
  return new HUYA.GetLivingInfoReq();
};
HUYA.GetLivingInfoReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetLivingInfoReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetLivingInfoReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeInt64(1, this.lTopSid);
  t.writeInt64(2, this.lSubSid);
  t.writeInt64(3, this.lPresenterUid);
  t.writeString(4, this.sTraceSource);
};
HUYA.GetLivingInfoReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.lTopSid = t.readInt64(1, false, this.lTopSid);
  this.lSubSid = t.readInt64(2, false, this.lSubSid);
  this.lPresenterUid = t.readInt64(3, false, this.lPresenterUid);
  this.sTraceSource = t.readString(4, false, this.sTraceSource);
};
HUYA.GetLivingInfoRsp = function() {
  this.bIsLiving = 0;
  this.tNotice = new HUYA.BeginLiveNotice();
  this.tStreamSettingNotice = new HUYA.StreamSettingNotice();
  this.bIsSelfLiving = 0;
};
HUYA.GetLivingInfoRsp.prototype._clone = function() {
  return new HUYA.GetLivingInfoRsp();
};
HUYA.GetLivingInfoRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetLivingInfoRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetLivingInfoRsp.prototype.writeTo = function(t) {
  t.writeInt32(0, this.bIsLiving);
  t.writeStruct(1, this.tNotice);
  t.writeStruct(2, this.tStreamSettingNotice);
  t.writeInt32(3, this.bIsSelfLiving);
};
HUYA.GetLivingInfoRsp.prototype.readFrom = function(t) {
  this.bIsLiving = t.readInt32(0, false, this.bIsLiving);
  this.tNotice = t.readStruct(1, false, this.tNotice);
  this.tStreamSettingNotice = t.readStruct(2, false, this.tStreamSettingNotice);
  this.bIsSelfLiving = t.readInt32(3, false, this.bIsSelfLiving);
};
HUYA.StreamInfo = function() {
  this.sCdnType = '';
  this.iIsMaster = 0;
  this.lChannelId = 0;
  this.lSubChannelId = 0;
  this.lPresenterUid = 0;
  this.sStreamName = '';
  this.sFlvUrl = '';
  this.sFlvUrlSuffix = '';
  this.sFlvAntiCode = '';
  this.sHlsUrl = '';
  this.sHlsUrlSuffix = '';
  this.sHlsAntiCode = '';
  this.iLineIndex = 0;
  this.iIsMultiStream = 0;
  this.iPCPriorityRate = 0;
  this.iWebPriorityRate = 0;
  this.iMobilePriorityRate = 0;
  this.vFlvIPList = new Taf.Vector(new Taf.STRING());
  this.iIsP2PSupport = 0;
  this.sP2pUrl = '';
  this.sP2pUrlSuffix = '';
  this.sP2pAntiCode = '';
  this.lFreeFlag = 0;
};
HUYA.StreamInfo.prototype._clone = function() {
  return new HUYA.StreamInfo();
};
HUYA.StreamInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.StreamInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.StreamInfo.prototype.writeTo = function(t) {
  t.writeString(0, this.sCdnType);
  t.writeInt32(1, this.iIsMaster);
  t.writeInt64(2, this.lChannelId);
  t.writeInt64(3, this.lSubChannelId);
  t.writeInt64(4, this.lPresenterUid);
  t.writeString(5, this.sStreamName);
  t.writeString(6, this.sFlvUrl);
  t.writeString(7, this.sFlvUrlSuffix);
  t.writeString(8, this.sFlvAntiCode);
  t.writeString(9, this.sHlsUrl);
  t.writeString(10, this.sHlsUrlSuffix);
  t.writeString(11, this.sHlsAntiCode);
  t.writeInt32(12, this.iLineIndex);
  t.writeInt32(13, this.iIsMultiStream);
  t.writeInt32(14, this.iPCPriorityRate);
  t.writeInt32(15, this.iWebPriorityRate);
  t.writeInt32(16, this.iMobilePriorityRate);
  t.writeVector(17, this.vFlvIPList);
  t.writeInt32(18, this.iIsP2PSupport);
  t.writeString(19, this.sP2pUrl);
  t.writeString(20, this.sP2pUrlSuffix);
  t.writeString(21, this.sP2pAntiCode);
  t.writeInt64(22, this.lFreeFlag);
};
HUYA.StreamInfo.prototype.readFrom = function(t) {
  this.sCdnType = t.readString(0, false, this.sCdnType);
  this.iIsMaster = t.readInt32(1, false, this.iIsMaster);
  this.lChannelId = t.readInt64(2, false, this.lChannelId);
  this.lSubChannelId = t.readInt64(3, false, this.lSubChannelId);
  this.lPresenterUid = t.readInt64(4, false, this.lPresenterUid);
  this.sStreamName = t.readString(5, false, this.sStreamName);
  this.sFlvUrl = t.readString(6, false, this.sFlvUrl);
  this.sFlvUrlSuffix = t.readString(7, false, this.sFlvUrlSuffix);
  this.sFlvAntiCode = t.readString(8, false, this.sFlvAntiCode);
  this.sHlsUrl = t.readString(9, false, this.sHlsUrl);
  this.sHlsUrlSuffix = t.readString(10, false, this.sHlsUrlSuffix);
  this.sHlsAntiCode = t.readString(11, false, this.sHlsAntiCode);
  this.iLineIndex = t.readInt32(12, false, this.iLineIndex);
  this.iIsMultiStream = t.readInt32(13, false, this.iIsMultiStream);
  this.iPCPriorityRate = t.readInt32(14, false, this.iPCPriorityRate);
  this.iWebPriorityRate = t.readInt32(15, false, this.iWebPriorityRate);
  this.iMobilePriorityRate = t.readInt32(16, false, this.iMobilePriorityRate);
  this.vFlvIPList = t.readVector(17, false, this.vFlvIPList);
  this.iIsP2PSupport = t.readInt32(18, false, this.iIsP2PSupport);
  this.sP2pUrl = t.readString(19, false, this.sP2pUrl);
  this.sP2pUrlSuffix = t.readString(20, false, this.sP2pUrlSuffix);
  this.sP2pAntiCode = t.readString(21, false, this.sP2pAntiCode);
  this.lFreeFlag = t.readInt64(22, false, this.lFreeFlag);
};
HUYA.MultiStreamInfo = function() {
  this.sDisplayName = '';
  this.iBitRate = 0;
  this.iCodecType = 0;
  this.iCompatibleFlag = 0;
};
HUYA.MultiStreamInfo.prototype._clone = function() {
  return new HUYA.MultiStreamInfo();
};
HUYA.MultiStreamInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.MultiStreamInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.MultiStreamInfo.prototype.writeTo = function(t) {
  t.writeString(0, this.sDisplayName);
  t.writeInt32(1, this.iBitRate);
  t.writeInt32(2, this.iCodecType);
  t.writeInt32(3, this.iCompatibleFlag);
};
HUYA.MultiStreamInfo.prototype.readFrom = function(t) {
  this.sDisplayName = t.readString(0, false, this.sDisplayName);
  this.iBitRate = t.readInt32(1, false, this.iBitRate);
  this.iCodecType = t.readInt32(2, false, this.iCodecType);
  this.iCompatibleFlag = t.readInt32(3, false, this.iCompatibleFlag);
};
HUYA.StreamSettingNotice = function() {
  this.lPresenterUid = 0;
  this.iBitRate = 0;
  this.iResolution = 0;
  this.iFrameRate = 0;
  this.lLiveId = 0;
  this.sDisplayName = '';
};
HUYA.StreamSettingNotice.prototype._clone = function() {
  return new HUYA.StreamSettingNotice();
};
HUYA.StreamSettingNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.StreamSettingNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.StreamSettingNotice.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lPresenterUid);
  t.writeInt32(1, this.iBitRate);
  t.writeInt32(2, this.iResolution);
  t.writeInt32(3, this.iFrameRate);
  t.writeInt64(4, this.lLiveId);
  t.writeString(5, this.sDisplayName);
};
HUYA.StreamSettingNotice.prototype.readFrom = function(t) {
  this.lPresenterUid = t.readInt64(0, false, this.lPresenterUid);
  this.iBitRate = t.readInt32(1, false, this.iBitRate);
  this.iResolution = t.readInt32(2, false, this.iResolution);
  this.iFrameRate = t.readInt32(3, false, this.iFrameRate);
  this.lLiveId = t.readInt64(4, false, this.lLiveId);
  this.sDisplayName = t.readString(5, false, this.sDisplayName);
};
HUYA.FansInfo = function() {
  this.lUid = 0;
  this.lBadgeId = 0;
  this.iBadgeLevel = 0;
  this.iScore = 0;
  this.iVFlag = 0;
};
HUYA.FansInfo.prototype._clone = function() {
  return new HUYA.FansInfo();
};
HUYA.FansInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.FansInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.FansInfo.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeInt64(1, this.lBadgeId);
  t.writeInt32(2, this.iBadgeLevel);
  t.writeInt32(3, this.iScore);
  t.writeInt32(4, this.iVFlag);
};
HUYA.FansInfo.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.lBadgeId = t.readInt64(1, false, this.lBadgeId);
  this.iBadgeLevel = t.readInt32(2, false, this.iBadgeLevel);
  this.iScore = t.readInt32(3, false, this.iScore);
  this.iVFlag = t.readInt32(4, false, this.iVFlag);
};
HUYA.GetCdnTokenReq = function() {
  this.url = '';
  this.cdn_type = '';
  this.stream_name = '';
  this.presenter_uid = 0;
};
HUYA.GetCdnTokenReq.prototype._clone = function() {
  return new HUYA.GetCdnTokenReq();
};
HUYA.GetCdnTokenReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetCdnTokenReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetCdnTokenReq.prototype.writeTo = function(t) {
  t.writeString(0, this.url);
  t.writeString(1, this.cdn_type);
  t.writeString(2, this.stream_name);
  t.writeInt64(3, this.presenter_uid);
};
HUYA.GetCdnTokenReq.prototype.readFrom = function(t) {
  this.url = t.readString(0, false, this.url);
  this.cdn_type = t.readString(1, false, this.cdn_type);
  this.stream_name = t.readString(2, false, this.stream_name);
  this.presenter_uid = t.readInt64(3, false, this.presenter_uid);
};
HUYA.GetCdnTokenRsp = function() {
  this.url = '';
  this.cdn_type = '';
  this.stream_name = '';
  this.presenter_uid = 0;
  this.anti_code = '';
  this.sTime = '';
  this.flv_anti_code = '';
  this.hls_anti_code = '';
};
HUYA.GetCdnTokenRsp.prototype._clone = function() {
  return new HUYA.GetCdnTokenRsp();
};
HUYA.GetCdnTokenRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetCdnTokenRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetCdnTokenRsp.prototype.writeTo = function(t) {
  t.writeString(0, this.url);
  t.writeString(1, this.cdn_type);
  t.writeString(2, this.stream_name);
  t.writeInt64(3, this.presenter_uid);
  t.writeString(4, this.anti_code);
  t.writeString(5, this.sTime);
  t.writeString(6, this.flv_anti_code);
  t.writeString(7, this.hls_anti_code);
};
HUYA.GetCdnTokenRsp.prototype.readFrom = function(t) {
  this.url = t.readString(0, false, this.url);
  this.cdn_type = t.readString(1, false, this.cdn_type);
  this.stream_name = t.readString(2, false, this.stream_name);
  this.presenter_uid = t.readInt64(3, false, this.presenter_uid);
  this.anti_code = t.readString(4, false, this.anti_code);
  this.sTime = t.readString(5, false, this.sTime);
  this.flv_anti_code = t.readString(6, false, this.flv_anti_code);
  this.hls_anti_code = t.readString(7, false, this.hls_anti_code);
};
HUYA.LiveLaunchReq = function() {
  this.tId = new HUYA.UserId();
  this.tLiveUB = new HUYA.LiveUserbase();
};
HUYA.LiveLaunchReq.prototype._clone = function() {
  return new HUYA.LiveLaunchReq();
};
HUYA.LiveLaunchReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.LiveLaunchReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.LiveLaunchReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeStruct(1, this.tLiveUB);
};
HUYA.LiveLaunchReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.tLiveUB = t.readStruct(1, false, this.tLiveUB);
};
HUYA.LiveLaunchRsp = function() {
  this.sGuid = '';
  this.iTime = 0;
  this.vProxyList = new Taf.Vector(new HUYA.LiveProxyValue());
  this.eAccess = 0;
  this.sClientIp = '';
};
HUYA.LiveLaunchRsp.prototype._clone = function() {
  return new HUYA.LiveLaunchRsp();
};
HUYA.LiveLaunchRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.LiveLaunchRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.LiveLaunchRsp.prototype.writeTo = function(t) {
  t.writeString(0, this.sGuid);
  t.writeInt32(1, this.iTime);
  t.writeVector(2, this.vProxyList);
  t.writeInt32(3, this.eAccess);
  t.writeString(4, this.sClientIp);
};
HUYA.LiveLaunchRsp.prototype.readFrom = function(t) {
  this.sGuid = t.readString(0, false, this.sGuid);
  this.iTime = t.readInt32(1, false, this.iTime);
  this.vProxyList = t.readVector(2, false, this.vProxyList);
  this.eAccess = t.readInt32(3, false, this.eAccess);
  this.sClientIp = t.readString(4, false, this.sClientIp);
};
HUYA.LiveAppUAEx = function() {
  this.sIMEI = '';
  this.sAPN = '';
  this.sNetType = '';
  this.sDeviceId = '';
};
HUYA.LiveAppUAEx.prototype._clone = function() {
  return new HUYA.LiveAppUAEx();
};
HUYA.LiveAppUAEx.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.LiveAppUAEx.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.LiveAppUAEx.prototype.writeTo = function(t) {
  t.writeString(1, this.sIMEI);
  t.writeString(2, this.sAPN);
  t.writeString(3, this.sNetType);
  t.writeString(4, this.sDeviceId);
};
HUYA.LiveAppUAEx.prototype.readFrom = function(t) {
  this.sIMEI = t.readString(1, false, this.sIMEI);
  this.sAPN = t.readString(2, false, this.sAPN);
  this.sNetType = t.readString(3, false, this.sNetType);
  this.sDeviceId = t.readString(4, false, this.sDeviceId);
};
HUYA.LiveUserbase = function() {
  this.eSource = 0;
  this.eType = 0;
  this.tUAEx = new HUYA.LiveAppUAEx();
};
HUYA.LiveUserbase.prototype._clone = function() {
  return new HUYA.LiveUserbase();
};
HUYA.LiveUserbase.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.LiveUserbase.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.LiveUserbase.prototype.writeTo = function(t) {
  t.writeInt32(0, this.eSource);
  t.writeInt32(1, this.eType);
  t.writeStruct(2, this.tUAEx);
};
HUYA.LiveUserbase.prototype.readFrom = function(t) {
  this.eSource = t.readInt32(0, false, this.eSource);
  this.eType = t.readInt32(1, false, this.eType);
  this.tUAEx = t.readStruct(2, false, this.tUAEx);
};
HUYA.LiveProxyValue = function() {
  this.eProxyType = 0;
  this.sProxy = new Taf.Vector(new Taf.STRING());
};
HUYA.LiveProxyValue.prototype._clone = function() {
  return new HUYA.LiveProxyValue();
};
HUYA.LiveProxyValue.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.LiveProxyValue.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.LiveProxyValue.prototype.writeTo = function(t) {
  t.writeInt32(0, this.eProxyType);
  t.writeVector(1, this.sProxy);
};
HUYA.LiveProxyValue.prototype.readFrom = function(t) {
  this.eProxyType = t.readInt32(0, false, this.eProxyType);
  this.sProxy = t.readVector(1, false, this.sProxy);
};
HUYA.SendCardPackageItemReq = function() {
  this.tId = new HUYA.UserId();
  this.lSid = 0;
  this.lSubSid = 0;
  this.iShowFreeitemInfo = 0;
  this.iItemType = 0;
  this.iItemCount = 0;
  this.lPresenterUid = 0;
  this.sPayId = '';
  this.sSendContent = '';
  this.sSenderNick = '';
  this.sPresenterNick = '';
  this.iPayPloy = 0;
  this.iItemCountByGroup = 0;
  this.iItemGroup = 0;
  this.iSuperPupleLevel = 0;
  this.iFromType = 0;
  this.sExpand = '';
  this.sToken = '';
  this.iTemplateType = 0;
  this.sTokencaKey = '';
  this.sPassport = '';
  this.iSenderShortSid = 0;
  this.iPayByFreeItem = 0;
  this.tExtUser = new HUYA.ExternalUser();
  this.iEventType = 0;
};
HUYA.SendCardPackageItemReq.prototype._clone = function() {
  return new HUYA.SendCardPackageItemReq();
};
HUYA.SendCardPackageItemReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.SendCardPackageItemReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.SendCardPackageItemReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeInt64(1, this.lSid);
  t.writeInt64(2, this.lSubSid);
  t.writeInt32(3, this.iShowFreeitemInfo);
  t.writeInt32(4, this.iItemType);
  t.writeInt32(5, this.iItemCount);
  t.writeInt64(6, this.lPresenterUid);
  t.writeString(7, this.sPayId);
  t.writeString(9, this.sSendContent);
  t.writeString(10, this.sSenderNick);
  t.writeString(11, this.sPresenterNick);
  t.writeInt32(12, this.iPayPloy);
  t.writeInt32(13, this.iItemCountByGroup);
  t.writeInt32(14, this.iItemGroup);
  t.writeInt32(15, this.iSuperPupleLevel);
  t.writeInt32(16, this.iFromType);
  t.writeString(17, this.sExpand);
  t.writeString(18, this.sToken);
  t.writeInt32(19, this.iTemplateType);
  t.writeString(20, this.sTokencaKey);
  t.writeString(21, this.sPassport);
  t.writeInt64(22, this.iSenderShortSid);
  t.writeInt32(23, this.iPayByFreeItem);
  t.writeStruct(24, this.tExtUser);
  t.writeInt16(25, this.iEventType);
};
HUYA.SendCardPackageItemReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.lSid = t.readInt64(1, false, this.lSid);
  this.lSubSid = t.readInt64(2, false, this.lSubSid);
  this.iShowFreeitemInfo = t.readInt32(3, false, this.iShowFreeitemInfo);
  this.iItemType = t.readInt32(4, false, this.iItemType);
  this.iItemCount = t.readInt32(5, false, this.iItemCount);
  this.lPresenterUid = t.readInt64(6, false, this.lPresenterUid);
  this.sPayId = t.readString(7, false, this.sPayId);
  this.sSendContent = t.readString(9, false, this.sSendContent);
  this.sSenderNick = t.readString(10, false, this.sSenderNick);
  this.sPresenterNick = t.readString(11, false, this.sPresenterNick);
  this.iPayPloy = t.readInt32(12, false, this.iPayPloy);
  this.iItemCountByGroup = t.readInt32(13, false, this.iItemCountByGroup);
  this.iItemGroup = t.readInt32(14, false, this.iItemGroup);
  this.iSuperPupleLevel = t.readInt32(15, false, this.iSuperPupleLevel);
  this.iFromType = t.readInt32(16, false, this.iFromType);
  this.sExpand = t.readString(17, false, this.sExpand);
  this.sToken = t.readString(18, false, this.sToken);
  this.iTemplateType = t.readInt32(19, false, this.iTemplateType);
  this.sTokencaKey = t.readString(20, false, this.sTokencaKey);
  this.sPassport = t.readString(21, false, this.sPassport);
  this.iSenderShortSid = t.readInt64(22, false, this.iSenderShortSid);
  this.iPayByFreeItem = t.readInt32(23, false, this.iPayByFreeItem);
  this.tExtUser = t.readStruct(24, false, this.tExtUser);
  this.iEventType = t.readInt16(25, false, this.iEventType);
};
HUYA.SendCardPackageItemRsp = function() {
  this.iPayRespCode = 0;
  this.iItemType = 0;
  this.iItemCount = 0;
  this.strPayId = '';
  this.strPayConfirmUrl = '';
  this.strSendContent = '';
  this.iItemCountByGroup = 0;
  this.iItemGroup = 0;
  this.lPresenterUid = 0;
  this.sExpand = '';
  this.strPayItemInfo = '';
  this.iPayType = 0;
};
HUYA.SendCardPackageItemRsp.prototype._clone = function() {
  return new HUYA.SendCardPackageItemRsp();
};
HUYA.SendCardPackageItemRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.SendCardPackageItemRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.SendCardPackageItemRsp.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iPayRespCode);
  t.writeInt32(1, this.iItemType);
  t.writeInt32(2, this.iItemCount);
  t.writeString(3, this.strPayId);
  t.writeString(4, this.strPayConfirmUrl);
  t.writeString(5, this.strSendContent);
  t.writeInt32(6, this.iItemCountByGroup);
  t.writeInt32(7, this.iItemGroup);
  t.writeInt64(8, this.lPresenterUid);
  t.writeString(9, this.sExpand);
  t.writeString(10, this.strPayItemInfo);
  t.writeInt32(11, this.iPayType);
};
HUYA.SendCardPackageItemRsp.prototype.readFrom = function(t) {
  this.iPayRespCode = t.readInt32(0, false, this.iPayRespCode);
  this.iItemType = t.readInt32(1, false, this.iItemType);
  this.iItemCount = t.readInt32(2, false, this.iItemCount);
  this.strPayId = t.readString(3, false, this.strPayId);
  this.strPayConfirmUrl = t.readString(4, false, this.strPayConfirmUrl);
  this.strSendContent = t.readString(5, false, this.strSendContent);
  this.iItemCountByGroup = t.readInt32(6, false, this.iItemCountByGroup);
  this.iItemGroup = t.readInt32(7, false, this.iItemGroup);
  this.lPresenterUid = t.readInt64(8, false, this.lPresenterUid);
  this.sExpand = t.readString(9, false, this.sExpand);
  this.strPayItemInfo = t.readString(10, false, this.strPayItemInfo);
  this.iPayType = t.readInt32(11, false, this.iPayType);
};
HUYA.GetVerificationStatusReq = function() {
  this.tId = new HUYA.UserId();
};
HUYA.GetVerificationStatusReq.prototype._clone = function() {
  return new HUYA.GetVerificationStatusReq();
};
HUYA.GetVerificationStatusReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetVerificationStatusReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetVerificationStatusReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
};
HUYA.GetVerificationStatusReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
};
HUYA.GetFirstRechargePkgStatusReq = function() {
  this.tId = new HUYA.UserId();
};
HUYA.GetFirstRechargePkgStatusReq.prototype._clone = function() {
  return new HUYA.GetFirstRechargePkgStatusReq();
};
HUYA.GetFirstRechargePkgStatusReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetFirstRechargePkgStatusReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetFirstRechargePkgStatusReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
};
HUYA.GetFirstRechargePkgStatusReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
};
HUYA.MuteRoomUserReq = function() {
  this.tId = new HUYA.UserId();
  this.lUid = 0;
  this.sText = '';
  this.lPresenterUid = 0;
  this.lSubcid = 0;
  this.iMutedTime = 0;
  this.iMutedAction = 0;
  this.iReasonType = 0;
  this.sReason = '';
};
HUYA.MuteRoomUserReq.prototype._clone = function() {
  return new HUYA.MuteRoomUserReq();
};
HUYA.MuteRoomUserReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.MuteRoomUserReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.MuteRoomUserReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeInt64(1, this.lUid);
  t.writeString(2, this.sText);
  t.writeInt64(3, this.lPresenterUid);
  t.writeInt64(4, this.lSubcid);
  t.writeInt32(5, this.iMutedTime);
  t.writeInt32(6, this.iMutedAction);
  t.writeInt32(7, this.iReasonType);
  t.writeString(8, this.sReason);
};
HUYA.MuteRoomUserReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.lUid = t.readInt64(1, false, this.lUid);
  this.sText = t.readString(2, false, this.sText);
  this.lPresenterUid = t.readInt64(3, false, this.lPresenterUid);
  this.lSubcid = t.readInt64(4, false, this.lSubcid);
  this.iMutedTime = t.readInt32(5, false, this.iMutedTime);
  this.iMutedAction = t.readInt32(6, false, this.iMutedAction);
  this.iReasonType = t.readInt32(7, false, this.iReasonType);
  this.sReason = t.readString(8, false, this.sReason);
};
HUYA.MuteRoomUserRsp = function() {
  this.iRetCode = 0;
  this.sMsg = '';
};
HUYA.MuteRoomUserRsp.prototype._clone = function() {
  return new HUYA.MuteRoomUserRsp();
};
HUYA.MuteRoomUserRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.MuteRoomUserRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.MuteRoomUserRsp.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iRetCode);
  t.writeString(1, this.sMsg);
};
HUYA.MuteRoomUserRsp.prototype.readFrom = function(t) {
  this.iRetCode = t.readInt32(0, false, this.iRetCode);
  this.sMsg = t.readString(1, false, this.sMsg);
};
HUYA.GetVerificationStatusResp = function() {
  this.iStatus = 0;
  this.lExpenditure = 0;
};
HUYA.GetVerificationStatusResp.prototype._clone = function() {
  return new HUYA.GetVerificationStatusResp();
};
HUYA.GetVerificationStatusResp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetVerificationStatusResp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetVerificationStatusResp.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iStatus);
  t.writeInt64(1, this.lExpenditure);
};
HUYA.GetVerificationStatusResp.prototype.readFrom = function(t) {
  this.iStatus = t.readInt32(0, false, this.iStatus);
  this.lExpenditure = t.readInt64(1, false, this.lExpenditure);
};
HUYA.GetFirstRechargePkgStatusResp = function() {
  this.iStatus = 0;
  this.iFetch = 0;
  this.sTip = '';
};
HUYA.GetFirstRechargePkgStatusResp.prototype._clone = function() {
  return new HUYA.GetFirstRechargePkgStatusResp();
};
HUYA.GetFirstRechargePkgStatusResp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetFirstRechargePkgStatusResp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetFirstRechargePkgStatusResp.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iStatus);
  t.writeInt32(1, this.iFetch);
  t.writeString(2, this.sTip);
};
HUYA.GetFirstRechargePkgStatusResp.prototype.readFrom = function(t) {
  this.iStatus = t.readInt32(0, false, this.iStatus);
  this.iFetch = t.readInt32(1, false, this.iFetch);
  this.sTip = t.readString(2, false, this.sTip);
};
HUYA.SendItemSubBroadcastPacket = function() {
  this.iItemType = 0;
  this.strPayId = '';
  this.iItemCount = 0;
  this.lPresenterUid = 0;
  this.lSenderUid = 0;
  this.sPresenterNick = '';
  this.sSenderNick = '';
  this.sSendContent = '';
  this.iItemCountByGroup = 0;
  this.iItemGroup = 0;
  this.iSuperPupleLevel = 0;
  this.iComboScore = 0;
  this.iDisplayInfo = 0;
  this.iEffectType = 0;
  this.iSenderIcon = '';
  this.iPresenterIcon = '';
  this.iTemplateType = 0;
  this.sExpand = '';
  this.bBusi = false;
  this.iColorEffectType = 0;
  this.sPropsName = '';
};
HUYA.SendItemSubBroadcastPacket.prototype._clone = function() {
  return new HUYA.SendItemSubBroadcastPacket();
};
HUYA.SendItemSubBroadcastPacket.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.SendItemSubBroadcastPacket.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.SendItemSubBroadcastPacket.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iItemType);
  t.writeString(1, this.strPayId);
  t.writeInt32(2, this.iItemCount);
  t.writeInt64(3, this.lPresenterUid);
  t.writeInt64(4, this.lSenderUid);
  t.writeString(5, this.sPresenterNick);
  t.writeString(6, this.sSenderNick);
  t.writeString(7, this.sSendContent);
  t.writeInt32(8, this.iItemCountByGroup);
  t.writeInt32(9, this.iItemGroup);
  t.writeInt32(10, this.iSuperPupleLevel);
  t.writeInt32(11, this.iComboScore);
  t.writeInt32(12, this.iDisplayInfo);
  t.writeInt32(13, this.iEffectType);
  t.writeString(14, this.iSenderIcon);
  t.writeString(15, this.iPresenterIcon);
  t.writeInt32(16, this.iTemplateType);
  t.writeString(17, this.sExpand);
  t.writeBoolean(18, this.bBusi);
  t.writeInt32(19, this.iColorEffectType);
  t.writeString(20, this.sPropsName);
};
HUYA.SendItemSubBroadcastPacket.prototype.readFrom = function(t) {
  this.iItemType = t.readInt32(0, false, this.iItemType);
  this.strPayId = t.readString(1, false, this.strPayId);
  this.iItemCount = t.readInt32(2, false, this.iItemCount);
  this.lPresenterUid = t.readInt64(3, false, this.lPresenterUid);
  this.lSenderUid = t.readInt64(4, false, this.lSenderUid);
  this.sPresenterNick = t.readString(5, false, this.sPresenterNick);
  this.sSenderNick = t.readString(6, false, this.sSenderNick);
  this.sSendContent = t.readString(7, false, this.sSendContent);
  this.iItemCountByGroup = t.readInt32(8, false, this.iItemCountByGroup);
  this.iItemGroup = t.readInt32(9, false, this.iItemGroup);
  this.iSuperPupleLevel = t.readInt32(10, false, this.iSuperPupleLevel);
  this.iComboScore = t.readInt32(11, false, this.iComboScore);
  this.iDisplayInfo = t.readInt32(12, false, this.iDisplayInfo);
  this.iEffectType = t.readInt32(13, false, this.iEffectType);
  this.iSenderIcon = t.readString(14, false, this.iSenderIcon);
  this.iPresenterIcon = t.readString(15, false, this.iPresenterIcon);
  this.iTemplateType = t.readInt32(16, false, this.iTemplateType);
  this.sExpand = t.readString(17, false, this.sExpand);
  this.bBusi = t.readBoolean(18, false, this.bBusi);
  this.iColorEffectType = t.readInt32(19, false, this.iColorEffectType);
  this.sPropsName = t.readString(20, false, this.sPropsName);
};
HUYA.SendItemNoticeWordBroadcastPacket = function() {
  this.iItemType = 0;
  this.iItemCount = 0;
  this.lSenderSid = 0;
  this.lSenderUid = 0;
  this.sSenderNick = '';
  this.lPresenterUid = 0;
  this.sPresenterNick = '';
  this.lNoticeChannelCount = 0;
  this.iItemCountByGroup = 0;
  this.iItemGroup = 0;
  this.iDisplayInfo = 0;
  this.iSuperPupleLevel = 0;
  this.iTemplateType = 0;
  this.sExpand = '';
  this.bBusi = false;
  this.iShowTime = 0;
  this.lPresenterYY = 0;
  this.lSid = 0;
  this.lSubSid = 0;
};
HUYA.SendItemNoticeWordBroadcastPacket.prototype._clone = function() {
  return new HUYA.SendItemNoticeWordBroadcastPacket();
};
HUYA.SendItemNoticeWordBroadcastPacket.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.SendItemNoticeWordBroadcastPacket.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.SendItemNoticeWordBroadcastPacket.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iItemType);
  t.writeInt32(1, this.iItemCount);
  t.writeInt64(2, this.lSenderSid);
  t.writeInt64(3, this.lSenderUid);
  t.writeString(4, this.sSenderNick);
  t.writeInt64(5, this.lPresenterUid);
  t.writeString(6, this.sPresenterNick);
  t.writeInt64(7, this.lNoticeChannelCount);
  t.writeInt32(8, this.iItemCountByGroup);
  t.writeInt32(9, this.iItemGroup);
  t.writeInt32(10, this.iDisplayInfo);
  t.writeInt32(11, this.iSuperPupleLevel);
  t.writeInt32(12, this.iTemplateType);
  t.writeString(13, this.sExpand);
  t.writeBoolean(14, this.bBusi);
  t.writeInt32(15, this.iShowTime);
  t.writeInt64(16, this.lPresenterYY);
  t.writeInt64(17, this.lSid);
  t.writeInt64(18, this.lSubSid);
};
HUYA.SendItemNoticeWordBroadcastPacket.prototype.readFrom = function(t) {
  this.iItemType = t.readInt32(0, false, this.iItemType);
  this.iItemCount = t.readInt32(1, false, this.iItemCount);
  this.lSenderSid = t.readInt64(2, false, this.lSenderSid);
  this.lSenderUid = t.readInt64(3, false, this.lSenderUid);
  this.sSenderNick = t.readString(4, false, this.sSenderNick);
  this.lPresenterUid = t.readInt64(5, false, this.lPresenterUid);
  this.sPresenterNick = t.readString(6, false, this.sPresenterNick);
  this.lNoticeChannelCount = t.readInt64(7, false, this.lNoticeChannelCount);
  this.iItemCountByGroup = t.readInt32(8, false, this.iItemCountByGroup);
  this.iItemGroup = t.readInt32(9, false, this.iItemGroup);
  this.iDisplayInfo = t.readInt32(10, false, this.iDisplayInfo);
  this.iSuperPupleLevel = t.readInt32(11, false, this.iSuperPupleLevel);
  this.iTemplateType = t.readInt32(12, false, this.iTemplateType);
  this.sExpand = t.readString(13, false, this.sExpand);
  this.bBusi = t.readBoolean(14, false, this.bBusi);
  this.iShowTime = t.readInt32(15, false, this.iShowTime);
  this.lPresenterYY = t.readInt64(16, false, this.lPresenterYY);
  this.lSid = t.readInt64(17, false, this.lSid);
  this.lSubSid = t.readInt64(18, false, this.lSubSid);
};
HUYA.BeginLiveNotice = function() {
  this.lPresenterUid = 0;
  this.iGameId = 0;
  this.sGameName = '';
  this.iRandomRange = 0;
  this.iStreamType = 0;
  this.vStreamInfo = new Taf.Vector(new HUYA.StreamInfo());
  this.vCdnList = new Taf.Vector(new Taf.STRING());
  this.lLiveId = 0;
  this.iPCDefaultBitRate = 0;
  this.iWebDefaultBitRate = 0;
  this.iMobileDefaultBitRate = 0;
  this.lMultiStreamFlag = 0;
  this.sNick = '';
  this.lYYId = 0;
  this.lAttendeeCount = 0;
  this.iCodecType = 0;
  this.iScreenType = 0;
  this.vMultiStreamInfo = new Taf.Vector(new HUYA.MultiStreamInfo());
  this.sLiveDesc = '';
  this.lLiveCompatibleFlag = 0;
  this.sAvatarUrl = '';
  this.iSourceType = 0;
  this.sSubchannelName = '';
  this.sVideoCaptureUrl = '';
  this.iStartTime = 0;
  this.lChannelId = 0;
  this.lSubChannelId = 0;
  this.sLocation = '';
  this.iCdnPolicyLevel = 0;
  this.iGameType = 0;
};
HUYA.BeginLiveNotice.prototype._clone = function() {
  return new HUYA.BeginLiveNotice();
};
HUYA.BeginLiveNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.BeginLiveNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.BeginLiveNotice.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lPresenterUid);
  t.writeInt32(1, this.iGameId);
  t.writeString(2, this.sGameName);
  t.writeInt32(3, this.iRandomRange);
  t.writeInt32(4, this.iStreamType);
  t.writeVector(5, this.vStreamInfo);
  t.writeVector(6, this.vCdnList);
  t.writeInt64(7, this.lLiveId);
  t.writeInt32(8, this.iPCDefaultBitRate);
  t.writeInt32(9, this.iWebDefaultBitRate);
  t.writeInt32(10, this.iMobileDefaultBitRate);
  t.writeInt64(11, this.lMultiStreamFlag);
  t.writeString(12, this.sNick);
  t.writeInt64(13, this.lYYId);
  t.writeInt64(14, this.lAttendeeCount);
  t.writeInt32(15, this.iCodecType);
  t.writeInt32(16, this.iScreenType);
  t.writeVector(17, this.vMultiStreamInfo);
  t.writeString(18, this.sLiveDesc);
  t.writeInt64(19, this.lLiveCompatibleFlag);
  t.writeString(20, this.sAvatarUrl);
  t.writeInt32(21, this.iSourceType);
  t.writeString(22, this.sSubchannelName);
  t.writeString(23, this.sVideoCaptureUrl);
  t.writeInt32(24, this.iStartTime);
  t.writeInt64(25, this.lChannelId);
  t.writeInt64(26, this.lSubChannelId);
  t.writeString(27, this.sLocation);
  t.writeInt32(28, this.iCdnPolicyLevel);
  t.writeInt32(29, this.iGameType);
};
HUYA.BeginLiveNotice.prototype.readFrom = function(t) {
  this.lPresenterUid = t.readInt64(0, false, this.lPresenterUid);
  this.iGameId = t.readInt32(1, false, this.iGameId);
  this.sGameName = t.readString(2, false, this.sGameName);
  this.iRandomRange = t.readInt32(3, false, this.iRandomRange);
  this.iStreamType = t.readInt32(4, false, this.iStreamType);
  this.vStreamInfo = t.readVector(5, false, this.vStreamInfo);
  this.vCdnList = t.readVector(6, false, this.vCdnList);
  this.lLiveId = t.readInt64(7, false, this.lLiveId);
  this.iPCDefaultBitRate = t.readInt32(8, false, this.iPCDefaultBitRate);
  this.iWebDefaultBitRate = t.readInt32(9, false, this.iWebDefaultBitRate);
  this.iMobileDefaultBitRate = t.readInt32(
    10,
    false,
    this.iMobileDefaultBitRate
  );
  this.lMultiStreamFlag = t.readInt64(11, false, this.lMultiStreamFlag);
  this.sNick = t.readString(12, false, this.sNick);
  this.lYYId = t.readInt64(13, false, this.lYYId);
  this.lAttendeeCount = t.readInt64(14, false, this.lAttendeeCount);
  this.iCodecType = t.readInt32(15, false, this.iCodecType);
  this.iScreenType = t.readInt32(16, false, this.iScreenType);
  this.vMultiStreamInfo = t.readVector(17, false, this.vMultiStreamInfo);
  this.sLiveDesc = t.readString(18, false, this.sLiveDesc);
  this.lLiveCompatibleFlag = t.readInt64(19, false, this.lLiveCompatibleFlag);
  this.sAvatarUrl = t.readString(20, false, this.sAvatarUrl);
  this.iSourceType = t.readInt32(21, false, this.iSourceType);
  this.sSubchannelName = t.readString(22, false, this.sSubchannelName);
  this.sVideoCaptureUrl = t.readString(23, false, this.sVideoCaptureUrl);
  this.iStartTime = t.readInt32(24, false, this.iStartTime);
  this.lChannelId = t.readInt64(25, false, this.lChannelId);
  this.lSubChannelId = t.readInt64(26, false, this.lSubChannelId);
  this.sLocation = t.readString(27, false, this.sLocation);
  this.iCdnPolicyLevel = t.readInt32(28, false, this.iCdnPolicyLevel);
  this.iGameType = t.readInt32(29, false, this.iGameType);
};
HUYA.EndLiveNotice = function() {
  this.lPresenterUid = 0;
  this.iReason = 0;
  this.lLiveId = 0;
  this.sReason = '';
};
HUYA.EndLiveNotice.prototype._clone = function() {
  return new HUYA.EndLiveNotice();
};
HUYA.EndLiveNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.EndLiveNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.EndLiveNotice.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lPresenterUid);
  t.writeInt32(1, this.iReason);
  t.writeInt64(2, this.lLiveId);
  t.writeString(3, this.sReason);
};
HUYA.EndLiveNotice.prototype.readFrom = function(t) {
  this.lPresenterUid = t.readInt64(0, false, this.lPresenterUid);
  this.iReason = t.readInt32(1, false, this.iReason);
  this.lLiveId = t.readInt64(2, false, this.lLiveId);
  this.sReason = t.readString(3, false, this.sReason);
};
HUYA.NobleNotice = function() {
  this.tNobleInfo = new HUYA.NobleBase();
};
HUYA.NobleNotice.prototype._clone = function() {
  return new HUYA.NobleNotice();
};
HUYA.NobleNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.NobleNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.NobleNotice.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tNobleInfo);
};
HUYA.NobleNotice.prototype.readFrom = function(t) {
  this.tNobleInfo = t.readStruct(0, false, this.tNobleInfo);
};
HUYA.NobleItem = function() {
  this.iNobleLevel = 0;
  this.lDeadLine = 0;
};
HUYA.NobleItem.prototype._clone = function() {
  return new HUYA.NobleItem();
};
HUYA.NobleItem.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.NobleItem.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.NobleItem.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iNobleLevel);
  t.writeInt64(1, this.lDeadLine);
};
HUYA.NobleItem.prototype.readFrom = function(t) {
  this.iNobleLevel = t.readInt32(0, false, this.iNobleLevel);
  this.lDeadLine = t.readInt64(1, false, this.lDeadLine);
};
HUYA.NobleEnterNotice = function() {
  this.tNobleInfo = new HUYA.NobleBase();
};
HUYA.NobleEnterNotice.prototype._clone = function() {
  return new HUYA.NobleEnterNotice();
};
HUYA.NobleEnterNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.NobleEnterNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.NobleEnterNotice.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tNobleInfo);
};
HUYA.NobleEnterNotice.prototype.readFrom = function(t) {
  this.tNobleInfo = t.readStruct(0, false, this.tNobleInfo);
};
HUYA.NobleSpeakReq = function() {
  this.tUserId = new HUYA.UserId();
  this.lTid = 0;
  this.lSid = 0;
  this.lPid = 0;
  this.sMsg = '';
  this.tSender = new HUYA.SenderItem();
  this.tNoble = new HUYA.NobleItem();
  this.tFans = new HUYA.FansItem();
  this.tVipSimle = new HUYA.VipSmileItem();
  this.tStamp = new HUYA.StampItem();
  this.tMass = new HUYA.MassItem();
  this.mReserver = new Taf.Map(new Taf.STRING(), new Taf.STRING());
};
HUYA.NobleSpeakReq.prototype._clone = function() {
  return new HUYA.NobleSpeakReq();
};
HUYA.NobleSpeakReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.NobleSpeakReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.NobleSpeakReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tUserId);
  t.writeInt64(1, this.lTid);
  t.writeInt64(2, this.lSid);
  t.writeInt64(3, this.lPid);
  t.writeString(4, this.sMsg);
  t.writeStruct(5, this.tSender);
  t.writeStruct(6, this.tNoble);
  t.writeStruct(7, this.tFans);
  t.writeStruct(8, this.tVipSimle);
  t.writeStruct(9, this.tStamp);
  t.writeStruct(10, this.tMass);
  t.writeMap(11, this.mReserver);
};
HUYA.NobleSpeakReq.prototype.readFrom = function(t) {
  this.tUserId = t.readStruct(0, false, this.tUserId);
  this.lTid = t.readInt64(1, false, this.lTid);
  this.lSid = t.readInt64(2, false, this.lSid);
  this.lPid = t.readInt64(3, false, this.lPid);
  this.sMsg = t.readString(4, false, this.sMsg);
  this.tSender = t.readStruct(5, false, this.tSender);
  this.tNoble = t.readStruct(6, false, this.tNoble);
  this.tFans = t.readStruct(7, false, this.tFans);
  this.tVipSimle = t.readStruct(8, false, this.tVipSimle);
  this.tStamp = t.readStruct(9, false, this.tStamp);
  this.tMass = t.readStruct(10, false, this.tMass);
  this.mReserver = t.readMap(11, false, this.mReserver);
};
HUYA.NobleSpeakResp = function() {
  this.iRespCode = 0;
  this.lUid = 0;
  this.lTid = 0;
  this.lSid = 0;
  this.lPid = 0;
};
HUYA.NobleSpeakResp.prototype._clone = function() {
  return new HUYA.NobleSpeakResp();
};
HUYA.NobleSpeakResp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.NobleSpeakResp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.NobleSpeakResp.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iRespCode);
  t.writeInt64(1, this.lUid);
  t.writeInt64(2, this.lTid);
  t.writeInt64(3, this.lSid);
  t.writeInt64(4, this.lPid);
};
HUYA.NobleSpeakResp.prototype.readFrom = function(t) {
  this.iRespCode = t.readInt32(0, false, this.iRespCode);
  this.lUid = t.readInt64(1, false, this.lUid);
  this.lTid = t.readInt64(2, false, this.lTid);
  this.lSid = t.readInt64(3, false, this.lSid);
  this.lPid = t.readInt64(4, false, this.lPid);
};
HUYA.NobleSpeakBrst = function() {
  this.tUserId = new HUYA.UserId();
  this.lTid = 0;
  this.lSid = 0;
  this.lPid = 0;
  this.sMsg = '';
  this.tSender = new HUYA.SenderItem();
  this.tNoble = new HUYA.NobleItem();
  this.tFans = new HUYA.FansItem();
  this.tVipSimle = new HUYA.VipSmileItem();
  this.tStamp = new HUYA.StampItem();
  this.tMass = new HUYA.MassItem();
  this.mReserver = new Taf.Map(new Taf.STRING(), new Taf.STRING());
  this.iChatCache = 0;
  this.iRoomAuditLevel = 0;
};
HUYA.NobleSpeakBrst.prototype._clone = function() {
  return new HUYA.NobleSpeakBrst();
};
HUYA.NobleSpeakBrst.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.NobleSpeakBrst.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.NobleSpeakBrst.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tUserId);
  t.writeInt64(1, this.lTid);
  t.writeInt64(2, this.lSid);
  t.writeInt64(3, this.lPid);
  t.writeString(4, this.sMsg);
  t.writeStruct(5, this.tSender);
  t.writeStruct(6, this.tNoble);
  t.writeStruct(7, this.tFans);
  t.writeStruct(8, this.tVipSimle);
  t.writeStruct(9, this.tStamp);
  t.writeStruct(10, this.tMass);
  t.writeMap(11, this.mReserver);
  t.writeInt32(12, this.iChatCache);
  t.writeInt32(13, this.iRoomAuditLevel);
};
HUYA.NobleSpeakBrst.prototype.readFrom = function(t) {
  this.tUserId = t.readStruct(0, false, this.tUserId);
  this.lTid = t.readInt64(1, false, this.lTid);
  this.lSid = t.readInt64(2, false, this.lSid);
  this.lPid = t.readInt64(3, false, this.lPid);
  this.sMsg = t.readString(4, false, this.sMsg);
  this.tSender = t.readStruct(5, false, this.tSender);
  this.tNoble = t.readStruct(6, false, this.tNoble);
  this.tFans = t.readStruct(7, false, this.tFans);
  this.tVipSimle = t.readStruct(8, false, this.tVipSimle);
  this.tStamp = t.readStruct(9, false, this.tStamp);
  this.tMass = t.readStruct(10, false, this.tMass);
  this.mReserver = t.readMap(11, false, this.mReserver);
  this.iChatCache = t.readInt32(12, false, this.iChatCache);
  this.iRoomAuditLevel = t.readInt32(13, false, this.iRoomAuditLevel);
};
HUYA.SenderItem = function() {
  this.lSenderUid = 0;
  this.lYYid = 0;
  this.iSenderRole = 0;
  this.iSenderGender = 0;
  this.sSenderNick = '';
};
HUYA.SenderItem.prototype._clone = function() {
  return new HUYA.SenderItem();
};
HUYA.SenderItem.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.SenderItem.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.SenderItem.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lSenderUid);
  t.writeInt64(1, this.lYYid);
  t.writeInt32(2, this.iSenderRole);
  t.writeInt32(3, this.iSenderGender);
  t.writeString(4, this.sSenderNick);
};
HUYA.SenderItem.prototype.readFrom = function(t) {
  this.lSenderUid = t.readInt64(0, false, this.lSenderUid);
  this.lYYid = t.readInt64(1, false, this.lYYid);
  this.iSenderRole = t.readInt32(2, false, this.iSenderRole);
  this.iSenderGender = t.readInt32(3, false, this.iSenderGender);
  this.sSenderNick = t.readString(4, false, this.sSenderNick);
};
HUYA.FansItem = function() {
  this.iFansLevel = 0;
  this.sFansNick = '';
  this.sFansPresenterNick = '';
};
HUYA.FansItem.prototype._clone = function() {
  return new HUYA.FansItem();
};
HUYA.FansItem.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.FansItem.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.FansItem.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iFansLevel);
  t.writeString(1, this.sFansNick);
  t.writeString(2, this.sFansPresenterNick);
};
HUYA.FansItem.prototype.readFrom = function(t) {
  this.iFansLevel = t.readInt32(0, false, this.iFansLevel);
  this.sFansNick = t.readString(1, false, this.sFansNick);
  this.sFansPresenterNick = t.readString(2, false, this.sFansPresenterNick);
};
HUYA.VipSmileItem = function() {
  this.sVipSmileKey = '';
  this.sVipSmilePath = '';
};
HUYA.VipSmileItem.prototype._clone = function() {
  return new HUYA.VipSmileItem();
};
HUYA.VipSmileItem.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.VipSmileItem.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.VipSmileItem.prototype.writeTo = function(t) {
  t.writeString(0, this.sVipSmileKey);
  t.writeString(1, this.sVipSmilePath);
};
HUYA.VipSmileItem.prototype.readFrom = function(t) {
  this.sVipSmileKey = t.readString(0, false, this.sVipSmileKey);
  this.sVipSmilePath = t.readString(1, false, this.sVipSmilePath);
};
HUYA.StampItem = function() {
  this.sSealIconPath = '';
  this.sKeyImg = '';
  this.lStampTime = 0;
  this.lStampEndTime = 0;
  this.iValidity = 0;
  this.sStampUserNick = '';
};
HUYA.StampItem.prototype._clone = function() {
  return new HUYA.StampItem();
};
HUYA.StampItem.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.StampItem.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.StampItem.prototype.writeTo = function(t) {
  t.writeString(0, this.sSealIconPath);
  t.writeString(1, this.sKeyImg);
  t.writeInt64(2, this.lStampTime);
  t.writeInt64(3, this.lStampEndTime);
  t.writeInt32(4, this.iValidity);
  t.writeString(5, this.sStampUserNick);
};
HUYA.StampItem.prototype.readFrom = function(t) {
  this.sSealIconPath = t.readString(0, false, this.sSealIconPath);
  this.sKeyImg = t.readString(1, false, this.sKeyImg);
  this.lStampTime = t.readInt64(2, false, this.lStampTime);
  this.lStampEndTime = t.readInt64(3, false, this.lStampEndTime);
  this.iValidity = t.readInt32(4, false, this.iValidity);
  this.sStampUserNick = t.readString(5, false, this.sStampUserNick);
};
HUYA.MassItem = function() {
  this.iGoldHostLevel = 0;
  this.iSuperPupleLevel = 0;
  this.iVipLevel = 0;
  this.iUserLevel = 0;
  this.iIsVipRed = 0;
  this.iAtSomebody = 0;
  this.sAtSomebodyNick = '';
  this.ibarrageColor = 0;
  this.sDevSourceType = '';
};
HUYA.MassItem.prototype._clone = function() {
  return new HUYA.MassItem();
};
HUYA.MassItem.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.MassItem.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.MassItem.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iGoldHostLevel);
  t.writeInt32(1, this.iSuperPupleLevel);
  t.writeInt32(2, this.iVipLevel);
  t.writeInt32(3, this.iUserLevel);
  t.writeInt32(4, this.iIsVipRed);
  t.writeInt32(5, this.iAtSomebody);
  t.writeString(6, this.sAtSomebodyNick);
  t.writeInt32(7, this.ibarrageColor);
  t.writeString(8, this.sDevSourceType);
};
HUYA.MassItem.prototype.readFrom = function(t) {
  this.iGoldHostLevel = t.readInt32(0, false, this.iGoldHostLevel);
  this.iSuperPupleLevel = t.readInt32(1, false, this.iSuperPupleLevel);
  this.iVipLevel = t.readInt32(2, false, this.iVipLevel);
  this.iUserLevel = t.readInt32(3, false, this.iUserLevel);
  this.iIsVipRed = t.readInt32(4, false, this.iIsVipRed);
  this.iAtSomebody = t.readInt32(5, false, this.iAtSomebody);
  this.sAtSomebodyNick = t.readString(6, false, this.sAtSomebodyNick);
  this.ibarrageColor = t.readInt32(7, false, this.ibarrageColor);
  this.sDevSourceType = t.readString(8, false, this.sDevSourceType);
};
HUYA.NobleInfoReq = function() {
  this.tUserId = new HUYA.UserId();
  this.iNoCache = 0;
  this.lUid = 0;
};
HUYA.NobleInfoReq.prototype._clone = function() {
  return new HUYA.NobleInfoReq();
};
HUYA.NobleInfoReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.NobleInfoReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.NobleInfoReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tUserId);
  t.writeInt32(1, this.iNoCache);
  t.writeInt64(2, this.lUid);
};
HUYA.NobleInfoReq.prototype.readFrom = function(t) {
  this.tUserId = t.readStruct(0, false, this.tUserId);
  this.iNoCache = t.readInt32(1, false, this.iNoCache);
  this.lUid = t.readInt64(2, false, this.lUid);
};
HUYA.NobleInfoRsp = function() {
  this.tInfo = new HUYA.NobleInfo();
};
HUYA.NobleInfoRsp.prototype._clone = function() {
  return new HUYA.NobleInfoRsp();
};
HUYA.NobleInfoRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.NobleInfoRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.NobleInfoRsp.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tInfo);
};
HUYA.NobleInfoRsp.prototype.readFrom = function(t) {
  this.tInfo = t.readStruct(0, false, this.tInfo);
};
HUYA.NobleInfo = function() {
  this.lUid = 0;
  this.lPid = 0;
  this.lValidDate = 0;
  this.sNobleName = '';
  this.iNobleLevel = 0;
  this.iNoblePet = 0;
  this.iNobleStatus = 0;
  this.iNobleType = 0;
  this.iRemainDays = 0;
};
HUYA.NobleInfo.prototype._clone = function() {
  return new HUYA.NobleInfo();
};
HUYA.NobleInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.NobleInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.NobleInfo.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeInt64(1, this.lPid);
  t.writeInt64(2, this.lValidDate);
  t.writeString(3, this.sNobleName);
  t.writeInt32(4, this.iNobleLevel);
  t.writeInt32(5, this.iNoblePet);
  t.writeInt32(6, this.iNobleStatus);
  t.writeInt32(7, this.iNobleType);
  t.writeInt32(8, this.iRemainDays);
};
HUYA.NobleInfo.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.lPid = t.readInt64(1, false, this.lPid);
  this.lValidDate = t.readInt64(2, false, this.lValidDate);
  this.sNobleName = t.readString(3, false, this.sNobleName);
  this.iNobleLevel = t.readInt32(4, false, this.iNobleLevel);
  this.iNoblePet = t.readInt32(5, false, this.iNoblePet);
  this.iNobleStatus = t.readInt32(6, false, this.iNobleStatus);
  this.iNobleType = t.readInt32(7, false, this.iNobleType);
  this.iRemainDays = t.readInt32(8, false, this.iRemainDays);
};
HUYA.NobleBase = function() {
  this.lUid = 0;
  this.sNickName = '';
  this.iLevel = 0;
  this.sName = '';
  this.iPet = 0;
  this.lPid = 0;
  this.lTid = 0;
  this.lSid = 0;
  this.lStartTime = 0;
  this.lEndTime = 0;
  this.iLeftDay = 0;
  this.iStatus = 0;
  this.iOpenFlag = 0;
  this.iMonths = 0;
  this.sPNickName = '';
};
HUYA.NobleBase.prototype._clone = function() {
  return new HUYA.NobleBase();
};
HUYA.NobleBase.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.NobleBase.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.NobleBase.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeString(1, this.sNickName);
  t.writeInt32(2, this.iLevel);
  t.writeString(3, this.sName);
  t.writeInt32(4, this.iPet);
  t.writeInt64(5, this.lPid);
  t.writeInt64(6, this.lTid);
  t.writeInt64(7, this.lSid);
  t.writeInt64(8, this.lStartTime);
  t.writeInt64(9, this.lEndTime);
  t.writeInt32(10, this.iLeftDay);
  t.writeInt32(11, this.iStatus);
  t.writeInt32(12, this.iOpenFlag);
  t.writeInt32(13, this.iMonths);
  t.writeString(14, this.sPNickName);
};
HUYA.NobleBase.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.sNickName = t.readString(1, false, this.sNickName);
  this.iLevel = t.readInt32(2, false, this.iLevel);
  this.sName = t.readString(3, false, this.sName);
  this.iPet = t.readInt32(4, false, this.iPet);
  this.lPid = t.readInt64(5, false, this.lPid);
  this.lTid = t.readInt64(6, false, this.lTid);
  this.lSid = t.readInt64(7, false, this.lSid);
  this.lStartTime = t.readInt64(8, false, this.lStartTime);
  this.lEndTime = t.readInt64(9, false, this.lEndTime);
  this.iLeftDay = t.readInt32(10, false, this.iLeftDay);
  this.iStatus = t.readInt32(11, false, this.iStatus);
  this.iOpenFlag = t.readInt32(12, false, this.iOpenFlag);
  this.iMonths = t.readInt32(13, false, this.iMonths);
  this.sPNickName = t.readString(14, false, this.sPNickName);
};
HUYA.GetPropsListReq = function() {
  this.tUserId = new HUYA.UserId();
  this.sMd5 = '';
  this.iTemplateType = 64;
  this.sVersion = '';
  this.iAppId = 0;
  this.lPresenterUid = 0;
  this.lSid = 0;
  this.lSubSid = 0;
};
HUYA.GetPropsListReq.prototype._clone = function() {
  return new HUYA.GetPropsListReq();
};
HUYA.GetPropsListReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetPropsListReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetPropsListReq.prototype.writeTo = function(t) {
  t.writeStruct(1, this.tUserId);
  t.writeString(2, this.sMd5);
  t.writeInt32(3, this.iTemplateType);
  t.writeString(4, this.sVersion);
  t.writeInt32(5, this.iAppId);
  t.writeInt64(6, this.lPresenterUid);
  t.writeInt64(7, this.lSid);
  t.writeInt64(8, this.lSubSid);
};
HUYA.GetPropsListReq.prototype.readFrom = function(t) {
  this.tUserId = t.readStruct(1, false, this.tUserId);
  this.sMd5 = t.readString(2, false, this.sMd5);
  this.iTemplateType = t.readInt32(3, false, this.iTemplateType);
  this.sVersion = t.readString(4, false, this.sVersion);
  this.iAppId = t.readInt32(5, false, this.iAppId);
  this.lPresenterUid = t.readInt64(6, false, this.lPresenterUid);
  this.lSid = t.readInt64(7, false, this.lSid);
  this.lSubSid = t.readInt64(8, false, this.lSubSid);
};
HUYA.GetPropsListRsp = function() {
  this.vPropsItemList = new Taf.Vector(new HUYA.PropsItem());
  this.sMd5 = '';
  this.iNewEffectSwitch = 0;
  this.iMirrorRoomShowNum = 0;
  this.iGameRoomShowNum = 0;
};
HUYA.GetPropsListRsp.prototype._clone = function() {
  return new HUYA.GetPropsListRsp();
};
HUYA.GetPropsListRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetPropsListRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetPropsListRsp.prototype.writeTo = function(t) {
  t.writeVector(1, this.vPropsItemList);
  t.writeString(2, this.sMd5);
  t.writeInt16(3, this.iNewEffectSwitch);
  t.writeInt16(4, this.iMirrorRoomShowNum);
  t.writeInt16(5, this.iGameRoomShowNum);
};
HUYA.GetPropsListRsp.prototype.readFrom = function(t) {
  this.vPropsItemList = t.readVector(1, false, this.vPropsItemList);
  this.sMd5 = t.readString(2, false, this.sMd5);
  this.iNewEffectSwitch = t.readInt16(3, false, this.iNewEffectSwitch);
  this.iMirrorRoomShowNum = t.readInt16(4, false, this.iMirrorRoomShowNum);
  this.iGameRoomShowNum = t.readInt16(5, false, this.iGameRoomShowNum);
};
HUYA.PropsItem = function() {
  this.iPropsId = 0;
  this.sPropsName = '';
  this.iPropsYb = 0;
  this.iPropsGreenBean = 0;
  this.iPropsWhiteBean = 0;
  this.iPropsGoldenBean = 0;
  this.iPropsRed = 0;
  this.iPropsPopular = 0;
  this.iPropsExpendNum = -1;
  this.iPropsFansValue = -1;
  this.vPropsNum = new Taf.Vector(new Taf.INT32());
  this.iPropsMaxNum = 0;
  this.iPropsBatterFlag = 0;
  this.vPropsChannel = new Taf.Vector(new Taf.INT32());
  this.sPropsToolTip = '';
  this.vPropsIdentity = new Taf.Vector(new HUYA.PropsIdentity());
  this.iPropsWeights = 0;
  this.iPropsLevel = 0;
  this.tDisplayInfo = new HUYA.DisplayInfo();
  this.tSpecialInfo = new HUYA.SpecialInfo();
  this.iPropsGrade = 0;
  this.iPropsGroupNum = 0;
  this.sPropsCommBannerResource = '';
  this.sPropsOwnBannerResource = '';
  this.iPropsShowFlag = 0;
  this.iTemplateType = 0;
  this.iShelfStatus = 0;
  this.sAndroidLogo = '';
  this.sIpadLogo = '';
  this.sIphoneLogo = '';
  this.sPropsCommBannerResourceEx = '';
  this.sPropsOwnBannerResourceEx = '';
  this.vPresenterUid = new Taf.Vector(new Taf.INT64());
  this.vPropView = new Taf.Vector(new HUYA.PropView());
};
HUYA.PropsItem.prototype._clone = function() {
  return new HUYA.PropsItem();
};
HUYA.PropsItem.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.PropsItem.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.PropsItem.prototype.writeTo = function(t) {
  t.writeInt32(1, this.iPropsId);
  t.writeString(2, this.sPropsName);
  t.writeInt32(3, this.iPropsYb);
  t.writeInt32(4, this.iPropsGreenBean);
  t.writeInt32(5, this.iPropsWhiteBean);
  t.writeInt32(6, this.iPropsGoldenBean);
  t.writeInt32(7, this.iPropsRed);
  t.writeInt32(8, this.iPropsPopular);
  t.writeInt32(9, this.iPropsExpendNum);
  t.writeInt32(10, this.iPropsFansValue);
  t.writeVector(11, this.vPropsNum);
  t.writeInt32(12, this.iPropsMaxNum);
  t.writeInt32(13, this.iPropsBatterFlag);
  t.writeVector(14, this.vPropsChannel);
  t.writeString(15, this.sPropsToolTip);
  t.writeVector(16, this.vPropsIdentity);
  t.writeInt32(17, this.iPropsWeights);
  t.writeInt32(18, this.iPropsLevel);
  t.writeStruct(19, this.tDisplayInfo);
  t.writeStruct(20, this.tSpecialInfo);
  t.writeInt32(21, this.iPropsGrade);
  t.writeInt32(22, this.iPropsGroupNum);
  t.writeString(23, this.sPropsCommBannerResource);
  t.writeString(24, this.sPropsOwnBannerResource);
  t.writeInt32(25, this.iPropsShowFlag);
  t.writeInt32(26, this.iTemplateType);
  t.writeInt32(27, this.iShelfStatus);
  t.writeString(28, this.sAndroidLogo);
  t.writeString(29, this.sIpadLogo);
  t.writeString(30, this.sIphoneLogo);
  t.writeString(31, this.sPropsCommBannerResourceEx);
  t.writeString(32, this.sPropsOwnBannerResourceEx);
  t.writeVector(33, this.vPresenterUid);
  t.writeVector(34, this.vPropView);
};
HUYA.PropsItem.prototype.readFrom = function(t) {
  this.iPropsId = t.readInt32(1, false, this.iPropsId);
  this.sPropsName = t.readString(2, false, this.sPropsName);
  this.iPropsYb = t.readInt32(3, false, this.iPropsYb);
  this.iPropsGreenBean = t.readInt32(4, false, this.iPropsGreenBean);
  this.iPropsWhiteBean = t.readInt32(5, false, this.iPropsWhiteBean);
  this.iPropsGoldenBean = t.readInt32(6, false, this.iPropsGoldenBean);
  this.iPropsRed = t.readInt32(7, false, this.iPropsRed);
  this.iPropsPopular = t.readInt32(8, false, this.iPropsPopular);
  this.iPropsExpendNum = t.readInt32(9, false, this.iPropsExpendNum);
  this.iPropsFansValue = t.readInt32(10, false, this.iPropsFansValue);
  this.vPropsNum = t.readVector(11, false, this.vPropsNum);
  this.iPropsMaxNum = t.readInt32(12, false, this.iPropsMaxNum);
  this.iPropsBatterFlag = t.readInt32(13, false, this.iPropsBatterFlag);
  this.vPropsChannel = t.readVector(14, false, this.vPropsChannel);
  this.sPropsToolTip = t.readString(15, false, this.sPropsToolTip);
  this.vPropsIdentity = t.readVector(16, false, this.vPropsIdentity);
  this.iPropsWeights = t.readInt32(17, false, this.iPropsWeights);
  this.iPropsLevel = t.readInt32(18, false, this.iPropsLevel);
  this.tDisplayInfo = t.readStruct(19, false, this.tDisplayInfo);
  this.tSpecialInfo = t.readStruct(20, false, this.tSpecialInfo);
  this.iPropsGrade = t.readInt32(21, false, this.iPropsGrade);
  this.iPropsGroupNum = t.readInt32(22, false, this.iPropsGroupNum);
  this.sPropsCommBannerResource = t.readString(
    23,
    false,
    this.sPropsCommBannerResource
  );
  this.sPropsOwnBannerResource = t.readString(
    24,
    false,
    this.sPropsOwnBannerResource
  );
  this.iPropsShowFlag = t.readInt32(25, false, this.iPropsShowFlag);
  this.iTemplateType = t.readInt32(26, false, this.iTemplateType);
  this.iShelfStatus = t.readInt32(27, false, this.iShelfStatus);
  this.sAndroidLogo = t.readString(28, false, this.sAndroidLogo);
  this.sIpadLogo = t.readString(29, false, this.sIpadLogo);
  this.sIphoneLogo = t.readString(30, false, this.sIphoneLogo);
  this.sPropsCommBannerResourceEx = t.readString(
    31,
    false,
    this.sPropsCommBannerResourceEx
  );
  this.sPropsOwnBannerResourceEx = t.readString(
    32,
    false,
    this.sPropsOwnBannerResourceEx
  );
  this.vPresenterUid = t.readVector(33, false, this.vPresenterUid);
  this.vPropView = t.readVector(34, false, this.vPropView);
};
HUYA.PropsIdentity = function() {
  this.iPropsIdType = 0;
  this.sPropsPic18 = '';
  this.sPropsPic24 = '';
  this.sPropsPicGif = '';
  this.sPropsBannerResource = '';
  this.sPropsBannerSize = '';
  this.sPropsBannerMaxTime = '';
  this.sPropsChatBannerResource = '';
  this.sPropsChatBannerSize = '';
  this.sPropsChatBannerMaxTime = '';
  this.iPropsChatBannerPos = 0;
  this.iPropsChatBannerIsCombo = 0;
  this.sPropsRollContent = '';
  this.iPropsBannerAnimationstyle = 0;
  this.sPropFaceu = '';
  this.sPropH5Resource = '';
  this.sPropsWeb = '';
  this.sWitch = 0;
  this.sCornerMark = '';
  this.iPropViewId = 0;
  this.sPropStreamerResource = '';
  this.iStreamerFrameRate = 0;
};
HUYA.PropsIdentity.prototype._clone = function() {
  return new HUYA.PropsIdentity();
};
HUYA.PropsIdentity.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.PropsIdentity.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.PropsIdentity.prototype.writeTo = function(t) {
  t.writeInt32(1, this.iPropsIdType);
  t.writeString(2, this.sPropsPic18);
  t.writeString(3, this.sPropsPic24);
  t.writeString(4, this.sPropsPicGif);
  t.writeString(5, this.sPropsBannerResource);
  t.writeString(6, this.sPropsBannerSize);
  t.writeString(7, this.sPropsBannerMaxTime);
  t.writeString(8, this.sPropsChatBannerResource);
  t.writeString(9, this.sPropsChatBannerSize);
  t.writeString(10, this.sPropsChatBannerMaxTime);
  t.writeInt32(11, this.iPropsChatBannerPos);
  t.writeInt32(12, this.iPropsChatBannerIsCombo);
  t.writeString(13, this.sPropsRollContent);
  t.writeInt32(14, this.iPropsBannerAnimationstyle);
  t.writeString(15, this.sPropFaceu);
  t.writeString(16, this.sPropH5Resource);
  t.writeString(17, this.sPropsWeb);
  t.writeInt32(18, this.sWitch);
  t.writeString(19, this.sCornerMark);
  t.writeInt32(20, this.iPropViewId);
  t.writeString(21, this.sPropStreamerResource);
  t.writeInt16(22, this.iStreamerFrameRate);
};
HUYA.PropsIdentity.prototype.readFrom = function(t) {
  this.iPropsIdType = t.readInt32(1, false, this.iPropsIdType);
  this.sPropsPic18 = t.readString(2, false, this.sPropsPic18);
  this.sPropsPic24 = t.readString(3, false, this.sPropsPic24);
  this.sPropsPicGif = t.readString(4, false, this.sPropsPicGif);
  this.sPropsBannerResource = t.readString(5, false, this.sPropsBannerResource);
  this.sPropsBannerSize = t.readString(6, false, this.sPropsBannerSize);
  this.sPropsBannerMaxTime = t.readString(7, false, this.sPropsBannerMaxTime);
  this.sPropsChatBannerResource = t.readString(
    8,
    false,
    this.sPropsChatBannerResource
  );
  this.sPropsChatBannerSize = t.readString(9, false, this.sPropsChatBannerSize);
  this.sPropsChatBannerMaxTime = t.readString(
    10,
    false,
    this.sPropsChatBannerMaxTime
  );
  this.iPropsChatBannerPos = t.readInt32(11, false, this.iPropsChatBannerPos);
  this.iPropsChatBannerIsCombo = t.readInt32(
    12,
    false,
    this.iPropsChatBannerIsCombo
  );
  this.sPropsRollContent = t.readString(13, false, this.sPropsRollContent);
  this.iPropsBannerAnimationstyle = t.readInt32(
    14,
    false,
    this.iPropsBannerAnimationstyle
  );
  this.sPropFaceu = t.readString(15, false, this.sPropFaceu);
  this.sPropH5Resource = t.readString(16, false, this.sPropH5Resource);
  this.sPropsWeb = t.readString(17, false, this.sPropsWeb);
  this.sWitch = t.readInt32(18, false, this.sWitch);
  this.sCornerMark = t.readString(19, false, this.sCornerMark);
  this.iPropViewId = t.readInt32(20, false, this.iPropViewId);
  this.sPropStreamerResource = t.readString(
    21,
    false,
    this.sPropStreamerResource
  );
  this.iStreamerFrameRate = t.readInt16(22, false, this.iStreamerFrameRate);
};
HUYA.PropView = function() {
  this.id = 0;
  this.name = '';
  this.uids = new Taf.Map(new Taf.INT64(), new Taf.INT16());
  this.tips = '';
};
HUYA.PropView.prototype._clone = function() {
  return new HUYA.PropView();
};
HUYA.PropView.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.PropView.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.PropView.prototype.writeTo = function(t) {
  t.writeInt32(0, this.id);
  t.writeString(1, this.name);
  t.writeMap(2, this.uids);
  t.writeString(3, this.tips);
};
HUYA.PropView.prototype.readFrom = function(t) {
  this.id = t.readInt32(0, false, this.id);
  this.name = t.readString(1, false, this.name);
  this.uids = t.readMap(2, false, this.uids);
  this.tips = t.readString(3, false, this.tips);
};
HUYA.DisplayInfo = function() {
  this.iMarqueeScopeMin = 0;
  this.iMarqueeScopeMax = 0;
  this.iCurrentVideoNum = 0;
  this.iCurrentVideoMin = 0;
  this.iCurrentVideoMax = 0;
  this.iAllVideoNum = 0;
  this.iAllVideoMin = 0;
  this.iAllVideoMax = 0;
  this.iCurrentScreenNum = 0;
  this.iCurrentScreenMin = 0;
  this.iCurrentScreenMax = 0;
};
HUYA.DisplayInfo.prototype._clone = function() {
  return new HUYA.DisplayInfo();
};
HUYA.DisplayInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.DisplayInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.DisplayInfo.prototype.writeTo = function(t) {
  t.writeInt32(1, this.iMarqueeScopeMin);
  t.writeInt32(2, this.iMarqueeScopeMax);
  t.writeInt32(3, this.iCurrentVideoNum);
  t.writeInt32(4, this.iCurrentVideoMin);
  t.writeInt32(5, this.iCurrentVideoMax);
  t.writeInt32(6, this.iAllVideoNum);
  t.writeInt32(7, this.iAllVideoMin);
  t.writeInt32(8, this.iAllVideoMax);
  t.writeInt32(9, this.iCurrentScreenNum);
  t.writeInt32(10, this.iCurrentScreenMin);
  t.writeInt32(11, this.iCurrentScreenMax);
};
HUYA.DisplayInfo.prototype.readFrom = function(t) {
  this.iMarqueeScopeMin = t.readInt32(1, false, this.iMarqueeScopeMin);
  this.iMarqueeScopeMax = t.readInt32(2, false, this.iMarqueeScopeMax);
  this.iCurrentVideoNum = t.readInt32(3, false, this.iCurrentVideoNum);
  this.iCurrentVideoMin = t.readInt32(4, false, this.iCurrentVideoMin);
  this.iCurrentVideoMax = t.readInt32(5, false, this.iCurrentVideoMax);
  this.iAllVideoNum = t.readInt32(6, false, this.iAllVideoNum);
  this.iAllVideoMin = t.readInt32(7, false, this.iAllVideoMin);
  this.iAllVideoMax = t.readInt32(8, false, this.iAllVideoMax);
  this.iCurrentScreenNum = t.readInt32(9, false, this.iCurrentScreenNum);
  this.iCurrentScreenMin = t.readInt32(10, false, this.iCurrentScreenMin);
  this.iCurrentScreenMax = t.readInt32(11, false, this.iCurrentScreenMax);
};
HUYA.SpecialInfo = function() {
  this.iFirstSingle = 0;
  this.iFirstGroup = 0;
  this.sFirstTips = '';
  this.iSecondSingle = 0;
  this.iSecondGroup = 0;
  this.sSecondTips = '';
  this.iThirdSingle = 0;
  this.iThirdGroup = 0;
  this.sThirdTips = '';
  this.iWorldSingle = 0;
  this.iWorldGroup = 0;
};
HUYA.SpecialInfo.prototype._clone = function() {
  return new HUYA.SpecialInfo();
};
HUYA.SpecialInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.SpecialInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.SpecialInfo.prototype.writeTo = function(t) {
  t.writeInt32(1, this.iFirstSingle);
  t.writeInt32(2, this.iFirstGroup);
  t.writeString(3, this.sFirstTips);
  t.writeInt32(4, this.iSecondSingle);
  t.writeInt32(5, this.iSecondGroup);
  t.writeString(6, this.sSecondTips);
  t.writeInt32(7, this.iThirdSingle);
  t.writeInt32(8, this.iThirdGroup);
  t.writeString(9, this.sThirdTips);
  t.writeInt32(10, this.iWorldSingle);
  t.writeInt32(11, this.iWorldGroup);
};
HUYA.SpecialInfo.prototype.readFrom = function(t) {
  this.iFirstSingle = t.readInt32(1, false, this.iFirstSingle);
  this.iFirstGroup = t.readInt32(2, false, this.iFirstGroup);
  this.sFirstTips = t.readString(3, false, this.sFirstTips);
  this.iSecondSingle = t.readInt32(4, false, this.iSecondSingle);
  this.iSecondGroup = t.readInt32(5, false, this.iSecondGroup);
  this.sSecondTips = t.readString(6, false, this.sSecondTips);
  this.iThirdSingle = t.readInt32(7, false, this.iThirdSingle);
  this.iThirdGroup = t.readInt32(8, false, this.iThirdGroup);
  this.sThirdTips = t.readString(9, false, this.sThirdTips);
  this.iWorldSingle = t.readInt32(10, false, this.iWorldSingle);
  this.iWorldGroup = t.readInt32(11, false, this.iWorldGroup);
};
HUYA.TokenCdnInfo = function() {
  this.sCdnName = '';
  this.sUrl = '';
  this.sStreamName = '';
};
HUYA.TokenCdnInfo.prototype._clone = function() {
  return new HUYA.TokenCdnInfo();
};
HUYA.TokenCdnInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.TokenCdnInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.TokenCdnInfo.prototype.writeTo = function(t) {
  t.writeString(0, this.sCdnName);
  t.writeString(1, this.sUrl);
  t.writeString(2, this.sStreamName);
};
HUYA.TokenCdnInfo.prototype.readFrom = function(t) {
  this.sCdnName = t.readString(0, false, this.sCdnName);
  this.sUrl = t.readString(1, false, this.sUrl);
  this.sStreamName = t.readString(2, false, this.sStreamName);
};
HUYA.CdnAntiCodeInfo = function() {
  this.sCdnName = '';
  this.sFlvAntiCode = '';
  this.sHlsAntiCode = '';
};
HUYA.CdnAntiCodeInfo.prototype._clone = function() {
  return new HUYA.CdnAntiCodeInfo();
};
HUYA.CdnAntiCodeInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.CdnAntiCodeInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.CdnAntiCodeInfo.prototype.writeTo = function(t) {
  t.writeString(0, this.sCdnName);
  t.writeString(1, this.sFlvAntiCode);
  t.writeString(2, this.sHlsAntiCode);
};
HUYA.CdnAntiCodeInfo.prototype.readFrom = function(t) {
  this.sCdnName = t.readString(0, false, this.sCdnName);
  this.sFlvAntiCode = t.readString(1, false, this.sFlvAntiCode);
  this.sHlsAntiCode = t.readString(2, false, this.sHlsAntiCode);
};
HUYA.BatchGetCdnTokenReq = function() {
  this.vCdnInfos = new Taf.Vector(new HUYA.TokenCdnInfo());
  this.sStreamName = '';
};
HUYA.BatchGetCdnTokenReq.prototype._clone = function() {
  return new HUYA.BatchGetCdnTokenReq();
};
HUYA.BatchGetCdnTokenReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.BatchGetCdnTokenReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.BatchGetCdnTokenReq.prototype.writeTo = function(t) {
  t.writeVector(0, this.vCdnInfos);
  t.writeString(1, this.sStreamName);
};
HUYA.BatchGetCdnTokenReq.prototype.readFrom = function(t) {
  this.vCdnInfos = t.readVector(0, false, this.vCdnInfos);
  this.sStreamName = t.readString(1, false, this.sStreamName);
};
HUYA.BatchGetCdnTokenRsp = function() {
  this.vCdnAntiCodes = new Taf.Vector(new HUYA.CdnAntiCodeInfo());
};
HUYA.BatchGetCdnTokenRsp.prototype._clone = function() {
  return new HUYA.BatchGetCdnTokenRsp();
};
HUYA.BatchGetCdnTokenRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.BatchGetCdnTokenRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.BatchGetCdnTokenRsp.prototype.writeTo = function(t) {
  t.writeVector(0, this.vCdnAntiCodes);
};
HUYA.BatchGetCdnTokenRsp.prototype.readFrom = function(t) {
  this.vCdnAntiCodes = t.readVector(0, false, this.vCdnAntiCodes);
};
HUYA.GetWebdbUserInfoReq = function() {
  this.lUid = 0;
  this.lImid = 0;
  this.sPassport = '';
  this.sAccount = '';
  this.bCacheFirst = true;
};
HUYA.GetWebdbUserInfoReq.prototype._clone = function() {
  return new HUYA.GetWebdbUserInfoReq();
};
HUYA.GetWebdbUserInfoReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetWebdbUserInfoReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetWebdbUserInfoReq.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeInt64(1, this.lImid);
  t.writeString(2, this.sPassport);
  t.writeString(3, this.sAccount);
  t.writeBoolean(4, this.bCacheFirst);
};
HUYA.GetWebdbUserInfoReq.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.lImid = t.readInt64(1, false, this.lImid);
  this.sPassport = t.readString(2, false, this.sPassport);
  this.sAccount = t.readString(3, false, this.sAccount);
  this.bCacheFirst = t.readBoolean(4, false, this.bCacheFirst);
};
HUYA.GetWebdbUserInfoRsp = function() {
  this.tUserInfo = new HUYA.DBUserInfo();
};
HUYA.GetWebdbUserInfoRsp.prototype._clone = function() {
  return new HUYA.GetWebdbUserInfoRsp();
};
HUYA.GetWebdbUserInfoRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetWebdbUserInfoRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetWebdbUserInfoRsp.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tUserInfo);
};
HUYA.GetWebdbUserInfoRsp.prototype.readFrom = function(t) {
  this.tUserInfo = t.readStruct(0, false, this.tUserInfo);
};
HUYA.DBUserInfo = function() {
  this.lUid = 0;
  this.sPassport = '';
  this.sAccount = '';
  this.sNick = '';
  this.iSex = 0;
  this.iBirthday = 0;
  this.sArea = '';
  this.sProvince = '';
  this.sCity = '';
  this.sSign = '';
  this.sIntro = '';
  this.iJifen = 0;
  this.sRegisterTime = '';
  this.sHdlogo = '';
  this.sSessionCard = '';
  this.lImid = 0;
  this.iLogoIndex = 0;
};
HUYA.DBUserInfo.prototype._clone = function() {
  return new HUYA.DBUserInfo();
};
HUYA.DBUserInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.DBUserInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.DBUserInfo.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeString(1, this.sPassport);
  t.writeString(2, this.sAccount);
  t.writeString(3, this.sNick);
  t.writeInt32(4, this.iSex);
  t.writeInt32(5, this.iBirthday);
  t.writeString(6, this.sArea);
  t.writeString(7, this.sProvince);
  t.writeString(8, this.sCity);
  t.writeString(9, this.sSign);
  t.writeString(10, this.sIntro);
  t.writeInt32(11, this.iJifen);
  t.writeString(12, this.sRegisterTime);
  t.writeString(13, this.sHdlogo);
  t.writeString(14, this.sSessionCard);
  t.writeInt64(16, this.lImid);
  t.writeInt32(17, this.iLogoIndex);
};
HUYA.DBUserInfo.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.sPassport = t.readString(1, false, this.sPassport);
  this.sAccount = t.readString(2, false, this.sAccount);
  this.sNick = t.readString(3, false, this.sNick);
  this.iSex = t.readInt32(4, false, this.iSex);
  this.iBirthday = t.readInt32(5, false, this.iBirthday);
  this.sArea = t.readString(6, false, this.sArea);
  this.sProvince = t.readString(7, false, this.sProvince);
  this.sCity = t.readString(8, false, this.sCity);
  this.sSign = t.readString(9, false, this.sSign);
  this.sIntro = t.readString(10, false, this.sIntro);
  this.iJifen = t.readInt32(11, false, this.iJifen);
  this.sRegisterTime = t.readString(12, false, this.sRegisterTime);
  this.sHdlogo = t.readString(13, false, this.sHdlogo);
  this.sSessionCard = t.readString(14, false, this.sSessionCard);
  this.lImid = t.readInt64(16, false, this.lImid);
  this.iLogoIndex = t.readInt32(17, false, this.iLogoIndex);
};
HUYA.GiftInfo = function() {
  this.iItemType = 0;
  this.iItemCount = 0;
};
HUYA.GiftInfo.prototype._clone = function() {
  return new HUYA.GiftInfo();
};
HUYA.GiftInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GiftInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GiftInfo.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iItemType);
  t.writeInt32(1, this.iItemCount);
};
HUYA.GiftInfo.prototype.readFrom = function(t) {
  this.iItemType = t.readInt32(0, false, this.iItemType);
  this.iItemCount = t.readInt32(1, false, this.iItemCount);
};
HUYA.GetUserBoxInfoReq = function() {
  this.tId = new HUYA.UserId();
};
HUYA.GetUserBoxInfoReq.prototype._clone = function() {
  return new HUYA.GetUserBoxInfoReq();
};
HUYA.GetUserBoxInfoReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetUserBoxInfoReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetUserBoxInfoReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
};
HUYA.GetUserBoxInfoReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
};
HUYA.GetUserBoxInfoRsp = function() {
  this.lUid = 0;
  this.tTask1 = new HUYA.BoxTaskInfo();
  this.tTask2 = new HUYA.BoxTaskInfo();
  this.tTask3 = new HUYA.BoxTaskInfo();
  this.tTask4 = new HUYA.BoxTaskInfo();
  this.tTask5 = new HUYA.BoxTaskInfo();
  this.tTask6 = new HUYA.BoxTaskInfo();
  this.iBoxLevel = 0;
};
HUYA.GetUserBoxInfoRsp.prototype._clone = function() {
  return new HUYA.GetUserBoxInfoRsp();
};
HUYA.GetUserBoxInfoRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetUserBoxInfoRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetUserBoxInfoRsp.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeStruct(1, this.tTask1);
  t.writeStruct(2, this.tTask2);
  t.writeStruct(3, this.tTask3);
  t.writeStruct(4, this.tTask4);
  t.writeStruct(5, this.tTask5);
  t.writeStruct(7, this.tTask6);
  t.writeInt32(8, this.iBoxLevel);
};
HUYA.GetUserBoxInfoRsp.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.tTask1 = t.readStruct(1, false, this.tTask1);
  this.tTask2 = t.readStruct(2, false, this.tTask2);
  this.tTask3 = t.readStruct(3, false, this.tTask3);
  this.tTask4 = t.readStruct(4, false, this.tTask4);
  this.tTask5 = t.readStruct(5, false, this.tTask5);
  this.tTask6 = t.readStruct(7, false, this.tTask6);
  this.iBoxLevel = t.readInt32(8, false, this.iBoxLevel);
};
HUYA.FinishTaskNoticeReq = function() {
  this.tId = new HUYA.UserId();
  this.lSid = 0;
  this.lSubSid = 0;
  this.iTaskId = 0;
  this.sPassport = '';
  this.iFromType = 0;
  this.fVersion = 1;
  this.sTime = '';
  this.sMd5 = '';
};
HUYA.FinishTaskNoticeReq.prototype._clone = function() {
  return new HUYA.FinishTaskNoticeReq();
};
HUYA.FinishTaskNoticeReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.FinishTaskNoticeReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.FinishTaskNoticeReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeInt64(1, this.lSid);
  t.writeInt64(2, this.lSubSid);
  t.writeInt32(3, this.iTaskId);
  t.writeString(4, this.sPassport);
  t.writeInt32(5, this.iFromType);
  t.writeFloat(6, this.fVersion);
  t.writeString(7, this.sTime);
  t.writeString(8, this.sMd5);
};
HUYA.FinishTaskNoticeReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.lSid = t.readInt64(1, false, this.lSid);
  this.lSubSid = t.readInt64(2, false, this.lSubSid);
  this.iTaskId = t.readInt32(3, false, this.iTaskId);
  this.sPassport = t.readString(4, false, this.sPassport);
  this.iFromType = t.readInt32(5, false, this.iFromType);
  this.fVersion = t.readFloat(6, false, this.fVersion);
  this.sTime = t.readString(7, false, this.sTime);
  this.sMd5 = t.readString(8, false, this.sMd5);
};
HUYA.FinishTaskNoticeRsp = function() {
  this.iRspCode = 0;
  this.iTaskId = 0;
};
HUYA.FinishTaskNoticeRsp.prototype._clone = function() {
  return new HUYA.FinishTaskNoticeRsp();
};
HUYA.FinishTaskNoticeRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.FinishTaskNoticeRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.FinishTaskNoticeRsp.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iRspCode);
  t.writeInt32(1, this.iTaskId);
};
HUYA.FinishTaskNoticeRsp.prototype.readFrom = function(t) {
  this.iRspCode = t.readInt32(0, false, this.iRspCode);
  this.iTaskId = t.readInt32(1, false, this.iTaskId);
};
HUYA.AwardBoxPrizeReq = function() {
  this.tId = new HUYA.UserId();
  this.lSid = 0;
  this.lSubSid = 0;
  this.iTaskId = 0;
  this.sPassport = '';
  this.iFromType = 0;
  this.fVersion = 1;
  this.sTime = '';
  this.sMd5 = '';
};
HUYA.AwardBoxPrizeReq.prototype._clone = function() {
  return new HUYA.AwardBoxPrizeReq();
};
HUYA.AwardBoxPrizeReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.AwardBoxPrizeReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.AwardBoxPrizeReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeInt64(1, this.lSid);
  t.writeInt64(2, this.lSubSid);
  t.writeInt32(3, this.iTaskId);
  t.writeString(4, this.sPassport);
  t.writeInt32(5, this.iFromType);
  t.writeFloat(6, this.fVersion);
  t.writeString(7, this.sTime);
  t.writeString(8, this.sMd5);
};
HUYA.AwardBoxPrizeReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.lSid = t.readInt64(1, false, this.lSid);
  this.lSubSid = t.readInt64(2, false, this.lSubSid);
  this.iTaskId = t.readInt32(3, false, this.iTaskId);
  this.sPassport = t.readString(4, false, this.sPassport);
  this.iFromType = t.readInt32(5, false, this.iFromType);
  this.fVersion = t.readFloat(6, false, this.fVersion);
  this.sTime = t.readString(7, false, this.sTime);
  this.sMd5 = t.readString(8, false, this.sMd5);
};
HUYA.AwardBoxPrizeRsp = function() {
  this.iRspCode = 0;
  this.iTaskId = 0;
  this.iItemType = 0;
  this.iCount = 0;
  this.iRewardLevel = 0;
};
HUYA.AwardBoxPrizeRsp.prototype._clone = function() {
  return new HUYA.AwardBoxPrizeRsp();
};
HUYA.AwardBoxPrizeRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.AwardBoxPrizeRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.AwardBoxPrizeRsp.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iRspCode);
  t.writeInt32(1, this.iTaskId);
  t.writeInt32(2, this.iItemType);
  t.writeInt32(3, this.iCount);
  t.writeInt32(4, this.iRewardLevel);
};
HUYA.AwardBoxPrizeRsp.prototype.readFrom = function(t) {
  this.iRspCode = t.readInt32(0, false, this.iRspCode);
  this.iTaskId = t.readInt32(1, false, this.iTaskId);
  this.iItemType = t.readInt32(2, false, this.iItemType);
  this.iCount = t.readInt32(3, false, this.iCount);
  this.iRewardLevel = t.readInt32(4, false, this.iRewardLevel);
};
HUYA.BoxTaskInfo = function() {
  this.iStat = 0;
  this.iItemType = 0;
  this.iItemCount = 0;
  this.iRewardLevel = 0;
};
HUYA.BoxTaskInfo.prototype._clone = function() {
  return new HUYA.BoxTaskInfo();
};
HUYA.BoxTaskInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.BoxTaskInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.BoxTaskInfo.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iStat);
  t.writeInt32(1, this.iItemType);
  t.writeInt32(2, this.iItemCount);
  t.writeInt32(3, this.iRewardLevel);
};
HUYA.BoxTaskInfo.prototype.readFrom = function(t) {
  this.iStat = t.readInt32(0, false, this.iStat);
  this.iItemType = t.readInt32(1, false, this.iItemType);
  this.iItemCount = t.readInt32(2, false, this.iItemCount);
  this.iRewardLevel = t.readInt32(3, false, this.iRewardLevel);
};
HUYA.InterveneCountRsp = function() {
  this.lTimeStamp = 0;
  this.iExpire = 0;
  this.lChannelId = 0;
  this.vCountInfos = new Taf.Vector(new HUYA.InterveneCountInfo());
};
HUYA.InterveneCountRsp.prototype._clone = function() {
  return new HUYA.InterveneCountRsp();
};
HUYA.InterveneCountRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.InterveneCountRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.InterveneCountRsp.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lTimeStamp);
  t.writeInt32(1, this.iExpire);
  t.writeInt64(2, this.lChannelId);
  t.writeVector(3, this.vCountInfos);
};
HUYA.InterveneCountRsp.prototype.readFrom = function(t) {
  this.lTimeStamp = t.readInt64(0, false, this.lTimeStamp);
  this.iExpire = t.readInt32(1, false, this.iExpire);
  this.lChannelId = t.readInt64(2, false, this.lChannelId);
  this.vCountInfos = t.readVector(3, false, this.vCountInfos);
};
HUYA.InterveneCountInfo = function() {
  this.lSubChannelId = 0;
  this.lAttendeeCount = 0;
};
HUYA.InterveneCountInfo.prototype._clone = function() {
  return new HUYA.InterveneCountInfo();
};
HUYA.InterveneCountInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.InterveneCountInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.InterveneCountInfo.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lSubChannelId);
  t.writeInt64(1, this.lAttendeeCount);
};
HUYA.InterveneCountInfo.prototype.readFrom = function(t) {
  this.lSubChannelId = t.readInt64(0, false, this.lSubChannelId);
  this.lAttendeeCount = t.readInt64(1, false, this.lAttendeeCount);
};
HUYA.AuditorEnterLiveNotice = function() {
  this.iUserType = 0;
  this.lUid = 0;
  this.sNick = '';
  this.bSendMessagePopUp = false;
  this.sSendMessageTips = '';
  this.lSubcid = 0;
  this.iSendMessagePopUpAmtTime = 0;
};
HUYA.AuditorEnterLiveNotice.prototype._clone = function() {
  return new HUYA.AuditorEnterLiveNotice();
};
HUYA.AuditorEnterLiveNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.AuditorEnterLiveNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.AuditorEnterLiveNotice.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iUserType);
  t.writeInt64(1, this.lUid);
  t.writeString(2, this.sNick);
  t.writeBoolean(3, this.bSendMessagePopUp);
  t.writeString(4, this.sSendMessageTips);
  t.writeInt64(5, this.lSubcid);
  t.writeInt32(6, this.iSendMessagePopUpAmtTime);
};
HUYA.AuditorEnterLiveNotice.prototype.readFrom = function(t) {
  this.iUserType = t.readInt32(0, false, this.iUserType);
  this.lUid = t.readInt64(1, false, this.lUid);
  this.sNick = t.readString(2, false, this.sNick);
  this.bSendMessagePopUp = t.readBoolean(3, false, this.bSendMessagePopUp);
  this.sSendMessageTips = t.readString(4, false, this.sSendMessageTips);
  this.lSubcid = t.readInt64(5, false, this.lSubcid);
  this.iSendMessagePopUpAmtTime = t.readInt32(
    6,
    false,
    this.iSendMessagePopUpAmtTime
  );
};
HUYA.AuditorRoleChangeNotice = function() {
  this.iOldUserType = 0;
  this.iNewUserType = 0;
  this.lUid = 0;
  this.lSubcid = 0;
  this.sNick = '';
  this.bPopUp = false;
  this.sSystemTips = '';
  this.bSendMessagePopUp = false;
  this.sSendMessageTips = '';
  this.iSendMessagePopUpAmtTime = 0;
};
HUYA.AuditorRoleChangeNotice.prototype._clone = function() {
  return new HUYA.AuditorRoleChangeNotice();
};
HUYA.AuditorRoleChangeNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.AuditorRoleChangeNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.AuditorRoleChangeNotice.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iOldUserType);
  t.writeInt32(1, this.iNewUserType);
  t.writeInt64(2, this.lUid);
  t.writeInt64(3, this.lSubcid);
  t.writeString(4, this.sNick);
  t.writeBoolean(5, this.bPopUp);
  t.writeString(6, this.sSystemTips);
  t.writeBoolean(7, this.bSendMessagePopUp);
  t.writeString(8, this.sSendMessageTips);
  t.writeInt32(9, this.iSendMessagePopUpAmtTime);
};
HUYA.AuditorRoleChangeNotice.prototype.readFrom = function(t) {
  this.iOldUserType = t.readInt32(0, false, this.iOldUserType);
  this.iNewUserType = t.readInt32(1, false, this.iNewUserType);
  this.lUid = t.readInt64(2, false, this.lUid);
  this.lSubcid = t.readInt64(3, false, this.lSubcid);
  this.sNick = t.readString(4, false, this.sNick);
  this.bPopUp = t.readBoolean(5, false, this.bPopUp);
  this.sSystemTips = t.readString(6, false, this.sSystemTips);
  this.bSendMessagePopUp = t.readBoolean(7, false, this.bSendMessagePopUp);
  this.sSendMessageTips = t.readString(8, false, this.sSendMessageTips);
  this.iSendMessagePopUpAmtTime = t.readInt32(
    9,
    false,
    this.iSendMessagePopUpAmtTime
  );
};
HUYA.AttendeeCountNotice = function() {
  this.iAttendeeCount = 0;
};
HUYA.AttendeeCountNotice.prototype._clone = function() {
  return new HUYA.AttendeeCountNotice();
};
HUYA.AttendeeCountNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.AttendeeCountNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.AttendeeCountNotice.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iAttendeeCount);
};
HUYA.AttendeeCountNotice.prototype.readFrom = function(t) {
  this.iAttendeeCount = t.readInt32(0, false, this.iAttendeeCount);
};
HUYA.ExternalUser = function() {
  this.sId = '';
  this.sToken = '';
  this.sOther = '';
};
HUYA.ExternalUser.prototype._clone = function() {
  return new HUYA.ExternalUser();
};
HUYA.ExternalUser.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.ExternalUser.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.ExternalUser.prototype.writeTo = function(t) {
  t.writeString(0, this.sId);
  t.writeString(1, this.sToken);
  t.writeString(2, this.sOther);
};
HUYA.ExternalUser.prototype.readFrom = function(t) {
  this.sId = t.readString(0, false, this.sId);
  this.sToken = t.readString(1, false, this.sToken);
  this.sOther = t.readString(2, false, this.sOther);
};
HUYA.VipCardReq = function() {
  this.tUserId = new HUYA.UserId();
  this.lTid = 0;
  this.lSid = 0;
  this.lPid = 0;
  this.lUid = 0;
};
HUYA.VipCardReq.prototype._clone = function() {
  return new HUYA.VipCardReq();
};
HUYA.VipCardReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.VipCardReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.VipCardReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tUserId);
  t.writeInt64(1, this.lTid);
  t.writeInt64(2, this.lSid);
  t.writeInt64(3, this.lPid);
  t.writeInt64(4, this.lUid);
};
HUYA.VipCardReq.prototype.readFrom = function(t) {
  this.tUserId = t.readStruct(0, false, this.tUserId);
  this.lTid = t.readInt64(1, false, this.lTid);
  this.lSid = t.readInt64(2, false, this.lSid);
  this.lPid = t.readInt64(3, false, this.lPid);
  this.lUid = t.readInt64(4, false, this.lUid);
};
HUYA.VipCardRsp = function() {
  this.lUid = 0;
  this.sNickName = '';
  this.tNobleInfo = new HUYA.NobleInfo();
  this.tGuardInfo = new HUYA.GuardInfo();
  this.tFansInfo = new HUYA.FansInfoEx();
  this.sLogoURL = '';
  this.iUserLevel = 0;
  this.iGender = 0;
  this.iAge = 0;
  this.sSign = '';
  this.sLocation = '';
  this.sUserPageUrl = '';
  this.sArea = '';
  this.sPresenterName = '';
  this.iSubscribeStatus = 0;
  this.iSubscribedCount = 0;
};
HUYA.VipCardRsp.prototype._clone = function() {
  return new HUYA.VipCardRsp();
};
HUYA.VipCardRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.VipCardRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.VipCardRsp.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeString(1, this.sNickName);
  t.writeStruct(2, this.tNobleInfo);
  t.writeStruct(3, this.tGuardInfo);
  t.writeStruct(4, this.tFansInfo);
  t.writeString(5, this.sLogoURL);
  t.writeInt32(6, this.iUserLevel);
  t.writeInt32(7, this.iGender);
  t.writeInt32(8, this.iAge);
  t.writeString(9, this.sSign);
  t.writeString(10, this.sLocation);
  t.writeString(11, this.sUserPageUrl);
  t.writeString(12, this.sArea);
  t.writeString(13, this.sPresenterName);
  t.writeInt32(14, this.iSubscribeStatus);
  t.writeInt32(15, this.iSubscribedCount);
};
HUYA.VipCardRsp.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.sNickName = t.readString(1, false, this.sNickName);
  this.tNobleInfo = t.readStruct(2, false, this.tNobleInfo);
  this.tGuardInfo = t.readStruct(3, false, this.tGuardInfo);
  this.tFansInfo = t.readStruct(4, false, this.tFansInfo);
  this.sLogoURL = t.readString(5, false, this.sLogoURL);
  this.iUserLevel = t.readInt32(6, false, this.iUserLevel);
  this.iGender = t.readInt32(7, false, this.iGender);
  this.iAge = t.readInt32(8, false, this.iAge);
  this.sSign = t.readString(9, false, this.sSign);
  this.sLocation = t.readString(10, false, this.sLocation);
  this.sUserPageUrl = t.readString(11, false, this.sUserPageUrl);
  this.sArea = t.readString(12, false, this.sArea);
  this.sPresenterName = t.readString(13, false, this.sPresenterName);
  this.iSubscribeStatus = t.readInt32(14, false, this.iSubscribeStatus);
  this.iSubscribedCount = t.readInt32(15, false, this.iSubscribedCount);
};
HUYA.FansInfoEx = function() {
  this.lUid = 0;
  this.lBadgeId = 0;
  this.sBadgeName = '';
  this.iBadgeLevel = 0;
  this.iScore = 0;
};
HUYA.FansInfoEx.prototype._clone = function() {
  return new HUYA.FansInfoEx();
};
HUYA.FansInfoEx.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.FansInfoEx.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.FansInfoEx.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeInt64(1, this.lBadgeId);
  t.writeString(2, this.sBadgeName);
  t.writeInt32(3, this.iBadgeLevel);
  t.writeInt32(4, this.iScore);
};
HUYA.FansInfoEx.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.lBadgeId = t.readInt64(1, false, this.lBadgeId);
  this.sBadgeName = t.readString(2, false, this.sBadgeName);
  this.iBadgeLevel = t.readInt32(3, false, this.iBadgeLevel);
  this.iScore = t.readInt32(4, false, this.iScore);
};
HUYA.WeekStarPropsIds = function() {
  this.vPropsId = new Taf.Vector(new Taf.INT64());
  this.iType = 0;
  this.iAppShowType = 0;
  this.iWeekStarType = 0;
  this.iGameID = 0;
};
HUYA.WeekStarPropsIds.prototype._clone = function() {
  return new HUYA.WeekStarPropsIds();
};
HUYA.WeekStarPropsIds.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.WeekStarPropsIds.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.WeekStarPropsIds.prototype.writeTo = function(t) {
  t.writeVector(0, this.vPropsId);
  t.writeInt32(1, this.iType);
  t.writeInt32(2, this.iAppShowType);
  t.writeInt32(3, this.iWeekStarType);
  t.writeInt32(4, this.iGameID);
};
HUYA.WeekStarPropsIds.prototype.readFrom = function(t) {
  this.vPropsId = t.readVector(0, false, this.vPropsId);
  this.iType = t.readInt32(1, false, this.iType);
  this.iAppShowType = t.readInt32(2, false, this.iAppShowType);
  this.iWeekStarType = t.readInt32(3, false, this.iWeekStarType);
  this.iGameID = t.readInt32(4, false, this.iGameID);
};
HUYA.WeekStarPropsIdsReq = function() {
  this.tUserId = new HUYA.UserId();
  this.iWeekStarType = 0;
  this.iGameID = 0;
};
HUYA.WeekStarPropsIdsReq.prototype._clone = function() {
  return new HUYA.WeekStarPropsIdsReq();
};
HUYA.WeekStarPropsIdsReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.WeekStarPropsIdsReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.WeekStarPropsIdsReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tUserId);
  t.writeInt32(1, this.iWeekStarType);
  t.writeInt32(2, this.iGameID);
};
HUYA.WeekStarPropsIdsReq.prototype.readFrom = function(t) {
  this.tUserId = t.readStruct(0, false, this.tUserId);
  this.iWeekStarType = t.readInt32(1, false, this.iWeekStarType);
  this.iGameID = t.readInt32(2, false, this.iGameID);
};
HUYA.WeekStarPropsIdsTab = function() {
  this.mapType2Props = new Taf.Map(
    new Taf.INT32(),
    new HUYA.WeekStarPropsIds()
  );
};
HUYA.WeekStarPropsIdsTab.prototype._clone = function() {
  return new HUYA.WeekStarPropsIdsTab();
};
HUYA.WeekStarPropsIdsTab.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.WeekStarPropsIdsTab.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.WeekStarPropsIdsTab.prototype.writeTo = function(t) {
  t.writeMap(0, this.mapType2Props);
};
HUYA.WeekStarPropsIdsTab.prototype.readFrom = function(t) {
  this.mapType2Props = t.readMap(0, false, this.mapType2Props);
};
HUYA.VipEnterBanner = function() {
  this.lUid = 0;
  this.sNickName = '';
  this.lPid = 0;
  this.tNobleInfo = new HUYA.NobleInfo();
  this.tGuardInfo = new HUYA.GuardInfo();
  this.tWeekRankInfo = new HUYA.WeekRankInfo();
  this.sLogoURL = '';
  this.bFromNearby = false;
  this.sLocation = '';
};
HUYA.VipEnterBanner.prototype._clone = function() {
  return new HUYA.VipEnterBanner();
};
HUYA.VipEnterBanner.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.VipEnterBanner.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.VipEnterBanner.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeString(1, this.sNickName);
  t.writeInt64(2, this.lPid);
  t.writeStruct(3, this.tNobleInfo);
  t.writeStruct(4, this.tGuardInfo);
  t.writeStruct(5, this.tWeekRankInfo);
  t.writeString(6, this.sLogoURL);
  t.writeBoolean(7, this.bFromNearby);
  t.writeString(8, this.sLocation);
};
HUYA.VipEnterBanner.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.sNickName = t.readString(1, false, this.sNickName);
  this.lPid = t.readInt64(2, false, this.lPid);
  this.tNobleInfo = t.readStruct(3, false, this.tNobleInfo);
  this.tGuardInfo = t.readStruct(4, false, this.tGuardInfo);
  this.tWeekRankInfo = t.readStruct(5, false, this.tWeekRankInfo);
  this.sLogoURL = t.readString(6, false, this.sLogoURL);
  this.bFromNearby = t.readBoolean(7, false, this.bFromNearby);
  this.sLocation = t.readString(8, false, this.sLocation);
};
HUYA.WeekRankInfo = function() {
  this.lUid = 0;
  this.iRank = 0;
};
HUYA.WeekRankInfo.prototype._clone = function() {
  return new HUYA.WeekRankInfo();
};
HUYA.WeekRankInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.WeekRankInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.WeekRankInfo.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeInt32(1, this.iRank);
};
HUYA.WeekRankInfo.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.iRank = t.readInt32(1, false, this.iRank);
};
HUYA.UserLevelUpgradeNotice = function() {
  this.lUid = 0;
  this.iNewLevel = 0;
  this.iOldLevel = 0;
};
HUYA.UserLevelUpgradeNotice.prototype._clone = function() {
  return new HUYA.UserLevelUpgradeNotice();
};
HUYA.UserLevelUpgradeNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.UserLevelUpgradeNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.UserLevelUpgradeNotice.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeInt32(1, this.iNewLevel);
  t.writeInt32(2, this.iOldLevel);
};
HUYA.UserLevelUpgradeNotice.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.iNewLevel = t.readInt32(1, false, this.iNewLevel);
  this.iOldLevel = t.readInt32(2, false, this.iOldLevel);
};
HUYA.UserNovieTaskCompleteNotice = function() {
  this.lUid = 0;
  this.tInfo = new HUYA.UserTaskInfo();
};
HUYA.UserNovieTaskCompleteNotice.prototype._clone = function() {
  return new HUYA.UserNovieTaskCompleteNotice();
};
HUYA.UserNovieTaskCompleteNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.UserNovieTaskCompleteNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.UserNovieTaskCompleteNotice.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeStruct(1, this.tInfo);
};
HUYA.UserNovieTaskCompleteNotice.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.tInfo = t.readStruct(1, false, this.tInfo);
};
HUYA.UserTaskInfo = function() {
  this.iId = 0;
  this.sName = '';
  this.sDesc = '';
  this.iType = 0;
  this.iProgressMode = 0;
  this.iTargetLevel = 0;
  this.tSubTaskTargetLevel = new Taf.Map(new Taf.STRING(), new Taf.INT32());
  this.sClassName = '';
  this.bEnable = true;
  this.iProgress = 0;
  this.bAwardPrize = true;
  this.tPrize = new Taf.Map(new Taf.STRING(), new Taf.INT32());
  this.sIcon = '';
  this.iExper = 0;
  this.iDisplay = 0;
  this.sMobileDesc = '';
};
HUYA.UserTaskInfo.prototype._clone = function() {
  return new HUYA.UserTaskInfo();
};
HUYA.UserTaskInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.UserTaskInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.UserTaskInfo.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iId);
  t.writeString(1, this.sName);
  t.writeString(2, this.sDesc);
  t.writeInt32(3, this.iType);
  t.writeInt32(4, this.iProgressMode);
  t.writeInt32(5, this.iTargetLevel);
  t.writeMap(6, this.tSubTaskTargetLevel);
  t.writeString(7, this.sClassName);
  t.writeBoolean(8, this.bEnable);
  t.writeInt32(9, this.iProgress);
  t.writeBoolean(10, this.bAwardPrize);
  t.writeMap(11, this.tPrize);
  t.writeString(12, this.sIcon);
  t.writeInt32(13, this.iExper);
  t.writeInt32(14, this.iDisplay);
  t.writeString(15, this.sMobileDesc);
};
HUYA.UserTaskInfo.prototype.readFrom = function(t) {
  this.iId = t.readInt32(0, false, this.iId);
  this.sName = t.readString(1, false, this.sName);
  this.sDesc = t.readString(2, false, this.sDesc);
  this.iType = t.readInt32(3, false, this.iType);
  this.iProgressMode = t.readInt32(4, false, this.iProgressMode);
  this.iTargetLevel = t.readInt32(5, false, this.iTargetLevel);
  this.tSubTaskTargetLevel = t.readMap(6, false, this.tSubTaskTargetLevel);
  this.sClassName = t.readString(7, false, this.sClassName);
  this.bEnable = t.readBoolean(8, false, this.bEnable);
  this.iProgress = t.readInt32(9, false, this.iProgress);
  this.bAwardPrize = t.readBoolean(10, false, this.bAwardPrize);
  this.tPrize = t.readMap(11, false, this.tPrize);
  this.sIcon = t.readString(12, false, this.sIcon);
  this.iExper = t.readInt32(13, false, this.iExper);
  this.iDisplay = t.readInt32(14, false, this.iDisplay);
  this.sMobileDesc = t.readString(15, false, this.sMobileDesc);
};
HUYA.GetGameInfoListReq = function() {
  this.tId = new HUYA.UserId();
  this.lTopSid = 0;
  this.lSubSid = 0;
  this.lPid = 0;
};
HUYA.GetGameInfoListReq.prototype._clone = function() {
  return new HUYA.GetGameInfoListReq();
};
HUYA.GetGameInfoListReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetGameInfoListReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetGameInfoListReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeInt64(1, this.lTopSid);
  t.writeInt64(2, this.lSubSid);
  t.writeInt64(3, this.lPid);
};
HUYA.GetGameInfoListReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.lTopSid = t.readInt64(1, false, this.lTopSid);
  this.lSubSid = t.readInt64(2, false, this.lSubSid);
  this.lPid = t.readInt64(3, false, this.lPid);
};
HUYA.GetGameInfoListRsp = function() {
  this.vGameNoticeInfoList = new Taf.Vector(new HUYA.GameNoticeInfoList());
};
HUYA.GetGameInfoListRsp.prototype._clone = function() {
  return new HUYA.GetGameInfoListRsp();
};
HUYA.GetGameInfoListRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetGameInfoListRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetGameInfoListRsp.prototype.writeTo = function(t) {
  t.writeVector(0, this.vGameNoticeInfoList);
};
HUYA.GetGameInfoListRsp.prototype.readFrom = function(t) {
  this.vGameNoticeInfoList = t.readVector(0, false, this.vGameNoticeInfoList);
};
HUYA.GetRemainBeanNumReq = function() {
  this.tId = new HUYA.UserId();
  this.lTopSid = 0;
  this.lSubSid = 0;
  this.lPid = 0;
  this.iUnitId = 0;
  this.iBetOdds = 0;
};
HUYA.GetRemainBeanNumReq.prototype._clone = function() {
  return new HUYA.GetRemainBeanNumReq();
};
HUYA.GetRemainBeanNumReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetRemainBeanNumReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetRemainBeanNumReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeInt64(1, this.lTopSid);
  t.writeInt64(2, this.lSubSid);
  t.writeInt64(3, this.lPid);
  t.writeInt32(4, this.iUnitId);
  t.writeInt32(5, this.iBetOdds);
};
HUYA.GetRemainBeanNumReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.lTopSid = t.readInt64(1, false, this.lTopSid);
  this.lSubSid = t.readInt64(2, false, this.lSubSid);
  this.lPid = t.readInt64(3, false, this.lPid);
  this.iUnitId = t.readInt32(4, false, this.iUnitId);
  this.iBetOdds = t.readInt32(5, false, this.iBetOdds);
};
HUYA.GetRemainBeanNumRsp = function() {
  this.iCode = 0;
  this.iBetType = 0;
  this.iBetRemainNum = 0;
  this.iBuyAllNum = 0;
  this.lBetRemainNum = 0;
  this.lBuyAllNum = 0;
};
HUYA.GetRemainBeanNumRsp.prototype._clone = function() {
  return new HUYA.GetRemainBeanNumRsp();
};
HUYA.GetRemainBeanNumRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetRemainBeanNumRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetRemainBeanNumRsp.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iCode);
  t.writeInt32(1, this.iBetType);
  t.writeInt32(2, this.iBetRemainNum);
  t.writeInt32(3, this.iBuyAllNum);
  t.writeInt64(4, this.lBetRemainNum);
  t.writeInt64(5, this.lBuyAllNum);
};
HUYA.GetRemainBeanNumRsp.prototype.readFrom = function(t) {
  this.iCode = t.readInt32(0, false, this.iCode);
  this.iBetType = t.readInt32(1, false, this.iBetType);
  this.iBetRemainNum = t.readInt32(2, false, this.iBetRemainNum);
  this.iBuyAllNum = t.readInt32(3, false, this.iBuyAllNum);
  this.lBetRemainNum = t.readInt64(4, false, this.lBetRemainNum);
  this.lBuyAllNum = t.readInt64(5, false, this.lBuyAllNum);
};
HUYA.QueryPackageReq = function() {
  this.tId = new HUYA.UserId();
  this.lTopSid = 0;
  this.lSubSid = 0;
};
HUYA.QueryPackageReq.prototype._clone = function() {
  return new HUYA.QueryPackageReq();
};
HUYA.QueryPackageReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.QueryPackageReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.QueryPackageReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeInt64(1, this.lTopSid);
  t.writeInt64(2, this.lSubSid);
};
HUYA.QueryPackageReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.lTopSid = t.readInt64(1, false, this.lTopSid);
  this.lSubSid = t.readInt64(2, false, this.lSubSid);
};
HUYA.QueryPackageRsp = function() {
  this.iCode = 0;
  this.iItemWhiteBeanCount = 0;
  this.iItemGreenBeanCount = 0;
  this.lItemWhiteBeanCount = 0;
  this.lItemGreenBeanCount = 0;
};
HUYA.QueryPackageRsp.prototype._clone = function() {
  return new HUYA.QueryPackageRsp();
};
HUYA.QueryPackageRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.QueryPackageRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.QueryPackageRsp.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iCode);
  t.writeInt32(1, this.iItemWhiteBeanCount);
  t.writeInt32(2, this.iItemGreenBeanCount);
  t.writeInt64(3, this.lItemWhiteBeanCount);
  t.writeInt64(4, this.lItemGreenBeanCount);
};
HUYA.QueryPackageRsp.prototype.readFrom = function(t) {
  this.iCode = t.readInt32(0, false, this.iCode);
  this.iItemWhiteBeanCount = t.readInt32(1, false, this.iItemWhiteBeanCount);
  this.iItemGreenBeanCount = t.readInt32(2, false, this.iItemGreenBeanCount);
  this.lItemWhiteBeanCount = t.readInt64(3, false, this.lItemWhiteBeanCount);
  this.lItemGreenBeanCount = t.readInt64(4, false, this.lItemGreenBeanCount);
};
HUYA.BuyBetReq = function() {
  this.tId = new HUYA.UserId();
  this.lTopSid = 0;
  this.lSubSid = 0;
  this.lPid = 0;
  this.iUnitId = 0;
  this.iBetOdds = 0;
  this.sUserName = '';
  this.iExchangeAmount = 0;
  this.sTokencakey = '';
};
HUYA.BuyBetReq.prototype._clone = function() {
  return new HUYA.BuyBetReq();
};
HUYA.BuyBetReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.BuyBetReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.BuyBetReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeInt64(1, this.lTopSid);
  t.writeInt64(2, this.lSubSid);
  t.writeInt64(3, this.lPid);
  t.writeInt32(4, this.iUnitId);
  t.writeInt32(5, this.iBetOdds);
  t.writeString(6, this.sUserName);
  t.writeInt32(7, this.iExchangeAmount);
  t.writeString(8, this.sTokencakey);
};
HUYA.BuyBetReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.lTopSid = t.readInt64(1, false, this.lTopSid);
  this.lSubSid = t.readInt64(2, false, this.lSubSid);
  this.lPid = t.readInt64(3, false, this.lPid);
  this.iUnitId = t.readInt32(4, false, this.iUnitId);
  this.iBetOdds = t.readInt32(5, false, this.iBetOdds);
  this.sUserName = t.readString(6, false, this.sUserName);
  this.iExchangeAmount = t.readInt32(7, false, this.iExchangeAmount);
  this.sTokencakey = t.readString(8, false, this.sTokencakey);
};
HUYA.BuyBetRsp = function() {
  this.iCode = 0;
  this.iBetType = 0;
  this.iBetOdds = 0;
  this.iSuccessExchangeAmount = 0;
  this.iFailedExchangeAmount = 0;
  this.iNestBestOdds = 0;
};
HUYA.BuyBetRsp.prototype._clone = function() {
  return new HUYA.BuyBetRsp();
};
HUYA.BuyBetRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.BuyBetRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.BuyBetRsp.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iCode);
  t.writeInt32(1, this.iBetType);
  t.writeInt32(2, this.iBetOdds);
  t.writeInt32(3, this.iSuccessExchangeAmount);
  t.writeInt32(4, this.iFailedExchangeAmount);
  t.writeInt32(5, this.iNestBestOdds);
};
HUYA.BuyBetRsp.prototype.readFrom = function(t) {
  this.iCode = t.readInt32(0, false, this.iCode);
  this.iBetType = t.readInt32(1, false, this.iBetType);
  this.iBetOdds = t.readInt32(2, false, this.iBetOdds);
  this.iSuccessExchangeAmount = t.readInt32(
    3,
    false,
    this.iSuccessExchangeAmount
  );
  this.iFailedExchangeAmount = t.readInt32(
    4,
    false,
    this.iFailedExchangeAmount
  );
  this.iNestBestOdds = t.readInt32(5, false, this.iNestBestOdds);
};
HUYA.BetReq = function() {
  this.tId = new HUYA.UserId();
  this.lTopSid = 0;
  this.lSubSid = 0;
  this.lPid = 0;
  this.sBankerName = '';
  this.iBetAmount = 0;
  this.iBetOdds = 0;
  this.iGameUnitId = 0;
  this.iBetType = 0;
  this.sTokencakey = '';
};
HUYA.BetReq.prototype._clone = function() {
  return new HUYA.BetReq();
};
HUYA.BetReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.BetReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.BetReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeInt64(1, this.lTopSid);
  t.writeInt64(2, this.lSubSid);
  t.writeInt64(3, this.lPid);
  t.writeString(4, this.sBankerName);
  t.writeInt32(5, this.iBetAmount);
  t.writeInt32(6, this.iBetOdds);
  t.writeInt32(7, this.iGameUnitId);
  t.writeInt32(8, this.iBetType);
  t.writeString(9, this.sTokencakey);
};
HUYA.BetReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.lTopSid = t.readInt64(1, false, this.lTopSid);
  this.lSubSid = t.readInt64(2, false, this.lSubSid);
  this.lPid = t.readInt64(3, false, this.lPid);
  this.sBankerName = t.readString(4, false, this.sBankerName);
  this.iBetAmount = t.readInt32(5, false, this.iBetAmount);
  this.iBetOdds = t.readInt32(6, false, this.iBetOdds);
  this.iGameUnitId = t.readInt32(7, false, this.iGameUnitId);
  this.iBetType = t.readInt32(8, false, this.iBetType);
  this.sTokencakey = t.readString(9, false, this.sTokencakey);
};
HUYA.BetRsp = function() {
  this.iCode = 0;
};
HUYA.BetRsp.prototype._clone = function() {
  return new HUYA.BetRsp();
};
HUYA.BetRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.BetRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.BetRsp.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iCode);
};
HUYA.BetRsp.prototype.readFrom = function(t) {
  this.iCode = t.readInt32(0, false, this.iCode);
};
HUYA.MyBetInfo = function() {
  this.iBetId = 0;
  this.sBankerName = '';
  this.iOperationType = 0;
  this.iBetType = 0;
  this.iBetAmount = 0;
  this.iBetExchangeAmount = 0;
  this.iBetOdds = 0;
  this.lBetTime = 0;
  this.sBetWinnerName = '';
  this.sGameName = '';
  this.lBetExchangeAmount = 0;
};
HUYA.MyBetInfo.prototype._clone = function() {
  return new HUYA.MyBetInfo();
};
HUYA.MyBetInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.MyBetInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.MyBetInfo.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iBetId);
  t.writeString(1, this.sBankerName);
  t.writeInt32(2, this.iOperationType);
  t.writeInt32(3, this.iBetType);
  t.writeInt32(4, this.iBetAmount);
  t.writeInt32(5, this.iBetExchangeAmount);
  t.writeInt32(6, this.iBetOdds);
  t.writeInt64(7, this.lBetTime);
  t.writeString(8, this.sBetWinnerName);
  t.writeString(9, this.sGameName);
  t.writeInt64(10, this.lBetExchangeAmount);
};
HUYA.MyBetInfo.prototype.readFrom = function(t) {
  this.iBetId = t.readInt32(0, false, this.iBetId);
  this.sBankerName = t.readString(1, false, this.sBankerName);
  this.iOperationType = t.readInt32(2, false, this.iOperationType);
  this.iBetType = t.readInt32(3, false, this.iBetType);
  this.iBetAmount = t.readInt32(4, false, this.iBetAmount);
  this.iBetExchangeAmount = t.readInt32(5, false, this.iBetExchangeAmount);
  this.iBetOdds = t.readInt32(6, false, this.iBetOdds);
  this.lBetTime = t.readInt64(7, false, this.lBetTime);
  this.sBetWinnerName = t.readString(8, false, this.sBetWinnerName);
  this.sGameName = t.readString(9, false, this.sGameName);
  this.lBetExchangeAmount = t.readInt64(10, false, this.lBetExchangeAmount);
};
HUYA.BatchGameInfoNotice = function() {
  this.vGameNoticeInfoList = new Taf.Vector(new HUYA.GameNoticeInfoList());
  this.lTopSid = 0;
  this.lSubSid = 0;
};
HUYA.BatchGameInfoNotice.prototype._clone = function() {
  return new HUYA.BatchGameInfoNotice();
};
HUYA.BatchGameInfoNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.BatchGameInfoNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.BatchGameInfoNotice.prototype.writeTo = function(t) {
  t.writeVector(0, this.vGameNoticeInfoList);
  t.writeInt64(1, this.lTopSid);
  t.writeInt64(2, this.lSubSid);
};
HUYA.BatchGameInfoNotice.prototype.readFrom = function(t) {
  this.vGameNoticeInfoList = t.readVector(0, false, this.vGameNoticeInfoList);
  this.lTopSid = t.readInt64(1, false, this.lTopSid);
  this.lSubSid = t.readInt64(2, false, this.lSubSid);
};
HUYA.GameNoticeInfoList = function() {
  this.vGameNoticeInfo = new Taf.Vector(new HUYA.GameNoticeInfo());
};
HUYA.GameNoticeInfoList.prototype._clone = function() {
  return new HUYA.GameNoticeInfoList();
};
HUYA.GameNoticeInfoList.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GameNoticeInfoList.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GameNoticeInfoList.prototype.writeTo = function(t) {
  t.writeVector(0, this.vGameNoticeInfo);
};
HUYA.GameNoticeInfoList.prototype.readFrom = function(t) {
  this.vGameNoticeInfo = t.readVector(0, false, this.vGameNoticeInfo);
};
HUYA.GameNoticeInfo = function() {
  this.iGameId = 0;
  this.iGameStats = 0;
  this.lGameStarterUid = 0;
  this.sGameName = '';
  this.lGameStarttime = 0;
  this.sGameDescription = '';
  this.vGameUnitInfo = new Taf.Vector(new HUYA.GameUnitInfoV1());
  this.iStarterTotalGames = 0;
  this.iStarterUncloseGames = 0;
  this.iStarterCreditValue = 0;
  this.iExchangeCredit = 0;
  this.iBetType = 0;
};
HUYA.GameNoticeInfo.prototype._clone = function() {
  return new HUYA.GameNoticeInfo();
};
HUYA.GameNoticeInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GameNoticeInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GameNoticeInfo.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iGameId);
  t.writeInt32(1, this.iGameStats);
  t.writeInt64(2, this.lGameStarterUid);
  t.writeString(3, this.sGameName);
  t.writeInt64(4, this.lGameStarttime);
  t.writeString(5, this.sGameDescription);
  t.writeVector(6, this.vGameUnitInfo);
  t.writeInt32(7, this.iStarterTotalGames);
  t.writeInt32(8, this.iStarterUncloseGames);
  t.writeInt32(9, this.iStarterCreditValue);
  t.writeInt32(10, this.iExchangeCredit);
  t.writeInt32(11, this.iBetType);
};
HUYA.GameNoticeInfo.prototype.readFrom = function(t) {
  this.iGameId = t.readInt32(0, false, this.iGameId);
  this.iGameStats = t.readInt32(1, false, this.iGameStats);
  this.lGameStarterUid = t.readInt64(2, false, this.lGameStarterUid);
  this.sGameName = t.readString(3, false, this.sGameName);
  this.lGameStarttime = t.readInt64(4, false, this.lGameStarttime);
  this.sGameDescription = t.readString(5, false, this.sGameDescription);
  this.vGameUnitInfo = t.readVector(6, false, this.vGameUnitInfo);
  this.iStarterTotalGames = t.readInt32(7, false, this.iStarterTotalGames);
  this.iStarterUncloseGames = t.readInt32(8, false, this.iStarterUncloseGames);
  this.iStarterCreditValue = t.readInt32(9, false, this.iStarterCreditValue);
  this.iExchangeCredit = t.readInt32(10, false, this.iExchangeCredit);
  this.iBetType = t.readInt32(11, false, this.iBetType);
};
HUYA.GameInfoChangeNotice = function() {
  this.iGameId = 0;
  this.iGameStats = 0;
  this.vGameUnitInfo = new Taf.Vector(new HUYA.GameUnitInfoV1());
  this.lTopSid = 0;
  this.lSubSid = 0;
};
HUYA.GameInfoChangeNotice.prototype._clone = function() {
  return new HUYA.GameInfoChangeNotice();
};
HUYA.GameInfoChangeNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GameInfoChangeNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GameInfoChangeNotice.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iGameId);
  t.writeInt32(1, this.iGameStats);
  t.writeVector(2, this.vGameUnitInfo);
  t.writeInt64(3, this.lTopSid);
  t.writeInt64(4, this.lSubSid);
};
HUYA.GameInfoChangeNotice.prototype.readFrom = function(t) {
  this.iGameId = t.readInt32(0, false, this.iGameId);
  this.iGameStats = t.readInt32(1, false, this.iGameStats);
  this.vGameUnitInfo = t.readVector(2, false, this.vGameUnitInfo);
  this.lTopSid = t.readInt64(3, false, this.lTopSid);
  this.lSubSid = t.readInt64(4, false, this.lSubSid);
};
HUYA.GameUnitInfoV1 = function() {
  this.iGameUnitId = 0;
  this.sGameUnitName = '';
  this.iBetOdds = 0;
  this.iBetExchangeAmount = 0;
  this.lBetExchangeAmount = 0;
};
HUYA.GameUnitInfoV1.prototype._clone = function() {
  return new HUYA.GameUnitInfoV1();
};
HUYA.GameUnitInfoV1.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GameUnitInfoV1.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GameUnitInfoV1.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iGameUnitId);
  t.writeString(1, this.sGameUnitName);
  t.writeInt32(2, this.iBetOdds);
  t.writeInt32(3, this.iBetExchangeAmount);
  t.writeInt64(4, this.lBetExchangeAmount);
};
HUYA.GameUnitInfoV1.prototype.readFrom = function(t) {
  this.iGameUnitId = t.readInt32(0, false, this.iGameUnitId);
  this.sGameUnitName = t.readString(1, false, this.sGameUnitName);
  this.iBetOdds = t.readInt32(2, false, this.iBetOdds);
  this.iBetExchangeAmount = t.readInt32(3, false, this.iBetExchangeAmount);
  this.lBetExchangeAmount = t.readInt64(4, false, this.lBetExchangeAmount);
};
HUYA.EndHistoryGameNotice = function() {
  this.vHistoryGameInfo = new Taf.Vector(new HUYA.HistoryGameInfo());
  this.lTopSid = 0;
  this.lSubSid = 0;
};
HUYA.EndHistoryGameNotice.prototype._clone = function() {
  return new HUYA.EndHistoryGameNotice();
};
HUYA.EndHistoryGameNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.EndHistoryGameNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.EndHistoryGameNotice.prototype.writeTo = function(t) {
  t.writeVector(0, this.vHistoryGameInfo);
  t.writeInt64(1, this.lTopSid);
  t.writeInt64(2, this.lSubSid);
};
HUYA.EndHistoryGameNotice.prototype.readFrom = function(t) {
  this.vHistoryGameInfo = t.readVector(0, false, this.vHistoryGameInfo);
  this.lTopSid = t.readInt64(1, false, this.lTopSid);
  this.lSubSid = t.readInt64(2, false, this.lSubSid);
};
HUYA.HistoryGameInfo = function() {
  this.sTopicName = '';
  this.iBreakFlag = 0;
  this.sWinnerName = '';
};
HUYA.HistoryGameInfo.prototype._clone = function() {
  return new HUYA.HistoryGameInfo();
};
HUYA.HistoryGameInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.HistoryGameInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.HistoryGameInfo.prototype.writeTo = function(t) {
  t.writeString(0, this.sTopicName);
  t.writeInt32(1, this.iBreakFlag);
  t.writeString(2, this.sWinnerName);
};
HUYA.HistoryGameInfo.prototype.readFrom = function(t) {
  this.sTopicName = t.readString(0, false, this.sTopicName);
  this.iBreakFlag = t.readInt32(1, false, this.iBreakFlag);
  this.sWinnerName = t.readString(2, false, this.sWinnerName);
};
HUYA.GameSettlementNotice = function() {
  this.vGameUnitNames = new Taf.Vector(new Taf.STRING());
  this.iWinnerUnitId = 0;
  this.iBetIncome = 0;
  this.iBuyIncome = 0;
  this.lGameTime = 0;
  this.vMyInfoList = new Taf.Vector(new HUYA.MyBetInfo());
  this.iGameId = 0;
};
HUYA.GameSettlementNotice.prototype._clone = function() {
  return new HUYA.GameSettlementNotice();
};
HUYA.GameSettlementNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GameSettlementNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GameSettlementNotice.prototype.writeTo = function(t) {
  t.writeVector(0, this.vGameUnitNames);
  t.writeInt32(1, this.iWinnerUnitId);
  t.writeInt32(2, this.iBetIncome);
  t.writeInt32(3, this.iBuyIncome);
  t.writeInt64(4, this.lGameTime);
  t.writeVector(5, this.vMyInfoList);
  t.writeInt32(6, this.iGameId);
};
HUYA.GameSettlementNotice.prototype.readFrom = function(t) {
  this.vGameUnitNames = t.readVector(0, false, this.vGameUnitNames);
  this.iWinnerUnitId = t.readInt32(1, false, this.iWinnerUnitId);
  this.iBetIncome = t.readInt32(2, false, this.iBetIncome);
  this.iBuyIncome = t.readInt32(3, false, this.iBuyIncome);
  this.lGameTime = t.readInt64(4, false, this.lGameTime);
  this.vMyInfoList = t.readVector(5, false, this.vMyInfoList);
  this.iGameId = t.readInt32(6, false, this.iGameId);
};
HUYA.PresenterEndGameNotice = function() {
  this.iGameId = 0;
  this.iGameUnitId = 0;
  this.iGameResult = 0;
};
HUYA.PresenterEndGameNotice.prototype._clone = function() {
  return new HUYA.PresenterEndGameNotice();
};
HUYA.PresenterEndGameNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.PresenterEndGameNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.PresenterEndGameNotice.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iGameId);
  t.writeInt32(1, this.iGameUnitId);
  t.writeInt32(2, this.iGameResult);
};
HUYA.PresenterEndGameNotice.prototype.readFrom = function(t) {
  this.iGameId = t.readInt32(0, false, this.iGameId);
  this.iGameUnitId = t.readInt32(1, false, this.iGameUnitId);
  this.iGameResult = t.readInt32(2, false, this.iGameResult);
};
HUYA.GetAssistantReq = function() {
  this.tId = new HUYA.UserId();
  this.lPid = 0;
  this.lAssistantUid = 0;
};
HUYA.GetAssistantReq.prototype._clone = function() {
  return new HUYA.GetAssistantReq();
};
HUYA.GetAssistantReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetAssistantReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetAssistantReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeInt64(1, this.lPid);
  t.writeInt64(2, this.lAssistantUid);
};
HUYA.GetAssistantReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.lPid = t.readInt64(1, false, this.lPid);
  this.lAssistantUid = t.readInt64(2, false, this.lAssistantUid);
};
HUYA.GetAssistantRsp = function() {
  this.iCode = 0;
  this.lAssistantUid = 0;
};
HUYA.GetAssistantRsp.prototype._clone = function() {
  return new HUYA.GetAssistantRsp();
};
HUYA.GetAssistantRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetAssistantRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetAssistantRsp.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iCode);
  t.writeInt64(1, this.lAssistantUid);
};
HUYA.GetAssistantRsp.prototype.readFrom = function(t) {
  this.iCode = t.readInt32(0, false, this.iCode);
  this.lAssistantUid = t.readInt64(1, false, this.lAssistantUid);
};
HUYA.ShowScreenSkinNotify = function() {
  this.data = new HUYA.ScreenSkinData();
};
HUYA.ShowScreenSkinNotify.prototype._clone = function() {
  return new HUYA.ShowScreenSkinNotify();
};
HUYA.ShowScreenSkinNotify.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.ShowScreenSkinNotify.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.ShowScreenSkinNotify.prototype.writeTo = function(t) {
  t.writeStruct(0, this.data);
};
HUYA.ShowScreenSkinNotify.prototype.readFrom = function(t) {
  this.data = t.readStruct(0, false, this.data);
};
HUYA.HideScreenSkinNotify = function() {
  this.lId = 0;
};
HUYA.HideScreenSkinNotify.prototype._clone = function() {
  return new HUYA.HideScreenSkinNotify();
};
HUYA.HideScreenSkinNotify.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.HideScreenSkinNotify.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.HideScreenSkinNotify.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lId);
};
HUYA.HideScreenSkinNotify.prototype.readFrom = function(t) {
  this.lId = t.readInt64(0, false, this.lId);
};
HUYA.ScreenSkinData = function() {
  this.lId = 0;
  this.sTitle = '';
  this.sPicUrl = '';
  this.iStatus = 0;
  this.iTemplate = 0;
  this.iPresenterUid = 0;
  this.sWebPicUrl = '';
};
HUYA.ScreenSkinData.prototype._clone = function() {
  return new HUYA.ScreenSkinData();
};
HUYA.ScreenSkinData.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.ScreenSkinData.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.ScreenSkinData.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lId);
  t.writeString(1, this.sTitle);
  t.writeString(2, this.sPicUrl);
  t.writeInt16(3, this.iStatus);
  t.writeInt32(4, this.iTemplate);
  t.writeInt64(5, this.iPresenterUid);
  t.writeString(6, this.sWebPicUrl);
};
HUYA.ScreenSkinData.prototype.readFrom = function(t) {
  this.lId = t.readInt64(0, false, this.lId);
  this.sTitle = t.readString(1, false, this.sTitle);
  this.sPicUrl = t.readString(2, false, this.sPicUrl);
  this.iStatus = t.readInt16(3, false, this.iStatus);
  this.iTemplate = t.readInt32(4, false, this.iTemplate);
  this.iPresenterUid = t.readInt64(5, false, this.iPresenterUid);
  this.sWebPicUrl = t.readString(6, false, this.sWebPicUrl);
};
HUYA.getScreenSkinReq = function() {
  this.tId = new HUYA.UserId();
  this.lPresenterUid = 0;
  this.iTemplate = 0;
  this.iFromType = 0;
};
HUYA.getScreenSkinReq.prototype._clone = function() {
  return new HUYA.getScreenSkinReq();
};
HUYA.getScreenSkinReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.getScreenSkinReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.getScreenSkinReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeInt64(1, this.lPresenterUid);
  t.writeInt32(2, this.iTemplate);
  t.writeInt32(3, this.iFromType);
};
HUYA.getScreenSkinReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.lPresenterUid = t.readInt64(1, false, this.lPresenterUid);
  this.iTemplate = t.readInt32(2, false, this.iTemplate);
  this.iFromType = t.readInt32(3, false, this.iFromType);
};
HUYA.getScreenSkinRsp = function() {
  this.iRetCode = 0;
  this.data = new HUYA.ScreenSkinData();
};
HUYA.getScreenSkinRsp.prototype._clone = function() {
  return new HUYA.getScreenSkinRsp();
};
HUYA.getScreenSkinRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.getScreenSkinRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.getScreenSkinRsp.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iRetCode);
  t.writeStruct(1, this.data);
};
HUYA.getScreenSkinRsp.prototype.readFrom = function(t) {
  this.iRetCode = t.readInt32(0, false, this.iRetCode);
  this.data = t.readStruct(1, false, this.data);
};
HUYA.GetRoomAuditConfReq = function() {
  this.tId = new HUYA.UserId();
  this.lTopCid = 0;
  this.lSubCid = 0;
  this.lPresenterUid = 0;
};
HUYA.GetRoomAuditConfReq.prototype._clone = function() {
  return new HUYA.GetRoomAuditConfReq();
};
HUYA.GetRoomAuditConfReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetRoomAuditConfReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetRoomAuditConfReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeInt64(1, this.lTopCid);
  t.writeInt64(2, this.lSubCid);
  t.writeInt64(3, this.lPresenterUid);
};
HUYA.GetRoomAuditConfReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.lTopCid = t.readInt64(1, false, this.lTopCid);
  this.lSubCid = t.readInt64(2, false, this.lSubCid);
  this.lPresenterUid = t.readInt64(3, false, this.lPresenterUid);
};
HUYA.GetRoomAuditConfRsp = function() {
  this.lPresenterUid = 0;
  this.vSpeakSwitchItem = new Taf.Vector(new HUYA.SpeakSwitchItem());
};
HUYA.GetRoomAuditConfRsp.prototype._clone = function() {
  return new HUYA.GetRoomAuditConfRsp();
};
HUYA.GetRoomAuditConfRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetRoomAuditConfRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetRoomAuditConfRsp.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lPresenterUid);
  t.writeVector(1, this.vSpeakSwitchItem);
};
HUYA.GetRoomAuditConfRsp.prototype.readFrom = function(t) {
  this.lPresenterUid = t.readInt64(0, false, this.lPresenterUid);
  this.vSpeakSwitchItem = t.readVector(1, false, this.vSpeakSwitchItem);
};
HUYA.SpeakSwitchItem = function() {
  this.iItemID = 0;
  this.iValue = 0;
};
HUYA.SpeakSwitchItem.prototype._clone = function() {
  return new HUYA.SpeakSwitchItem();
};
HUYA.SpeakSwitchItem.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.SpeakSwitchItem.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.SpeakSwitchItem.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iItemID);
  t.writeInt32(1, this.iValue);
};
HUYA.SpeakSwitchItem.prototype.readFrom = function(t) {
  this.iItemID = t.readInt32(0, false, this.iItemID);
  this.iValue = t.readInt32(1, false, this.iValue);
};
HUYA.ERoomAuditConfItem = {
  EItem_NormalNoSpeak: 1001,
  EItem_TextLimit: 1002,
  EItem_SpeakCD: 1003,
  EItem_ResetNoSpeakConf: 1004
};
HUYA.GetPresenterDetailReq = function() {
  this.tId = new HUYA.UserId();
  this.lUid = 0;
};
HUYA.GetPresenterDetailReq.prototype._clone = function() {
  return new HUYA.GetPresenterDetailReq();
};
HUYA.GetPresenterDetailReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetPresenterDetailReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetPresenterDetailReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeInt64(1, this.lUid);
};
HUYA.GetPresenterDetailReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.lUid = t.readInt64(1, false, this.lUid);
};
HUYA.GetPresenterDetailRsp = function() {
  this.mMiscInfo = new Taf.Map(new Taf.STRING(), new Taf.STRING());
  this.iStartTime = 0;
};
HUYA.GetPresenterDetailRsp.prototype._clone = function() {
  return new HUYA.GetPresenterDetailRsp();
};
HUYA.GetPresenterDetailRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetPresenterDetailRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetPresenterDetailRsp.prototype.writeTo = function(t) {
  t.writeMap(0, this.mMiscInfo);
  t.writeInt32(1, this.iStartTime);
};
HUYA.GetPresenterDetailRsp.prototype.readFrom = function(t) {
  this.mMiscInfo = t.readMap(0, false, this.mMiscInfo);
  this.iStartTime = t.readInt32(1, false, this.iStartTime);
};
HUYA.BadgeNameRsp = function() {
  this.lBadgeId = 0;
  this.sBadgeName = '';
};
HUYA.BadgeNameRsp.prototype._clone = function() {
  return new HUYA.BadgeNameRsp();
};
HUYA.BadgeNameRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.BadgeNameRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.BadgeNameRsp.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lBadgeId);
  t.writeString(1, this.sBadgeName);
};
HUYA.BadgeNameRsp.prototype.readFrom = function(t) {
  this.lBadgeId = t.readInt64(0, false, this.lBadgeId);
  this.sBadgeName = t.readString(1, false, this.sBadgeName);
};
HUYA.GameBaseInfo = function() {
  this.iId = 0;
  this.sFullName = '';
  this.sShortName = '';
  this.sIcon = '';
  this.iCategory = 0;
  this.sCategoryName = '';
  this.iExeId = 0;
};
HUYA.GameBaseInfo.prototype._clone = function() {
  return new HUYA.GameBaseInfo();
};
HUYA.GameBaseInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GameBaseInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GameBaseInfo.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iId);
  t.writeString(1, this.sFullName);
  t.writeString(2, this.sShortName);
  t.writeString(3, this.sIcon);
  t.writeInt32(4, this.iCategory);
  t.writeString(5, this.sCategoryName);
  t.writeInt32(6, this.iExeId);
};
HUYA.GameBaseInfo.prototype.readFrom = function(t) {
  this.iId = t.readInt32(0, false, this.iId);
  this.sFullName = t.readString(1, false, this.sFullName);
  this.sShortName = t.readString(2, false, this.sShortName);
  this.sIcon = t.readString(3, false, this.sIcon);
  this.iCategory = t.readInt32(4, false, this.iCategory);
  this.sCategoryName = t.readString(5, false, this.sCategoryName);
  this.iExeId = t.readInt32(6, false, this.iExeId);
};
HUYA.AwardUser = function() {
  this.sUserNick = '';
  this.iPrizeType = 0;
  this.sPrizeName = '';
};
HUYA.AwardUser.prototype._clone = function() {
  return new HUYA.AwardUser();
};
HUYA.AwardUser.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.AwardUser.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.AwardUser.prototype.writeTo = function(t) {
  t.writeString(0, this.sUserNick);
  t.writeInt16(1, this.iPrizeType);
  t.writeString(2, this.sPrizeName);
};
HUYA.AwardUser.prototype.readFrom = function(t) {
  this.sUserNick = t.readString(0, false, this.sUserNick);
  this.iPrizeType = t.readInt16(1, false, this.iPrizeType);
  this.sPrizeName = t.readString(2, false, this.sPrizeName);
};
HUYA.TreasureResultBroadcastPacket = function() {
  this.lStarterUid = 0;
  this.sStarterNick = '';
  this.iShortChannelId = 0;
  this.vAwardUsers = new Taf.Vector(new HUYA.AwardUser());
  this.lTid = 0;
  this.lSid = 0;
};
HUYA.TreasureResultBroadcastPacket.prototype._clone = function() {
  return new HUYA.TreasureResultBroadcastPacket();
};
HUYA.TreasureResultBroadcastPacket.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.TreasureResultBroadcastPacket.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.TreasureResultBroadcastPacket.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lStarterUid);
  t.writeString(1, this.sStarterNick);
  t.writeInt32(2, this.iShortChannelId);
  t.writeVector(3, this.vAwardUsers);
  t.writeInt64(4, this.lTid);
  t.writeInt64(5, this.lSid);
};
HUYA.TreasureResultBroadcastPacket.prototype.readFrom = function(t) {
  this.lStarterUid = t.readInt64(0, false, this.lStarterUid);
  this.sStarterNick = t.readString(1, false, this.sStarterNick);
  this.iShortChannelId = t.readInt32(2, false, this.iShortChannelId);
  this.vAwardUsers = t.readVector(3, false, this.vAwardUsers);
  this.lTid = t.readInt64(4, false, this.lTid);
  this.lSid = t.readInt64(5, false, this.lSid);
};
HUYA.TreasureUpdateNotice = function() {
  this.lSendUid = 0;
  this.sSendNick = '';
  this.iQueneSize = 0;
  this.iCountDown = 0;
  this.iState = 0;
  this.Id = '';
};
HUYA.TreasureUpdateNotice.prototype._clone = function() {
  return new HUYA.TreasureUpdateNotice();
};
HUYA.TreasureUpdateNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.TreasureUpdateNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.TreasureUpdateNotice.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lSendUid);
  t.writeString(1, this.sSendNick);
  t.writeInt16(2, this.iQueneSize);
  t.writeInt32(3, this.iCountDown);
  t.writeInt16(4, this.iState);
  t.writeString(5, this.Id);
};
HUYA.TreasureUpdateNotice.prototype.readFrom = function(t) {
  this.lSendUid = t.readInt64(0, false, this.lSendUid);
  this.sSendNick = t.readString(1, false, this.sSendNick);
  this.iQueneSize = t.readInt16(2, false, this.iQueneSize);
  this.iCountDown = t.readInt32(3, false, this.iCountDown);
  this.iState = t.readInt16(4, false, this.iState);
  this.Id = t.readString(5, false, this.Id);
};
HUYA.TreasureLotteryDrawReq = function() {
  this.tId = new HUYA.UserId();
  this.sStarterNick = '';
  this.lSid = 0;
  this.lSubSid = 0;
  this.iFromType = 0;
};
HUYA.TreasureLotteryDrawReq.prototype._clone = function() {
  return new HUYA.TreasureLotteryDrawReq();
};
HUYA.TreasureLotteryDrawReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.TreasureLotteryDrawReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.TreasureLotteryDrawReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeString(1, this.sStarterNick);
  t.writeInt64(2, this.lSid);
  t.writeInt64(3, this.lSubSid);
  t.writeInt16(4, this.iFromType);
};
HUYA.TreasureLotteryDrawReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.sStarterNick = t.readString(1, false, this.sStarterNick);
  this.lSid = t.readInt64(2, false, this.lSid);
  this.lSubSid = t.readInt64(3, false, this.lSubSid);
  this.iFromType = t.readInt16(4, false, this.iFromType);
};
HUYA.TreasureLotteryDrawRsp = function() {
  this.lStarterUid = 0;
  this.iRetCode = 0;
  this.iPrizeType = 0;
  this.sNickName = '';
  this.sPrizeName = '';
};
HUYA.TreasureLotteryDrawRsp.prototype._clone = function() {
  return new HUYA.TreasureLotteryDrawRsp();
};
HUYA.TreasureLotteryDrawRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.TreasureLotteryDrawRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.TreasureLotteryDrawRsp.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lStarterUid);
  t.writeInt32(1, this.iRetCode);
  t.writeInt16(2, this.iPrizeType);
  t.writeString(3, this.sNickName);
  t.writeString(4, this.sPrizeName);
};
HUYA.TreasureLotteryDrawRsp.prototype.readFrom = function(t) {
  this.lStarterUid = t.readInt64(0, false, this.lStarterUid);
  this.iRetCode = t.readInt32(1, false, this.iRetCode);
  this.iPrizeType = t.readInt16(2, false, this.iPrizeType);
  this.sNickName = t.readString(3, false, this.sNickName);
  this.sPrizeName = t.readString(4, false, this.sPrizeName);
};
HUYA.QueryTreasureInfoReq = function() {
  this.tId = new HUYA.UserId();
  this.lSid = 0;
  this.lSubSid = 0;
  this.iFromType = 0;
};
HUYA.QueryTreasureInfoReq.prototype._clone = function() {
  return new HUYA.QueryTreasureInfoReq();
};
HUYA.QueryTreasureInfoReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.QueryTreasureInfoReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.QueryTreasureInfoReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeInt64(1, this.lSid);
  t.writeInt64(2, this.lSubSid);
  t.writeInt16(4, this.iFromType);
};
HUYA.QueryTreasureInfoReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.lSid = t.readInt64(1, false, this.lSid);
  this.lSubSid = t.readInt64(2, false, this.lSubSid);
  this.iFromType = t.readInt16(4, false, this.iFromType);
};
HUYA.QueryTreasureInfoRsp = function() {
  this.iRetCode = 0;
  this.iQueneSize = 0;
  this.iStatus = 0;
  this.iCountDown = 0;
  this.lUid = 0;
  this.sNickName = '';
};
HUYA.QueryTreasureInfoRsp.prototype._clone = function() {
  return new HUYA.QueryTreasureInfoRsp();
};
HUYA.QueryTreasureInfoRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.QueryTreasureInfoRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.QueryTreasureInfoRsp.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iRetCode);
  t.writeInt16(1, this.iQueneSize);
  t.writeInt16(2, this.iStatus);
  t.writeInt32(3, this.iCountDown);
  t.writeInt64(4, this.lUid);
  t.writeString(5, this.sNickName);
};
HUYA.QueryTreasureInfoRsp.prototype.readFrom = function(t) {
  this.iRetCode = t.readInt32(0, false, this.iRetCode);
  this.iQueneSize = t.readInt16(1, false, this.iQueneSize);
  this.iStatus = t.readInt16(2, false, this.iStatus);
  this.iCountDown = t.readInt32(3, false, this.iCountDown);
  this.lUid = t.readInt64(4, false, this.lUid);
  this.sNickName = t.readString(5, false, this.sNickName);
};
HUYA.TreasureLotteryResultNoticePacket = function() {
  this.lStarterUid = 0;
  this.lSid = 0;
  this.lSubSid = 0;
  this.lTimeStamp = 0;
  this.iPrizeType = 0;
  this.lUserUid = 0;
  this.sKey = '';
  this.sCode = '';
  this.sPrizeName = '';
  this.sStarterNick = '';
  this.sUserNick = '';
};
HUYA.TreasureLotteryResultNoticePacket.prototype._clone = function() {
  return new HUYA.TreasureLotteryResultNoticePacket();
};
HUYA.TreasureLotteryResultNoticePacket.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.TreasureLotteryResultNoticePacket.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.TreasureLotteryResultNoticePacket.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lStarterUid);
  t.writeInt64(1, this.lSid);
  t.writeInt64(2, this.lSubSid);
  t.writeInt64(3, this.lTimeStamp);
  t.writeInt16(4, this.iPrizeType);
  t.writeInt64(5, this.lUserUid);
  t.writeString(6, this.sKey);
  t.writeString(7, this.sCode);
  t.writeString(8, this.sPrizeName);
  t.writeString(9, this.sStarterNick);
  t.writeString(10, this.sUserNick);
};
HUYA.TreasureLotteryResultNoticePacket.prototype.readFrom = function(t) {
  this.lStarterUid = t.readInt64(0, false, this.lStarterUid);
  this.lSid = t.readInt64(1, false, this.lSid);
  this.lSubSid = t.readInt64(2, false, this.lSubSid);
  this.lTimeStamp = t.readInt64(3, false, this.lTimeStamp);
  this.iPrizeType = t.readInt16(4, false, this.iPrizeType);
  this.lUserUid = t.readInt64(5, false, this.lUserUid);
  this.sKey = t.readString(6, false, this.sKey);
  this.sCode = t.readString(7, false, this.sCode);
  this.sPrizeName = t.readString(8, false, this.sPrizeName);
  this.sStarterNick = t.readString(9, false, this.sStarterNick);
  this.sUserNick = t.readString(10, false, this.sUserNick);
};
HUYA.ViewerListReq = function() {
  this.tUserId = new HUYA.UserId();
  this.lTid = 0;
  this.lSid = 0;
};
HUYA.ViewerListReq.prototype._clone = function() {
  return new HUYA.ViewerListReq();
};
HUYA.ViewerListReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.ViewerListReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.ViewerListReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tUserId);
  t.writeInt64(1, this.lTid);
  t.writeInt64(2, this.lSid);
};
HUYA.ViewerListReq.prototype.readFrom = function(t) {
  this.tUserId = t.readStruct(0, false, this.tUserId);
  this.lTid = t.readInt64(1, false, this.lTid);
  this.lSid = t.readInt64(2, false, this.lSid);
};
HUYA.ViewerListRsp = function() {
  this.lTid = 0;
  this.lSid = 0;
  this.vViewerItem = new Taf.Vector(new HUYA.ViewerItem());
  this.iNobleNum = 0;
  this.iUserNum = 0;
};
HUYA.ViewerListRsp.prototype._clone = function() {
  return new HUYA.ViewerListRsp();
};
HUYA.ViewerListRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.ViewerListRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.ViewerListRsp.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lTid);
  t.writeInt64(1, this.lSid);
  t.writeVector(2, this.vViewerItem);
  t.writeInt32(3, this.iNobleNum);
  t.writeInt32(4, this.iUserNum);
};
HUYA.ViewerListRsp.prototype.readFrom = function(t) {
  this.lTid = t.readInt64(0, false, this.lTid);
  this.lSid = t.readInt64(1, false, this.lSid);
  this.vViewerItem = t.readVector(2, false, this.vViewerItem);
  this.iNobleNum = t.readInt32(3, false, this.iNobleNum);
  this.iUserNum = t.readInt32(4, false, this.iUserNum);
};
HUYA.ViewerItem = function() {
  this.lUid = 0;
  this.sNickName = '';
  this.sLogo = '';
  this.iNobleLevel = 0;
  this.iUserLevel = 0;
};
HUYA.ViewerItem.prototype._clone = function() {
  return new HUYA.ViewerItem();
};
HUYA.ViewerItem.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.ViewerItem.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.ViewerItem.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeString(1, this.sNickName);
  t.writeString(2, this.sLogo);
  t.writeInt32(3, this.iNobleLevel);
  t.writeInt32(4, this.iUserLevel);
};
HUYA.ViewerItem.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.sNickName = t.readString(1, false, this.sNickName);
  this.sLogo = t.readString(2, false, this.sLogo);
  this.iNobleLevel = t.readInt32(3, false, this.iNobleLevel);
  this.iUserLevel = t.readInt32(4, false, this.iUserLevel);
};
HUYA.FansSupportListReq = function() {
  this.tUserId = new HUYA.UserId();
  this.lPid = 0;
};
HUYA.FansSupportListReq.prototype._clone = function() {
  return new HUYA.FansSupportListReq();
};
HUYA.FansSupportListReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.FansSupportListReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.FansSupportListReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tUserId);
  t.writeInt64(1, this.lPid);
};
HUYA.FansSupportListReq.prototype.readFrom = function(t) {
  this.tUserId = t.readStruct(0, false, this.tUserId);
  this.lPid = t.readInt64(1, false, this.lPid);
};
HUYA.FansSupportListRsp = function() {
  this.lPid = 0;
  this.vFansSupportList = new Taf.Vector(new HUYA.FansSupportItem());
  this.sBadgeName = '';
};
HUYA.FansSupportListRsp.prototype._clone = function() {
  return new HUYA.FansSupportListRsp();
};
HUYA.FansSupportListRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.FansSupportListRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.FansSupportListRsp.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lPid);
  t.writeVector(1, this.vFansSupportList);
  t.writeString(2, this.sBadgeName);
};
HUYA.FansSupportListRsp.prototype.readFrom = function(t) {
  this.lPid = t.readInt64(0, false, this.lPid);
  this.vFansSupportList = t.readVector(1, false, this.vFansSupportList);
  this.sBadgeName = t.readString(2, false, this.sBadgeName);
};
HUYA.FansSupportItem = function() {
  this.lUid = 0;
  this.sNickName = '';
  this.sLogo = '';
  this.iFansLevel = 0;
  this.iGuardianLevel = 0;
  this.sBadgeName = '';
  this.iUserLevel = 0;
  this.iNobleLevel = 0;
};
HUYA.FansSupportItem.prototype._clone = function() {
  return new HUYA.FansSupportItem();
};
HUYA.FansSupportItem.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.FansSupportItem.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.FansSupportItem.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeString(1, this.sNickName);
  t.writeString(2, this.sLogo);
  t.writeInt32(3, this.iFansLevel);
  t.writeInt32(4, this.iGuardianLevel);
  t.writeString(5, this.sBadgeName);
  t.writeInt32(6, this.iUserLevel);
  t.writeInt32(7, this.iNobleLevel);
};
HUYA.FansSupportItem.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.sNickName = t.readString(1, false, this.sNickName);
  this.sLogo = t.readString(2, false, this.sLogo);
  this.iFansLevel = t.readInt32(3, false, this.iFansLevel);
  this.iGuardianLevel = t.readInt32(4, false, this.iGuardianLevel);
  this.sBadgeName = t.readString(5, false, this.sBadgeName);
  this.iUserLevel = t.readInt32(6, false, this.iUserLevel);
  this.iNobleLevel = t.readInt32(7, false, this.iNobleLevel);
};
HUYA.LinkMicStatusChangeNotice = function() {
  this.lLMSessionId = 0;
  this.iLinkMicStatus = 0;
  this.lOwnerUid = 0;
  this.vLMPresenterInfos = new Taf.Vector(new HUYA.LMPresenterInfo());
};
HUYA.LinkMicStatusChangeNotice.prototype._clone = function() {
  return new HUYA.LinkMicStatusChangeNotice();
};
HUYA.LinkMicStatusChangeNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.LinkMicStatusChangeNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.LinkMicStatusChangeNotice.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lLMSessionId);
  t.writeInt32(1, this.iLinkMicStatus);
  t.writeInt64(2, this.lOwnerUid);
  t.writeVector(3, this.vLMPresenterInfos);
};
HUYA.LinkMicStatusChangeNotice.prototype.readFrom = function(t) {
  this.lLMSessionId = t.readInt64(0, false, this.lLMSessionId);
  this.iLinkMicStatus = t.readInt32(1, false, this.iLinkMicStatus);
  this.lOwnerUid = t.readInt64(2, false, this.lOwnerUid);
  this.vLMPresenterInfos = t.readVector(3, false, this.vLMPresenterInfos);
};
HUYA.LMPresenterInfo = function() {
  this.lUid = 0;
  this.lChannelId = 0;
  this.lSubChannelId = 0;
  this.sNick = '';
  this.sAvatarUrl = '';
  this.iActivityCount = 0;
  this.iLevel = 0;
  this.lYYId = 0;
};
HUYA.LMPresenterInfo.prototype._clone = function() {
  return new HUYA.LMPresenterInfo();
};
HUYA.LMPresenterInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.LMPresenterInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.LMPresenterInfo.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeInt64(1, this.lChannelId);
  t.writeInt64(2, this.lSubChannelId);
  t.writeString(3, this.sNick);
  t.writeString(4, this.sAvatarUrl);
  t.writeInt32(5, this.iActivityCount);
  t.writeInt32(6, this.iLevel);
  t.writeInt64(7, this.lYYId);
};
HUYA.LMPresenterInfo.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.lChannelId = t.readInt64(1, false, this.lChannelId);
  this.lSubChannelId = t.readInt64(2, false, this.lSubChannelId);
  this.sNick = t.readString(3, false, this.sNick);
  this.sAvatarUrl = t.readString(4, false, this.sAvatarUrl);
  this.iActivityCount = t.readInt32(5, false, this.iActivityCount);
  this.iLevel = t.readInt32(6, false, this.iLevel);
  this.lYYId = t.readInt64(7, false, this.lYYId);
};
HUYA.GetLinkMicPresenterInfoReq = function() {
  this.tId = new HUYA.UserId();
  this.lUid = 0;
};
HUYA.GetLinkMicPresenterInfoReq.prototype._clone = function() {
  return new HUYA.GetLinkMicPresenterInfoReq();
};
HUYA.GetLinkMicPresenterInfoReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetLinkMicPresenterInfoReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetLinkMicPresenterInfoReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeInt64(1, this.lUid);
};
HUYA.GetLinkMicPresenterInfoReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.lUid = t.readInt64(1, false, this.lUid);
};
HUYA.GetLinkMicPresenterInfoRsp = function() {
  this.lLMSessionId = 0;
  this.iLinkMicStatus = 0;
  this.lOwnerUid = 0;
  this.vLMPresenterInfos = new Taf.Vector(new HUYA.LMPresenterInfo());
};
HUYA.GetLinkMicPresenterInfoRsp.prototype._clone = function() {
  return new HUYA.GetLinkMicPresenterInfoRsp();
};
HUYA.GetLinkMicPresenterInfoRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetLinkMicPresenterInfoRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetLinkMicPresenterInfoRsp.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lLMSessionId);
  t.writeInt32(1, this.iLinkMicStatus);
  t.writeInt64(2, this.lOwnerUid);
  t.writeVector(3, this.vLMPresenterInfos);
};
HUYA.GetLinkMicPresenterInfoRsp.prototype.readFrom = function(t) {
  this.lLMSessionId = t.readInt64(0, false, this.lLMSessionId);
  this.iLinkMicStatus = t.readInt32(1, false, this.iLinkMicStatus);
  this.lOwnerUid = t.readInt64(2, false, this.lOwnerUid);
  this.vLMPresenterInfos = t.readVector(3, false, this.vLMPresenterInfos);
};
HUYA.SubscribeInfoNotify = function() {
  this.tTo = new HUYA.Activity();
  this.iToCount = 0;
};
HUYA.SubscribeInfoNotify.prototype._clone = function() {
  return new HUYA.SubscribeInfoNotify();
};
HUYA.SubscribeInfoNotify.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.SubscribeInfoNotify.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.SubscribeInfoNotify.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tTo);
  t.writeInt32(1, this.iToCount);
};
HUYA.SubscribeInfoNotify.prototype.readFrom = function(t) {
  this.tTo = t.readStruct(0, false, this.tTo);
  this.iToCount = t.readInt32(1, false, this.iToCount);
};
HUYA.Activity = function() {
  this.iType = 0;
  this.sKey = '';
};
HUYA.Activity.prototype._clone = function() {
  return new HUYA.Activity();
};
HUYA.Activity.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.Activity.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.Activity.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iType);
  t.writeString(1, this.sKey);
};
HUYA.Activity.prototype.readFrom = function(t) {
  this.iType = t.readInt32(0, false, this.iType);
  this.sKey = t.readString(1, false, this.sKey);
};
HUYA.BannerNotice = function() {
  this.lBannerId = 0;
  this.mParam = new Taf.Map(new Taf.STRING(), new Taf.STRING());
  this.tChInfo = new HUYA.PresenterChannelInfo();
};
HUYA.BannerNotice.prototype._clone = function() {
  return new HUYA.BannerNotice();
};
HUYA.BannerNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.BannerNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.BannerNotice.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lBannerId);
  t.writeMap(1, this.mParam);
  t.writeStruct(2, this.tChInfo);
};
HUYA.BannerNotice.prototype.readFrom = function(t) {
  this.lBannerId = t.readInt64(0, false, this.lBannerId);
  this.mParam = t.readMap(1, false, this.mParam);
  this.tChInfo = t.readStruct(2, false, this.tChInfo);
};
HUYA.GetUserLevelInfoReq = function() {
  this.tId = new HUYA.UserId();
};
HUYA.GetUserLevelInfoReq.prototype._clone = function() {
  return new HUYA.GetUserLevelInfoReq();
};
HUYA.GetUserLevelInfoReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetUserLevelInfoReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetUserLevelInfoReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
};
HUYA.GetUserLevelInfoReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
};
HUYA.GetUserLevelInfoRsp = function() {
  this.tUserProfile = new HUYA.UserProfile();
  this.lCurrLevelExp = 0;
  this.lNextLevelExp = 0;
  this.lDailyIncExp = 0;
  this.lNext2LevelExp = 0;
};
HUYA.GetUserLevelInfoRsp.prototype._clone = function() {
  return new HUYA.GetUserLevelInfoRsp();
};
HUYA.GetUserLevelInfoRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetUserLevelInfoRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetUserLevelInfoRsp.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tUserProfile);
  t.writeInt64(1, this.lCurrLevelExp);
  t.writeInt64(2, this.lNextLevelExp);
  t.writeInt64(3, this.lDailyIncExp);
  t.writeInt64(4, this.lNext2LevelExp);
};
HUYA.GetUserLevelInfoRsp.prototype.readFrom = function(t) {
  this.tUserProfile = t.readStruct(0, false, this.tUserProfile);
  this.lCurrLevelExp = t.readInt64(1, false, this.lCurrLevelExp);
  this.lNextLevelExp = t.readInt64(2, false, this.lNextLevelExp);
  this.lDailyIncExp = t.readInt64(3, false, this.lDailyIncExp);
  this.lNext2LevelExp = t.readInt64(4, false, this.lNext2LevelExp);
};
HUYA.UserProfile = function() {
  this.tUserBase = new HUYA.UserBase();
  this.tPresenterBase = new HUYA.PresenterBase();
  this.tRecentLive = new HUYA.GameLiveInfo();
};
HUYA.UserProfile.prototype._clone = function() {
  return new HUYA.UserProfile();
};
HUYA.UserProfile.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.UserProfile.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.UserProfile.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tUserBase);
  t.writeStruct(1, this.tPresenterBase);
  t.writeStruct(2, this.tRecentLive);
};
HUYA.UserProfile.prototype.readFrom = function(t) {
  this.tUserBase = t.readStruct(0, false, this.tUserBase);
  this.tPresenterBase = t.readStruct(1, false, this.tPresenterBase);
  this.tRecentLive = t.readStruct(2, false, this.tRecentLive);
};
HUYA.UserBase = function() {
  this.lUid = 0;
  this.sNickName = '';
  this.sAvatarUrl = '';
  this.iGender = 0;
  this.lYYId = 0;
  this.iCertified = 0;
  this.iSubscribedCount = 0;
  this.iSubscribeToCount = 0;
  this.iUserLevel = 0;
  this.lUserExp = 0;
  this.iBirthday = 0;
  this.sSign = '';
  this.sArea = '';
  this.sLocation = '';
  this.sRegisterTime = '';
  this.iFreezeTime = 0;
};
HUYA.UserBase.prototype._clone = function() {
  return new HUYA.UserBase();
};
HUYA.UserBase.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.UserBase.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.UserBase.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeString(1, this.sNickName);
  t.writeString(2, this.sAvatarUrl);
  t.writeInt32(3, this.iGender);
  t.writeInt64(4, this.lYYId);
  t.writeInt32(5, this.iCertified);
  t.writeInt32(6, this.iSubscribedCount);
  t.writeInt32(7, this.iSubscribeToCount);
  t.writeInt32(8, this.iUserLevel);
  t.writeInt64(9, this.lUserExp);
  t.writeInt32(10, this.iBirthday);
  t.writeString(11, this.sSign);
  t.writeString(12, this.sArea);
  t.writeString(13, this.sLocation);
  t.writeString(14, this.sRegisterTime);
  t.writeInt32(15, this.iFreezeTime);
};
HUYA.UserBase.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.sNickName = t.readString(1, false, this.sNickName);
  this.sAvatarUrl = t.readString(2, false, this.sAvatarUrl);
  this.iGender = t.readInt32(3, false, this.iGender);
  this.lYYId = t.readInt64(4, false, this.lYYId);
  this.iCertified = t.readInt32(5, false, this.iCertified);
  this.iSubscribedCount = t.readInt32(6, false, this.iSubscribedCount);
  this.iSubscribeToCount = t.readInt32(7, false, this.iSubscribeToCount);
  this.iUserLevel = t.readInt32(8, false, this.iUserLevel);
  this.lUserExp = t.readInt64(9, false, this.lUserExp);
  this.iBirthday = t.readInt32(10, false, this.iBirthday);
  this.sSign = t.readString(11, false, this.sSign);
  this.sArea = t.readString(12, false, this.sArea);
  this.sLocation = t.readString(13, false, this.sLocation);
  this.sRegisterTime = t.readString(14, false, this.sRegisterTime);
  this.iFreezeTime = t.readInt32(15, false, this.iFreezeTime);
};
HUYA.PresenterBase = function() {
  this.iIsPresenter = 0;
  this.sPresenterName = '';
  this.lSignedChannel = 0;
  this.sPrivateHost = '';
  this.iRecType = 0;
  this.iFreeze = 0;
  this.iPresenterLevel = 0;
  this.lPresenterExp = 0;
  this.vPresentedGames = new Taf.Vector(new HUYA.GameBaseInfo());
  this.iCertified = 0;
};
HUYA.PresenterBase.prototype._clone = function() {
  return new HUYA.PresenterBase();
};
HUYA.PresenterBase.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.PresenterBase.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.PresenterBase.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iIsPresenter);
  t.writeString(1, this.sPresenterName);
  t.writeInt64(2, this.lSignedChannel);
  t.writeString(3, this.sPrivateHost);
  t.writeInt32(4, this.iRecType);
  t.writeInt32(5, this.iFreeze);
  t.writeInt32(6, this.iPresenterLevel);
  t.writeInt64(7, this.lPresenterExp);
  t.writeVector(8, this.vPresentedGames);
  t.writeInt32(9, this.iCertified);
};
HUYA.PresenterBase.prototype.readFrom = function(t) {
  this.iIsPresenter = t.readInt32(0, false, this.iIsPresenter);
  this.sPresenterName = t.readString(1, false, this.sPresenterName);
  this.lSignedChannel = t.readInt64(2, false, this.lSignedChannel);
  this.sPrivateHost = t.readString(3, false, this.sPrivateHost);
  this.iRecType = t.readInt32(4, false, this.iRecType);
  this.iFreeze = t.readInt32(5, false, this.iFreeze);
  this.iPresenterLevel = t.readInt32(6, false, this.iPresenterLevel);
  this.lPresenterExp = t.readInt64(7, false, this.lPresenterExp);
  this.vPresentedGames = t.readVector(8, false, this.vPresentedGames);
  this.iCertified = t.readInt32(9, false, this.iCertified);
};
HUYA.GameLiveInfo = function() {
  this.lLiveId = 0;
  this.lUid = 0;
  this.lChannelId = 0;
  this.iShortChannel = 0;
  this.lSubchannel = 0;
  this.sSubchannelName = '';
  this.iGameId = 0;
  this.sGameName = '';
  this.iAttendeeCount = 0;
  this.eGender = HUYA.EGender.MALE;
  this.iAid = 0;
  this.sNick = '';
  this.sAvatarUrl = '';
  this.iStartTime = 0;
  this.iEndTime = 0;
  this.iSourceType = 0;
  this.bIsCameraOpen = false;
  this.bIsRoomSecret = false;
  this.sVideoCaptureUrl = '';
  this.iCdnAttendee = 0;
  this.lYYId = 0;
  this.bCertified = false;
  this.iRecType = 0;
  this.lSignChannel = 0;
  this.sLiveDesc = '';
  this.iLevel = 0;
  this.sGameShortName = '';
  this.iGameType = 0;
  this.sPrivateHost = '';
  this.iActivityCount = 0;
  this.iStreamType = 0;
  this.iBitRate = 0;
  this.iResolution = 0;
  this.iFrameRate = 0;
  this.iIsMultiStream = 0;
  this.iExeGameId = 0;
  this.lExp = 0;
  this.sReplayHls = '';
  this.lMultiStreamFlag = 0;
  this.iScreenType = 0;
  this.iChannelType = 0;
  this.sLocation = '';
  this.iCodecType = 0;
  this.vPresenterTags = new Taf.Vector(new HUYA.GameLiveTag());
  this.vGameTags = new Taf.Vector(new HUYA.GameLiveTag());
  this.lLiveCompatibleFlag = 0;
  this.sTraceId = '';
};
HUYA.GameLiveInfo.prototype._clone = function() {
  return new HUYA.GameLiveInfo();
};
HUYA.GameLiveInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GameLiveInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GameLiveInfo.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lLiveId);
  t.writeInt64(1, this.lUid);
  t.writeInt64(2, this.lChannelId);
  t.writeInt32(3, this.iShortChannel);
  t.writeInt64(4, this.lSubchannel);
  t.writeString(5, this.sSubchannelName);
  t.writeInt32(6, this.iGameId);
  t.writeString(7, this.sGameName);
  t.writeInt32(8, this.iAttendeeCount);
  t.writeInt32(9, this.eGender);
  t.writeInt32(10, this.iAid);
  t.writeString(11, this.sNick);
  t.writeString(12, this.sAvatarUrl);
  t.writeInt32(13, this.iStartTime);
  t.writeInt32(14, this.iEndTime);
  t.writeInt32(15, this.iSourceType);
  t.writeBoolean(16, this.bIsCameraOpen);
  t.writeBoolean(17, this.bIsRoomSecret);
  t.writeString(18, this.sVideoCaptureUrl);
  t.writeInt32(19, this.iCdnAttendee);
  t.writeInt64(20, this.lYYId);
  t.writeBoolean(21, this.bCertified);
  t.writeInt32(22, this.iRecType);
  t.writeInt64(23, this.lSignChannel);
  t.writeString(24, this.sLiveDesc);
  t.writeInt32(25, this.iLevel);
  t.writeString(26, this.sGameShortName);
  t.writeInt32(27, this.iGameType);
  t.writeString(28, this.sPrivateHost);
  t.writeInt32(29, this.iActivityCount);
  t.writeInt32(30, this.iStreamType);
  t.writeInt32(31, this.iBitRate);
  t.writeInt32(32, this.iResolution);
  t.writeInt32(33, this.iFrameRate);
  t.writeInt32(34, this.iIsMultiStream);
  t.writeInt32(35, this.iExeGameId);
  t.writeInt64(36, this.lExp);
  t.writeString(37, this.sReplayHls);
  t.writeInt64(38, this.lMultiStreamFlag);
  t.writeInt32(39, this.iScreenType);
  t.writeInt32(40, this.iChannelType);
  t.writeString(41, this.sLocation);
  t.writeInt32(42, this.iCodecType);
  t.writeVector(43, this.vPresenterTags);
  t.writeVector(44, this.vGameTags);
  t.writeInt64(45, this.lLiveCompatibleFlag);
  t.writeString(46, this.sTraceId);
};
HUYA.GameLiveInfo.prototype.readFrom = function(t) {
  this.lLiveId = t.readInt64(0, false, this.lLiveId);
  this.lUid = t.readInt64(1, false, this.lUid);
  this.lChannelId = t.readInt64(2, false, this.lChannelId);
  this.iShortChannel = t.readInt32(3, false, this.iShortChannel);
  this.lSubchannel = t.readInt64(4, false, this.lSubchannel);
  this.sSubchannelName = t.readString(5, false, this.sSubchannelName);
  this.iGameId = t.readInt32(6, false, this.iGameId);
  this.sGameName = t.readString(7, false, this.sGameName);
  this.iAttendeeCount = t.readInt32(8, false, this.iAttendeeCount);
  this.eGender = t.readInt32(9, false, this.eGender);
  this.iAid = t.readInt32(10, false, this.iAid);
  this.sNick = t.readString(11, false, this.sNick);
  this.sAvatarUrl = t.readString(12, false, this.sAvatarUrl);
  this.iStartTime = t.readInt32(13, false, this.iStartTime);
  this.iEndTime = t.readInt32(14, false, this.iEndTime);
  this.iSourceType = t.readInt32(15, false, this.iSourceType);
  this.bIsCameraOpen = t.readBoolean(16, false, this.bIsCameraOpen);
  this.bIsRoomSecret = t.readBoolean(17, false, this.bIsRoomSecret);
  this.sVideoCaptureUrl = t.readString(18, false, this.sVideoCaptureUrl);
  this.iCdnAttendee = t.readInt32(19, false, this.iCdnAttendee);
  this.lYYId = t.readInt64(20, false, this.lYYId);
  this.bCertified = t.readBoolean(21, false, this.bCertified);
  this.iRecType = t.readInt32(22, false, this.iRecType);
  this.lSignChannel = t.readInt64(23, false, this.lSignChannel);
  this.sLiveDesc = t.readString(24, false, this.sLiveDesc);
  this.iLevel = t.readInt32(25, false, this.iLevel);
  this.sGameShortName = t.readString(26, false, this.sGameShortName);
  this.iGameType = t.readInt32(27, false, this.iGameType);
  this.sPrivateHost = t.readString(28, false, this.sPrivateHost);
  this.iActivityCount = t.readInt32(29, false, this.iActivityCount);
  this.iStreamType = t.readInt32(30, false, this.iStreamType);
  this.iBitRate = t.readInt32(31, false, this.iBitRate);
  this.iResolution = t.readInt32(32, false, this.iResolution);
  this.iFrameRate = t.readInt32(33, false, this.iFrameRate);
  this.iIsMultiStream = t.readInt32(34, false, this.iIsMultiStream);
  this.iExeGameId = t.readInt32(35, false, this.iExeGameId);
  this.lExp = t.readInt64(36, false, this.lExp);
  this.sReplayHls = t.readString(37, false, this.sReplayHls);
  this.lMultiStreamFlag = t.readInt64(38, false, this.lMultiStreamFlag);
  this.iScreenType = t.readInt32(39, false, this.iScreenType);
  this.iChannelType = t.readInt32(40, false, this.iChannelType);
  this.sLocation = t.readString(41, false, this.sLocation);
  this.iCodecType = t.readInt32(42, false, this.iCodecType);
  this.vPresenterTags = t.readVector(43, false, this.vPresenterTags);
  this.vGameTags = t.readVector(44, false, this.vGameTags);
  this.lLiveCompatibleFlag = t.readInt64(45, false, this.lLiveCompatibleFlag);
  this.sTraceId = t.readString(46, false, this.sTraceId);
};
HUYA.GameLiveTag = function() {
  this.iTagId = 0;
  this.sTagName = '';
  this.bIsShow = true;
};
HUYA.GameLiveTag.prototype._clone = function() {
  return new HUYA.GameLiveTag();
};
HUYA.GameLiveTag.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GameLiveTag.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GameLiveTag.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iTagId);
  t.writeString(1, this.sTagName);
  t.writeBoolean(2, this.bIsShow);
};
HUYA.GameLiveTag.prototype.readFrom = function(t) {
  this.iTagId = t.readInt32(0, false, this.iTagId);
  this.sTagName = t.readString(1, false, this.sTagName);
  this.bIsShow = t.readBoolean(2, false, this.bIsShow);
};
HUYA.MatchRaffleResultNotice = function() {
  this.sPrizeName = '';
  this.sUrl = '';
  this.sShowDoc = '';
  this.sIcon = '';
  this.tBanner = new HUYA.MatchRaffleBanner();
};
HUYA.MatchRaffleResultNotice.prototype._clone = function() {
  return new HUYA.MatchRaffleResultNotice();
};
HUYA.MatchRaffleResultNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.MatchRaffleResultNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.MatchRaffleResultNotice.prototype.writeTo = function(t) {
  t.writeString(0, this.sPrizeName);
  t.writeString(1, this.sUrl);
  t.writeString(2, this.sShowDoc);
  t.writeString(3, this.sIcon);
  t.writeStruct(4, this.tBanner);
};
HUYA.MatchRaffleResultNotice.prototype.readFrom = function(t) {
  this.sPrizeName = t.readString(0, false, this.sPrizeName);
  this.sUrl = t.readString(1, false, this.sUrl);
  this.sShowDoc = t.readString(2, false, this.sShowDoc);
  this.sIcon = t.readString(3, false, this.sIcon);
  this.tBanner = t.readStruct(4, false, this.tBanner);
};
HUYA.MatchRaffleBanner = function() {
  this.sPcBanner = '';
  this.sH5Banner = '';
  this.sFlashBanner = '';
  this.sAdrBanner = '';
  this.sIosBanner = '';
  this.sPadBanner = '';
};
HUYA.MatchRaffleBanner.prototype._clone = function() {
  return new HUYA.MatchRaffleBanner();
};
HUYA.MatchRaffleBanner.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.MatchRaffleBanner.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.MatchRaffleBanner.prototype.writeTo = function(t) {
  t.writeString(0, this.sPcBanner);
  t.writeString(1, this.sH5Banner);
  t.writeString(2, this.sFlashBanner);
  t.writeString(3, this.sAdrBanner);
  t.writeString(4, this.sIosBanner);
  t.writeString(5, this.sPadBanner);
};
HUYA.MatchRaffleBanner.prototype.readFrom = function(t) {
  this.sPcBanner = t.readString(0, false, this.sPcBanner);
  this.sH5Banner = t.readString(1, false, this.sH5Banner);
  this.sFlashBanner = t.readString(2, false, this.sFlashBanner);
  this.sAdrBanner = t.readString(3, false, this.sAdrBanner);
  this.sIosBanner = t.readString(4, false, this.sIosBanner);
  this.sPadBanner = t.readString(5, false, this.sPadBanner);
};
HUYA.GuardianPresenterInfoNotice = function() {
  this.lUid = 0;
  this.sNick = '';
  this.iLevel = 0;
  this.lGuardianUid = 0;
  this.sGuardianNick = '';
  this.eNoticeType = 0;
  this.iOpenDays = 0;
  this.iLastLevel = 0;
  this.iNobleLevel = 0;
};
HUYA.GuardianPresenterInfoNotice.prototype._clone = function() {
  return new HUYA.GuardianPresenterInfoNotice();
};
HUYA.GuardianPresenterInfoNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GuardianPresenterInfoNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GuardianPresenterInfoNotice.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeString(1, this.sNick);
  t.writeInt32(2, this.iLevel);
  t.writeInt64(3, this.lGuardianUid);
  t.writeString(4, this.sGuardianNick);
  t.writeInt32(5, this.eNoticeType);
  t.writeInt32(6, this.iOpenDays);
  t.writeInt32(7, this.iLastLevel);
  t.writeInt32(8, this.iNobleLevel);
};
HUYA.GuardianPresenterInfoNotice.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.sNick = t.readString(1, false, this.sNick);
  this.iLevel = t.readInt32(2, false, this.iLevel);
  this.lGuardianUid = t.readInt64(3, false, this.lGuardianUid);
  this.sGuardianNick = t.readString(4, false, this.sGuardianNick);
  this.eNoticeType = t.readInt32(5, false, this.eNoticeType);
  this.iOpenDays = t.readInt32(6, false, this.iOpenDays);
  this.iLastLevel = t.readInt32(7, false, this.iLastLevel);
  this.iNobleLevel = t.readInt32(8, false, this.iNobleLevel);
};
HUYA.SubscribeReq = function() {
  this.tId = new HUYA.UserId();
  this.tFrom = new HUYA.Subscriber();
  this.tTo = new HUYA.Activity();
  this.iAction = 0;
};
HUYA.SubscribeReq.prototype._clone = function() {
  return new HUYA.SubscribeReq();
};
HUYA.SubscribeReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.SubscribeReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.SubscribeReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeStruct(1, this.tFrom);
  t.writeStruct(2, this.tTo);
  t.writeInt32(3, this.iAction);
};
HUYA.SubscribeReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.tFrom = t.readStruct(1, false, this.tFrom);
  this.tTo = t.readStruct(2, false, this.tTo);
  this.iAction = t.readInt32(3, false, this.iAction);
};
HUYA.SubscribeResp = function() {
  this.tFrom = new HUYA.Subscriber();
  this.tTo = new HUYA.Activity();
  this.iAction = 0;
  this.iFlag = 0;
};
HUYA.SubscribeResp.prototype._clone = function() {
  return new HUYA.SubscribeResp();
};
HUYA.SubscribeResp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.SubscribeResp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.SubscribeResp.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tFrom);
  t.writeStruct(1, this.tTo);
  t.writeInt32(2, this.iAction);
  t.writeInt32(3, this.iFlag);
};
HUYA.SubscribeResp.prototype.readFrom = function(t) {
  this.tFrom = t.readStruct(0, false, this.tFrom);
  this.tTo = t.readStruct(1, false, this.tTo);
  this.iAction = t.readInt32(2, false, this.iAction);
  this.iFlag = t.readInt32(3, false, this.iFlag);
};
HUYA.UnsubscribeReq = function() {
  this.tId = new HUYA.UserId();
  this.tFrom = new HUYA.Subscriber();
  this.tTo = new HUYA.Activity();
};
HUYA.UnsubscribeReq.prototype._clone = function() {
  return new HUYA.UnsubscribeReq();
};
HUYA.UnsubscribeReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.UnsubscribeReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.UnsubscribeReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeStruct(1, this.tFrom);
  t.writeStruct(2, this.tTo);
};
HUYA.UnsubscribeReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.tFrom = t.readStruct(1, false, this.tFrom);
  this.tTo = t.readStruct(2, false, this.tTo);
};
HUYA.UnsubscribeResp = function() {
  this.tFrom = new HUYA.Subscriber();
  this.tTo = new HUYA.Activity();
  this.iFlag = 0;
};
HUYA.UnsubscribeResp.prototype._clone = function() {
  return new HUYA.UnsubscribeResp();
};
HUYA.UnsubscribeResp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.UnsubscribeResp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.UnsubscribeResp.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tFrom);
  t.writeStruct(1, this.tTo);
  t.writeInt32(3, this.iFlag);
};
HUYA.UnsubscribeResp.prototype.readFrom = function(t) {
  this.tFrom = t.readStruct(0, false, this.tFrom);
  this.tTo = t.readStruct(1, false, this.tTo);
  this.iFlag = t.readInt32(3, false, this.iFlag);
};
HUYA.SubscribeStatusReq = function() {
  this.tId = new HUYA.UserId();
  this.tFrom = new HUYA.Subscriber();
  this.tTo = new HUYA.Activity();
};
HUYA.SubscribeStatusReq.prototype._clone = function() {
  return new HUYA.SubscribeStatusReq();
};
HUYA.SubscribeStatusReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.SubscribeStatusReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.SubscribeStatusReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeStruct(1, this.tFrom);
  t.writeStruct(2, this.tTo);
};
HUYA.SubscribeStatusReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.tFrom = t.readStruct(1, false, this.tFrom);
  this.tTo = t.readStruct(2, false, this.tTo);
};
HUYA.SubscribeStatusResp = function() {
  this.tFrom = new HUYA.Subscriber();
  this.tTo = new HUYA.Activity();
  this.iSubscribedCount = 0;
  this.iStatus = 0;
};
HUYA.SubscribeStatusResp.prototype._clone = function() {
  return new HUYA.SubscribeStatusResp();
};
HUYA.SubscribeStatusResp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.SubscribeStatusResp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.SubscribeStatusResp.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tFrom);
  t.writeStruct(1, this.tTo);
  t.writeInt32(2, this.iSubscribedCount);
  t.writeInt32(3, this.iStatus);
};
HUYA.SubscribeStatusResp.prototype.readFrom = function(t) {
  this.tFrom = t.readStruct(0, false, this.tFrom);
  this.tTo = t.readStruct(1, false, this.tTo);
  this.iSubscribedCount = t.readInt32(2, false, this.iSubscribedCount);
  this.iStatus = t.readInt32(3, false, this.iStatus);
};
HUYA.Subscriber = function() {
  this.iType = 0;
  this.sKey = '';
  this.lSubscribeTime = 0;
};
HUYA.Subscriber.prototype._clone = function() {
  return new HUYA.Subscriber();
};
HUYA.Subscriber.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.Subscriber.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.Subscriber.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iType);
  t.writeString(1, this.sKey);
  t.writeInt64(2, this.lSubscribeTime);
};
HUYA.Subscriber.prototype.readFrom = function(t) {
  this.iType = t.readInt32(0, false, this.iType);
  this.sKey = t.readString(1, false, this.sKey);
  this.lSubscribeTime = t.readInt64(2, false, this.lSubscribeTime);
};
HUYA.PresenterChannelInfo = function() {
  this.lYYId = 0;
  this.lTid = 0;
  this.lSid = 0;
  this.iSourceType = 0;
  this.iScreenType = 0;
  this.lUid = 0;
  this.iGameId = 0;
};
HUYA.PresenterChannelInfo.prototype._clone = function() {
  return new HUYA.PresenterChannelInfo();
};
HUYA.PresenterChannelInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.PresenterChannelInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.PresenterChannelInfo.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lYYId);
  t.writeInt64(1, this.lTid);
  t.writeInt64(3, this.lSid);
  t.writeInt32(4, this.iSourceType);
  t.writeInt32(5, this.iScreenType);
  t.writeInt64(6, this.lUid);
  t.writeInt32(7, this.iGameId);
};
HUYA.PresenterChannelInfo.prototype.readFrom = function(t) {
  this.lYYId = t.readInt64(0, false, this.lYYId);
  this.lTid = t.readInt64(1, false, this.lTid);
  this.lSid = t.readInt64(3, false, this.lSid);
  this.iSourceType = t.readInt32(4, false, this.iSourceType);
  this.iScreenType = t.readInt32(5, false, this.iScreenType);
  this.lUid = t.readInt64(6, false, this.lUid);
  this.iGameId = t.readInt32(7, false, this.iGameId);
};
HUYA.LiveAdvertisementInfo = function() {
  this.iType = 0;
  this.sTagUrl = '';
  this.iHLeftPercent = 0;
  this.iHRightPercent = 0;
  this.iVAbovePercent = 0;
  this.iVBelowPercent = 0;
  this.iLifeTime = 0;
  this.iLoadTime = 0;
  this.iPlayNow = 0;
  this.sAdPercent = '';
  this.iIsCountDown = 0;
  this.iId = 0;
  this.sTitle = '';
  this.iPlayNum = 0;
  this.iHasPlayNum = 0;
};
HUYA.LiveAdvertisementInfo.prototype._clone = function() {
  return new HUYA.LiveAdvertisementInfo();
};
HUYA.LiveAdvertisementInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.LiveAdvertisementInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.LiveAdvertisementInfo.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iType);
  t.writeString(1, this.sTagUrl);
  t.writeInt32(2, this.iHLeftPercent);
  t.writeInt32(3, this.iHRightPercent);
  t.writeInt32(4, this.iVAbovePercent);
  t.writeInt32(5, this.iVBelowPercent);
  t.writeInt32(6, this.iLifeTime);
  t.writeInt32(7, this.iLoadTime);
  t.writeInt32(8, this.iPlayNow);
  t.writeString(9, this.sAdPercent);
  t.writeInt32(10, this.iIsCountDown);
  t.writeInt32(11, this.iId);
  t.writeString(12, this.sTitle);
  t.writeInt32(13, this.iPlayNum);
  t.writeInt32(14, this.iHasPlayNum);
};
HUYA.LiveAdvertisementInfo.prototype.readFrom = function(t) {
  this.iType = t.readInt32(0, false, this.iType);
  this.sTagUrl = t.readString(1, false, this.sTagUrl);
  this.iHLeftPercent = t.readInt32(2, false, this.iHLeftPercent);
  this.iHRightPercent = t.readInt32(3, false, this.iHRightPercent);
  this.iVAbovePercent = t.readInt32(4, false, this.iVAbovePercent);
  this.iVBelowPercent = t.readInt32(5, false, this.iVBelowPercent);
  this.iLifeTime = t.readInt32(6, false, this.iLifeTime);
  this.iLoadTime = t.readInt32(7, false, this.iLoadTime);
  this.iPlayNow = t.readInt32(8, false, this.iPlayNow);
  this.sAdPercent = t.readString(9, false, this.sAdPercent);
  this.iIsCountDown = t.readInt32(10, false, this.iIsCountDown);
  this.iId = t.readInt32(11, false, this.iId);
  this.sTitle = t.readString(12, false, this.sTitle);
  this.iPlayNum = t.readInt32(13, false, this.iPlayNum);
  this.iHasPlayNum = t.readInt32(14, false, this.iHasPlayNum);
};
HUYA.GetLiveAdInfoReq = function() {
  this.tId = new HUYA.UserId();
  this.lPresenterUid = 0;
};
HUYA.GetLiveAdInfoReq.prototype._clone = function() {
  return new HUYA.GetLiveAdInfoReq();
};
HUYA.GetLiveAdInfoReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetLiveAdInfoReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetLiveAdInfoReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeInt64(1, this.lPresenterUid);
};
HUYA.GetLiveAdInfoReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.lPresenterUid = t.readInt64(1, false, this.lPresenterUid);
};
HUYA.GetLiveAdInfoRsp = function() {
  this.tAdInfo = new HUYA.LiveAdvertisementInfo();
  this.iIsConfig = 0;
  this.tEndLiveAdInfo = new HUYA.LiveAdvertisementInfo();
  this.iIsEndLiveConfig = 0;
};
HUYA.GetLiveAdInfoRsp.prototype._clone = function() {
  return new HUYA.GetLiveAdInfoRsp();
};
HUYA.GetLiveAdInfoRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetLiveAdInfoRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetLiveAdInfoRsp.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tAdInfo);
  t.writeInt32(1, this.iIsConfig);
  t.writeStruct(2, this.tEndLiveAdInfo);
  t.writeInt32(3, this.iIsEndLiveConfig);
};
HUYA.GetLiveAdInfoRsp.prototype.readFrom = function(t) {
  this.tAdInfo = t.readStruct(0, false, this.tAdInfo);
  this.iIsConfig = t.readInt32(1, false, this.iIsConfig);
  this.tEndLiveAdInfo = t.readStruct(2, false, this.tEndLiveAdInfo);
  this.iIsEndLiveConfig = t.readInt32(3, false, this.iIsEndLiveConfig);
};
HUYA.LiveAdvertisementNotice = function() {
  this.tAdInfo = new HUYA.LiveAdvertisementInfo();
  this.iAdrPlay = 0;
  this.iIosPlay = 0;
  this.iAdrtvPlay = 0;
  this.iIPadPlay = 0;
  this.iAdrPadPlay = 0;
  this.iWebPlay = 0;
};
HUYA.LiveAdvertisementNotice.prototype._clone = function() {
  return new HUYA.LiveAdvertisementNotice();
};
HUYA.LiveAdvertisementNotice.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.LiveAdvertisementNotice.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.LiveAdvertisementNotice.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tAdInfo);
  t.writeInt32(1, this.iAdrPlay);
  t.writeInt32(2, this.iIosPlay);
  t.writeInt32(3, this.iAdrtvPlay);
  t.writeInt32(4, this.iIPadPlay);
  t.writeInt32(5, this.iAdrPadPlay);
  t.writeInt32(6, this.iWebPlay);
};
HUYA.LiveAdvertisementNotice.prototype.readFrom = function(t) {
  this.tAdInfo = t.readStruct(0, false, this.tAdInfo);
  this.iAdrPlay = t.readInt32(1, false, this.iAdrPlay);
  this.iIosPlay = t.readInt32(2, false, this.iIosPlay);
  this.iAdrtvPlay = t.readInt32(3, false, this.iAdrtvPlay);
  this.iIPadPlay = t.readInt32(4, false, this.iIPadPlay);
  this.iAdrPadPlay = t.readInt32(5, false, this.iAdrPadPlay);
  this.iWebPlay = t.readInt32(6, false, this.iWebPlay);
};
HUYA.ActivityMsgReq = function() {
  this.tUserId = new HUYA.UserId();
  this.iActivityId = 0;
  this.lPid = 0;
  this.lTid = 0;
  this.lSid = 0;
  this.iChannelType = 0;
  this.iSubUri = 0;
};
HUYA.ActivityMsgReq.prototype._clone = function() {
  return new HUYA.ActivityMsgReq();
};
HUYA.ActivityMsgReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.ActivityMsgReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.ActivityMsgReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tUserId);
  t.writeInt32(1, this.iActivityId);
  t.writeInt64(2, this.lPid);
  t.writeInt64(3, this.lTid);
  t.writeInt64(4, this.lSid);
  t.writeInt32(5, this.iChannelType);
  t.writeInt32(6, this.iSubUri);
};
HUYA.ActivityMsgReq.prototype.readFrom = function(t) {
  this.tUserId = t.readStruct(0, false, this.tUserId);
  this.iActivityId = t.readInt32(1, false, this.iActivityId);
  this.lPid = t.readInt64(2, false, this.lPid);
  this.lTid = t.readInt64(3, false, this.lTid);
  this.lSid = t.readInt64(4, false, this.lSid);
  this.iChannelType = t.readInt32(5, false, this.iChannelType);
  this.iSubUri = t.readInt32(6, false, this.iSubUri);
};
HUYA.ActivityMsgRsp = function() {
  this.iEnable = 0;
  this.vSerializedMsg = new Taf.Vector(new HUYA.ActivitySerializedMsg());
  this.iTimeStamp = 0;
};
HUYA.ActivityMsgRsp.prototype._clone = function() {
  return new HUYA.ActivityMsgRsp();
};
HUYA.ActivityMsgRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.ActivityMsgRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.ActivityMsgRsp.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iEnable);
  t.writeVector(1, this.vSerializedMsg);
  t.writeInt32(2, this.iTimeStamp);
};
HUYA.ActivityMsgRsp.prototype.readFrom = function(t) {
  this.iEnable = t.readInt32(0, false, this.iEnable);
  this.vSerializedMsg = t.readVector(1, false, this.vSerializedMsg);
  this.iTimeStamp = t.readInt32(2, false, this.iTimeStamp);
};
HUYA.ActivitySerializedMsg = function() {
  this.iSubUri = 0;
  this.vContent = new Taf.BinBuffer();
};
HUYA.ActivitySerializedMsg.prototype._clone = function() {
  return new HUYA.ActivitySerializedMsg();
};
HUYA.ActivitySerializedMsg.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.ActivitySerializedMsg.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.ActivitySerializedMsg.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iSubUri);
  t.writeBytes(1, this.vContent);
};
HUYA.ActivitySerializedMsg.prototype.readFrom = function(t) {
  this.iSubUri = t.readInt32(0, false, this.iSubUri);
  this.vContent = t.readBytes(1, false, this.vContent);
};
HUYA.GetGameLiveHisUponReq = function() {
  this.lUid = 0;
  this.iMinutes = 0;
  this.iNumberWanted = 0;
};
HUYA.GetGameLiveHisUponReq.prototype._clone = function() {
  return new HUYA.GetGameLiveHisUponReq();
};
HUYA.GetGameLiveHisUponReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetGameLiveHisUponReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetGameLiveHisUponReq.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeInt32(1, this.iMinutes);
  t.writeInt32(2, this.iNumberWanted);
};
HUYA.GetGameLiveHisUponReq.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.iMinutes = t.readInt32(1, false, this.iMinutes);
  this.iNumberWanted = t.readInt32(2, false, this.iNumberWanted);
};
HUYA.GetGameLiveHisUponRsp = function() {
  this.lUid = 0;
  this.vHistoryList = new Taf.Vector(new HUYA.GameLiveHlsInfo());
};
HUYA.GetGameLiveHisUponRsp.prototype._clone = function() {
  return new HUYA.GetGameLiveHisUponRsp();
};
HUYA.GetGameLiveHisUponRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetGameLiveHisUponRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetGameLiveHisUponRsp.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeVector(1, this.vHistoryList);
};
HUYA.GetGameLiveHisUponRsp.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.vHistoryList = t.readVector(1, false, this.vHistoryList);
};
HUYA.GameLiveHlsInfo = function() {
  this.tGameInfo = new HUYA.GameLiveInfo();
  this.sHlsUrl = '';
  this.iVideoSyncTime = 0;
};
HUYA.GameLiveHlsInfo.prototype._clone = function() {
  return new HUYA.GameLiveHlsInfo();
};
HUYA.GameLiveHlsInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GameLiveHlsInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GameLiveHlsInfo.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tGameInfo);
  t.writeString(1, this.sHlsUrl);
  t.writeInt32(2, this.iVideoSyncTime);
};
HUYA.GameLiveHlsInfo.prototype.readFrom = function(t) {
  this.tGameInfo = t.readStruct(0, false, this.tGameInfo);
  this.sHlsUrl = t.readString(1, false, this.sHlsUrl);
  this.iVideoSyncTime = t.readInt32(2, false, this.iVideoSyncTime);
};
HUYA.GetVideoHisUponReq = function() {
  this.lUid = 0;
  this.lLiveId = 0;
};
HUYA.GetVideoHisUponReq.prototype._clone = function() {
  return new HUYA.GetVideoHisUponReq();
};
HUYA.GetVideoHisUponReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetVideoHisUponReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetVideoHisUponReq.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeInt64(1, this.lLiveId);
};
HUYA.GetVideoHisUponReq.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.lLiveId = t.readInt64(1, false, this.lLiveId);
};
HUYA.GetVideoHisUponRsp = function() {
  this.lUid = 0;
  this.vHistoryList = new Taf.Vector(new HUYA.GameLiveHlsInfo());
};
HUYA.GetVideoHisUponRsp.prototype._clone = function() {
  return new HUYA.GetVideoHisUponRsp();
};
HUYA.GetVideoHisUponRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetVideoHisUponRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetVideoHisUponRsp.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeVector(1, this.vHistoryList);
};
HUYA.GetVideoHisUponRsp.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.vHistoryList = t.readVector(1, false, this.vHistoryList);
};
HUYA.SendReplayMessageReq = function() {
  this.tId = new HUYA.UserId();
  this.sSenderNickName = '';
  this.iGroupType = 0;
  this.iGroupId = 0;
  this.sMessage = '';
};
HUYA.SendReplayMessageReq.prototype._clone = function() {
  return new HUYA.SendReplayMessageReq();
};
HUYA.SendReplayMessageReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.SendReplayMessageReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.SendReplayMessageReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeString(1, this.sSenderNickName);
  t.writeInt32(2, this.iGroupType);
  t.writeInt32(3, this.iGroupId);
  t.writeString(4, this.sMessage);
};
HUYA.SendReplayMessageReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.sSenderNickName = t.readString(1, false, this.sSenderNickName);
  this.iGroupType = t.readInt32(2, false, this.iGroupType);
  this.iGroupId = t.readInt32(3, false, this.iGroupId);
  this.sMessage = t.readString(4, false, this.sMessage);
};
HUYA.SendReplayMessageRsp = function() {
  this.lUid = 0;
  this.iValidate = 0;
};
HUYA.SendReplayMessageRsp.prototype._clone = function() {
  return new HUYA.SendReplayMessageRsp();
};
HUYA.SendReplayMessageRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.SendReplayMessageRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.SendReplayMessageRsp.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeInt32(1, this.iValidate);
};
HUYA.SendReplayMessageRsp.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.iValidate = t.readInt32(1, false, this.iValidate);
};
HUYA.ReplayMessageBody = function() {
  this.sMessage = '';
  this.lSenderUid = 0;
  this.sSenderNickName = '';
  this.iGroupType = 0;
  this.iGroupId = 0;
};
HUYA.ReplayMessageBody.prototype._clone = function() {
  return new HUYA.ReplayMessageBody();
};
HUYA.ReplayMessageBody.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.ReplayMessageBody.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.ReplayMessageBody.prototype.writeTo = function(t) {
  t.writeString(0, this.sMessage);
  t.writeInt64(1, this.lSenderUid);
  t.writeString(2, this.sSenderNickName);
  t.writeInt32(3, this.iGroupType);
  t.writeInt32(4, this.iGroupId);
};
HUYA.ReplayMessageBody.prototype.readFrom = function(t) {
  this.sMessage = t.readString(0, false, this.sMessage);
  this.lSenderUid = t.readInt64(1, false, this.lSenderUid);
  this.sSenderNickName = t.readString(2, false, this.sSenderNickName);
  this.iGroupType = t.readInt32(3, false, this.iGroupType);
  this.iGroupId = t.readInt32(4, false, this.iGroupId);
};
HUYA.ReplayPresenterInLiveNotify = function() {
  this.lUid = 0;
  this.lChannelId = 0;
  this.lSubChannelId = 0;
};
HUYA.ReplayPresenterInLiveNotify.prototype._clone = function() {
  return new HUYA.ReplayPresenterInLiveNotify();
};
HUYA.ReplayPresenterInLiveNotify.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.ReplayPresenterInLiveNotify.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.ReplayPresenterInLiveNotify.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lUid);
  t.writeInt64(1, this.lChannelId);
  t.writeInt64(2, this.lSubChannelId);
};
HUYA.ReplayPresenterInLiveNotify.prototype.readFrom = function(t) {
  this.lUid = t.readInt64(0, false, this.lUid);
  this.lChannelId = t.readInt64(1, false, this.lChannelId);
  this.lSubChannelId = t.readInt64(2, false, this.lSubChannelId);
};
HUYA.PresenterActivityReq = function() {
  this.tId = new HUYA.UserId();
  this.lUid = 0;
};
HUYA.PresenterActivityReq.prototype._clone = function() {
  return new HUYA.PresenterActivityReq();
};
HUYA.PresenterActivityReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.PresenterActivityReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.PresenterActivityReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tId);
  t.writeInt64(1, this.lUid);
};
HUYA.PresenterActivityReq.prototype.readFrom = function(t) {
  this.tId = t.readStruct(0, false, this.tId);
  this.lUid = t.readInt64(1, false, this.lUid);
};
HUYA.PresenterActivityRsp = function() {
  this.tAct = new HUYA.PresenterActivityEx();
};
HUYA.PresenterActivityRsp.prototype._clone = function() {
  return new HUYA.PresenterActivityRsp();
};
HUYA.PresenterActivityRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.PresenterActivityRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.PresenterActivityRsp.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tAct);
};
HUYA.PresenterActivityRsp.prototype.readFrom = function(t) {
  this.tAct = t.readStruct(0, false, this.tAct);
};
HUYA.PresenterActivityEx = function() {
  this.tAct = new HUYA.ActivityEx();
  this.lUid = 0;
  this.lYYId = 0;
  this.sNick = '';
  this.sAvatar = '';
  this.bLive = true;
  this.tLive = new HUYA.GameLiveInfo();
  this.iLevel = 0;
  this.iCanBeSubscribed = 0;
  this.iSubscribeStatus = 0;
  this.lSubscribeCount = 0;
  this.iGender = 0;
  this.iFansNum = 0;
  this.iDiamondFansNum = 0;
  this.iDiamondFansQuota = 0;
  this.sDiamondUrl = '';
};
HUYA.PresenterActivityEx.prototype._clone = function() {
  return new HUYA.PresenterActivityEx();
};
HUYA.PresenterActivityEx.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.PresenterActivityEx.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.PresenterActivityEx.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tAct);
  t.writeInt64(1, this.lUid);
  t.writeInt64(2, this.lYYId);
  t.writeString(3, this.sNick);
  t.writeString(4, this.sAvatar);
  t.writeBoolean(5, this.bLive);
  t.writeStruct(6, this.tLive);
  t.writeInt32(7, this.iLevel);
  t.writeInt32(8, this.iCanBeSubscribed);
  t.writeInt32(9, this.iSubscribeStatus);
  t.writeInt64(10, this.lSubscribeCount);
  t.writeInt32(11, this.iGender);
  t.writeInt32(12, this.iFansNum);
  t.writeInt32(13, this.iDiamondFansNum);
  t.writeInt32(14, this.iDiamondFansQuota);
  t.writeString(15, this.sDiamondUrl);
};
HUYA.PresenterActivityEx.prototype.readFrom = function(t) {
  this.tAct = t.readStruct(0, false, this.tAct);
  this.lUid = t.readInt64(1, false, this.lUid);
  this.lYYId = t.readInt64(2, false, this.lYYId);
  this.sNick = t.readString(3, false, this.sNick);
  this.sAvatar = t.readString(4, false, this.sAvatar);
  this.bLive = t.readBoolean(5, false, this.bLive);
  this.tLive = t.readStruct(6, false, this.tLive);
  this.iLevel = t.readInt32(7, false, this.iLevel);
  this.iCanBeSubscribed = t.readInt32(8, false, this.iCanBeSubscribed);
  this.iSubscribeStatus = t.readInt32(9, false, this.iSubscribeStatus);
  this.lSubscribeCount = t.readInt64(10, false, this.lSubscribeCount);
  this.iGender = t.readInt32(11, false, this.iGender);
  this.iFansNum = t.readInt32(12, false, this.iFansNum);
  this.iDiamondFansNum = t.readInt32(13, false, this.iDiamondFansNum);
  this.iDiamondFansQuota = t.readInt32(14, false, this.iDiamondFansQuota);
  this.sDiamondUrl = t.readString(15, false, this.sDiamondUrl);
};
HUYA.ActivityEx = function() {
  this.iType = 0;
  this.sKey = '';
  this.lAid = 0;
  this.iDateline = 0;
};
HUYA.ActivityEx.prototype._clone = function() {
  return new HUYA.ActivityEx();
};
HUYA.ActivityEx.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.ActivityEx.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.ActivityEx.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iType);
  t.writeString(1, this.sKey);
  t.writeInt64(2, this.lAid);
  t.writeInt32(3, this.iDateline);
};
HUYA.ActivityEx.prototype.readFrom = function(t) {
  this.iType = t.readInt32(0, false, this.iType);
  this.sKey = t.readString(1, false, this.sKey);
  this.lAid = t.readInt64(2, false, this.lAid);
  this.iDateline = t.readInt32(3, false, this.iDateline);
};
HUYA.GetCdnTokenExReq = function() {
  this.sFlvUrl = '';
  this.sStreamName = '';
};
HUYA.GetCdnTokenExReq.prototype._clone = function() {
  return new HUYA.GetCdnTokenExReq();
};
HUYA.GetCdnTokenExReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetCdnTokenExReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetCdnTokenExReq.prototype.writeTo = function(t) {
  t.writeString(0, this.sFlvUrl);
  t.writeString(1, this.sStreamName);
};
HUYA.GetCdnTokenExReq.prototype.readFrom = function(t) {
  this.sFlvUrl = t.readString(0, false, this.sFlvUrl);
  this.sStreamName = t.readString(1, false, this.sStreamName);
};
HUYA.GetCdnTokenExRsp = function() {
  this.sFlvToken = '';
  this.iExpireTime = 0;
};
HUYA.GetCdnTokenExRsp.prototype._clone = function() {
  return new HUYA.GetCdnTokenExRsp();
};
HUYA.GetCdnTokenExRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.GetCdnTokenExRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.GetCdnTokenExRsp.prototype.writeTo = function(t) {
  t.writeString(0, this.sFlvToken);
  t.writeInt32(1, this.iExpireTime);
};
HUYA.GetCdnTokenExRsp.prototype.readFrom = function(t) {
  this.sFlvToken = t.readString(0, false, this.sFlvToken);
  this.iExpireTime = t.readInt32(1, false, this.iExpireTime);
};
HUYA.SetBadgeVReq = function() {
  this.tUserId = new HUYA.UserId();
  this.lFansUid = 0;
  this.lBadgeId = 0;
  this.iVFlag = -1;
};
HUYA.SetBadgeVReq.prototype._clone = function() {
  return new HUYA.SetBadgeVReq();
};
HUYA.SetBadgeVReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.SetBadgeVReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.SetBadgeVReq.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tUserId);
  t.writeInt64(1, this.lFansUid);
  t.writeInt64(2, this.lBadgeId);
  t.writeInt32(3, this.iVFlag);
};
HUYA.SetBadgeVReq.prototype.readFrom = function(t) {
  this.tUserId = t.readStruct(0, false, this.tUserId);
  this.lFansUid = t.readInt64(1, false, this.lFansUid);
  this.lBadgeId = t.readInt64(2, false, this.lBadgeId);
  this.iVFlag = t.readInt32(3, false, this.iVFlag);
};
HUYA.SetBadgeVRsp = function() {
  this.iRet = 0;
  this.lFansUid = 0;
  this.lBadgeId = 0;
  this.iVFlag = -1;
};
HUYA.SetBadgeVRsp.prototype._clone = function() {
  return new HUYA.SetBadgeVRsp();
};
HUYA.SetBadgeVRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
HUYA.SetBadgeVRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
HUYA.SetBadgeVRsp.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iRet);
  t.writeInt64(1, this.lFansUid);
  t.writeInt64(2, this.lBadgeId);
  t.writeInt32(3, this.iVFlag);
};
HUYA.SetBadgeVRsp.prototype.readFrom = function(t) {
  this.iRet = t.readInt32(0, false, this.iRet);
  this.lFansUid = t.readInt64(1, false, this.lFansUid);
  this.lBadgeId = t.readInt64(2, false, this.lBadgeId);
  this.iVFlag = t.readInt32(3, false, this.iVFlag);
};

var ActSummerSports = ActSummerSports || {};
ActSummerSports.JumpChannel = function() {
  this.lPid = 0;
  this.lTid = 0;
  this.lSid = 0;
  this.iGameId = 0;
  this.lYYId = 0;
};
ActSummerSports.JumpChannel.prototype._clone = function() {
  return new ActSummerSports.JumpChannel();
};
ActSummerSports.JumpChannel.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
ActSummerSports.JumpChannel.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
ActSummerSports.JumpChannel.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lPid);
  t.writeInt64(1, this.lTid);
  t.writeInt64(2, this.lSid);
  t.writeInt32(3, this.iGameId);
  t.writeInt64(4, this.lYYId);
};
ActSummerSports.JumpChannel.prototype.readFrom = function(t) {
  this.lPid = t.readInt64(0, false, this.lPid);
  this.lTid = t.readInt64(1, false, this.lTid);
  this.lSid = t.readInt64(2, false, this.lSid);
  this.iGameId = t.readInt32(3, false, this.iGameId);
  this.lYYId = t.readInt64(4, false, this.lYYId);
};
ActSummerSports.AnchorPanel = function() {
  this.iRank = 0;
  this.iCurDay = 0;
  this.iMaxDay = 0;
  this.iJob = 0;
  this.tJumpSelf = new ActSummerSports.JumpChannel();
  this.sLogoUrlSelf = '';
  this.sNickNameSelf = '';
  this.tJumpMate = new ActSummerSports.JumpChannel();
  this.sLogoUrlMate = '';
  this.sNickNameMate = '';
  this.iScore = 0;
  this.iTaskLv = 0;
  this.iTaskProgress = 0;
  this.iTaskRequire = 0;
  this.iTaskReward = 0;
  this.iTaskFinish = 0;
  this.iBuff = 0;
  this.iBuffExpire = 0;
  this.iSPTime = 0;
  this.iHasGroup = 0;
  this.iGroupGold = 0;
  this.iGroupSilver = 0;
  this.iGroupBronze = 0;
  this.iHourRank = 0;
  this.iHourScore = 0;
  this.iStarRoom = 0;
};
ActSummerSports.AnchorPanel.prototype._clone = function() {
  return new ActSummerSports.AnchorPanel();
};
ActSummerSports.AnchorPanel.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
ActSummerSports.AnchorPanel.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
ActSummerSports.AnchorPanel.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iRank);
  t.writeInt32(1, this.iCurDay);
  t.writeInt32(2, this.iMaxDay);
  t.writeInt32(3, this.iJob);
  t.writeStruct(4, this.tJumpSelf);
  t.writeString(5, this.sLogoUrlSelf);
  t.writeString(6, this.sNickNameSelf);
  t.writeStruct(7, this.tJumpMate);
  t.writeString(8, this.sLogoUrlMate);
  t.writeString(9, this.sNickNameMate);
  t.writeInt32(10, this.iScore);
  t.writeInt32(11, this.iTaskLv);
  t.writeInt32(12, this.iTaskProgress);
  t.writeInt32(13, this.iTaskRequire);
  t.writeInt32(14, this.iTaskReward);
  t.writeInt32(15, this.iTaskFinish);
  t.writeInt32(16, this.iBuff);
  t.writeInt32(17, this.iBuffExpire);
  t.writeInt32(18, this.iSPTime);
  t.writeInt32(19, this.iHasGroup);
  t.writeInt32(20, this.iGroupGold);
  t.writeInt32(21, this.iGroupSilver);
  t.writeInt32(22, this.iGroupBronze);
  t.writeInt32(23, this.iHourRank);
  t.writeInt32(24, this.iHourScore);
  t.writeInt32(25, this.iStarRoom);
};
ActSummerSports.AnchorPanel.prototype.readFrom = function(t) {
  this.iRank = t.readInt32(0, false, this.iRank);
  this.iCurDay = t.readInt32(1, false, this.iCurDay);
  this.iMaxDay = t.readInt32(2, false, this.iMaxDay);
  this.iJob = t.readInt32(3, false, this.iJob);
  this.tJumpSelf = t.readStruct(4, false, this.tJumpSelf);
  this.sLogoUrlSelf = t.readString(5, false, this.sLogoUrlSelf);
  this.sNickNameSelf = t.readString(6, false, this.sNickNameSelf);
  this.tJumpMate = t.readStruct(7, false, this.tJumpMate);
  this.sLogoUrlMate = t.readString(8, false, this.sLogoUrlMate);
  this.sNickNameMate = t.readString(9, false, this.sNickNameMate);
  this.iScore = t.readInt32(10, false, this.iScore);
  this.iTaskLv = t.readInt32(11, false, this.iTaskLv);
  this.iTaskProgress = t.readInt32(12, false, this.iTaskProgress);
  this.iTaskRequire = t.readInt32(13, false, this.iTaskRequire);
  this.iTaskReward = t.readInt32(14, false, this.iTaskReward);
  this.iTaskFinish = t.readInt32(15, false, this.iTaskFinish);
  this.iBuff = t.readInt32(16, false, this.iBuff);
  this.iBuffExpire = t.readInt32(17, false, this.iBuffExpire);
  this.iSPTime = t.readInt32(18, false, this.iSPTime);
  this.iHasGroup = t.readInt32(19, false, this.iHasGroup);
  this.iGroupGold = t.readInt32(20, false, this.iGroupGold);
  this.iGroupSilver = t.readInt32(21, false, this.iGroupSilver);
  this.iGroupBronze = t.readInt32(22, false, this.iGroupBronze);
  this.iHourRank = t.readInt32(23, false, this.iHourRank);
  this.iHourScore = t.readInt32(24, false, this.iHourScore);
  this.iStarRoom = t.readInt32(25, false, this.iStarRoom);
};
ActSummerSports.AnchorInfoItem = function() {
  this.tJump = new ActSummerSports.JumpChannel();
  this.iJob = 0;
  this.sLogoUrl = '';
  this.sNickName = '';
  this.iScore = 0;
};
ActSummerSports.AnchorInfoItem.prototype._clone = function() {
  return new ActSummerSports.AnchorInfoItem();
};
ActSummerSports.AnchorInfoItem.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
ActSummerSports.AnchorInfoItem.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
ActSummerSports.AnchorInfoItem.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tJump);
  t.writeInt32(1, this.iJob);
  t.writeString(2, this.sLogoUrl);
  t.writeString(3, this.sNickName);
  t.writeInt32(4, this.iScore);
};
ActSummerSports.AnchorInfoItem.prototype.readFrom = function(t) {
  this.tJump = t.readStruct(0, false, this.tJump);
  this.iJob = t.readInt32(1, false, this.iJob);
  this.sLogoUrl = t.readString(2, false, this.sLogoUrl);
  this.sNickName = t.readString(3, false, this.sNickName);
  this.iScore = t.readInt32(4, false, this.iScore);
};
ActSummerSports.ResultPanel = function() {
  this.tBestMan = new ActSummerSports.AnchorInfoItem();
  this.tBestLady = new ActSummerSports.AnchorInfoItem();
  this.tGroupMan = new ActSummerSports.AnchorInfoItem();
  this.tGroupLady = new ActSummerSports.AnchorInfoItem();
};
ActSummerSports.ResultPanel.prototype._clone = function() {
  return new ActSummerSports.ResultPanel();
};
ActSummerSports.ResultPanel.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
ActSummerSports.ResultPanel.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
ActSummerSports.ResultPanel.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tBestMan);
  t.writeStruct(1, this.tBestLady);
  t.writeStruct(2, this.tGroupMan);
  t.writeStruct(3, this.tGroupLady);
};
ActSummerSports.ResultPanel.prototype.readFrom = function(t) {
  this.tBestMan = t.readStruct(0, false, this.tBestMan);
  this.tBestLady = t.readStruct(1, false, this.tBestLady);
  this.tGroupMan = t.readStruct(2, false, this.tGroupMan);
  this.tGroupLady = t.readStruct(3, false, this.tGroupLady);
};
ActSummerSports.PresenterRankItem = function() {
  this.tJump = new ActSummerSports.JumpChannel();
  this.sNickName = '';
  this.iScore = 0;
  this.iRank = 0;
  this.sLogoUrl = '';
};
ActSummerSports.PresenterRankItem.prototype._clone = function() {
  return new ActSummerSports.PresenterRankItem();
};
ActSummerSports.PresenterRankItem.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
ActSummerSports.PresenterRankItem.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
ActSummerSports.PresenterRankItem.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tJump);
  t.writeString(1, this.sNickName);
  t.writeInt32(2, this.iScore);
  t.writeInt32(3, this.iRank);
  t.writeString(4, this.sLogoUrl);
};
ActSummerSports.PresenterRankItem.prototype.readFrom = function(t) {
  this.tJump = t.readStruct(0, false, this.tJump);
  this.sNickName = t.readString(1, false, this.sNickName);
  this.iScore = t.readInt32(2, false, this.iScore);
  this.iRank = t.readInt32(3, false, this.iRank);
  this.sLogoUrl = t.readString(4, false, this.sLogoUrl);
};
ActSummerSports.HourRankPanel = function() {
  this.iSPTime = 0;
  this.vRank = new Taf.Vector(new ActSummerSports.PresenterRankItem());
  this.iJob = 0;
};
ActSummerSports.HourRankPanel.prototype._clone = function() {
  return new ActSummerSports.HourRankPanel();
};
ActSummerSports.HourRankPanel.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
ActSummerSports.HourRankPanel.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
ActSummerSports.HourRankPanel.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iSPTime);
  t.writeVector(1, this.vRank);
  t.writeInt32(2, this.iJob);
};
ActSummerSports.HourRankPanel.prototype.readFrom = function(t) {
  this.iSPTime = t.readInt32(0, false, this.iSPTime);
  this.vRank = t.readVector(1, false, this.vRank);
  this.iJob = t.readInt32(2, false, this.iJob);
};
ActSummerSports.ManRankPanel = function() {
  this.vRank = new Taf.Vector(new ActSummerSports.PresenterRankItem());
};
ActSummerSports.ManRankPanel.prototype._clone = function() {
  return new ActSummerSports.ManRankPanel();
};
ActSummerSports.ManRankPanel.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
ActSummerSports.ManRankPanel.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
ActSummerSports.ManRankPanel.prototype.writeTo = function(t) {
  t.writeVector(0, this.vRank);
};
ActSummerSports.ManRankPanel.prototype.readFrom = function(t) {
  this.vRank = t.readVector(0, false, this.vRank);
};
ActSummerSports.LadyRankPanel = function() {
  this.vRank = new Taf.Vector(new ActSummerSports.PresenterRankItem());
};
ActSummerSports.LadyRankPanel.prototype._clone = function() {
  return new ActSummerSports.LadyRankPanel();
};
ActSummerSports.LadyRankPanel.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
ActSummerSports.LadyRankPanel.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
ActSummerSports.LadyRankPanel.prototype.writeTo = function(t) {
  t.writeVector(0, this.vRank);
};
ActSummerSports.LadyRankPanel.prototype.readFrom = function(t) {
  this.vRank = t.readVector(0, false, this.vRank);
};
ActSummerSports.GroupRankItem = function() {
  this.tUserInfo = new ActSummerSports.UserBaseInfo();
  this.iRank = 0;
  this.iGroupGold = 0;
  this.iGroupSilver = 0;
  this.iGroupBronze = 0;
  this.tJump = new ActSummerSports.JumpChannel();
};
ActSummerSports.GroupRankItem.prototype._clone = function() {
  return new ActSummerSports.GroupRankItem();
};
ActSummerSports.GroupRankItem.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
ActSummerSports.GroupRankItem.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
ActSummerSports.GroupRankItem.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tUserInfo);
  t.writeInt32(1, this.iRank);
  t.writeInt32(3, this.iGroupGold);
  t.writeInt32(4, this.iGroupSilver);
  t.writeInt32(5, this.iGroupBronze);
  t.writeStruct(6, this.tJump);
};
ActSummerSports.GroupRankItem.prototype.readFrom = function(t) {
  this.tUserInfo = t.readStruct(0, false, this.tUserInfo);
  this.iRank = t.readInt32(1, false, this.iRank);
  this.iGroupGold = t.readInt32(3, false, this.iGroupGold);
  this.iGroupSilver = t.readInt32(4, false, this.iGroupSilver);
  this.iGroupBronze = t.readInt32(5, false, this.iGroupBronze);
  this.tJump = t.readStruct(6, false, this.tJump);
};
ActSummerSports.GroupRankPanel = function() {
  this.vRank = new Taf.Vector(new ActSummerSports.GroupRankItem());
};
ActSummerSports.GroupRankPanel.prototype._clone = function() {
  return new ActSummerSports.GroupRankPanel();
};
ActSummerSports.GroupRankPanel.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
ActSummerSports.GroupRankPanel.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
ActSummerSports.GroupRankPanel.prototype.writeTo = function(t) {
  t.writeVector(0, this.vRank);
};
ActSummerSports.GroupRankPanel.prototype.readFrom = function(t) {
  this.vRank = t.readVector(0, false, this.vRank);
};
ActSummerSports.HoverItem = function() {
  this.iDay = 0;
  this.iSPTime = 0;
  this.lPid = 0;
  this.iMedal = 0;
};
ActSummerSports.HoverItem.prototype._clone = function() {
  return new ActSummerSports.HoverItem();
};
ActSummerSports.HoverItem.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
ActSummerSports.HoverItem.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
ActSummerSports.HoverItem.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iDay);
  t.writeInt32(1, this.iSPTime);
  t.writeInt64(2, this.lPid);
  t.writeInt32(3, this.iMedal);
};
ActSummerSports.HoverItem.prototype.readFrom = function(t) {
  this.iDay = t.readInt32(0, false, this.iDay);
  this.iSPTime = t.readInt32(1, false, this.iSPTime);
  this.lPid = t.readInt64(2, false, this.lPid);
  this.iMedal = t.readInt32(3, false, this.iMedal);
};
ActSummerSports.HoverPannel = function() {
  this.tSelf = new ActSummerSports.AnchorInfoItem();
  this.tMate = new ActSummerSports.AnchorInfoItem();
  this.vItem = new Taf.Vector(new ActSummerSports.HoverItem());
};
ActSummerSports.HoverPannel.prototype._clone = function() {
  return new ActSummerSports.HoverPannel();
};
ActSummerSports.HoverPannel.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
ActSummerSports.HoverPannel.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
ActSummerSports.HoverPannel.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tSelf);
  t.writeStruct(1, this.tMate);
  t.writeVector(2, this.vItem);
};
ActSummerSports.HoverPannel.prototype.readFrom = function(t) {
  this.tSelf = t.readStruct(0, false, this.tSelf);
  this.tMate = t.readStruct(1, false, this.tMate);
  this.vItem = t.readVector(2, false, this.vItem);
};
ActSummerSports.UserBaseInfo = function() {
  this.lPid = 0;
  this.sNickName = '';
  this.sIconUrl = '';
};
ActSummerSports.UserBaseInfo.prototype._clone = function() {
  return new ActSummerSports.UserBaseInfo();
};
ActSummerSports.UserBaseInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
ActSummerSports.UserBaseInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
ActSummerSports.UserBaseInfo.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lPid);
  t.writeString(1, this.sNickName);
  t.writeString(2, this.sIconUrl);
};
ActSummerSports.UserBaseInfo.prototype.readFrom = function(t) {
  this.lPid = t.readInt64(0, false, this.lPid);
  this.sNickName = t.readString(1, false, this.sNickName);
  this.sIconUrl = t.readString(2, false, this.sIconUrl);
};
ActSummerSports.InfoRsp = function() {
  this.vAttackRank = new Taf.Vector(new ActSummerSports.PresenterRankItem());
  this.tMvpInfo = new ActSummerSports.UserBaseInfo();
};
ActSummerSports.InfoRsp.prototype._clone = function() {
  return new ActSummerSports.InfoRsp();
};
ActSummerSports.InfoRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
ActSummerSports.InfoRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
ActSummerSports.InfoRsp.prototype.writeTo = function(t) {
  t.writeVector(0, this.vAttackRank);
  t.writeStruct(1, this.tMvpInfo);
};
ActSummerSports.InfoRsp.prototype.readFrom = function(t) {
  this.vAttackRank = t.readVector(0, false, this.vAttackRank);
  this.tMvpInfo = t.readStruct(1, false, this.tMvpInfo);
};
ActSummerSports.Banner = function() {
  this.iBannerType = 0;
  this.vArg = new Taf.Vector(new Taf.STRING());
};
ActSummerSports.Banner.prototype._clone = function() {
  return new ActSummerSports.Banner();
};
ActSummerSports.Banner.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
ActSummerSports.Banner.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
ActSummerSports.Banner.prototype.writeTo = function(t) {
  t.writeInt32(0, this.iBannerType);
  t.writeVector(1, this.vArg);
};
ActSummerSports.Banner.prototype.readFrom = function(t) {
  this.iBannerType = t.readInt32(0, false, this.iBannerType);
  this.vArg = t.readVector(1, false, this.vArg);
};
ActSummerSports.TeamInfo = function() {
  this.tUserInfo = new ActSummerSports.UserBaseInfo();
  this.iJob = 0;
  this.iRank = 0;
  this.iScore = 0;
  this.iInviteTime = 0;
  this.iGroupGold = 0;
  this.iGroupSilver = 0;
  this.iGroupBronze = 0;
};
ActSummerSports.TeamInfo.prototype._clone = function() {
  return new ActSummerSports.TeamInfo();
};
ActSummerSports.TeamInfo.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
ActSummerSports.TeamInfo.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
ActSummerSports.TeamInfo.prototype.writeTo = function(t) {
  t.writeStruct(0, this.tUserInfo);
  t.writeInt32(1, this.iJob);
  t.writeInt32(2, this.iRank);
  t.writeInt32(3, this.iScore);
  t.writeInt32(4, this.iInviteTime);
  t.writeInt32(5, this.iGroupGold);
  t.writeInt32(6, this.iGroupSilver);
  t.writeInt32(7, this.iGroupBronze);
};
ActSummerSports.TeamInfo.prototype.readFrom = function(t) {
  this.tUserInfo = t.readStruct(0, false, this.tUserInfo);
  this.iJob = t.readInt32(1, false, this.iJob);
  this.iRank = t.readInt32(2, false, this.iRank);
  this.iScore = t.readInt32(3, false, this.iScore);
  this.iInviteTime = t.readInt32(4, false, this.iInviteTime);
  this.iGroupGold = t.readInt32(5, false, this.iGroupGold);
  this.iGroupSilver = t.readInt32(6, false, this.iGroupSilver);
  this.iGroupBronze = t.readInt32(7, false, this.iGroupBronze);
};
ActSummerSports.TeamOpReq = function() {
  this.lOwnerId = 0;
  this.lParnerId = 0;
  this.iOpType = 0;
};
ActSummerSports.TeamOpReq.prototype._clone = function() {
  return new ActSummerSports.TeamOpReq();
};
ActSummerSports.TeamOpReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
ActSummerSports.TeamOpReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
ActSummerSports.TeamOpReq.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lOwnerId);
  t.writeInt64(1, this.lParnerId);
  t.writeInt32(2, this.iOpType);
};
ActSummerSports.TeamOpReq.prototype.readFrom = function(t) {
  this.lOwnerId = t.readInt64(0, false, this.lOwnerId);
  this.lParnerId = t.readInt64(1, false, this.lParnerId);
  this.iOpType = t.readInt32(2, false, this.iOpType);
};
ActSummerSports.TeamOpRsp = function() {
  this.lOwnerId = 0;
  this.lParnerId = 0;
  this.iOpType = 0;
  this.iResult = 0;
  this.sResult = '';
};
ActSummerSports.TeamOpRsp.prototype._clone = function() {
  return new ActSummerSports.TeamOpRsp();
};
ActSummerSports.TeamOpRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
ActSummerSports.TeamOpRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
ActSummerSports.TeamOpRsp.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lOwnerId);
  t.writeInt64(1, this.lParnerId);
  t.writeInt32(2, this.iOpType);
  t.writeInt32(3, this.iResult);
  t.writeString(4, this.sResult);
};
ActSummerSports.TeamOpRsp.prototype.readFrom = function(t) {
  this.lOwnerId = t.readInt64(0, false, this.lOwnerId);
  this.lParnerId = t.readInt64(1, false, this.lParnerId);
  this.iOpType = t.readInt32(2, false, this.iOpType);
  this.iResult = t.readInt32(3, false, this.iResult);
  this.sResult = t.readString(4, false, this.sResult);
};
ActSummerSports.TeamSearchReq = function() {
  this.lPid = 0;
  this.sNickName = '';
};
ActSummerSports.TeamSearchReq.prototype._clone = function() {
  return new ActSummerSports.TeamSearchReq();
};
ActSummerSports.TeamSearchReq.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
ActSummerSports.TeamSearchReq.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
ActSummerSports.TeamSearchReq.prototype.writeTo = function(t) {
  t.writeInt64(0, this.lPid);
  t.writeString(1, this.sNickName);
};
ActSummerSports.TeamSearchReq.prototype.readFrom = function(t) {
  this.lPid = t.readInt64(0, false, this.lPid);
  this.sNickName = t.readString(1, false, this.sNickName);
};
ActSummerSports.TeamSearchRsp = function() {
  this.vSearchList = new Taf.Vector(new ActSummerSports.TeamInfo());
};
ActSummerSports.TeamSearchRsp.prototype._clone = function() {
  return new ActSummerSports.TeamSearchRsp();
};
ActSummerSports.TeamSearchRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
ActSummerSports.TeamSearchRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
ActSummerSports.TeamSearchRsp.prototype.writeTo = function(t) {
  t.writeVector(0, this.vSearchList);
};
ActSummerSports.TeamSearchRsp.prototype.readFrom = function(t) {
  this.vSearchList = t.readVector(0, false, this.vSearchList);
};
ActSummerSports.TeamInviteRsp = function() {
  this.vInviteList = new Taf.Vector(new ActSummerSports.TeamInfo());
};
ActSummerSports.TeamInviteRsp.prototype._clone = function() {
  return new ActSummerSports.TeamInviteRsp();
};
ActSummerSports.TeamInviteRsp.prototype._write = function(t, e, i) {
  t.writeStruct(e, i);
};
ActSummerSports.TeamInviteRsp.prototype._read = function(t, e, i) {
  return t.readStruct(e, true, i);
};
ActSummerSports.TeamInviteRsp.prototype.writeTo = function(t) {
  t.writeVector(0, this.vInviteList);
};
ActSummerSports.TeamInviteRsp.prototype.readFrom = function(t) {
  this.vInviteList = t.readVector(0, false, this.vInviteList);
};

var TafMx = TafMx || {};
TafMx.UriMapping = {
  1001: HUYA.NobleNotice,
  1002: HUYA.NobleEnterNotice,
  1005: HUYA.NobleEnterNotice,
  1400: HUYA.MessageNotice,
  3104: HUYA.SubscribeInfoNotify,
  6100: HUYA.WeekStarPropsIds,
  6102: HUYA.WeekStarPropsIdsTab,
  6110: HUYA.VipEnterBanner,
  6200: HUYA.EnterPushInfo,
  6201: HUYA.GameAdvertisement,
  6202: HUYA.AdvanceUserEnterNotice,
  6203: HUYA.ViewerListRsp,
  6210: HUYA.VipBarListRsp,
  6220: HUYA.WeekRankListRsp,
  6221: HUYA.WeekRankEnterBanner,
  6223: HUYA.FansSupportListRsp,
  6230: HUYA.FansRankListRsp,
  6231: HUYA.BadgeInfo,
  6232: HUYA.BadgeScoreChanged,
  6233: HUYA.FansInfoNotice,
  6234: HUYA.UserGiftNotice,
  6235: HUYA.WeekStarPropsIds,
  6250: HUYA.GiftBarRsp,
  6260: HUYA.GrandCeremonyChampionPresenter,
  6501: HUYA.SendItemSubBroadcastPacket,
  6502: HUYA.SendItemNoticeWordBroadcastPacket,
  6640: HUYA.ShowScreenSkinNotify,
  6641: HUYA.HideScreenSkinNotify,
  6291: HUYA.BannerNotice,
  6602: HUYA.TreasureResultBroadcastPacket,
  6604: HUYA.TreasureUpdateNotice,
  6605: HUYA.TreasureLotteryResultNoticePacket,
  7054: HUYA.MatchRaffleResultNotice,
  7055: HUYA.MatchRaffleResultNotice,
  7500: HUYA.BatchGameInfoNotice,
  7501: HUYA.GameInfoChangeNotice,
  7502: HUYA.EndHistoryGameNotice,
  7503: HUYA.GameSettlementNotice,
  7504: HUYA.PresenterEndGameNotice,
  8000: HUYA.BeginLiveNotice,
  8001: HUYA.EndLiveNotice,
  8002: HUYA.StreamSettingNotice,
  8006: HUYA.AttendeeCountNotice,
  9010: HUYA.ReplayPresenterInLiveNotify,
  9011: HUYA.ReplayMessageBody,
  10040: HUYA.AuditorEnterLiveNotice,
  10041: HUYA.AuditorRoleChangeNotice,
  10042: HUYA.GetRoomAuditConfRsp,
  42008: HUYA.LinkMicStatusChangeNotice,
  44000: HUYA.InterveneCountRsp,
  1000106: HUYA.UserLevelUpgradeNotice,
  1000107: HUYA.UserNovieTaskCompleteNotice,
  1020001: HUYA.GuardianPresenterInfoNotice,
  10220251: HUYA.LiveAdvertisementNotice,
  1010003: HUYA.ActivityMsgRsp,
  20170802: ActSummerSports.AnchorPanel,
  20170803: ActSummerSports.ResultPanel,
  20170804: ActSummerSports.HourRankPanel,
  20170805: ActSummerSports.ManRankPanel,
  20170806: ActSummerSports.LadyRankPanel,
  20170807: ActSummerSports.GroupRankPanel,
  20170808: ActSummerSports.Banner,
  20170809: ActSummerSports.HoverPannel
};
TafMx.WupMapping = {
  OnUserEvent: HUYA.UserEventRsp,
  doLaunch: HUYA.LiveLaunchRsp,
  getLivingInfo: HUYA.GetLivingInfoRsp,
  getWebdbUserInfo: HUYA.GetWebdbUserInfoRsp,
  batchGetCdnTokenInfo: HUYA.BatchGetCdnTokenRsp,
  getPropsList: HUYA.GetPropsListRsp,
  getCurWeekStarPropsIds: HUYA.WeekStarPropsIds,
  sendCardPackageItem: HUYA.SendCardPackageItemRsp,
  getVerificationStatus: HUYA.GetVerificationStatusResp,
  getFirstRechargePkgStatus: HUYA.GetFirstRechargePkgStatusResp,
  getPresenterDetail: HUYA.GetPresenterDetailRsp,
  OnUserHeartBeat: HUYA.UserHeartBeatRsp,
  getCdnTokenInfoEx: HUYA.GetCdnTokenExRsp,
  getVipBarList: HUYA.VipBarListRsp,
  getWeekRankList: HUYA.WeekRankListRsp,
  muteRoomUser: HUYA.MuteRoomUserRsp,
  sendMessage: HUYA.SendMessageRsp,
  GetNobleInfo: HUYA.NobleInfoRsp,
  queryBadgeInfoList: HUYA.BadgeInfoListRsp,
  queryBadgeInfo: HUYA.BadgeInfo,
  useBadge: HUYA.BadgeInfo,
  getVipCard: HUYA.VipCardRsp,
  getScreenSkin: HUYA.getScreenSkinRsp,
  getRoomAuditConf: HUYA.GetRoomAuditConfRsp,
  getUserLevelInfo: HUYA.GetUserLevelInfoRsp,
  getViewerList: HUYA.ViewerListRsp,
  getFansSupportList: HUYA.FansSupportListRsp,
  sendReplayMessage: HUYA.SendReplayMessageRsp,
  getPresenterActivity: HUYA.PresenterActivityRsp,
  getUserBoxInfo: HUYA.GetUserBoxInfoRsp,
  finishTaskNotice: HUYA.FinishTaskNoticeRsp,
  awardBoxPrize: HUYA.AwardBoxPrizeRsp,
  bet: HUYA.BetRsp,
  buyBet: HUYA.BuyBetRsp,
  getGameInfo: HUYA.GetGameInfoListRsp,
  getRemainBeanNum: HUYA.GetRemainBeanNumRsp,
  queryCardPackage: HUYA.QueryPackageRsp,
  getAssistant: HUYA.GetAssistantRsp,
  queryTreasure: HUYA.QueryTreasureInfoRsp,
  sendTreasureLotteryDraw: HUYA.TreasureLotteryDrawRsp,
  getLinkMicPresenterListByUid: HUYA.GetLinkMicPresenterInfoRsp,
  subscribe: HUYA.SubscribeResp,
  unsubscribe: HUYA.UnsubscribeResp,
  getSubscribeStatus: HUYA.SubscribeStatusResp,
  getGameLiveHisUpon: HUYA.GetGameLiveHisUponRsp,
  getBadgeName: HUYA.BadgeNameRsp,
  getLiveAdInfo: HUYA.GetLiveAdInfoRsp,
  setBadgeV: HUYA.SetBadgeVRsp,
  getActivityMsg: HUYA.ActivityMsgRsp
};

function TafHandler() {
  var w,
    j = this,
    k = 0;
  function l() {
    var destroyed = false;
    var a = 'ws://ws.api.huya.com:80';
    DEBUG && console.info('connecting ' + a),
      (w = new WebSocket(a)),
      (w.onopen = v),
      (w.onclose = p),
      (w.onerror = d),
      (w.onmessage = b);
  }
  function g(a) {
    w.send(a);
  }
  function v() {
    DEBUG && console.log('=== WebSocket Connected ==='),
      (k = 0),
      (j.connected = !0),
      j.dispatch('connect');
  }
  function p(a) {
    j.connected = !1;
    j.dispatch('close');
  }
  function d(a) {
    j.dispatch('error', a);
    DEBUG && console.warn('%c=== WebSocket Error ===', 'font-size:120%', a);
  }
  function b(A) {
    A = A.data;
    var y = new Taf.JceInputStream(A),
      E = new HUYA.WebSocketCommand();
    switch ((E.readFrom(y), E.iCmdType)) {
      case HUYA.EWebSocketCommandType.EWSCmd_RegisterRsp:
        y = new Taf.JceInputStream(E.vData.buffer);
        var C = new HUYA.WSRegisterRsp();
        C.readFrom(y),
          DEBUG && console.log('<<<<<<< rspRegister', C),
          j.dispatch('rawdata', { cmd: 'WSRegisterRsp', data: C });
        break;
      case HUYA.EWebSocketCommandType.EWSCmd_WupRsp:
        var x = new Taf.Wup();
        x.decode(E.vData.buffer);
        var c = TafMx.WupMapping[x.sFuncName];
        if (c) {
          c = new c();
          var F = x.newdata.get('tRsp') ? 'tRsp' : 'tResp';
          x.readStruct(F, c, TafMx.WupMapping[x.sFuncName]),
            DEBUG && console.log('<<<<<<< rspWup: ' + x.sFuncName),
            j.dispatch('rawdata', { cmd: x.sFuncName, data: c });
        } else {
          j.dispatch('rawdata', { cmd: x.sFuncName });
        }
        break;
      case HUYA.EWebSocketCommandType.EWSCmdS2C_MsgPushReq:
        y = new Taf.JceInputStream(E.vData.buffer);
        var z = new HUYA.WSPushMessage();
        z.readFrom(y), (y = new Taf.JceInputStream(z.sMsg.buffer));
        var D = TafMx.UriMapping[z.iUri];
        D &&
          ((D = new D()),
          D.readFrom(y),
          DEBUG && console.log('<<<<<<< rspMsgPush, iUri=' + z.iUri, D),
          j.dispatch('rawdata', { cmd: z.iUri, data: D }));
        break;
      case HUYA.EWebSocketCommandType.EWSCmdS2C_HeartBeatAck:
        DEBUG && console.log('<<<<<<< rspHeartBeat: ' + new Date().getTime());
        break;
      case HUYA.EWebSocketCommandType.EWSCmdS2C_VerifyCookieRsp:
        y = new Taf.JceInputStream(E.vData.buffer);
        var i = new HUYA.WSVerifyCookieRsp();
        i.readFrom(y);
        var B = 0 == i.iValidate;
        DEBUG &&
          console.log('<<<<<<< VerifyCookie', '校验' + (B ? '通过！' : '失败！'), i);
        break;
      default:
        DEBUG && console.warn('<<<<<<< Not matched CmdType: ' + E.iCmdType);
    }
  }
  function m(a) {
    return 'color:' + a + ';font-weight:900';
  }
  this.connected = !1;
  l(),
    (this.sendWup = function(u, f, c) {
      var x = new Taf.Wup();
      x.setServant(u), x.setFunc(f), x.writeStruct('tReq', c);
      var n = new HUYA.WebSocketCommand();
      (n.iCmdType = HUYA.EWebSocketCommandType.EWSCmd_WupReq),
        (n.vData = x.encode());
      var i = new Taf.JceOutputStream();
      n.writeTo(i),
        g(i.getBuffer()),
        DEBUG &&
          console.log(
            '%c>>>>>>> %creqWup: %c' + f,
            m('#009100'),
            m('black'),
            m('#009100'),
            c
          );
    }),
    (this.sendRegister = function(i) {
      var f = new Taf.JceOutputStream();
      i.writeTo(f);
      var c = new HUYA.WebSocketCommand();
      (c.iCmdType = HUYA.EWebSocketCommandType.EWSCmd_RegisterReq),
        (c.vData = f.getBinBuffer()),
        (f = new Taf.JceOutputStream()),
        c.writeTo(f),
        g(f.getBuffer()),
        DEBUG &&
          console.log(
            '%c>>>>>>> %creqRegister:',
            m('#009100'),
            m('#D26900'),
            i
          );
    });
  var q = {};
  (this.addListener = function(a, c) {
    return (
      'undefined' == typeof q[a] && (q[a] = []),
      'function' == typeof c && q[a].push(c),
      this
    );
  }),
    (this.dispatch = function(i, s) {
      var f = q[i];
      if (f instanceof Array) {
        for (var c = 0, r = f.length; r > c; c += 1) {
          'function' == typeof f[c] && f[c](s);
        }
        0 == f.length;
      }
      return this;
    }),
    (this.removeListener = function(i, s) {
      var f = q[i];
      if ('string' == typeof i && f instanceof Array) {
        if ('function' == typeof s) {
          for (var c = 0, r = f.length; r > c; c += 1) {
            if (f[c].fn === s) {
              q[i].splice(c, 1);
              break;
            }
          }
        } else {
          delete q[i];
        }
      }
      return this;
    }),
    (this.destroy = function() {
      w.destroy = true;
      w.onopen = null;
      w.onclose = null;
      w.onerror = null;
      w.onmessage = null;
      w.close();
    });
}
HUYA.TafHandler = TafHandler;
module.exports = HUYA;
