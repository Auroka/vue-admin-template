import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './permission' // permission control
import './utils/directive/permission' // 自定义全局指令

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/styles/index.scss'

import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import './element-variables.scss'

import * as filters from './filters' // global filters
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(ElementUI, {
  size: 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
