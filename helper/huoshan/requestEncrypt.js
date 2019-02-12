const net = require('net');

const Logger = require('../../config/Logger');
const logger = new Logger('huoshan/tcp');

class RequestEncrypt {
    constructor() {
        this.serverUrl = '60.190.228.34';
        this.serverPort = '1113';
        this.online = false;
        this.client = null;
        this.mas = null;
        this.masFlag = false;
        this.connect();
        // this.masFlagIntervel();
        logger.log('chushihua')
    }

    // masFlagIntervel(timeLong = 2000) {
    //     setInterval(() => {
    //         this.masFlag = false
    //     }, timeLong)
    // }

    connect() {
        let client = net.connect(this.serverPort, this.serverUrl, () => {
            logger.log('连接 服务端 ');
            this.online = true;
            this.client = client;
        });

        client.on('data', this.clientDataHandler.bind(this));

        client.on('close', () => {
            logger.log('客户端收到关闭信号');
            this.remove();
        })

        client.on('error', (e) => {
            logger.log('错误信息: ', e);
            this.remove();
            if(this.client) this.client.end();
        })
        client.write('ping\n');
    }

    remove() {
        this.online = false;
        this.client = null;
        this.masFlag = false;
    }

    end() {
        logger.log('强制关闭');
        this.client.end('强制关闭');
    }

    clientDataHandler(data) {
        data = data.toString().replace(/[\r\n]/g, '');
        if(data !== 'pong') {
            // logger.log('data ====> ', data);
            // logger.log('=================')
            let reg = /mas/g;
            let masCount = data.match(reg).length;
            if(masCount !== 1) {
                data = data.split('}');
                if(data.length > 1) {
                    data = data[0] + '}'
                } else {
                    logger.log('获取加密参数失败', data, ' end');
                    return;
                } 
            }
            // logger.log('data ====> ', data);
            data = JSON.parse(data);
            this.mas = data;
            if(!this.masFlag) {
                // this.masFlag = true;
            }
        }
        
    }

    send(ts, url, params, device_id) {
        // logger.log('in send --> ', ts, url, device_id)
        if(!this.online) this.connect();
        if(!this.client) return false;
        // if(this.masFlag) return this.mas;
        let input = {
            'ts': ts,
            'url': url,
            'params': params,
            'device_id': device_id
        }
        input = new Buffer(JSON.stringify(input) + '\n', 'binary');
        this.client.write(input);
    }
}
// requestE = new RequestEncrypt();
module.exports = new RequestEncrypt();