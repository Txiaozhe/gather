const device = require('./device');
const request = require('./requestOperation');
const encrypt = require('./encrypt');
const requestEncrypt = require('./requestEncrypt');

const Logger = require('../../config/Logger');
const logger = new Logger('huoshan/api');

const _ = require('lodash');
const moment = require('moment');

class Api {

    constructor() {
        this.version = 4203;
        this.cookie = {};
        this.query = {};
        this.deviceInfo = {};
        this.encryptInterval = null;
        this.deviceRegister();
        this.deviceRegisterInterval();
    }

    deviceRegisterInterval(timeLong = 50 * 60 * 1000) {
        setInterval(this.deviceRegister.bind(this), timeLong);
    }

    encryptSendInfo(timeLong = 2 * 1000) {
        if (this.encryptInterval) return;
        this._acm();
        this.encryptInterval = setInterval(this._acm.bind(this), timeLong);
    }

    versionV() {
        let v = {};
        v['channel'] = 'xiaomi';
        v['update_version_code'] = this.version;
        v['manifest_version_code'] = Math.floor(v['update_version_code'] / 10);
        v['version_code'] = v['manifest_version_code'];
        v['version_name'] = v['version_code'].toString().split('').join('.');
        v['app_version'] = v['version_name'];
        v['live_sdk_version'] = v['version_code'];
        return v;
    }

    formatObj(data) {
        for (let [key, value] of Object.entries(data)) {
            if (value) {
                data[key] = value + '';
            }
        }
        return data;
    }

    async deviceRegister(url = 'https://ib.snssdk.com/service/2/device_register/', query = this.getDeviceInfo(), data = {}) {
        let version = this.versionV();
        let _rticket = (+new Date()) + '';
        let h = {
            'Accept': null,
            'Cache-Control': 'max-stale=0',
            'Connection': 'Keep-Alive',
            'Content-Type': 'application/octet-stream;tt-data=a',
            'User-Agent': 'okhttp/3.8.1',
        }
        let q = {
            '_rticket': _rticket,
            'ac': 'wifi',
            'aid': 1112,
            'app_name': 'live_stream',
            'ssmix': 'a',
            'tt_data': 'a',
            device_brand: query['device_brand'],
            device_platform: query['device_platform'],
            device_type: query['device_type'],
            dpi: query['dpi'],
            language: query['language'],
            openudid: query['openudid'],
            os_api: query['os_api'],
            os_version: query['os_version'],
            resolution: query['resolution'],
            uuid: query['uuid'],
            channel: version['channel'],
            manifest_version_code: version['manifest_version_code'],
            update_version_code: version['update_version_code'],
            version_code: version['version_code'],
            version_name: version['version_name'],
        };

        if (query['device_id']) {
            q['device_id'] = query['device_id'];
        }
        if (query['iid']) {
            q['iid'] = query['iid'];
        }

        let dQuery = {};
        [
            'build_serial', 'clientudid', 'cpu_abi', 'density_dpi', 'device_brand', 'device_manufacturer', 'device_model', 'display_density', 'language', 'mc', 'openudid', 'os', 'os_api', 'os_version', 'region', 'resolution', 'rom', 'rom_version', 'serial_number', 'sim_serial_number', 'timezone', 'tz_name', 'tz_offset', 'udid'
        ].forEach(_tmp => {
            dQuery[_tmp] = query[_tmp];
        })

        let dVersion = {};
        [
            'app_version', 'channel', 'manifest_version_code', 'update_version_code', 'version_code'
        ].forEach(_tmp => {
            dVersion[_tmp] = version[_tmp];
        })
        let d = {
            '_gen_time': +_rticket,
            'header': Object.assign(
                {},
                {
                    'access': 'wifi',
                    'aid': 1112,
                    'appkey': '56ea65c067e58eea7e000c63',
                    'display_name': '火山小视频',
                    'not_request_sender': 0,
                    'package': 'com.ss.android.ugc.live',
                    'release_build': 'dfa0993_20180620',
                    'sdk_version': '2.5.4.0',
                    'sig_hash': 'aea615ab910015038f73c47e45d21466',
                },
                dQuery,
                dVersion
            ),
            'magic_tag': 'ss_app_log',
        }
        d['header']['resolution'] = d['header']['resolution'].replace('*', 'x')
        if (query['device_id']) {
            d['header']['device_id'] = query['device_id']
        }
        if (data) {
            d = Object.assign(d, data);
        }

        let requestBody = await encrypt.tt_encrypt(d);
        let r = await request.Post(url, this.formatObj(q), requestBody, this.formatObj(h));
        r = await this.responseFormat(r);
        this.deviceInfo = r;
        await this.uploadDeviceInfo(query, r);
    }

    async responseFormat(r) {
        let sc = r.headers['set-cookie'];
        if (sc) {
            sc = sc.join(';');
            let cookie = {};
            sc = sc.replace(/\s/g, '');
            sc = sc.replace(/;/g, ',');
            sc = sc.split(',');
            for (let c of sc) {
                let kv = c.split('=');
                if (!['Domain', 'expires', 'Max-Age', 'Path', 'HttpOnly'].includes(kv[0]) && kv.length === 2) {
                    cookie[kv[0]] = kv[1];
                }
            }
            this.cookie = cookie;
        }
        return JSON.parse(r.body);
    }

    async uploadDeviceInfo(device, registerDeviceInfo) {
        device['device_id'] = registerDeviceInfo['device_id'] + '';
        device['install_id'] = registerDeviceInfo['install_id'] + '';
        device['iid'] = device['install_id'];
        let version = this.versionV();
        let deviceQuery = {};
        ['device_brand', 'device_id', 'device_platform', 'device_type', 'dpi', 'iid', 'language', 'openudid', 'os_api', 'os_version', 'resolution', 'uuid'].forEach(_tmp => {
            deviceQuery[_tmp] = device[_tmp] || '';
        });

        let versionQuery = {};
        ['channel', 'manifest_version_code', 'update_version_code', 'version_code', 'version_name', 'live_sdk_version'].forEach(_tmp => {
            versionQuery[_tmp] = version[_tmp] || '';
        });
        let query = Object.assign({}, {
            'ac': 'wifi',
            'aid': 1112,
            'app_name': 'live_stream',
            'ssmix': 'a',
        }, deviceQuery, versionQuery);

        this.query = Object.assign(
            {_rticket: moment().valueOf()},
            this.query,
            query
        );

        this.encryptSendInfo() // 定时更新 as cp mas

        let bodyDevice = {};
        ['apkcount', 'applist', 'brand', 'cellid', 'cpu', 'description', 'display', 'file', 'fingerprint', 'h', 'host', 'idfa', 'imei', 'lock', 'mac', 'mem', 'provider', 'root', 'sdtotal', 'sim', 'temperature', 'type', 'uid', 'usb', 'vpn'].forEach(_tmp => {
            bodyDevice[_tmp] = device[_tmp] || '';
        });

        let unwifi = await encrypt.unwifi();

        let device_info = Object.assign(
            {},
            {
                'active': Math.floor(Math.random() * (3600 - 60 + 1) + 60),
                'battery': Math.floor(Math.random() * (100 - 1 + 1) + 1),
                'charge': Math.random() < 0.618 ? 0 : 1,
                'os': device['os_version'],
                'sdused': Math.floor(device['sdtotal'] * (Math.floor(Math.random() * (80 - 20 + 1) + 20)) / 100),
                'time': moment().unix(),
            },
            bodyDevice, unwifi
        );
        let deviceEncrypt = await encrypt.j_a(device_info);

        device_info = new Buffer(deviceEncrypt).toString('hex')
        // device_info = '1f8b08000000000000001d975192042108432fb41f82827a1c14bcff11f6f5fc4c4d4dd936842464a4df706d79fbb2ad9aa7528e2eedbba58e58f7993519e3b433fab6e7cd4563ece1eebaadf485b5ed6bd8ad3eaadebaabd91c7955af469bdddab977cb56bba9bbc93a27227ab723ba6786899c9ae3da142bdb227bb6b071fdda1815f632c66aa762c57ba239df8db0a85ea7af65e39946dd0aedabe65e3c2d7be57d7a445a9b56b7b739d5ac1f2ebb4f66666be1bb0eaf8c355e7def6df27c9cceb5af2fbf636cdf4b55dbe384e5a08f59221c3e7c5db7ddedf7e85179f6c069b4329e5a87f3f3f497a66dd4717dbd55eea16f643f1aba26352ef5a7c281abd3e7de26dcd44ecf796c889f5d39ea1d7a9528f3d7b7c798d59fcea88c7a6d2d7e6b29f3bceecbb2f596f95d2dc5b53a457565c6d9fd4c79675fd936df0486769e5adf7aab9a366aedfad4abddac88e2c563b4b64febe032a97a9acc5a3278c856578bcb65ab7a5bdd5b7be1212b813ba90db4475bfea66f903992ab0fcf39e2a5cf3537236eeaddaee495aa7d2fa551521f175cda93e6f063f8737b4b41604091959cdb96c2cdf5d5127bbb553e86ffdee89739d794dc275649edc6f32bc7e40609a590b4a4571b2173366fdca4746efb8d1aead2fa9ee5f36b48a6751f0a0b975cef54010cb54fe979ef9b9f1785bcc364f66396d1d4260280014ff7e502887401f764fb5141c67e30801967560779caca172d84d774897dc6e4518388d2a06826e4da7daf579000e818d78a73637785f7533685eeb2b547dcab8c4c0216195aa5cad76f1e97090e2197815efaec19a1c039ae42853d63bf059283ee77f273bd57bb7687d3556b011748ceba13015b0d39f3b444fe8739cf23c868d46a9fc25b6bc72f1390b5cf6a31e28c36b6bc64eefb7d5c40837e29a8bab84f45af7b15802f340c2d8643525c243b7538a399cb0e1525c8e4795f45f338b4c3133a24dac3a6a313c54a469e3b972f8699891086d7837040768f218abc9b1e65e303f9ba989f19a3eb3a43e2cd33ef0e1fe1d022f03f9c0a6064f584218d4ef089e8b818ad9a31a6d163e46edcbff498da697321e9adb483a1545197095857e4fed87696088ab203d3632061cb9e5d11deb19293e3ab7c092746eb72b1206a58f58072eab98bc956d667a47403fc94723af4deb7c7ac091667cb699ec8f7c67c384bc4c9e7cc0483fcd06d7beab48df76aef78fc84158f612aa283fd7c4bd8f80cc2bc3977c7d3e28e7dbc15aa0014198296e73017513845c7fc92820c6fb53d661ff95aad6c630af27b7be1b1cab9786377f37cd2d326fb622c88cba8fa650c585cb7ceb870dac0848c46f0b033215fa8d00e1e014bd68a0e27ad35f359d5fdeace8e8f317da3017b720fd5ece7d7c1c03e956e643c3f4fc3f9d381cdae5d16dbfb882207143f79d5720b6cc2bf85171daf03508cc8804f3a23799feb7413331a3888759db599946fef89c363f3e3a28b82aa9797c49d823aa094e67a178f8ce05d0d22dc50c63d7ff6812cec9c6223e82b97c502f509d73ce0c73e9fa155635509cdeeb8413b0d9aa4db7958a8b537b035679456eb225ef83c1f3d8ccb66c3faf11a24b081109f417d3412c0f6f0f9a3e6be90e7deecb9607f5e7cae35c50af4b0761fdd3d9a3ed71feaf6d3d88adeb6322bb1fd990db438cc06c39ade9bc4b7de7bc5d44266af3ff73cb66ce1fec7d9a2206c8288080cd7924f52c2eab7c6bd3477022a4d7f90a2eba72cfced87539c3ec6fc24afb67096adefe6c6814cf193bb5e7b48c51a4dd1d2fa1803d89e2c713af276b1a9d7ce796c44579ce73683a89bed3c3e875105df896a20d8a05022490876d579f24e920ee47ccb8494c0fa79a8d6a3a31d2cceda1d788b1f61a7f9bc677cae79f68e7c18dac77d6d75e8c32abcdffe115a7b7ca0b06896d4ec75890018df3e8495fe990c30bfc3260faec177c83de766fe5c9ff78f896a9320732eeba8ed7436da5232591a6128d9ec4424ec534a9515c8f8cec381e0cb4a0a54609aec5c020d5fe967b08df6ce58040bfc6ebe60db602dfbd31ad7d13ad1656eb62d9715ba372c8de00705a060f4ac85f9ac4ebafa96364b13ed2f640679f0854b2714a485af8fe964074c0d8b2edfd782f7f27a017d0369a6482e1b8df5a6839882b132b38bd32f361381425aa4e011481c41134ab1c9c3bc08ad84a8aeb824391605b3ecedde5a868e13a915890a86aa8ce57d85635a9fa3412327c1b0754bc7f8b493f1259e037d9847234cbcf882df654b7b0da22ea8e029d897e2765c20040c3483c5b18c70a8848e84df2446321576f98d83fee079259b631c82ddc6340c3b9fb348d2fb3af3f527c5d2fea6ceefa8fe4b3b433ecb87d8b2f7bcd4dea89b587ec402e21276b9f9cdb608991c8444be7c8f469dfddb7f88546282e33a31e3ca6381b29ec08ae843aee56648a2458d5f424f62772e32993308df70b505e67efb572d5860522824897078bc0e3a660520f6846068a4430c798420fd9548385918a809ff0a165cc1859123b984fd5c4a42c1b5128fe91ec9166110f97de24add18276991a2e647142352e6d0ea5f56e74fc777688295bf53446d1e483828e51d19c09df67240636c6d7c04ea4bad61ce8e29ad24c59288e6620ba2e02c79db39864b3a0cd453628b5efda30d5e80afc0acf843bc3abe55dffe01edcbccdc2b0d0000'
        // logger.log('device_info ---> ', device_info)
        let requestBody = {
            'device_info': device_info,
            'scene': 'cold_start',
            'retry_type': 'no_retry',
        }
        let res = await this.doRequest('https://i.snssdk.com/ies/antispam/upload_device_info/', { 'Cache-Control': 'max-stale=0' }, null, requestBody, true);
        if (res) { logger.log('上报设备信息成功'); } else { logger.log('上报信息失败 ===》 ', res) }
        return;
    }

    getDeviceInfo() {
        let udevice = device.deviceInfo();
        return udevice;
    }

    async doRequest(url, headers, query, data, update = false, needParse = true) {
        headers = Object.assign({}, headers, {
            'Accept': null,
            // 'Accept-Encoding': 'gzip',
            'Cache-Control': 'max-stale=0',
            'Connection': 'Keep-Alive',
            'User-Agent': 'okhttp/3.8.1',
        });

        let cookie = headers['Cookie'] || ''; // h.get('Cookie', '')
        if (true) {
            for (let [k, v] of Object.entries(this.cookie)) {
                if (v) {
                    if (cookie) cookie += '; ';
                    cookie += k + '=' + v;
                }
            }
            headers['Cookie'] = cookie;
        }

        let now = moment().valueOf();
        let q = _.cloneDeep(this.query);
        // q['_rticket'] = now;
        if (query) {
            q = Object.assign({}, q, query);
        }

        let body = {};
        if (data) {
            if (update) body = Object.assign({}, body, q);
            body = Object.assign({}, body, data);
        } else {
            body = null
        }

        now = now + '';
        q['ts'] = +now.slice(0, now.length - 3);
        // this._acm(q, body);

        let _count = 0;
        while (_count < 10) {
            if (requestEncrypt.mas) break;
            await this.delay(100);
            _count++;
        }
        q = Object.assign({}, q, requestEncrypt.mas);

        let res = null;
        if (!body) {
            // logger.log('body ---> ', q)
            res = await request.Get(url, this.formatObj(q), this.formatObj(headers), true, needParse);
        } else {
            if (!Object.keys(headers).includes('Content-Type')) headers['Content-Type'] = 'application/x-www-form-urlencoded'
            res = await request.Post(url, this.formatObj(q), this.formatObj(body), this.formatObj(headers))
        }
        res = res.body ? (typeof (res.body) === 'string' && needParse ? JSON.parse(res.body) : res.body) : null;
        if (!res) logger.log('res null ===================')
        return res;
    }

    // 封装加密接口
    async _acm(...args) {
        let kvs = Object.assign({}, this.query, { ts: moment().unix() });
        delete kvs['uuid']
        // for(let arg of args) {
        //     if(arg) kvs = Object.assign(kvs, arg);
        // }

        let params = [];
        for (let [key, value] of Object.entries(kvs)) {
            if (value) {
                if (!(typeof (value) === 'string')) value += '';
                params.push(key, value);
            }
        }
        return requestEncrypt.send(kvs['ts'], '', params, kvs['device_id']);
    }

    async delay(timeLong) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, timeLong)
        })
    }

    async fetchMessagePolling(rid, cursor = 0, user_id = 0) {
        let url = `https://hotsoon.snssdk.com/hotsoon/room/${rid}/_fetch_message_polling/`;
        let headers = { 'Cache-Control': 'max-stale=0' };
        return await this.doRequest(url, headers, '', { cursor, user_id }, true);
    }

    async enterRoom(rid) {
        let url = `https://api.huoshan.com/hotsoon/room/${rid}/_enter/`;
        let query = {
            hold_living_room: 1
        };
        query = Object.assign({}, this.query, query);
        return await this.doRequest(url, null, query);
    }

    async giftList(rid) {
        let url = `https://api.huoshan.com/hotsoon/gift/`;
        let body = {
            room_id: rid || ''
        }
        let headers = { 'Cache-Control': 'max-stale=0' };
        return await this.doRequest(url, headers, '', body, true);
    }

    async scan_room(offset = 0) {
        try {
            let deviceInfo = this.deviceInfo;
            if (!deviceInfo || !Object.keys(deviceInfo).length) {
                logger.log('设备信息错误')
                return;
            }
            let url = 'https://api.huoshan.com/hotsoon/feed/';
            let query = {
                type: 'live',
                live_source: 'live_small_picture', // big: 6/perpage; small: 12/perpage
                min_time: 0,
                max_time: +new Date(),
                offset,
                count: 20, // 修改无效
                req_from: 'feed_loadmore',
            };
            query = Object.assign({}, this.query, query);
            // delete query['uuid'];
            let res = await this.doRequest(url, null, query);
            return res;
        } catch (e) {
            logger.log('scan room error: ', e);
            return {
                status_code: 0,
                data: [],
                extra: []
            };
        }

    }

    async getLiveRoomIdByAnchorId (anchor_id) {
        if(!anchor_id) return false;
        let url = `https://api.huoshan.com/hotsoon/user/${anchor_id}/`;

        let query = {};

        try {
            query = Object.assign({}, this.query, query);
            let res = await this.doRequest(url, null, query, null, false, false);
            let liveRoomReg = /\"live_room_id\"\: (\S*)\,/;
            let liveRoomId = res.match(liveRoomReg);
            if(!liveRoomId || !liveRoomId[1]) {
                logger.error('get live roomId error: ', 'huoshan', `未开播${anchor_id}`, '', true);
                return false;
            }
            liveRoomId = liveRoomId[1];

            res = JSON.parse(res)
            return liveRoomId;
        } catch (e) {
            logger.error('get live roomId error: ', 'huoshan', e, '', true);
            return false
        }
    }

    async getLiveRoomIdByHuoshanNumber (huoshanNumber) {
        if(!anchor_id) return false;
        let url = 'https://api.huoshan.com/hotsoon/search/general_search/';

        let query = {
            q: huoshanNumber,
            offset: 0,
            count: 20,
            from_label: 'search_sug',
            user_action: 'passive'
        }

        try {
            query = Object.assign({}, this.query, query);
            let res = await this.doRequest(url, null, query, null, false, false);
            let liveRoomReg = /\"live_room_id\"\: (\S*)\,/;
            let liveRoomId = res.match(liveRoomReg);
            if(!liveRoomId || !liveRoomId[1]) {
                logger.error('get live roomId error: ', 'huoshan', `未开播${huoshanNumber}`, '', true);
                return false;
            }
            liveRoomId = liveRoomId[1];

            res = JSON.parse(res)
            if(res.status_code || !res.data || !res.data.length || res.data[0].type !== 1) {
                logger.error('get live roomId error: ', 'huoshan', `无效搜索内容${huoshanNumber}`, '', true);
                return false;
            }
            return liveRoomId;
        } catch (e) {
            logger.error('get live roomId error: ', 'huoshan', e, '', true);
            return false
        }
    }

}

module.exports = new Api();