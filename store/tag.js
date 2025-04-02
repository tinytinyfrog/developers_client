const store = {
  state: () => {
    return {
      tags: [],
      tagGroup: []
    }
  },
  mutations: {
    insertTagsList (state, tags) {
      const group = new Set()
      state.tags = tags
      tags.forEach((item) => {
        group.add(item.groupName)
      })
      state.tagGroup = ['全部', ...group]
    }
  },
  actions: {
    async getTagsList ({ state, commit }, { $api }) {
      if (state.tags.length) {
        return
      }
      return await $api.getTagsByRef().then((data) => {
        commit('insertTagsList', data)
      })
    }
  }
}
export default store
