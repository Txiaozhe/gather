/**
 * Creator: Tang Xiaoji
 * Time: 2018-06-12
 */

'use strict';

module.exports = {
  nest: {
    rpc_host: '10.4.20.103'
  },
  mysql: {
    host: 'rm-bp1z6xst2m8uwjvge.mysql.rds.aliyuncs.com',
    port: 3306,
    connectionLimit: 10,
    user: 'fentuan',
    password: 'ALadHrb3bd7JORxq',
    charset: 'utf8mb4'
  },
  redis: {
    host: 'r-bp166c8a4faed514196.redis.rds.aliyuncs.com',
    port: 6379,
    auth: 'Fentuan2017',
    db: 0
  },
  elasticsearch: {
    host: '10.10.0.57:9200',
    maxSockets: 100,
    log: 'error'
  },
  opp: {
    bee: {
      max_retry: 100,
      retry_delay: 1000
    },
    search_task: 30 * 1000
  }
};
 