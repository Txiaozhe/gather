const Redis = require('ioredis');
const config = require('./config').redis;
const redis = new Redis({
  port: config.port,
  host: config.host,
  password: config.auth,
  db: config.db
});

module.exports = redis;
