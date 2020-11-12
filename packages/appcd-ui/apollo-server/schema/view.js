const gql = require('graphql-tag')

const views = require('../connectors/views')

exports.types = gql`
extend type Query {
  views: [View]
}

type View {
  id: ID!
  name: String!
  icon: String!
  title: String!
  group: String!
}
`

exports.resolvers = {
  Query: {
    views: (root, args, context) => views.list(context)
  }
}
