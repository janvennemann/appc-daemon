import Vue from 'vue'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

import vuetify from './plugins/vuetify'
import router from './router'
import ClientAddonApi from './utils/ClientAddonApi'
import App from './App.vue'
import i18n from './i18n'
import './plugins'
import './register-components'
import { createProvider } from './vue-apollo'

Vue.config.productionTip = false
Vue.config.devtools = true

window.Vue = Vue
window.ClientAddonApi = new ClientAddonApi()

new Vue({
  router,
  vuetify,
  apolloProvider: createProvider(),
  i18n,
  render: h => h(App)
}).$mount('#app')
