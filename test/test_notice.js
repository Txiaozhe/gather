const opp = require('../gather/lib/opportunity');

opp.getNoticeToCheck({
    room_id: 123456,
    plat: 'quanmin',
    url: 'https://www.quanmin.tv/13359230'
}).then(r => console.log(r)).catch(e => console.log(e));
