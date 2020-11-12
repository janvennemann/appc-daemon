const cwd = require('./cwd')
const channels = require('../channels')

const views = new Map()

function builtInViews () {
  return [
    {
      id: 'appcd-status',
      name: 'appcd-status',
      icon: 'mdi-server',
      title: 'appcd.nav.titles.status',
      group: 'appcd.nav.groups.core'
    },
    {
      id: 'appcd-plugins',
      name: 'appcd-plugins',
      icon: 'mdi-cube-outline',
      title: 'appcd.nav.titles.plugins',
      group: 'appcd.nav.groups.core'
    }
  ]
}

function getViews () {
  const currentDir = cwd.get()
  let list = views.get(currentDir)
  if (!list) {
    list = builtInViews()
    views.set(currentDir, list)
  }
  return list
}

function list (context) {
  return getViews()
}

function findOne (id) {
  const views = getViews()
  return views.find(v => v.id === id)
}

function add (view, context) {
  remove(view.id, context)
  const views = getViews()
  views.push(view)
  context.pubsub.publish(channels.VIEW_ADDED, {
    viewAdded: view
  })
}

function remove (id, context) {
  const views = getViews()
  const index = views.findIndex(r => r.id === id)
  if (index !== -1) {
    const view = views[index]
    views.splice(index, 1)
    context.pubsub.publish(channels.VIEW_REMOVED, {
      viewRemoved: view
    })
  }
}

module.exports = {
  list,
  findOne,
  add,
  remove
}
