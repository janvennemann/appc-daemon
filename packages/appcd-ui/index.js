const Koa = require('koa')
const serve = require('koa-static')
const path = require('path')

const distPath = path.resolve(__dirname, 'dist')

const CACHE_CONTROL = 'no-store, no-cache, must-revalidate, private'

function setHeaders (res) {
  res.setHeader('Cache-Control', CACHE_CONTROL)
}

const app = new Koa()
app.use(serve(distPath, { setHeaders }))

module.exports = app
