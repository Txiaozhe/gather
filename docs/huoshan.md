### JSON FORMAT
```
{
    common：{
        room_id,
        create_time,
        method, // 消息类型
    }，
    
    user_id, // 用户id
    user: {
        
        short_id, // 火山号
        gender,
        level

    },
    ...others
}
```

### 消息类型

#### ChatMessage(弹幕)
```
data.common.method: ChatMessage 
data.content: 弹幕内容
```

#### GiftMessage(礼物)
```
data.common.method: GiftMessage
data.gift_id: 礼物id
data.gift_id.combo_count: 礼物个数
```

#### DoodleGiftMessage(涂鸦礼物)
```
data.compose.points: [ // 涂鸦礼物数组，每个礼物一个 object， 涂鸦礼物可以由不同礼物即不同 礼物id 组成
    {
        x, // 涂鸦礼物屏幕显示 坐标
        y, // 涂鸦礼物屏幕显示 坐标
        id // 礼物id，数目为1
    }
]
data.gift_id: 礼物id
没有礼物个数，涂鸦礼物一般为一个，由多个其他礼物构成
```

#### CommonLuckyMoneyMessage(手气红包)
一般为观众发，观众抢

#### RoomNotifyMessage(其他直播间大礼物显示)

#### RoomMessage(自己进入直播间提示信息)

#### MemberMessage(观众进入直播间)

#### DiggMessage(点击屏幕出现小动物等，没什么卵用)

#### SunDailyRankMessage(主播个人排行榜信息)

#### PushMessage (推送)

#### UserStatsMessage(应该是没用)

#### SocialMessage(没有辅助信息进行判断用途)
