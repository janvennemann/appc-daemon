import Vue from 'vue'

import Home from '../views/Home.vue'
import router from '../router'

export default class ClientAddonApi {
  constructor () {
    this.components = new Map()
  }

  registerComponent (id, definition) {
    this.components.set(id, definition)
    const componentId = toComponentId(id)
    Vue.component(componentId, definition)
    // eslint-disable-next-line no-console
    console.log(`[ClientAddonApi] Registered ${componentId} component`)
    // Call listeners
    const listeners = this.componentListeners.get(id)
    if (listeners) {
      listeners.forEach(l => l(definition))
      this.componentListeners.delete(id)
    }
  }

  addRoutes (id, routes) {
    router.addRoutes([
      {
        path: `/addon/${id}`,
        component: Home,
        children: routes
      }
    ])
  }
}

export function toComponentId (id) {
  id = id.replace(/\./g, '-')
  return `client-addon--${id}`
}
