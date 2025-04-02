const store = {
  state: () => {
    return {
      ua: '',
      isMiniProgram: false,
      isWeChat: false,
      isMobile: false
    }
  },
  mutations: {
    updateEnv (state, ua) {
      state.ua = ua
      state.isMiniProgram = /miniProgram/gi.test(ua)
      state.isWeChat = /MicroMessenger/gi.test(ua)
      state.isMobile = /iPhone|iPad|iPod|iOS|Android|Mobile/gi.test(ua)
    }
  }
}
export default store
