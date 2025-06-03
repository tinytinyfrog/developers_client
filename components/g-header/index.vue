<template>
  <header id="g-header-container" class="g-header-container">
    <div class="g-header-box">
      <div class="header-left">
        <div class="header-left-nav">
          <img class="logo" src="~/assets/images/header/logo.png" alt="" @click="$router.push('/')">
          <a-divider type="vertical" class="a-divider" />
          <img class="intro-logo" src="~/assets/images/header/intro.png" alt="">
          <InputSearch v-model="searchVal" placeholder="请输入关键字进行搜索" style="width: 320px" class="search" @search="onSearch" />
        </div>
        <!-- <span class="search-container">
          <InputSearch v-model="searchVal" placeholder="请输入关键字" style="width: 280px" @search="onSearch" />
        </span> -->
      </div>
      <div class="header-right">
        <template v-if="userInfo">
          <img src="~/assets/images/header/comment.png" class="comment">
          <a-button type="primary" @click="handleWrite">
            写文章
          </a-button>
          <div class="msg">
            欢迎来到交付中心门户
          </div>
          <Avatar class="a-avatar">
            {{ userInfo.nickname[0] }}
          </Avatar>
          <div>
            <a-dropdown>
              <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                {{ userInfo.nickname }} <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;" @click="handleGoto">个人中心</a>
                </a-menu-item>
                <a-menu-item>
                  <span style="color:red" @click="logout">退出系统</span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </template>
        <template v-else>
          <Button @click="handleLogin">
            登录
          </Button>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
import { Input, Avatar, Button } from 'ant-design-vue'
import EventBus from '@/lib/event-bus'
import cookieUtils from '@/lib/cookie-utils'
const InputSearch = Input.Search
export default {
  name: 'GHeader',
  components: {
    Button,
    // Popover,
    // Icon,
    // Badge,
    Avatar,
    InputSearch
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
    let activeIndex = -1
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
          label: '我的主页',
          path: '/user',
          icon: 'profile'
        },
        {
          label: '我的文章',
          path: '/user?tab=article',
          icon: 'book'
        },
        {
          label: '我的QA',
          path: '/user?tab=qa',
          icon: 'question-circle'
        },
        {
          label: '我的收藏',
          path: '/user?tab=collect',
          icon: 'star'
        },
        {
          label: '退出登录',
          method: 'logout',
          icon: 'sync'
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
    this.getMessageCount()
    EventBus.$on('G_UPDATE_MSG_COUNT', this.getMessageCount)
  },
  beforeDestroy () {
    EventBus.$off('G_UPDATE_MSG_COUNT', this.getMessageCount)
  },
  methods: {
    goToLogin () {
      EventBus.$emit('GLOGIN')
    },
    getPopContainer () {
      return document.getElementById('g-header-container')
    },
    async onReadAll () {
      // EventBus.$emit('G_MSG_ITEM_COUNT')
      const res = await this.$api.markMessageStateAll()
      if (res.success) {
        this.getMessageCount()
        EventBus.$emit('G_MSG_ITEM_COUNT')
      }
    },
    getMessageCount () {
      if (this.$store.state.user.userInfo) {
        this.$api.getMessageCount().then((count) => {
          this.msgCount = count
        })
      }
    },
    handleSetting (action) {
      this.showInfoItem = false
      if (action.method) {
        this[action.method]()
      }
      if (action.path) {
        this.$router.push(action.path)
      }
    },
    handleWrite () {
      this.$utils.openNewWindow('/draft/editor/new?t=article')
      // this.$router.push('/draft/editor/new?t=article')
    },
    logout () {
      console.log('coming')
      this.$confirm({
        title: '确认需要退出吗？',
        content: '要不再溜达溜达~',
        okText: '确认',
        cancelText: '取消',
        onCancel: () => {},
        onOk: async () => {
          console.log('coming')
          this.$api.logout({
            token: cookieUtils.getToken()
          })
          cookieUtils.clearToken()
          await this.$store.dispatch('user/getUserInfo', {
            $api: this.$api,
            clear: true
          })
          // location.href = '/'
        }
      })
    },
    currentSearch (type) {
      EventBus.$emit('G_SEARCH', {
        type,
        value: this.searchVal
      })
      const newUrl = `/${type}/${this.searchVal}`
      const stateObject = 0
      const title = type
      history.replaceState(stateObject, title, newUrl)
    },
    onSearch () {
      if (!this.searchVal) { return }
      const url = location.href
      if (/\/search\/.+/.test(url)) {
        this.currentSearch('search')
        return
      }
      this.$router.push(`/search/${this.searchVal}`)
      // this.$utils.openNewWindow(`/search/${this.searchVal}`)
    },
    handleLogin () {
      location.href = 'http://it.talkweb.com.cn/idaas/login?client_id=1834156237792284674&redirect_uri=http%3A%2F%2F192.168.35.12%3A19102%2F%23%2FloginRedirect&response_type=code'
      // location.href = 'https://it.talkweb.com.cn/idaas/login?client_id=1899739142530338818&redirect_uri=https://delivery.paas.talkweb.com.cn/auth&response_type=code'
    },
    handleGoto () {
      this.$router.push('/user')
    }
  }
}
</script>

<style lang="less" scoped>
  .g-header-container {
    min-height: @title-height;
    width: 100%;
    background-color: #fff;
   // border-bottom: 1px solid @border-4-color;
    transition: top 0.5s;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.05);
    z-index: 2;
    .g-header-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      // max-width: @max-width;
      // min-width: @max-width;
      // margin: 0 auto;
      height: @title-height;
      padding: 10px 17px;
      .header-left {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: @content-max-width;
        .header-left-nav {
          display: flex;
          align-items: center;
        }
        a {
          display: inline-block;
          color: @font-color-second;
          outline: none;
          text-decoration: none;
          cursor: pointer;
          font-size: 18px;
          margin-right: 30px;
        }
      }
      .a-divider {
        background:rgb(128, 154, 255);
        height: 38px;
        margin: 0 16px;
      }
      .logo {
        height: 50px;
        width: 120px;
        color: @g-main-color;
        font-size: @font-first;
        vertical-align: middle;
        cursor: pointer;
      }
      .intro-logo {
        height: 50px;
        width: 196px;
        color: @g-main-color;
        font-size: @font-first;
        vertical-align: middle;
        cursor: pointer;
      }
      .search{
        margin-left: 80px;
      }
      .header-right {
        display: flex;
        align-items: center;
        column-gap:16px;
        .comment {
          width:16px;
          height: 16px;
        }
        .msg {
          color: rgb(41, 41, 41);
          font-family: PingFang SC;
          font-size: 14px;
          font-weight: 400;
        }
        .a-avatar {
          background-color:#0060FF;
          color:#fff
        }
        .header-right-nav {
          padding: 0 10px;
          font-size: @font-fourth;
          &:last-child {
            padding-right: 0;
          }
        }
        .message-notice {
          font-size: @font-second;
          cursor: pointer;
          color: @g-main-color;
        }
        .ant-badge-count {
          font-size: 12px !important;
          width: 16px !important;
          height: 16px !important;
        }
        .user-header {
          width: 35px;
          height: 35px;
          cursor: pointer;
        }
      }
    }
  }
  @media screen and (max-width: 1000px) {
    .g-header-container {
      height: 50px;
      min-height: 50px;
      .g-header-box {
        max-width: max-content;
        min-width: 375px;
        line-height: 50px;
        padding-left: 12px;
        height: 50px;
        .header-left {
          .logo {
            width: 35px;
            height: 35px;
          }
          a {
            font-size: @font-third;
            margin-right: 20px;
          }
        }
      }
      .header-right {
        display: none !important;
      }
      .search-container {
        display: none;
      }
    }
  }
</style>
