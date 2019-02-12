module.exports = {
  nest: {
    rpc_host: '127.0.0.1'
  },
  mysql: {
    connectionLimit: 10,
    host: '192.168.18.240',
    user: 'root',
    port: 3310,
    password: '123456',
    database: 'db_fentuan',
    charset: 'utf8mb4'
  },
  redis: {
    host: '192.168.19.101',
    port: 6379,
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
