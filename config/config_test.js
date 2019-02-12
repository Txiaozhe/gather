module.exports = {
  nest: {
    rpc_host: '10.4.20.103'
  },
  mysql: {
    connectionLimit: 10,
    host: 'rm-bp1tzi73g5y910h7h.mysql.rds.aliyuncs.com',
    user: 'fentuan',
    port: 3306,
    password: 'Fentuan2017',
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
