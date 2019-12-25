* post  /zhibobao.personal.account/Account/reqCode

```Json
{mobile: '15158161535'} // 必须
```

* post  /zhibobao.personal.account/Account/login

```Json
{
    mobile: '15158161535', // 必须
    code: '123456', // 必须
    password: 'djkenwdew', 
    type: '0', 
    cacheId: 'nnnnn'
}
```

* get  /zhibobao.personal.account/Account/logout
* post  /zhibobao.personal.account/Account/pwlogin

```json
{
    mobile: '151598161535', // 必须
    code: '111111', // 必须
    type: '0'
}
```

* post /zhibobao.personal.account/Account/pwModify

```json
{
    password: 'dewdwedw', // 必须
    mobile: '15158161535', // 必须
    code: '123457' // 必须
}
```

* get   /zhibobao.personal.account/Account/getInfo
* post  /zhibobao.personal.account/Account/modifyInfo

```json
{
    nickname: 'hdehd', // 必须
    province: '浙江', // 必须
    city: '杭州', // 必须
    gender: 0(女)/1(男)/-1(未知), // 必须
    avatar: 'http://dedeknde.img'
}
```

* post  /zhibobao.personal.account/Account/checkOldMobile

```json
{
    mobile: '151598161535', 
    code: '123456'
}
```

* post  /zhibobao.personal.account/Account/modifyOldMobile

```json
{
    mobile: '15158161535', 
    code: '123456'
}
```



