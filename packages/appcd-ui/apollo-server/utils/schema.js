const EventEmitter = require('events')
const { Kind } = require('graphql/language')
const gql = require('graphql-tag')
const { makeExecutableSchema } = require('graphql-tools')

const emitter = new EventEmitter()
const definitions = new Map()
let baseTypeDefs
let baseResolvers

function initialize (typeDefs, resolvers) {
  typeDefs = normalizeTypeDefs(typeDefs)
  // We augment the typeDefs with the @cacheControl directive and associated
  // scope enum, so makeExecutableSchema won't fail SDL validation
  if (!isDirectiveDefined(typeDefs, 'cacheControl')) {
    typeDefs.push(
      gql`
        enum CacheControlScope {
          PUBLIC
          PRIVATE
        }
        directive @cacheControl(
          maxAge: Int
          scope: CacheControlScope
        ) on FIELD_DEFINITION | OBJECT | INTERFACE
      `
    )
  }

  // We augment the typeDefs with the Upload scalar, so typeDefs that
  // don't include it won't fail
  typeDefs.push(
    gql`
      scalar Upload
    `
  )

  baseTypeDefs = typeDefs
  baseResolvers = resolvers
}

function add (def) {
  remove(def.id)
  definitions.set(def.id, def)
}

function remove (id) {
  definitions.delete(id)
}

function createExecutableSchema () {
  const typeDefs = [ ...baseTypeDefs ]
  const resolvers = [ ...baseResolvers ]
  definitions.forEach(def => {
    if (def.types) {
      typeDefs.push(def.types)
    }
    if (def.resolvers) {
      resolvers.push(def.resolvers)
    }
  })

  return makeExecutableSchema({
    typeDefs,
    resolvers
  })
}

function onSchemaChange (callback) {
  emitter.on('change', callback)
  return () => emitter.off('change', callback)
}

function requestSchemaUpdate () {
  emitter.emit('change', createExecutableSchema())
}

function normalizeTypeDefs (typeDefs) {
  if (Array.isArray(typeDefs)) {
    return typeDefs.map(normalizeTypeDefs)
  }

  if (typeof typeDefs === 'string') {
    // Convert schema to AST
    typeDefs = gql(typeDefs)
  }

  // Remove upload scalar (it's already included in Apollo Server)
  removeFromSchema(typeDefs, 'ScalarTypeDefinition', 'Upload')

  return typeDefs
}

function removeFromSchema (document, kind, name) {
  const definitions = document.definitions
  const index = definitions.findIndex(
    def => def.kind === kind && def.name.kind === 'Name' && def.name.value === name
  )
  if (index !== -1) {
    definitions.splice(index, 1)
  }
}

function isDirectiveDefined (typeDefs, directiveName) {
  // If we didn't receive an array of what we want, ensure it's an array.
  typeDefs = Array.isArray(typeDefs) ? typeDefs : [typeDefs]

  return typeDefs.some(typeDef => {
    if (typeof typeDef === 'string') {
      typeDef = gql(typeDef)
    }

    return typeDef.definitions.some(
      definition =>
        definition.kind === Kind.DIRECTIVE_DEFINITION &&
        definition.name.value === directiveName
    )
  })
}

module.exports = {
  initialize,
  add,
  remove,
  onSchemaChange,
  requestSchemaUpdate,
  createExecutableSchema
}
