<template>
  <div class="menu-container">
    <template v-for="(item,index) of userMenu">
      <a-dropdown v-if="Array.isArray(item.children) && item.children.length > 0" :key="index">
        <div class="menu-item" :class="[activeIndex === index ? 'active':'']" @click="e => {handleClick(index,item,true)}">
          <img :src="item.icon" class="img">  {{ item.menuName }}
        </div>
        <a-menu slot="overlay" :selected-keys="[current]" @click="hanleMenuClick">
          <a-menu-item v-for="(k) of item.children" :key="k.path">
            <a @click="() => {handleGoTo(index,item,k)}">{{ k.menuName }}</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <div v-else :key="index" class="menu-item" :class="[activeIndex === index ? 'active':'']" @click="e => {handleClick(index,item)}">
        <img :src="item.icon" class="img">  {{ item.menuName }}
      </div>
    </template>
  </div>
</template>

<script>
import EventBus from '@/lib/event-bus'
import cookieUtils from '@/lib/cookie-utils'
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
    const activeIndex = -1
    const current = ''
    // for (let i = 0; i < navBars.length; i++) {
    //   if (this.$route.path.includes(navBars[i].path)) {
    //     activeIndex = i
    //   }
    // }
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
      userMenu: []
      // userMenu: [
      //   {
      //     label: '首页',
      //     child: [],
      //     path: '/home',
      //     icon: require('@/assets/images/menu/home.png')
      //   },
      //   {
      //     label: '知识库',
      //     path: '/wiki',
      //     icon: require('@/assets/images/menu/wiki.png')
      //   },
      //   {
      //     label: '互动论坛',
      //     path: '/article',
      //     child: [],
      //     icon: require('@/assets/images/menu/forum.png')
      //   },
      //   {
      //     label: '开发平台&通用框架',
      //     path: '/platform',
      //     child: [],
      //     icon: require('@/assets/images/menu/platform.png')
      //   },
      //   {
      //     label: '资讯广场',
      //     path: '/info',
      //     child: [{
      //       label: '活动新闻',
      //       path: '/info?type=news'
      //     },
      //     {
      //       label: '专家墙',
      //       path: '/info?type=expert'
      //     },
      //     {
      //       label: '荣誉墙',
      //       path: '/info?type=honor'
      //     },
      //     {
      //       label: '优秀团队',
      //       path: '/info?type=team'
      //     },
      //     {
      //       label: '贡献达人',
      //       path: '/info?type=talent'
      //     },
      //     {
      //       label: '沙龙',
      //       path: '/info?type=salon'
      //     },
      //     {
      //       label: '月刊',
      //       path: '/info?type=journal'
      //     }],
      //     icon: require('@/assets/images/menu/info.png')
      //   }
      // ]
    }
  },
  watch: {
    // 路由状态变更
    '$store.state.user.userInfo' (userInfo, old) {
      this.userInfo = userInfo
      if (userInfo && (userInfo.roleId) !== old.roleId) {
        this.fetchMenuList()
      }
    },
    '$route' (to) {
      console.log('coimings')
      let hasNav = false
      let navIndex = 0
      // this.navBars.forEach((item, index) => {
      //   if (to.path === item.path) {
      //     hasNav = true
      //     navIndex = index
      //   }
      // })
      if (to.path === '/wiki') {
        this.current = to.path + '?wikiId=' + to.query.wikiId
      }
      if (to.path === '/article') {
        this.current = to.path + '?tagId=' + to.query.tagId
      }
      if (to.path === '/info') {
        console.log(to, 'to')
        this.current = to.path + '?type=' + to.query.type
      }
      if (to.path === '/platform') {
        console.log(to, 'to')
        this.current = to.path + '?platformId=' + to.query.platformId
      }
      for (let i = 0; i < this.userMenu.length; i++) {
        if (this.userMenu[i]?.path && this.userMenu[i].path === to.path) {
          hasNav = true
          navIndex = i
        } else if (this.userMenu[i]?.children && this.userMenu[i].children.length > 0) {
          const paths = this.userMenu[i].children.map(i => i.path)
          if (this.userMenu[i].path === '/wiki' && (/\/wiki\/.*\/?$/).test(to.path)) {
            hasNav = true
            navIndex = i
          } else if (this.userMenu[i].path === '/article' && (/\/article\/.*\/?$/).test(to.path)) {
            hasNav = true
            navIndex = i
          } else if (this.userMenu[i].path === '/info' && (/\/info\/.*\/?$/).test(to.path)) {
            hasNav = true
            navIndex = i
          } else if (this.userMenu[i].path === '/platform' && (/\/platform\/.*\/?$/).test(to.path)) {
            hasNav = true
            navIndex = i
          } else if (paths?.length > 0 && paths.includes(this.$route.path)) {
            hasNav = true
            navIndex = i
          }
        }
      }
      this.activeIndex = hasNav ? navIndex : -1
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
    handleClick (index, item, hasChild) {
      this.activeIndex = index
      if (index !== 1) {
        this.current = ''
      }
      if (item.path && hasChild) {
        this.$router.push(item.children[0].path)
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
    fetchMenuList () {
      this.$api.getRoleMenuList({ roleId: cookieUtils.getToken() ? this.$store.state.user.userInfo ? this.$store.state.user.userInfo.roleId : '-1' : '-1' }).then((res) => {
        this.userMenu = res.map((item) => {
          item.children = item.children.filter(i => i.isSelect === 1)
          return item
        }).filter(k => k.isSelect === 1)
        this.$store.commit('menu/insertMenuInfo', {
          list: this.userMenu
        })
        if (this.userMenu.length > 0) {
          for (let i = 0; i < this.userMenu.length; i++) {
            if (this.userMenu[i]?.path && this.userMenu[i].path === this.$route.path) {
              this.activeIndex = i
            } else if (this.userMenu[i]?.children && this.userMenu[i].children.length > 0) {
              const paths = this.userMenu[i].children.map(i => i.path)
              if (this.userMenu[i].path === '/wiki' && (/\/wiki\/.*\/?$/).test(this.$route.path)) {
                this.activeIndex = i
                this.current = this.$route.path
              } else if (this.userMenu[i].path === '/article' && (/\/article\/.*\/?$/).test(this.$route.path)) {
                this.activeIndex = i
                this.current = this.$route.path
              } else if (this.userMenu[i].path === '/info' && (/\/info\/.*\/?$/).test(this.$route.path)) {
                this.activeIndex = i
                this.current = this.$route.path
              } else if (this.userMenu[i].path === '/platform' && (/\/platform\/.*\/?$/).test(this.$route.path)) {
                this.activeIndex = i
                this.current = this.$route.path
              } else if (paths?.length > 0 && paths.includes(this.$route.path)) {
                this.activeIndex = i
              }
            }
          }
        }
      })
    }
    // fetchWikiList () {
    //   this.$api.getWikiList({
    //     pageNo: 1,
    //     pageSize: 100,
    //     filter: { categoryId: '' }
    //   }).then((res) => {
    //     if (res?.length > 0)
    //       this.userMenu[1].children = res.map((i) => {
    //         return {
    //           label: i.name,
    //           path: this.userMenu[1].path + '?wikiId=' + i.id
    //         }
    //       })
    //     this.current = this.userMenu[1].children[0].path
    //     if (this.userMenu.length > 0) {
    //       for (let i = 0; i < this.userMenu.length; i++) {
    //         if (this.userMenu[i]?.path && this.userMenu[i].path === this.$route.path) {
    //           this.activeIndex = i
    //         } else if (this.userMenu[i]?.children && this.userMenu[i].children.length > 0) {
    //           const paths = this.userMenu[i].children.map(i => i.path)
    //           if (this.userMenu[i].path === '/wiki' && (/\/wiki\/.*\/?$/).test(this.$route.path)) {
    //             this.activeIndex = i
    //           } else if (this.userMenu[i].path === '/article' && (/\/article\/.*\/?$/).test(this.$route.path)) {
    //             this.activeIndex = i
    //             this.current = this.$route.path
    //           } else if (this.userMenu[i].path === '/info' && (/\/info\/.*\/?$/).test(this.$route.path)) {
    //             this.activeIndex = i
    //             this.current = this.$route.path
    //           } else if (this.userMenu[i].path === '/platform' && (/\/platform\/.*\/?$/).test(this.$route.path)) {
    //             this.activeIndex = i
    //             this.current = this.$route.path
    //           } else if (paths?.length > 0 && paths.includes(this.$route.path)) {
    //             this.activeIndex = i
    //           }
    //         }
    //       }
    //     }
    //   })
    // },
    // fetchTagList () {
    //   this.$api.getTagsByRef().then((res) => {
    //     if (res?.length > 0)
    //       this.userMenu[2].children = res.map((i) => {
    //         return {
    //           label: i.name,
    //           path: `${this.userMenu[2].path}?tagId=${i.id}`
    //         }
    //       })
    //   })
    // },
    // fetchPlatformTagList () {
    //   this.$api.getPlatformTag({ category: 'PLATFORM' }).then((res) => {
    //     if (res?.length > 0) {
    //       this.userMenu[3].children = res.map((i) => {
    //         return {
    //           label: i.name,
    //           path: `${this.userMenu[3].path}?platformId=${i.id}`
    //         }
    //       })
    //     }
    //   })
    // }
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
