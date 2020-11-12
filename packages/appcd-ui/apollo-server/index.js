const { PubSub } = require('graphql-subscriptions')

const ApolloServer = require('./server');
const typeDefs = require('./type-defs')
const resolvers = require('./resolvers')
const context = require('./context')
const schemaManager = require('./utils/schema')

const pubsub = new PubSub()
schemaManager.initialize(typeDefs, resolvers)
const schema = schemaManager.createExecutableSchema()

/**
 * Calls the given value as a function if possible.
 *
 * @param {*} fn Value to auto call
 * @param  {...any} context
 */
function autoCall (fn, ...context) {
  if (typeof fn === 'function') {
    return fn(...context)
  }
  return fn
}

const server = new ApolloServer({
  schema,
  tracing: true,
  cacheControl: true,
  // Resolvers' context from POST
  context: async ({ req, connection }) => {
    let contextData
    try {
      if (connection) {
        contextData = await autoCall(context, { connection })
      } else {
        contextData = await autoCall(context, { req })
      }
    } catch (e) {
      console.error(e)
      throw e
    }
    // contextData = Object.assign({}, contextData, { pubsub })
    return contextData
  },
  // Resolvers context from WebSocket
  subscriptions: {
    path: '/dashboard/graphql',
    onConnect: async (connection, websocket) => {
      let contextData = {}
      try {
        contextData = await autoCall(context, {
          connection,
          websocket
        })
        contextData = Object.assign({}, contextData, { pubsub })
      } catch (e) {
        console.error(e)
        throw e
      }
      return contextData
    }
  }
})

schemaManager.onSchemaChange(schema => {
  const schemaDerivedData = server.generateSchemaDerivedData(schema)
  server.schema = schema
  server.schemaDerivedData = schemaDerivedData
  if (server.subscriptionServer) {
    server.subscriptionServer.schema = schema
  }
})

module.exports = server
