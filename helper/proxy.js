/**
 * Creator: Tang Xiaoji
 * Time: 2018-02-08
 */

const _ = require('lodash');
const request = require("request");

const order = 'a7e109386c74ca83843f1bff64a1a52b';
const apiURL = 'http://api.ip.data5u.com/dynamic/get.html?order=' + order + '&sep=3';

const MAX_PROXY_LIST_LENGTH = 5;

let Proxy_List = [];
let running = false;
function getProxyList() {
  const options = {
    method: 'GET',
    url: apiURL,
    gzip: true,
    encoding: null,
    headers: {},
  };

  request(options, function (error, response, body) {
    try {
      const res = Buffer.from(body).toString();
      if (error || !res.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}/g)) {

      } else {
        running = true;
        Proxy_List = Proxy_List.concat(_.pull(res.split('\n'), ''));
      }
    } catch (e) {
      console.log('get proxy list error: ', e)
    }
  });

  if(Proxy_List.length > MAX_PROXY_LIST_LENGTH) {
    Proxy_List = Proxy_List.slice(Proxy_List.length - MAX_PROXY_LIST_LENGTH);
  }

  setTimeout(getProxyList, 5000);
}

if(!running) {
  // getProxyList(); TODO:
}

function getIp(cb) {
  if(cb) {
    cb(Proxy_List[_.random(0, Proxy_List.length - 1)]);
    return;
  }

  if(Proxy_List.length) {
    return Proxy_List[_.random(0, Proxy_List.length - 1)];
  } else {
    return '';
  }
}

let ip = '';
function getRealIp(cb) {
  const options = {
    method: 'GET',
    url: apiURL,
    gzip: true,
    encoding: null,
    headers: {},
  };

  request(options, function (error, response, body) {
    if(error) {
      ip = getIp();
      cb(ip);
    } else {
      const res = Buffer.from(body).toString();
      if(!res.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}/g)) {
        ip = getIp();
        cb(ip);
      } else {
        ip = res.split('\n')[0];
        cb(ip);
      }
    }
  });
}

function asyncGetRealIp() {
  const options = {
    method: 'GET',
    url: apiURL,
    gzip: true,
    encoding: null,
    headers: {},
  };

  return new Promise((resolve) => {
    request(options, function (error, r, body) {
      if(error) {
        ip = getIp();
        resolve(ip);
      } else {
        const res = Buffer.from(body).toString();
        if(!res.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}/g)) {
          ip = getIp();
          resolve(ip);
        } else {
          ip = res.split('\n')[0];
          resolve(ip);
        }
      }
    });
  })
}

function proxyRequest(opt, force_timeout) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject('force timeout');
    }, force_timeout);

    request(opt, (err, response, body) => {
      if (err) {
        clearTimeout(timeout);
        reject(err);
      } else {
        clearTimeout(timeout);
        resolve(body);
      }
    })
  })
}

module.exports = {
  getIp,
  getRealIp,
  asyncGetRealIp,
  proxyRequest
};
