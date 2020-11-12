const globby = require('globby')

const clientAddons = require('./connectors/client-addons')

const resolvers = [{
  ClientAddon: {
    url: (addon, args, context) => clientAddons.getUrl(addon, context)
  },
  Query: {
    clientAddons: (root, args, context) => clientAddons.list(context)
  }
}]

// Load resolvers in './schema'
const paths = globby.sync(['./schema/*.js'], { cwd: __dirname, absolute: true })
paths.forEach(file => {
  const { resolvers: r } = require(file)
  r && resolvers.push(r)
})

module.exports = resolvers
