const pubsub = require('./pubsub')

// Context object passed to all resolvers as the third argument
module.exports = () => {
  return {
    pubsub
  }
}
