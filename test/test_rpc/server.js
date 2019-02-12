/**
 * Creator: Tang Xiaoji
 * Time: 2018-06-28
 */

'use strict';

const rpc = require('../../gather/lib/rpc');

const server = new rpc.Server({}, 3000, '127.0.0.1');
server.on('remote', (remote) => {
  console.log(remote)
});