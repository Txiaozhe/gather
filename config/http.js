/**
 * Creator: Tang Xiaoji
 * Time: 2018-01-25
 */

const request = require('request-promise');
const RESPONSE_TIMEOUT = 15e3;
const DEADLINE_TIMEOUT = 6e4;

const Get = function(url) {
  return request({
    method: 'GET',
    uri: url
  });
};

const Post = function(url, params) {
  return request({
    method: 'POST',
    uri: url,
    gzip: true,
    forever: true,
    json: params
  });
};

module.exports = {
  Get,
  Post
};
