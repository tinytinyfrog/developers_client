<template>
  <nav class="menu-container">
    <template v-for="(item, index) of userMenu">
      <a-dropdown v-if="hasChildren(item)" :key="index" :trigger="['hover']" placement="bottomLeft">
        <div
          class="menu-item"
          :class="{ active: activeIndex === index }"
          @click="handleClick(index, item, true)"
        >
          <img v-if="item.icon" :src="item.icon" class="menu-icon" alt="">
          <span class="menu-text">{{ item.menuName }}</span>
          <a-icon type="down" class="dropdown-icon" />
        </div>
        <a-menu
          slot="overlay"
          class="dropdown-menu"
          :selected-keys="[current]"
          @click="handleMenuClick"
        >
          <a-menu-item v-for="child of item.children" :key="child.path" class="dropdown-item">
            <a @click="() => handleGoTo(index, item, child)">
              {{ child.menuName }}
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>

      <div
        v-else
        :key="index"
        class="menu-item"
        :class="{ active: activeIndex === index }"
        @click="handleClick(index, item)"
      >
        <img v-if="item.icon" :src="item.icon" class="menu-icon" alt="">
        <span class="menu-text">{{ item.menuName }}</span>
      </div>
    </template>
  </nav>
</template>

<script>
import EventBus from '@/lib/event-bus'
import cookieUtils from '@/lib/cookie-utils'

export default {
  name: 'GMenu',
  data () {
    return {
      searchVal: this.$route.query.q || '',
      activeIndex: -1,
      userInfo: this.$store.state.user.userInfo,
      current: '',
      userMenu: []
    }
  },

  computed: {
    // 计算当前路由相关的 current 值
    computedCurrent () {
      const { path, query } = this.$route
      const routeCurrentMap = {
        '/wiki': `${path}?wikiId=${query.wikiId || ''}`,
        '/article': `${path}?tagId=${query.tagId || ''}`,
        '/info': `${path}?type=${query.type || ''}`,
        '/platform': `${path}?platformId=${query.platformId || ''}`
      }
      return routeCurrentMap[path] || ''
    }
  },
  watch: {
    '$store.state.user.userInfo' (userInfo, old) {
      this.userInfo = userInfo
      if (userInfo && userInfo.roleId !== old?.roleId) {
        this.fetchMenuList()
      }
    },

    $route (to) {
      this.updateCurrentPath(to)
      this.updateActiveIndex(to)
    }
  },
  beforeMount () {
    this.fetchMenuList()
  },
  mounted () {
    // this.getMessageCount()
    EventBus.$on('G_UPDATE_MSG_COUNT', this.getMessageCount)
    if (this.$route.path === '/wiki') {
      this.current = this.$route.path + '?wikiId=' + this.$route.query.wikiId
    }
    if (this.$route.path === '/article') {
      this.current = this.$route.path + '?tagId=' + this.$route.query.tagId
    }
    if (this.$route.path === '/info') {
      this.current = this.$route.path + '?type=' + this.$route.query.type
    }
    if (this.$route.path === '/platform') {
      this.current = this.$route.path + '?platformId=' + this.$route.query.platformId
    }
  },
  beforeDestroy () {
    EventBus.$off('G_UPDATE_MSG_COUNT', this.getMessageCount)
  },
  methods: {
    // 检查菜单项是否有子菜单
    hasChildren (item) {
      return Array.isArray(item.children) && item.children.length > 0
    },

    // 更新当前路径
    updateCurrentPath (to) {
      const { path, query } = to
      const pathHandlers = {
        '/wiki': () => `${path}?wikiId=${query.wikiId || ''}`,
        '/article': () => `${path}?tagId=${query.tagId || ''}`,
        '/info': () => `${path}?type=${query.type || ''}`,
        '/platform': () => `${path}?platformId=${query.platformId || ''}`
      }

      if (pathHandlers[path]) {
        this.current = pathHandlers[path]()
      }
    },

    // 更新活跃索引
    updateActiveIndex (to) {
      let hasNav = false
      let navIndex = 0

      for (let i = 0; i < this.userMenu.length; i++) {
        const menuItem = this.userMenu[i]

        if (this.isDirectMatch(menuItem, to.path)) {
          hasNav = true
          navIndex = i
          break
        }

        if (this.isPatternMatch(menuItem, to.path)) {
          hasNav = true
          navIndex = i
          break
        }

        if (this.isChildMatch(menuItem, to.path)) {
          hasNav = true
          navIndex = i
          break
        }
      }

      this.activeIndex = hasNav ? navIndex : -1
    },

    // 直接路径匹配
    isDirectMatch (menuItem, currentPath) {
      return menuItem.path && menuItem.path === currentPath
    },

    // 模式匹配（如 /wiki/xxx）
    isPatternMatch (menuItem, currentPath) {
      const patterns = {
        '/wiki': /\/wiki\/.*\/?$/,
        '/article': /\/article\/.*\/?$/,
        '/info': /\/info\/.*\/?$/,
        '/platform': /\/platform\/.*\/?$/
      }

      return menuItem.path && patterns[menuItem.path]?.test(currentPath)
    },

    // 子菜单路径匹配
    isChildMatch (menuItem, currentPath) {
      if (!this.hasChildren(menuItem)) return false

      const childPaths = menuItem.children.map(child => child.path)
      return childPaths.includes(currentPath)
    },

    handleClick (index, item, hasChild) {
      this.activeIndex = index

      if (index !== 1) {
        this.current = ''
      }

      if (item.path && hasChild && this.hasChildren(item)) {
        this.$router.push(item.children[0].path)
        return
      }

      if (item.path) {
        this.$router.push(item.path)
      }
    },

    handleGoTo (index, item, menu) {
      this.activeIndex = index
      this.$router.push(menu.path)
    },

    handleMenuClick (e) {
      this.current = e.key
    },

    // 获取消息数量（如果需要）
    getMessageCount () {
      // 如果有消息相关功能，可以在这里实现
      console.log('Getting message count...')
    },
    /**
     * 获取用户菜单列表
     * @returns {Promise}
     */
    async fetchMenuList () {
      try {
        const roleId = this.getCurrentRoleId()
        const menuData = await this.$api.getRoleMenuList({ roleId })

        // 处理菜单数据
        this.userMenu = this.processMenuData(menuData)

        // 更新 Vuex store
        this.updateMenuStore()

        // 设置当前活跃菜单
        this.setActiveMenuOnInit()
      } catch (error) {
        console.error('获取菜单列表失败:', error)
        this.userMenu = []
        // 可以添加错误提示
        // this.$message.error('获取菜单失败，请刷新页面重试')
      }
    },

    /**
     * 获取当前用户角色ID
     * @returns {string} 角色ID或'-1'
     */
    getCurrentRoleId () {
      const hasToken = cookieUtils.getToken()
      const userInfo = this.$store.state.user.userInfo

      if (!hasToken || !userInfo) {
        return '-1'
      }

      return userInfo.roleId || '-1'
    },

    /**
     * 处理菜单数据，过滤选中的菜单项
     * @param {Array} menuData 原始菜单数据
     * @returns {Array} 处理后的菜单数据
     */
    processMenuData (menuData) {
      if (!Array.isArray(menuData)) {
        return []
      }

      return menuData
        .map(item => ({
          ...item,
          children: this.filterSelectedChildren(item.children)
        }))
        .filter(item => item.isSelect === 1)
    },

    /**
     * 过滤选中的子菜单
     * @param {Array} children 子菜单数组
     * @returns {Array} 过滤后的子菜单
     */
    filterSelectedChildren (children) {
      if (!Array.isArray(children)) {
        return []
      }

      return children.filter(child => child.isSelect === 1)
    },

    /**
     * 更新菜单信息到 Vuex store
     */
    updateMenuStore () {
      this.$store.commit('menu/insertMenuInfo', {
        list: this.userMenu
      })
    },

    /**
     * 初始化时设置活跃菜单
     */
    setActiveMenuOnInit () {
      if (this.userMenu.length === 0) {
        this.activeIndex = -1
        return
      }

      const currentPath = this.$route.path

      for (let i = 0; i < this.userMenu.length; i++) {
        const menuItem = this.userMenu[i]

        // 直接路径匹配
        if (this.isDirectMatch(menuItem, currentPath)) {
          this.activeIndex = i
          return
        }

        // 模式匹配（如 /wiki/xxx）
        if (this.isPatternMatch(menuItem, currentPath)) {
          this.activeIndex = i
          this.current = currentPath
          return
        }

        // 子菜单匹配
        if (this.isChildMatch(menuItem, currentPath)) {
          this.activeIndex = i
          return
        }
      }

      // 如果没有匹配到任何菜单，重置为-1
      this.activeIndex = -1
    }
  }
}
</script>

<style lang="less" scoped>
.menu-container {
  width: 100%;
  height: 60px;
  background: rgb(37, 56, 81);
  padding: 0 96px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 1200px) {
    padding: 0 48px;
  }

  @media (max-width: 768px) {
    padding: 0 24px;
    height: 56px;
  }

  .menu-item {
    position: relative;
    padding: 18px 20px;
    color: rgba(255, 255, 255, 0.85);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 100%;
    border-radius: 0;
    transition: all 0.3s ease;
    user-select: none;

    @media (max-width: 768px) {
      padding: 14px 16px;
      gap: 6px;
    }

    &:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.08);
    }

    .menu-icon {
      width: 16px;
      height: 16px;
      object-fit: contain;
      flex-shrink: 0;

      @media (max-width: 768px) {
        width: 14px;
        height: 14px;
      }
    }

    .menu-text {
      font-size: 15px;
      font-weight: 500;
      white-space: nowrap;

      @media (max-width: 768px) {
        font-size: 14px;
      }
    }

    .dropdown-icon {
      font-size: 12px;
      margin-left: 4px;
      transition: transform 0.2s ease;

      @media (max-width: 768px) {
        font-size: 10px;
      }
    }

    &.active {
      color: #ffffff;
      background: rgb(21, 36, 56);
      // border-bottom: 2px solid rgb(0, 112, 255);
      .dropdown-icon {
        transform: rotate(180deg);
      }
    }
  }
}

// 下拉菜单样式优化
::v-deep .ant-dropdown {
  .dropdown-menu {
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    border: none;
    overflow: hidden;

    .dropdown-item {
      margin: 0;

      a {
        display: block;
        padding: 12px 20px;
        color: #333;
        text-decoration: none;
        transition: all 0.2s ease;
        font-size: 14px;

        &:hover {
          background: #f5f5f5;
          color: rgb(0, 112, 255);
        }
      }

      &.ant-menu-item-selected {
        background: rgba(0, 112, 255, 0.1);

        a {
          color: rgb(0, 112, 255);
          font-weight: 500;
        }
      }
    }
  }
}

// 添加一个平滑的加载动画
.menu-item {
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 4px;
    background: rgb(0, 112, 255);
    transition: width 0.3s ease;
  }

  &:hover::before {
    width: 100%;
  }

  &.active::before {
    width: 100%;
    height: 4px;
  }
}
</style>
