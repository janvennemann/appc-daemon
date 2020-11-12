import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueTimeago from 'vue-timeago'

import en from './locales/en'

Vue.use(VueI18n)
Vue.use(VueTimeago, {
  name: 'Timeago',
  locale: 'en'
})

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en
  }
})

export default i18n
