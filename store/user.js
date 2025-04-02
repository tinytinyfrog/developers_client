import cookieUtils from '@/lib/cookie-utils'
const store = {
  state: () => {
    return {
      userInfo: null
    }
  },
  mutations: {
    insertUserInfo (state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
    async getUserInfo ({ state, commit }, { $api, clear = false, ctx = null }) {
      if (state.userInfo && !clear) {
        return
      }
      return await $api.getUserInfo().then((data) => {
        commit('insertUserInfo', data)
        if (process.client && !data) {
          cookieUtils.clearToken()
        }
      })
    }
  }
}
export default store
