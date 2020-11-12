const Koa = require('koa')
const serve = require('koa-static')
const route = require('koa-route')
const path = require('path')

const apolloServer = require('./apollo-server')
const clientAddons = require('./apollo-server/connectors/client-addons')

const distPath = path.resolve(__dirname, 'dist')

const CACHE_CONTROL = 'no-store, no-cache, must-revalidate, private'

function setHeaders (res) {
  res.setHeader('Cache-Control', CACHE_CONTROL)
}

const app = new Koa()
app.use(serve(distPath, { setHeaders }))
app.use(apolloServer.getMiddleware())
app.use(route.get('/_addon/:id/:file(.*)', clientAddons.serve))

module.exports = {
  middleware: app,
  server: apolloServer
}
