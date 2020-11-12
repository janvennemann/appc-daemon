import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { createApolloClient } from 'vue-cli-plugin-apollo/graphql-client'

import stateDefaults from './state/defaults'
import typeDefs from './state/typeDefs'
import resolvers from './state/resolvers'

// @TODO: Use restartWebsockets() on schema change?

// Install the vue plugin
Vue.use(VueApollo)

// Config
const defaultOptions = {
  inMemoryCacheOptions: {},
  wsEndpoint: process.env.VUE_APP_GRAPHQL_WS || 'ws://localhost:1732/dashboard/graphql',
  // Enable Automatic Query persisting with Apollo Engine
  persisting: false,
  // Use websockets for everything (no HTTP)
  websocketsOnly: true,
  typeDefs,
  resolvers,
  onCacheInit: cache => {
    cache.writeData({ data: stateDefaults() })
  }
}

// Call this in the Vue app file
export function createProvider (options = {}) {
  // Create apollo client
  const { apolloClient, wsClient } = createApolloClient({
    ...defaultOptions,
    ...options
  })
  apolloClient.wsClient = wsClient

  // Create vue apollo provider
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all'
      }
    },
    errorHandler (error) {
      console.log('%cAn error occurred', 'background: red; color: white; padding: 4px; border-radius: 4px;font-weight: bold;')
      console.log(error.message)
      if (error.graphQLErrors) {
        console.log(error.graphQLErrors)
      }
      if (error.networkError) {
        console.log(error.networkError)
      }
    }
  })

  return apolloProvider
}
