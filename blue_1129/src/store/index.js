import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import report from './modules/report'
import getters from './getters'

// 导入监听监看（管理的）商品，tab栏切换

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    report
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
