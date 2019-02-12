/**
 * tangxiaoji 2018-08-13 14:55:00
 */

const Conn = require('./Conn');
const zlib = require('zlib');
const InkDanmuAddr = "60.205.82.107";
const InkDanmuPort = 80;

class Inke extends Conn {
    constructor(url = '') {
        super();

        this.url = url;

        this.init();
    }

    init() {
        this.on('connect', this.onConnectHandler);
        this.connect(InkDanmuPort, InkDanmuAddr);
    }

    onConnectHandler() {
        this.on('rawdata', this.clientDataHandler);
        console.log('connect1');

        this.register();
    }

    clientDataHandler(buf) {
        // this.emit('data', data);

        // console.log(buf);
        zlib.unzip(Buffer.from(buf), (err, res) => {
            if (err) {
                console.log(err);
            } else {
                // console.log(res);
            }
        });
    }

    register() {
        const uid = "1A156FBB"
        // topic = "topic_88"
        // rid = "1533799576408588"
        // uid = "29F04AC0"
        const topic = "topic_49"
        const rid = "1533872684082049"
        const buffString = Buffer.from("090002034c04" + "0072" + uid + "000027100000002d", 'hex');

        let buffer = Buffer.alloc(100, buffString);
        let offset = 0;

        offset = Buffer.byteLength(buffString);
        const arr = [0x0001, 0x0600, "domain", 0x0500, "group", 0x0800, topic, 0x1000, rid];
        arr.forEach(a => {
            if (typeof a === 'string') {
                buffer.fill(Buffer.from(a), offset);
                offset += Buffer.byteLength(Buffer.from(a));
            } else {
                buffer.fill(Buffer.from([a]), offset);
                offset += Buffer.byteLength(Buffer.from([a]));
            }
            console.log('offset: ', offset);
            console.log(buffer);
        });
        this.write(buffer, true);
    }

    send() {
        
    }
}

module.exports = Inke
