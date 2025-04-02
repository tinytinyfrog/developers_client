const store = {
  state: () => {
    return {
      users: {}
    }
  },
  mutations: {
    insertUserInfo (state, { id, userInfo }) {
      state.users[id] = userInfo
    }
  }
}
export default store
