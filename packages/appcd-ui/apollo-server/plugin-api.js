class PluginApi {
  constructor ({ plugins, cwd, project = null }, context) {
    this.context = context
    this.pluginId = null
    this.cwd = cwd
    this.project = project
    this.plugins = plugins
    this.clientAddons = []
    this.views = []
    this.schemas = []
  }

  /**
   * Register a client addon (a JS bundle which will be loaded in the browser).
   * Used to load components and add vue-router routes.
   */
  addClientAddon (options) {
    this.clientAddons.push({
      ...options,
      pluginId: this.pluginId
    })
  }

  /**
   * Add a new view as a link to the left navigation sidebar.
   */
  addView (options) {
    this.views.push({
      ...options,
      pluginId: this.pluginId
    })
  }

  addSchema (options) {
    this.schemas.push({
      ...options,
      pluginId: this.pluginId
    })
  }
}

module.exports = PluginApi
