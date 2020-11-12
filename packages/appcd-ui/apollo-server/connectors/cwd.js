const channels = require('../channels')
const fs = require('fs')
const path = require('path')

let cwd = 'global'

function normalize (value) {
  if (value.length === 1) return value
  const lastChar = value.charAt(value.length - 1)
  if (lastChar === path.sep) {
    value = value.substr(0, value.length - 1)
  }
  return value
}

module.exports = {
  get: () => cwd,
  set: (value, context) => {
    value = normalize(value)
    if (!fs.existsSync(value) && value !== 'global') {
      return
    }
    cwd = value
    context.pubsub.publish(channels.CWD_CHANGED, { cwdChanged: value })
    try {
      // process.chdir(value)
    } catch (err) {}
  }
}
