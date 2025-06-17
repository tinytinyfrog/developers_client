const store = {
  state: () => {
    return {
      menuList: []
    }
  },
  mutations: {
    insertMenuInfo (state, { list }) {
      state.menuList = list
    }
  }
}
export default store
