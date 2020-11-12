import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import * as components from 'vuetify/lib/components'
import * as directives from 'vuetify/lib/directives'

Vue.use(Vuetify, {
  components,
  directives
})

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: '#00b3a4',
        // secondary: colors.amber.darken3,
        // accent: colors.grey.darken3,
        info: '#1982C4',
        success: '#8AC926',
        warning: '#F8C10D',
        error: '#fb656f'
      }
    }
  }
})
