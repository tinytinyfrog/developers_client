import cookieUtils from '@/lib/cookie-utils'
const store = {
  state: () => {
    return {
      userInfo: null
    }
  },
  mutations: {
    insertUserInfo (state, userInfo) {
      console.log('insert store', state, userInfo)
      state.userInfo = userInfo
    }
  },
  actions: {
    async getUserInfo ({ state, commit }, { $api, clear = false, ctx = null }) {
      console.log(state.userInfo, `state---->${new Date()}`)
      if (state.userInfo && !clear) {
        return
      }
      return await $api.getUserInfo().then((data) => {
        console.log(data, `data---->${new Date()}`)
        commit('insertUserInfo', data)
        if (process.client && !data) {
          cookieUtils.clearToken()
        }
      })
    },
    clearUserInfo ({ commit }) {
      commit('insertUserInfo', null)
    }
  }
}
export default store
