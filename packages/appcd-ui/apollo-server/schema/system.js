const gql = require('graphql-tag')
const system = require('../connectors/system')

const types = gql`
type MemoryUsage {
  heapTotal: Int
  heapUsed: Int
  rss: Int
}

type System {
  appcdVersion: String,
  nodeVersion: String
  loadAvg: [Float]
  uptime: Float
}

extend type Query {
  system: System
  memory: [MemoryUsage]
}
`

const resolvers = {
  Query: {
    system: (root, args, context) => system.info(context),
    memory: (root, args, context) => system.memoryUsage(context)
  }
}

module.exports = {
  types,
  resolvers
}
