/**
 * Creator: Tang Xiaoji
 * Time: 2017-11-02
 */

const url = require('url');
const request = require('superagent');
require('superagent-proxy')(request);

const rp = require('request-promise');

const RESPONSE_TIMEOUT = 15e3;
const DEADLINE_TIMEOUT = 6e4;

class HttpClient {
  constructor(response = RESPONSE_TIMEOUT, deadline = DEADLINE_TIMEOUT) {
    this.response = response;
    this.deadline = deadline;
  }

  Get(u, host, queryParams) {
    const srvUrl = url.parse(u);
    return request
      .get(u)
      .query(queryParams || {})
      .set('host', host || srvUrl.hostname)
      .set('Content-Type', 'application/json')
      .set('Connection', 'keep-alive')
      .set('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36')
      .set('X-Requested-With', 'XMLHttpRequest')
      .timeout({
        response: this.response,
        deadline: this.deadline
      });
  }

  LongzhuGet(url) {
    return rp({
      uri: url,
      headers: {
        'Host': 'api.plu.cn',
        'Content-Type': 'application/json',
        'Connection': 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      },
    });
  }

  Post(url, params) {
    return rp({
      method: 'POST',
      uri: url,
      gzip: true,
      forever: true,
      json: params
    });
  }
}

module.exports = new HttpClient();