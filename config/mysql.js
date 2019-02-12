/**
 * tang xiaoji
 */

const mysql = require('mysql');
const config = require('./config');
const Logger = require('./Logger');
const logger = new Logger('mysql');

const pool = mysql.createPool(config.mysql);
logger.log('mysql 已连接!');

exports.pool = pool;

exports.getConn = (cb) => {
  pool.getConnection((err, conn) => {
    if (err) {
      cb(err);
      logger.error('mysql connect error', 'mysql', err);
    } else {
      cb(null, conn);
    }
  });
}

exports.asyncGetConn = () => {
  return new Promise((resolve) => {
    pool.getConnection((err, conn) => {
      resolve([err, conn]);
    });
  });
}

exports.asyncQuery = (sql, params, conn) => {
  return new Promise((resolve) => {
    if (conn) {
      conn.query(sql, params, (err, res) => {
        resolve([err, res]);
      });
    } else {
      pool.getConnection((err, conn) => {
        if (err) {
          resolve([err]);
        } else {
          conn.query(sql, params, (err, res) => {
            conn.release();
            resolve([err, res]);
          });
        }
      });
    }
  });
}
