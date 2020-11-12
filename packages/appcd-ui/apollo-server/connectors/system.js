const appcd = require('../utils/appcd')

const MAX_HISTORY_ENTRIES = 4320
const memoryUsageHistory = []

async function info (context) {
  const data = await appcd.get('/appcd/status')
  const { version: appcdVersion, uptime } = data
  const { version: nodeVersion } = data.node
  const { heapTotal, heapUsed, rss } = data.memory
  return {
    appcdVersion,
    nodeVersion,
    uptime,
    memory: {
      heapTotal,
      heapUsed,
      rss
    }
  }
}

async function memoryUsage (context) {
  return memoryUsageHistory
}

module.exports = {
  info,
  memoryUsage
}
