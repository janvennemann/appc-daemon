const gql = require('graphql-tag')

const cwd = require('../connectors/cwd')
const plugins = require('../connectors/plugins')

const types = gql`
  extend type Query {
    globalPlugins: [GlobalPlugin]
    projectPlugins: [ProjectPlugin]
  }

  interface Plugin {
    id: ID!
    name: String
  }

  type ProjectPlugin implements Plugin {
    id: ID!
    name: String
    version: String
    path: String
  }

  type PluginVersion {
    version: String
    path: String
    error: String
    pid: Int
  }

  type GlobalPlugin implements Plugin {
    id: ID!
    name: String
    versions: [PluginVersion]
  }
`

const resolvers = {
  Query: {
    globalPlugins: (root, args, context) => plugins.listGlobal(context),
    projectPlugins: (root, args, context) => plugins.listProject(cwd.get(), context)
  }
}

module.exports = {
  types,
  resolvers
}
