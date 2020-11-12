import gql from 'graphql-tag'

export default gql`
extend type Query {
  connected: Boolean!
  loading: Boolean!
}

extend type GlobalPlugin {
  current: PluginVersion!
}
`
