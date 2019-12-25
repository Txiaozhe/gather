# Request URL Rules

## URL 公共 Query 字段

### 业务 URL Query 字段
字段             | 意义        | 候选值和含义
---------------- | ----------- | ------------
product          | 产品标识    | 直播宝: 1
app              | 应用标识    | Android: 1, iPhone: 2, PC: 3, 小程序: 4, PC Web: 5, Mobile Web: 6, Android pad: 7, iPhone pad: 8, Android TV: 9
channel          | 渠道标识    | zhibobao, xiaozaizhan, 等等
ver_code         | 版本号      | 18011211，32位以内的无符号整形数字
ver_name         | 版本名      | 字符串，点分隔数字，一共三位
dev_id           | 设备 ID     | xxx-xxx-xxxx-xxxxx，字符串
dev_os           | 设备系统    | android_5_1, android_8_0, ios_11, win_7, win_8_1, chrome_63_0_3239_132, ie_8
dev_brand        | 设备品牌    | xiaomi, sony, iphone
dev_model        | 设备型号    | G8142
dev_arch         | CPU 型号    | armv7, x86，x64, amd64
dev_conn         | 网络连接    | 有线网络: 1, WiFi: 2, 2G: 3, 3G: 4, 4G: 5, 5G: 6
my_uid           | 用户 UID    | 122222
my_sid           | 用户 SID    | xxxxxxxxxxxxxxxxxxxxxxxxxxx
my_token         | 用户 token  | xxxxxxxxxxxxxxxxxxxxxxxxxxx


### 校验 URL Query 字段

字段             | 意义              | 候选值和含义
---------------- | ----------------- | ------------
s_nonce          | 随机字符串        | xxxxxxxxxxxxxxxxxxxxxxxxxxxx
s_sign           | 需要校验          | 类似于微信开发平台参数校验规则，值大概是: (sha1(arg1=111&arg2=222&arg3=333&arg4=444&s_nonce=xxxx&s_key=xxxxxxxxxxxx)).toLowerCase()
s_raw            | 不需要校验        | 值: 1, 给 Web 端和调试使用
```
1. get:
http://api.zhibobao.tv/app/update?product=1&app=3&channel=zbb&ver_code=18011211&ver_name=1.1.1&dev_id=xxxxxxxxxxxxxxxxxx&dev_os=win_7&dev_brand=sony&dev_model=G8142&dev_arch=arvmv7&dev_conn=WiFi&my_uid=12323&my_sid=121213123232342424242444&s_nonce=xxxxxx&s_sign=12222222222222222222222222222222222

2. get:
http://api.zhibobao.tv/room/info/{roomid}?product=1&app=3&channel=zbb&ver_code=18011211&ver_name=1.1.1&dev_id=xxxxxxxxxxxxxxxxxx&dev_os=win_7&dev_brand=sony&dev_model=G8142&dev_arch=arvmv7&dev_conn=WiFi&my_uid=12323&my_sid=121213123232342424242444&s_nonce=xxxxxx&s_sign=12222222222222222222222222222222222

3. post:
http://api.zhibobao.tv/user/auth/login?product=1&app=3&channel=zbb&ver_code=18011211&ver_name=1.1.1&dev_id=xxxxxxxxxxxxxxxxxx&dev_os=win_7&dev_brand=sony&dev_model=G8142&dev_arch=arvmv7&dev_conn=WiFi&my_uid=12323&my_sid=121213123232342424242444&s_nonce=xxxxxx&s_sign=12222222222222222222222222222222222

post field:
mobile=13923420000
sms=123456

```
