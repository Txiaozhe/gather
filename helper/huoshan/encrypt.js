const exec = require('child-process-promise').exec;
const crypto = require('crypto');

const Logger = require('../../config/Logger');
const logger = new Logger('huoshan/encrypt');

const tt_encrypt = async (data) => {
    data = JSON.stringify(data);
    let res = await exec(`PYTHONIOENCODING=utf-8 python3 ${__dirname}/python-scripts/tt_encrypt.py ${JSON.stringify(data)}`);
    // logger.log('error: ', res.stderr);
    // logger.log('out: ', res.stdout.toString());
    data = res.stdout;
    data = data.split('\n');
    data = data.slice(0, data.length - 1);
    data = data.join('\n')
    return new Buffer(data.toString(), 'binary');
}

const unwifi = async () => {
    try{
        let res = await exec(`PYTHONIOENCODING=utf-8 python3 ${__dirname}/python-scripts/unwifi.py`);
        if(res.stderr) throw new Error(res.stderr);
        res = `${res.stdout.split('\n')[0]}`;
        res = res.replace(/"/g, '\\"');
        res = res.replace(/'/g, '"');
        res = JSON.parse(res);
        return res;
    } catch (e) {
        logger.log('unwifi e: ', e);
        return {};
    }
}

const dataFormat = async (data) => {
    data = JSON.stringify(data, null, 4);
    data = JSON.stringify(data, null, 4);
    let res = await exec(`PYTHONIOENCODING=utf-8 python3 ${__dirname}/python-scripts/complementation.py ${data}`);
    data = res.stdout;
    data = data.split('\n')[0];
    return data;
}

const cipheriv = async (
    data, 
    algorithm = 'aes-128-cfb', 
    key = 'eagleye_9fd&fwfl', 
    iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f', 
    input = 'binary', 
    output = 'hex'
) => {
    data = await dataFormat(data);
    buf = data
    key = new Buffer(key, 'binary');
    iv = new Buffer(iv, 'binary');
    let encrypted = '';
    const cip = crypto.createCipheriv(algorithm, key, iv);
    cip.setAutoPadding(true);
    encrypted += cip.update(buf, input, output);
    encrypted += cip.final(output);
    logger.log('encrypted length ====>', encrypted.length)
    return encrypted;
}

const cryptoAfter = async (data) => {
    data = data + '';
    let res = await exec(`PYTHONIOENCODING=utf-8 python3 ${__dirname}/python-scripts/cryptoAfter.py ${data}`);
    data = res.stdout;
    data = data.split('\n');
    
    data = data.slice(0, data.length - 1);
    data = data.join('\n')
    return new Buffer(data, 'binary');
}

const j_a = async (data) => {
    let encrypted = await cipheriv(data);
    let res = await cryptoAfter(encrypted);
    return res
}

module.exports = {
    tt_encrypt,
    unwifi,
    dataFormat,
    cryptoAfter,
    cipheriv,
    j_a
}

// (async () => {
//     await j_a({a: 111});
// })()