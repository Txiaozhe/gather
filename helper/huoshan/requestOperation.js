const rp = require('request-promise');
// const proxy = require('../proxy');
const superagent = require('superagent');

const Logger = require('../../config/Logger');
const logger = new Logger('huoshan/request');

class RequestOption {
    static async Get(url, query, headers, insecure = true, needParse = true) {
        let timeLong = 60000;
        let options = {
            // proxy: 'http://' + proxy.getIp(),
            uri: url,
            method: 'GET',
            headers,
            qs: query,
            insecure,
            simple: true,
            resolveWithFullResponse: true,
            json: true,
            timeout: timeLong
        }
        delete query['uuid'];
        return new Promise((resolve, reject) => {
            let timeout = setTimeout(() => {
                reject('force timeout');
            }, timeLong);
            superagent
            .get(url)
            // .proxy('http://' + proxy.getIp())
            .set(headers)
            .query(query)
            .then((data) => {
                clearTimeout(timeout);
                resolve({
                    body: needParse ? JSON.parse(data.res.text) : data.res.text
                })
            }).catch((e) => {
                clearTimeout(timeout);
                reject(e);
            })
            // rp(options)
            // .then((data) => {
            //     resolve(data);
            // }).catch((e) => {
            //     reject(e);
            // }).finally(() => {
            //     clearTimeout(timeout)
            // });
        });
        
    }

    static async Post(url, query = {}, data, headers = {}, insecure = true) {

        if(data && !Buffer.isBuffer(data))  {
            let _data = [];
            for(let [k, v] of Object.entries(data)) {
                _data.push(`${k}=${v}`);
            }
            
            data = _data.join('&');
        };

        let options = {
            // proxy: 'http://' + proxy.getIp(),
            url: url,
            method: 'POST',
            headers,
            qs: query,
            body: data,
            insecure,
            simple: true,
            resolveWithFullResponse: true,
        };
        // if(data && !Buffer.isBuffer(data) && typeof(data) === 'object') options.json = true;
        // if(!url === 'https://i.snssdk.com/ies/antispam/upload_device_info/') options.qs = query;
        return await rp(options);
    }
}
module.exports = RequestOption