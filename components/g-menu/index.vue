<template>
  <div class="menu-container">
    <template v-for="(item,index) of userMenu">
      <a-dropdown v-if="Array.isArray(item.child) && item.child.length > 0" :key="index">
        <div class="menu-item" :class="[activeIndex === index ? 'active':'']" @click="e => {handleClick(index,item.path)}">
          <img :src="item.icon" class="img">  {{ item.label }}
        </div>
        <a-menu slot="overlay">
          <a-menu-item v-for="(k,v) of item.child" :key="v">
            <a @click="() => {handleGoTo(v.path)}">{{ k.label }}</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <div v-else :key="index" class="menu-item" :class="[activeIndex === index ? 'active':'']" @click="e => {handleClick(index)}">
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
      userMenu: [
        {
          label: '首页',
          child: [],
          path: '/home',
          icon: require('@/assets/images/menu/home.png')
        },
        {
          label: '知识库',
          child: [{
            label: '流程规范库',
            path: '/article'
          }, {
            label: '敏捷',
            path: 'b'
          }],
          icon: require('@/assets/images/menu/wiki.png')
        },
        {
          label: '互动论坛',
          child: [{
            label: '流程规范库',
            path: '/a'
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
      let hasNav = false
      let navIndex = 0
      this.navBars.forEach((item, index) => {
        if (to.path === item.path) {
          hasNav = true
          navIndex = index
        }
      })
      this.activeIndex = hasNav ? navIndex : -1
    }
  },
  mounted () {
    // this.getMessageCount()
    EventBus.$on('G_UPDATE_MSG_COUNT', this.getMessageCount)
  },
  beforeDestroy () {
    EventBus.$off('G_UPDATE_MSG_COUNT', this.getMessageCount)
  },
  methods: {
    handleClick (index, path) {
      this.activeIndex = index
      if (path) this.$router.push(path)
    },
    handleGoTo (path) {
      this.$router.push(path)
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
