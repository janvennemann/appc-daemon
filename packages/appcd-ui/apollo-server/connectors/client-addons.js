const send = require('koa-send')
const path = require('path')

const channels = require('../channels')

const addons = []
const baseUrl = `http://localhost:1732/dashboard`

function list (context) {
  return addons
}

function add (options, context) {
  if (findOne(options.id)) {
    remove(options.id, context)
  }

  addons.push(options)
  context.pubsub.publish(channels.CLIENT_ADDON_ADDED, {
    clientAddonAdded: options
  })
}

function remove (id, context) {
  const index = addons.findIndex(
    addon => addon.id === id
  )
  if (index !== -1) addons.splice(index, 1)
}

function clear (context) {
  for (const addon of addons) {
    remove(addon.id, context)
  }
}

function findOne (id, context = null) {
  return addons.find(addon => addon.id === id)
}

function getUrl (addon, context) {
  return addon.url || `${baseUrl}/_addon/${addon.id}/index.js`
}

async function serve (ctx, id, file) {
  const response = ctx.response
  const addon = findOne(id)
  if (addon && addon.path) {
    await send(ctx, file, { root: addon.path })
  } else {
    response.status = 404
    response.body = `Addon ${id} not found in loaded addons.`
  }
}

module.exports = {
  list,
  add,
  remove,
  clear,
  findOne,
  getUrl,
  serve
}
