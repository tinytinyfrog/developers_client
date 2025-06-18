<template>
  <div class="page-wiki-detail-entry">
    <div class="wiki-menu-left" :class="{'show-mobile-menu': showMobileMenu}">
      <Menu
        :menu-list="wikiMenu"
        :wiki-info="wikiInfo"
        :can-edit="canEdit"
        :show-mobile-menu="showMobileMenu"
        :is-collaborator="isCollaborator"
        @on-update="updateMenu"
      />
    </div>
    <div class="wiki-container-right">
      <nuxt-child :wiki-info="wikiInfo" :show-mobile-menu="showMobileMenu" :menu-list="wikiMenu" />
    </div>
    <div class="fixed-menu-btn">
      <a-button
        size="large"
        type="default"
        :icon="showMobileMenu ? 'close' : 'menu'"
        @click="showMobileMenu = !showMobileMenu"
      />
    </div>
  </div>
</template>

<script>
import EventBus from '@/lib/event-bus'
import Menu from './_id/components/wiki-menu'

const getNextSortNode = (nextNode, list, resultList) => {
  if (!nextNode) return []
  resultList.push(nextNode)
  let hasNext = false
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (nextNode.nodeId === item.prevBrotherNodeId) {
      hasNext = true
      return getNextSortNode(item, list, resultList)
    }
  }
  if (!hasNext) return resultList
}

const menuSort = (list) => {
  let firstWiki = null
  for (let i = 0; i < list.length; i++) {
    if (!list[i].prevBrotherNodeId) {
      firstWiki = list[i]
    }
  }
  return getNextSortNode(firstWiki, list, [])
}

const handlerMenu = (wikiMenu) => {
  if (!wikiMenu.length) return
  // 所有一级目录
  let list = wikiMenu.filter(item => item.level === 1)
  // 二级目录
  const tempList = wikiMenu.filter(item => item.level === 2)
  // eslint-disable-next-line no-return-assign
  list.forEach(item => item.children = [])
  list = menuSort(list)
  const tempListLen = tempList.length
  for (let i = 0; i < list.length; i++) {
    const oneLevel = list[i]
    let childrenList = []
    for (let k = 0; k < tempListLen; k++) {
      const children = tempList[k]
      if (children.parentNodeId === oneLevel.nodeId) {
        childrenList.push(children)
      }
    }
    if (childrenList.length) {
      childrenList = menuSort(childrenList)
      list[i].children = [...childrenList]
      childrenList = []
    }
  }
  return list
}
export default {
  name: 'WikiDetailEntry',
  components: {
    Menu
  },
  async asyncData ({ route, $api, store }) {
    const { id } = route.params
    const wikiInfo = await $api.getWikiNodeListInfoById(id)
    const wikiMenu = handlerMenu(wikiInfo.nodeList)
    let canEdit = ['ADMIN', 'OWNER'].includes(wikiInfo.role)
    const { isMobile } = store.state.globalData
    if (isMobile) {
      canEdit = false
    }
    // 协作者
    const isCollaborator = wikiInfo.role === 'COLLABORATOR'
    return {
      wikiId: id,
      wikiInfo,
      wikiMenu,
      canEdit,
      isCollaborator
    }
  },
  data () {
    return {
      showMobileMenu: false,
      showPagination: false
    }
  },
  watch: {
    $route (to) {
      if (to.path === `/wiki/${this.wikiId}`) {
        this.updateMenu()
      }
    }
  },
  mounted () {
    EventBus.$on('G_UPDATE_MENU', (show) => {
      this.showMobileMenu = show
    })
  },
  beforeDestroy () {
    EventBus.$off('G_UPDATE_MENU')
  },
  methods: {
    async updateMenu () {
      this.wikiInfo = await this.$api.getWikiNodeListInfoById(this.wikiId)
      this.wikiMenu = handlerMenu(this.wikiInfo.nodeList)
    }
  }
}
</script>

<style lang="less" scoped>
.page-wiki-detail-entry {
  display: flex;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  .wiki-container-right {
    flex: 1;
    max-width: calc(100% - 300px);
    background-color: #fff;
    border-left: 1px dashed @border-1-color;
  }
  .wiki-menu-left {
      transition: all 0.3s;
    }
  .fixed-menu-btn {
    display: none;
  }
  @media screen and (max-width: 1000px) {
    .wiki-menu-left {
      width: 0;
      overflow-x: hidden;
    }
    .show-mobile-menu {
      width: 301px !important;
      z-index: 1;
      overflow-x: initial;
    }
    .wiki-container-right {
      min-width: 100%;
    }
    .fixed-menu-btn {
      display: inline-block;
      position: fixed;
      right: 20px;
      bottom: 110px;
      z-index: 9;
      border-radius: @g-radius;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
