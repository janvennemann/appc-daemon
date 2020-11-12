const AppcdClient = require('appcd-client').default

const client = new AppcdClient()

function get (url) {
  return new Promise((resolve, reject) => {
    client.request(url)
      .once('response', data => {
        resolve(data)
      })
      .once('error', reject)
  })
}

module.exports = {
  get
}
