const Logger = require('../../config/Logger');
const logger = new Logger('huoshan/device');

const zfill = (str, size) => {
    while(str.length < size) {
        str = '0' + str;
    }
    return str;
}

const ubyte = (n) => {
    if(n > 0) {
        let start = 0;
        let end = parseInt('ff', 16);
        let randomNum = Math.floor(Math.random() * (end - start + 1) + start);
        randomNum = randomNum.toString(16);
        return ubyte(n - 1) + zfill(randomNum, 2);
    }
    return '';
}

const uint = (n) => {
    let start = Math.pow(10, n - 1);
    let end = Math.pow(10, n) - 1;
    let res = Math.floor(Math.random() * (end - start + 1) + start);
    return res.toString();
}

const ui = (i) => {
    return i[Math.floor(Math.random() * (i.length - 1 + 1))];
}
const getDeviceInfo = () => {
    let [cpu, cpu_abi, density_dpi, description, device_brand, device_manufacturer, device_model, fingerprint, mem, os_api, os_version, resolution, rom, rom_version, sdtotal] = ui([
        ['abi: armeabi-v7anProcessor\t: ARMv7 Processor rev 1 (v7l)\nBogoMIPS\t: 38.40\n\nBogoMIPS\t: 38.40\n\nBogoMIPS\t: 38.40\n\nBogoMIPS\t: 38.40\n\nFeatures\t: swp half thumb fastmult vfp edsp neon vfpv3 tls vfpv4 idiva idivt \nCPU implementer\t: 0x51\nCPU architecture: 7\nCPU variant\t: 0x2\nCPU part\t: 0x06f\nCPU revision\t: 1\n\nHardware\t: Qualcomm MSM8974PRO-AC\nRevision\t: 0000\nSerial\t\t: 0000000000000000\n', 'armeabi-v7a', 480, 'cancro-user 6.0.1 MMB29M 7.11.30 release-keys', 'Xiaomi', 'Xiaomi', 'MI 4LTE', 'Xiaomi\/cancro_wc_lte\/cancro:6.0.1\/MMB29M\/7.11.30:user\/release-keys', 1938935808, 23, '6.0.1', '1080*1920', 'MIUI-7.11.30', 'miui_V9_7.11.30', 13369495552],
    ]);

    let applist = ui([
        [],
    ]).concat(['com.baidu.BaiduMap', 'com.eg.android.AlipayGphone', 'com.sina.weibo', 'com.snssdk.api', 'com.ss.android.ugc.live', 'com.ss.android.ugc.aweme', 'com.taobao.taobao', 'com.tencent.mm', 'com.tencent.mobileqq', 'com.tencent.weishi']).sort()
    
    let idfa = ubyte(8);
    let imei = uint(15);
    let mac = [1, 1, 1, 1, 1, 1].map(i => ubyte(i).toUpperCase()).join(':');
    let serial_number = uint(8);

    let display_density = {120: 'ldpi', 240: 'hdpi', 320: 'xhdpi'};

    const deviceInfo = {
        cellid: 0,
        device_platform: 'android',
        file: '',
        h: 'ffff0000-ffff1000 r-xp 00000000 00:00 0          [vectors]\n',
        host: 0,
        language: 'zh',
        lock: 5000,
        os: 'Android',
        provider: '',
        region: 'CN',
        root: 0,
        sim: 1,
        sim_serial_number: [],
        temperature: 1,
        timezone: 8,
        type: 0,
        tz_name: 'Asia\/Shanghai',
        tz_offset: 28800,
        usb: 1,
        vpn: 0,
    
        clientudid: [4, 2, 2, 2, 6].map(i => ubyte(i)).join('-'),
        idfa,
        imei,
        mac,
        serial_number,

        cpu, cpu_abi, density_dpi, description, device_brand, device_manufacturer, device_model, fingerprint, mem, os_api, os_version, resolution, rom, rom_version, sdtotal,
        applist,
        apkcount: applist.length,
    
        brand: device_brand + ' ' + device_model,
        build_serial: serial_number,
        device_type: device_model,
        display: resolution.replace('*', ','),
        display_density: display_density[density_dpi] || 'mdpi',
        dpi: density_dpi,
        mc: mac,
        openudid: idfa,
        udid: imei,
        uuid: imei,
    }
    return deviceInfo;
}

const getDeviceId = () => {

}


module.exports = {
    deviceInfo: getDeviceInfo
}