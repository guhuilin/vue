import api from '../../api/index'

const state = {
  list: []
}

const mutations = {
  setData (state, payload) {
    state.list = payload
  }
}

const actions = {
  // 个人中心 的 数据
  getMineData ({commit}, payload) {
    return new Promise(async (resolve, reject) => {
      let data = await api.api.getMine()// {user_id: 1}
      commit('setData', data.data)
      resolve(data)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
