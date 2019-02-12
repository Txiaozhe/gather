/**
 * Creator: Tang Xiaoji
 * Time: 2018-01-09
 */

const config = require('../config/config');
const mysql = require('../config/mysql');

mysql.getConn((err, conn) => {
  conn.query('SELECT * FROM ?? LIMIT 10', [
    config.tbl_name.db_fentuan_taskv2
  ], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log('获取数据成功: ', result);
    }
    conn.release();
  });
});
