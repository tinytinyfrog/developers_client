<template>
  <div class="menu-container">
    <template v-for="(item,index) of userMenu">
      <a-dropdown v-if="Array.isArray(item.child) && item.child.length > 0" :key="index">
        <div class="menu-item" :class="[activeIndex === index ? 'active':'']" @click="e => {handleClick(index,item,true)}">
          <img :src="item.icon" class="img">  {{ item.label }}
        </div>
        <a-menu slot="overlay" :selected-keys="[current]" @click="hanleMenuClick">
          <a-menu-item v-for="(k) of item.child" :key="k.path">
            <a @click="() => {handleGoTo(index,item,k)}">{{ k.label }}</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <div v-else :key="index" class="menu-item" :class="[activeIndex === index ? 'active':'']" @click="e => {handleClick(index,item)}">
        <img :src="item.icon" class="img">  {{ item.label }}
      </div>
    </template>
  </div>
</template>

<script>
import EventBus from '@/lib/event-bus'
export default {
  name: 'GMenu',
  components: {

  },
  data () {
    const navBars = [
      {
        name: '开发者·客栈',
        path: '/article'
      },
      {
        name: 'QA',
        path: '/faq'
      },
      {
        name: 'Wiki',
        path: '/wiki'
      }
    ]
    let activeIndex = 0
    const current = ''
    for (let i = 0; i < navBars.length; i++) {
      if (this.$route.path.includes(navBars[i].path)) {
        activeIndex = i
      }
    }
    const userInfo = this.$store.state.user.userInfo
    const { q = '' } = this.$route.query
    return {
      searchVal: q,
      activeIndex,
      navBars,
      userInfo,
      msgCount: 0,
      showInfoItem: false,
      cmStyle: { paddingLeft: 0, paddingRight: 0 },
      popoverItemStyle: {
        width: '140px',
        cursor: 'pointer',
        padding: '8px 0',
        fontSize: '15px',
        marginBottom: 0
      },
      current,
      userMenu: [
        {
          label: '首页',
          child: [],
          path: '/home',
          icon: require('@/assets/images/menu/home.png')
        },
        {
          label: '知识库',
          path: '/wiki',
          icon: require('@/assets/images/menu/wiki.png')
        },
        {
          label: '互动论坛',
          child: [{
            label: '流程规范库',
            path: '/article'
          }, {
            label: '敏捷',
            path: 'b'
          }],
          icon: require('@/assets/images/menu/forum.png')
        },
        {
          label: '开发平台&通用框架',
          child: [{
            label: '流程规范库',
            path: '/a'
          }, {
            label: '敏捷',
            path: 'b'
          }],
          icon: require('@/assets/images/menu/platform.png')
        },
        {
          label: '咨询广场',
          child: [{
            label: '流程规范库',
            path: '/a'
          }, {
            label: '敏捷',
            path: 'b'
          }],
          icon: require('@/assets/images/menu/info.png')
        }
      ]
    }
  },
  watch: {
    // 路由状态变更
    '$store.state.user.userInfo' (userInfo) {
      this.userInfo = userInfo
    },
    '$route' (to) {
      console.log('coiming')
      let hasNav = false
      let navIndex = 0
      // this.navBars.forEach((item, index) => {
      //   if (to.path === item.path) {
      //     hasNav = true
      //     navIndex = index
      //   }
      // })
      for (let i = 0; i < this.userMenu.length; i++) {
        if (this.userMenu[i]?.path && this.userMenu[i].path === to.path) {
          hasNav = true
          navIndex = i
        } else if (this.userMenu[i]?.child && this.userMenu[i].child.length > 0) {
          const paths = this.userMenu[i].child.map(i => i.path)
          if (this.userMenu[i].path === '/wiki' && (/\/wiki\/.*\/?$/).test(to.path)) {
            hasNav = true
            navIndex = i
            return
          }
          if (paths?.length > 0 && paths.includes(to.path)) {
            hasNav = true
            navIndex = i
          }
        }
      }
      this.activeIndex = hasNav ? navIndex : -1
    }
  },
  beforeMount () {
    this.fetchWikiList()
  },
  mounted () {
    // this.getMessageCount()
    EventBus.$on('G_UPDATE_MSG_COUNT', this.getMessageCount)
  },
  beforeDestroy () {
    EventBus.$off('G_UPDATE_MSG_COUNT', this.getMessageCount)
  },
  methods: {
    handleClick (index, item, hasChild) {
      this.activeIndex = index
      if (index !== 1) {
        this.current = ''
      }
      if (item.path && hasChild) {
        this.$router.push(item.child[0].path)
        return
      }
      if (item.path) this.$router.push(item.path)
    },
    handleGoTo (index, item, menu) {
      this.activeIndex = index
      this.$router.push(`${menu.path}`)
    },
    hanleMenuClick (e) {
      this.current = e.key
    },
    fetchWikiList () {
      this.$api.getWikiList({
        pageNo: 1,
        pageSize: 100,
        filter: { categoryId: '' }
      }).then((res) => {
        console.log(res, 'res')
        if (res?.length > 0)
          this.userMenu[1].child = res.map((i) => {
            return {
              label: i.name,
              path: this.userMenu[1].path + '/' + i.id
            }
          })
        this.current = this.userMenu[1].child[0].path
      })
    }
  }
}
</script>

  <style lang="less" scoped>
  .menu-container {
    width:100%;
    height:60px;
    background: rgb(37, 56, 81);
    padding: 0 96px;
    display:flex;
    .menu-item {
      padding: 22px 20px;
      color:white;
      cursor: pointer;
      display:flex;
      align-items:center;
      column-gap: 6px;
      .img {
        width:14px;
        height: 14px;

      }
    }
    .active {
      background: rgb(21, 36, 56);
      border-bottom: 4px solid rgb(0, 112, 255);
    }
  }
  </style>
