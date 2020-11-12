import Vue from 'vue'

const components = require.context(
  './components',
  true,
  /[A-Z]\w+\.(vue)$/
)
for (const componentPath of components.keys()) {
  const componentConfig = components(componentPath)
  const fileName = componentPath.split('/').pop()
  if (!fileName) {
    throw new Error(`Couldn't determine component name for ${componentPath}`)
  }
  const componentName = fileName.split('.')[0]
  Vue.component(componentName, componentConfig.default || componentConfig)
}
