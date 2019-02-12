const ProtoBuf = require('protobufjs');

/**
 * PB对象
 * @type {{}}
 */
const proto_root = {};

/**
 * PB封包
 * @param protoPath
 * @param msgType
 * @param body
 */
async function protoEncode(protoPath, msgType, body) {
  if (!proto_root[protoPath]) {
    proto_root[protoPath] = await ProtoBuf.load(protoPath);
  }
  let msgT = proto_root[protoPath].lookupType(msgType);
  let errMsg = msgT.verify(body);
  if (errMsg) {
    console.log('pb invalid body', body);
    throw new Error(errMsg);
  }
  let message = msgT.create(body);
  return msgT.encode(message).finish();
}

/**
 * PB解包
 * @param protoPath
 * @param msgType
 * @param buffer
 */
async function protoDecode(protoPath, msgType, buffer) {
  if (!proto_root[protoPath]) {
    proto_root[protoPath] = await ProtoBuf.load(protoPath);
  }
  let msgT = proto_root[protoPath].lookupType(msgType);
  let message = msgT.decode(buffer);
  return msgT.toObject(message, {
    longs: String,
    enums: String,
    bytes: String
    // see ConversionOptions
  });
}

module.exports = {
  encode: protoEncode,
  decode: protoDecode
};
