<template>
  <div class="page-layout-container">
    <div v-if="showHeadByRouter" class="common-header-box" :class="{'transition-head': hideHead}">
      <GHeader />
      <GMenu />
    </div>
    <Tags v-show="showTag" />
    <div class="child-container">
      <nuxt-child />
      <BackTop />
    </div>
    <!-- <div v-if="miniUrl" class="wx-open-btn">
      <wx-open-launch-weapp
        v-if="isWeChat"
        id="launch-btn"
        username="gh_3c543a61b2b8"
        :path="miniPath"
      >
        <script type="text/wxtag-template">
          <button style="padding: 8px 12px;background-color: #004fc4; color: #fff;font-size: 12px; border-radius: 20px">打开小程序</button>
        </script>
      </wx-open-launch-weapp>
      <Button v-else type="primary" shape="round" @click="$utils.openNewWindow(miniUrl, false)">
        微信小程序
      </Button>
    </div>
    <GWxOauth :show.sync="showLogin" @email-login="emailLogin = true" />
    <GLogin :show.sync="emailLogin" @qrcode-login="showLogin = true" /> -->
    <GFooter />
  </div>
</template>

<script>
import { BackTop } from 'ant-design-vue'
import cookieUtils from '@/lib/cookie-utils'
import throttle from 'lodash/throttle'
import SHA1 from 'crypto-js/sha1'
import globalConfig from '../global'
import EventBus from '../lib/event-bus'
import { setWxShare } from '../lib/wx-share'
import Tags from './index/components/tags'
// import Category from './index/components/category'

const tagsWhite = ['/faq', '/article']
/// /\/wiki\/.*\/?$/,
const hideHeadReg = [/\/auth/, /\/draft\/editor\/.*\/?$/] // 白名单

export default {
  name: 'Home',
  components: {
    // Category,
    Tags,
    BackTop
    // Button
  },
  async asyncData (ctx) {
    const {
      store,
      $api,
      route
    } = ctx
    const {
      _tk,
      _isMp
    } = route.query
    let scene = ''
    let miniUrl = ''
    const {
      isMobile,
      isMiniProgram,
      isWeChat
    } = store.state.globalData
    if (_tk) {
      // 外部 cookie 暂时有效 10 d
      ctx.$cookies.set(cookieUtils.TOKENKEY, _tk, { maxAge: 60 * 60 * 24 * 10 })
      console.log('微信小程序打开页面:', _tk)
      await store.dispatch('user/getUserInfo', {
        $api,
        ctx
      })
    } else if (_isMp) { // 小程序且无 cookie
      const res = await $api.getWxLogoQrcode()
      scene = res.scene
    }
    if (isMobile && !isMiniProgram) {
      // 手机端重定向 打开微信小程序
      const res = await $api.getSchemeUrl({
        path: route.path === '/article' ? '/pages/index/index' : '/pages/new-web-view/index',
        query: `?scene=${scene}&url=${globalConfig.developerServer}${encodeURIComponent(route.path)}`,
        env_version: 'release'
      }).catch(console.log)
      if (res.success) {
        miniUrl = res.data
      }
    }
    return {
      scene,
      miniUrl,
      isWeChat,
      showTag: tagsWhite.includes(route.path)
    }
  },
  data () {
    return {
      emailLogin: false,
      showLogin: false,
      hideHead: false,
      scrollTop: 0,
      toTopTimes: 0,
      scrollTimer: 0,
      showTagFilter: true,
      fullUrl: '',
      scrollThrottle: throttle(this.handleScroll, 350),
      miniPath: 'pages/index/index.html'
    }
  },
  computed: {
    showHeadByRouter () {
      return !hideHeadReg.some(reg => reg.test(this.$route.path))
    }
  },
  watch: {
    $route: {
      handler (newRoute) {
        this.showHeadByRouter = hideHeadReg.some(reg => !reg.test(newRoute.path))
        this.showTag = tagsWhite.includes(newRoute.path)
        if (location.href !== '/article') {
          this.miniPath = `pages/new-web-view/index.html?scene=${this.scene}&url=${location.href}`
        }
      },
      deep: true
    }
  },
  mounted () {
    if (!this.$store.state.user.userInfo) {
      cookieUtils.clearToken()
    }
    window.addEventListener('scroll', this.scrollThrottle)
    // this.wxOauth()
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollThrottle)
  },
  methods: {
    async getSignature (nonceStr, timestamp) {
      const ticket = await this.$api.getWxMiniTicket()
      const str = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${location.href}`
      return SHA1(str).toString().toLowerCase()
    },
    async wxOauth () {
      this.fullUrl = location.href
      if (location.href !== '/article') {
        this.miniPath = `pages/new-web-view/index.html?scene=${this.scene}&url=${this.fullUrl}`
      }
      if (window.wx) {
        const timestamp = Math.floor(Date.now() / 1000)
        const nonceStr = this.randomString(16)
        const signature = await this.getSignature(nonceStr, timestamp)
        window.wx.config({
          debug: false,
          appId: 'wx1ff168a93aabdc34',
          timestamp,
          nonceStr,
          signature,
          jsApiList: ['updateTimelineShareData', 'updateAppMessageShareData', 'onMenuShareAppMessage', 'onMenuShareTimeline', 'showShareMenu', 'onShareAppMessage', 'onShareTimeline'],
          openTagList: ['wx-open-launch-weapp']
        })
        window.wx.ready(() => {
          window.wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
          })
          setWxShare({})
        })
      }
      if (!this.scene) {
        return
      }
      this.$utils.openWxOauth(this.scene, this.$route.path)
    },
    randomString (len) {
      // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
      const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      const tempLen = chars.length; let tempStr = ''
      for (let i = 0; i < len; ++i) {
        tempStr += chars.charAt(Math.floor(Math.random() * tempLen))
      }
      return tempStr
    },
    handleScroll () {
      // 改变元素#searchBar的top值
      const showHeaderReg = [/^\/$/, /^\/user.*/]
      const flag = showHeaderReg.some(item => item.test(this.$route.path))
      if (flag) {
        return
      }
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      EventBus.$emit('G_SCROLLTOP', scrollTop)
      if (scrollTop > this.scrollTop) {
        // 下滑
        this.hideHead = scrollTop > 50
        EventBus.$emit('G_HEADER_STATE', false)
        clearTimeout(this.scrollTimer)
        this.scrollTimer = setTimeout(() => {
          this.toTopTimes = 0
        }, 300)
      } else {
        clearTimeout(this.scrollTimer)
        // 相当于两次滑动出发
        if (this.toTopTimes >= 3 || scrollTop <= 10) {
          this.hideHead = false
          EventBus.$emit('G_HEADER_STATE', true)
        } else {
          this.toTopTimes++
        }
      }
      this.scrollTop = scrollTop
    }
  }
}
</script>

<style lang="less" scoped>
.page-layout-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  min-height: 100vh;
  height: 100%;
  width: 100%;

  .child-container {
    display: flex;
    height: 100%;
    width: 100%;
    // max-width: @max-width;
    justify-content: space-between;
    transition: all 0.2s;

    .ant-back-top {
      bottom: 60px;
    }
  }
  .common-header-box {
    position: sticky;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 100;
    transition: top 0.3s;
  }

  .transition-head {
    top: -@title-height;
    box-shadow: none;
  }

  .wx-open-btn {
    position: fixed;
    bottom: 55px;
    left: calc(50% - 45px);
  }
}

@media screen and (max-width: 1000px) {
  .page-layout-container {
    .transition-head {
      top: -50px !important;
    }
  }
}
</style>
