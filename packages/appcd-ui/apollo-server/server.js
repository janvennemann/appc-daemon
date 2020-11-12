const { formatApolloErrors } = require('apollo-server-errors')
const { ApolloServer: ApolloServerBase } = require('apollo-server-koa')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')

/** @typedef {import('ws').Server} WebSocketServer */

class ApolloServer extends ApolloServerBase {
  /**
   * @param {WebSocketServer} server
   */
  installSubscriptionHandlers (server) {
    const {
      onDisconnect,
      onConnect,
      keepAlive
    } = this.subscriptionServerOptions

    const schema = this.schema
    if (schema === undefined) {
      throw new Error(
        'Schema undefined during creation of subscription server.'
      )
    }

    this.subscriptionServer = SubscriptionServer.create(
      {
        schema,
        execute,
        subscribe,
        onConnect: onConnect || (connectionParams => ({ ...connectionParams })),
        onDisconnect: onDisconnect,
        onOperation: async (
          message,
          connection
        ) => {
          connection.formatResponse = value => ({
            ...value,
            errors:
              value.errors &&
              formatApolloErrors([...value.errors], {
                formatter: this.requestOptions.formatError,
                debug: this.requestOptions.debug
              })
          })

          connection.formatError = this.requestOptions.formatError

          let context = this.context ? this.context : { connection }

          try {
            context =
              typeof this.context === 'function'
                ? await this.context({ connection, payload: message.payload })
                : context
          } catch (e) {
            throw formatApolloErrors([e], {
              formatter: this.requestOptions.formatError,
              debug: this.requestOptions.debug
            })[0]
          }

          return { ...connection, context }
        },
        keepAlive
      },
      server
    )
  }
}

module.exports = ApolloServer
