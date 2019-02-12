/**
 * Creator: Tang Xiaoji
 * Time: 2018-06-20
 */

'use strict';

const Logger = require('../config/Logger');
const logger = new Logger('cpu/mem/pkg monitor');
const {exec} = require('child_process');
const os = require('os');
const config = require('../config/config');
const mysql = require('../config/mysql');

function getCpuUsed() {
  return new Promise((resolve) => {
    try {
      const plat = os.platform();
      if (plat !== 'linux') {
        resolve({
          used: '0%'
        });
      } else {
        exec('top -bn 1 -i -c', (error, stdout, stderr) => {
          if (error) {
            logger.error('getCpuUsed', 'monitor', error);
            resolve({
              used: '-'
            });
          } else if (stderr) {
            logger.error('getCpuUsed', 'monitor', stderr);
            resolve({
              used: '-'
            });
          } else {
            try {
              const idle = (100 - parseFloat(stdout.match(/ (\S*)%id,/)[1])).toFixed(1);
              resolve({
                used: `${idle}%`
              });
            } catch (e) {
              resolve({
                used: '-'
              });
            }
          }
        });
      }
    } catch (e) {
      resolve({
        used: '-'
      });
    }
  });
}

function getMemoryUsed() {
  return new Promise((resolve) => {
    try {
      const plat = os.platform();
      if (plat !== 'linux') {
        resolve({
          used: '0%'
        });
      } else {
        exec('awk \'{if($1 ~ /MemTotal/ || $1 ~ /MemFree/ || $1 ~ /Buffers/ || $1 ~ /Cached/) print $1" "$2}\' /proc/meminfo', (error, stdout, stderr) => {
          if (error) {
            logger.error('getMemoryUsed', 'monitor', error);
            resolve({
              used: '-'
            });
          } else if (stderr) {
            logger.error('getMemoryUsed', 'monitor', stderr);
            resolve({
              used: '-'
            });
          } else {
            try {
              const total = parseInt(stdout.match(/MemTotal: (\S*)/)[1]);
              const free = parseInt(stdout.match(/MemFree: (\S*)/)[1]);
              const buffer = parseInt(stdout.match(/Buffers: (\S*)/)[1]);
              const cache = parseInt(stdout.match(/Cached: (\S*)/)[1]);
              resolve({
                used: `${(((total - (free + buffer + cache)) / total) * 100).toFixed(1)}%`
              });
            } catch (e) {
              resolve({
                used: '-'
              });
            }
          }
        });
      }
    } catch (e) {
      resolve({
        used: '-'
      });
    }
  });
}

async function updateSystemInfo() {
  try {
    const cpuInfo = await getCpuUsed();
    const memInfo = await getMemoryUsed();

    mysql.getConn((err, conn) => {
      if (err) {
        logger.error('检查系统性能 getconn error', 'monitor', err);
        setTimeout(updateSystemInfo, config.timeout.update_system_info);
      } else {
        conn.query('INSERT INTO ?? ( ?? ) VALUES ( ? ) ON DUPLICATE KEY UPDATE cpu = ?, memory = ?, pkgs = ?', [
          config.tbl_name.db_fentuan_monitor_v2, [
            'cpu', 'memory', 'pkgs', 'client_ip'
          ], [
            cpuInfo.used, memInfo.used, 0, config.app.host
          ], cpuInfo.used, memInfo.used, 0
        ], (e) => {
          conn.release();
          setTimeout(updateSystemInfo, config.timeout.update_system_info);
          if (e) {
            logger.error('检查系统性能 error', 'monitor', e);
          }
        });
      }
    })
  } catch (e) {
    logger.error('检查系统性能 cpu/mem error', 'monitor', e);
    setTimeout(updateSystemInfo, config.timeout.update_system_info);
  }
}

process.on('uncaughtException', (err) => {
  logger.error('bee start uncaughtException', 'monitor', err);
});

module.exports = {
  getCpuUsed,
  getMemoryUsed,
  updateSystemInfo
};

// getCpuUsed().then(r => console.log('cpu: ', r)).catch(e => console.log(e));
// getMemoryUsed().then(r => console.log('mem: ', r)).catch(e => console.log(e));
 