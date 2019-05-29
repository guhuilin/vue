// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '@/assets/scss/common.css'
import '@/assets/scss/index.scss'
import icons from './plugins/icons'
import index from './plugins/index'
import api from '@/api/index'
import store from './store/index'
Vue.prototype.api = api

Vue.config.productionTip = false
/* eslint-disable no-new */
Vue.use(icons)
Vue.use(index)
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
