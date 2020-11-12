import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard'
import AppcdStatus from '../views/AppcdStatus'
import AppcdPlugins from '../views/AppcdPlugins'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard
      },
      {
        path: 'status',
        name: 'appcd-status',
        component: AppcdStatus
      },
      {
        path: 'plugins',
        name: 'appcd-plugins',
        component: AppcdPlugins
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
