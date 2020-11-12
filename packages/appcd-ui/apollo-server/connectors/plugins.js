const AppcdClient = require('appcd-client').default
const path = require('path')
const semver = require('semver')

const clientAddons = require('./client-addons')
const views = require('./views')
const PluginApi = require('../plugin-api')
const { loadModule } = require('../utils/loader')
const schemaManager = require('../utils/schema')

const client = new AppcdClient()
let globalPlugins = new Map()
let pluginApiInstances = new Map()

async function listGlobal (context, options) {
  return listGlobalPlugins(context, options)
}

async function listProject (cwd, context) {
  return []
}

async function listGlobalPlugins (context, { reloadApi = true } = {}) {
  return new Promise((resolve, reject) => {
    client.request('/appcd/status/plugins')
      .on('response', data => {
        if (data.registered.length === 0) {
          return []
        }

        const plugins = new Map()
        const registeredPlugins = data.registered.sort((a, b) => {
          const result = a.name.localeCompare(b.name)
          if (result !== 0) {
            return result
          }
          return semver.lt(a.version, b.version)
        })
        registeredPlugins.forEach(pluginInfo => {
          const name = pluginInfo.name
          if (plugins.has(name)) {
            const plugin = plugins.get(name)
            plugin.versions.push({
              version: pluginInfo.version,
              path: pluginInfo.path,
              error: pluginInfo.error,
              pid: pluginInfo.pid
            })
          } else {
            const versionInfo = {
              version: pluginInfo.version,
              path: pluginInfo.path,
              error: pluginInfo.error,
              pid: pluginInfo.pid
            }
            const plugin = {
              id: `global:${pluginInfo.name}`,
              name: pluginInfo.name,
              versions: [versionInfo]
            }
            plugins.set(name, plugin)
          }
          globalPlugins = plugins
        })

        if (reloadApi) {
          reloadPluginApi('global', context)
        }

        const result = []
        plugins.forEach(p => result.push(p))
        resolve(result)
      })
      .on('error', reject)
  })
}

function getPlugins (cwd) {
  const plugins = []
  globalPlugins.forEach(p => plugins.push(p))
  if (cwd !== 'global') {
    // @TODO: Add project plugins
  }
  return plugins
}

function reloadPluginApi (cwd, context) {
  let pluginApi = pluginApiInstances.get(cwd)
  if (pluginApi) {
    // @TODO clean up
    pluginApi.schemas.forEach(s => schemaManager.remove(s.id))
    pluginApi.views.forEach(v => views.remove(v.id, context))
    clientAddons.clear(context)
  }

  const plugins = getPlugins(cwd)
  pluginApi = new PluginApi({
    plugins,
    cwd
  }, context)
  pluginApiInstances.set(cwd, pluginApi)

  runPluginApi(path.resolve(__dirname, '../../'), pluginApi, 'ui-defaults')
  plugins.forEach(plugin => {
    if (plugin.id.startsWith('global:')) {
      // @TODO Use currently selected version
      runPluginApi(plugin.versions[0].path, pluginApi)
    } else {

    }
  })

  // Add schema extensions
  for (const schema of pluginApi.schemas) {
    schemaManager.add(schema)
  }
  schemaManager.requestSchemaUpdate()

  // Add client addons
  for (const addon of pluginApi.clientAddons) {
    clientAddons.add(addon, context)
  }

  // Add views
  for (const view of pluginApi.views) {
    views.add(view, context)
  }
}

function runPluginApi (id, pluginApi, filename = 'ui') {
  const name = filename !== 'ui' ? `${id}/${filename}` : id
  let module
  try {
    let request = `${id}/${filename}`
    let context = pluginApi.cwd
    if (pluginApi.cwd === 'global') {
      request = filename
      context = id
    }
    module = loadModule(request, context, true)
  } catch (e) {
    if (process.env.APPCD_UI_DEBUG) {
      console.error(e)
    }
  }
  if (module) {
    if (typeof module !== 'function') {
      console.log(`Error while loading plugin API: no function exported, for ${name}`)
    } else {
      pluginApi.pluginId = id
      try {
        module(pluginApi)
        console.log(`Plugin API loaded for ${name}`)
      } catch (e) {
        console.log(`Error while loading plugin API for ${name}: ${e}`)
      }
      pluginApi.pluginId = null
    }
  }
}

module.exports = {
  listProject,
  listGlobal
}
