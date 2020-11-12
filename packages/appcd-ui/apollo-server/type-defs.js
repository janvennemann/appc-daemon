const globby = require('globby')
const gql = require('graphql-tag')

const typeDefs = [gql`
  type ClientAddon {
    id: ID!
    url: String!
  }

  type Query {
    clientAddons: [ClientAddon]
  }

  type Subscriptions {
    clientAddonAdded: ClientAddon
  }
`]

// Load types in './schema'
const paths = globby.sync(['./schema/*.js'], { cwd: __dirname, absolute: true })
paths.forEach(file => {
  const { types } = require(file)
  types && typeDefs.push(types)
})

module.exports = typeDefs
