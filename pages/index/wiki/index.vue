<template>
  <div class="page-wiki-container ">
    <template v-if="menuIndex >= 0">
      <div class="info-menu">
        <div v-for="(item,index) of menuList" :key="index" class="menu-item" :class="menuIndex === index ? 'active-menu':''" @click="e => handleGoto(item)">
          <div>
            {{ item.menuName }}
          </div>
        </div>
      </div>
      <div class="wiki-content">
        <!-- <HomeTitle :title-tags="titleTags" :current-tag-index.sync="currentmenuIndex" /> -->
        <div class="wiki-content-header">
          <div class="wiki-filter">
            <div v-for="(item,index) of tagList" :key="index" class="wiki-tag" :class="tagIndex === item.value ? 'active-tag':''" @click="e =>{ handleTag(item)}">
              {{ item.label }}
            </div>
          </div>
          <a-button v-if="userInfo && userInfo.role === 'ADMIN'" type="primary" @click="handleWrite">
            写wiki
          </a-button>
        </div>
        <div v-infinite-scroll="loadData" class="home-list-box">
          <WikiItem v-for="(item, index) in wikiList" :key="index" :article="item" />
        </div>
        <g-empty :list="wikiList" :finished="finished" :loading="loading" />
      </div>
    </template>
    <div v-else class="page-wiki-empty-container">
      <a-result status="403" sub-title="对不起,你没访问权限">
        <template #extra>
          <a-button type="primary" @click="handleBackHome">
            返回首页
          </a-button>
        </template>
      </a-result>
    </div>
  </div>
</template>

<script>
import EventBus from '@/lib/event-bus'
// import HomeTitle from '../components/home-title.vue'
import WikiItem from '../components/wiki-item.vue'

export default {
  name: 'WikiHome',
  components: {
    WikiItem
  },
  async asyncData ({ $api, store, route }) {
    const { wikiId } = route.query

    let menuList = []
    const res = store.state.menu.menuList.filter(i => i.path === '/wiki')
    if (res?.length > 0 && res[0].children) {
      menuList = res[0].children
    }
    const data = {
      // q,
      finished: false,
      pageNo: 1,
      pageSize: 20,
      articleList: [],
      randomArticle: {
        title: '随便看看',
        list: []
      },
      honor: {
        title: '作者榜',
        list: []
      },
      noticeData: {
        title: '公告',
        list: []
      },
      myAchievement: null,
      menuList,
      tagList: [],
      tagIndex: 0,
      filter: {
        wikiId
      }
    }

    await Promise.all([
      $api.getWikiList({
        pageNo: 1,
        pageSize: 100,
        filter: { categoryId: '' }
      }).then((list) => {
        data.menuList = list
      })
    ])
    return data
  },
  data () {
    const userInfo = this.$store.state.user.userInfo
    return {
      userInfo,
      loading: false,
      currentmenuIndex: 0,
      menuIndex: 99999,
      wikiList: [],
      titleTags: Object.freeze([
        {
          title: '最新',
          type: 1
        },
        {
          title: '最热',
          type: 2,
          prop: 'sortByViews'
        },
        {
          title: '官方',
          type: 3,
          prop: 'official'
        },
        {
          title: '加精',
          type: 4,
          prop: 'marrow'
        }
      ])
    }
  },
  watch: {
    currenttagIndex (nVal, oVal) {
      console.log(nVal, oVal)
      // if (nVal === oVal) { return }
      // const filter = this.titleTags[nVal]
      // this.filter.sortByViews = null
      // this.filter.official = null
      // this.filter.marrow = null
      // if (filter.prop) {
      //   this.filter[filter.prop] = true
      // }
      // this.clearStatus()
      // this.loadData()
    },
    menuIndex (nVal, oVal) {
      if (nVal !== oVal) {
        this.tagList = []
        this.tagIndex = 0
        this.fetchWikiTag()
      }
    },
    tagIndex (nVal) {
      this.filter = {
        wikiId: this.$route.query.wikiId,
        tags: nVal ? [nVal] : undefined
      }
      this.clearStatus()
      this.loadData()
    },
    '$route' (to) {
      const { wikiId } = to.query
      this.filter = {
        wikiId
      }

      this.clearStatus()
      this.loadData()
      if (this.menuList.length > 0) {
        this.menuIndex = this.menuList.findIndex(item => item.path === to.fullPath)
      } else {
        this.menuIndex = -1
      }
    },
    '$store.state.menu.menuList' (menu) {
      console.log(menu, 'menu')
      let menuList = []
      const res = menu.filter(i => i.path === '/wiki')
      if (res?.length > 0 && res[0].children) {
        menuList = res[0].children
      }
      this.menuList = menuList
      if (this.menuList.length > 0) {
        this.menuIndex = this.menuList.findIndex(item => item.path === this.$route.fullPath)
      } else {
        this.menuIndex = -1
      }
    }
  },
  mounted () {
    this.loadData()
    const res = this.$store.state.menu.menuList.filter(i => i.path === '/wiki')
    if (res?.length > 0 && res[0].children) {
      this.menuList = res[0].children
      if (this.menuList.length > 0) {
        this.menuIndex = this.menuList.findIndex(item => item.path === this.$route.fullPath)
      }
    } else {
      this.menuIndex = -1
    }
  },
  beforeDestroy () {
    EventBus.$off('G_Tags')
  },
  methods: {
    handleTag (item) {
      this.tagIndex = item.value
    },
    handleWrite () {
      this.$utils.openNewWindow(`/draft/editor/new?t=wiki&wikiId=${this.$route.query.wikiId}`)
    },
    handleGoto (item) {
      this.$router.push(item.path)
    },
    clearStatus () {
      this.pageNo = 1
      this.finished = false
      this.loading = false
    },
    handleBackHome () {
      this.$router.push('/home')
    },
    loadData () {
      if (this.loading || this.finished) { return }
      this.loading = true
      this.$api.getWikiNodes({
        filter: this.filter,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }).then((list) => {
        if (list) {
          this.wikiList = this.pageNo === 1 ? list : [...this.wikiList, ...list]
          this.pageNo++
          this.finished = list.length < this.pageSize
        }
      }).finally(() => {
        this.loading = false
      })
    },
    fetchWikiTag () {
      this.$api.getWikiTag({ wikiId: this.$route.query.wikiId, tags: [] }).then((res) => {
        if (res.length > 0) {
          this.tagList = res.map(i => ({ label: i.tagName, value: i.tagId }))
        }
        console.log(this.tagList, 'taglist', res)
        this.tagList.unshift({ label: '全部', value: 0 })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page-wiki-container {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  // justify-content: center;
  min-height: 100vh;
  .info-menu {
        width:265px;
        min-height: calc( 100vh - 140px);
        background: rgb(246, 246, 246);
        color: rgb(40, 40, 40);
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 400;
        border-right: 1px solid rgb(226, 232, 246);;
        .menu-item {
            padding: 16px 24px;
            display: flex;
            column-gap: 10px;
            cursor: pointer;
            img {
                width: 18px;
                height: 18px;
            }
        }
        .active-menu {
            background: #ffff;
            border-left:  6px solid  rgb(0, 112, 255);
        }

    }
  // .tag-list {
  //   background: #fff;
  //   border-radius: 8px;
  //   width:200px;
  //   padding:  16px 0px;
  //   margin-bottom: 20px;
  //   height:calc(100vh - 184px);
  //   .tag-item {
  //     padding: 8px 20px;
  //     cursor: pointer;
  //     font-size: 14px;
  //     font-weight: 400;
  //     color:rgba(0, 0, 0, 0.8)
  //   }
  //   .tag-item:hover{
  //     color:#0070ff
  //   }
  //   .active-tag {
  //     color: #0070ff;
  //     font-size: 14px;
  //     font-weight: 500;
  //   }
  // }
  .wiki-content {
    // width: @content-max-width;
    width:0;
    flex:1;
    height: 100%;
    background-color: #fff;
    border-radius: @g-radius;
    padding-bottom: 20px;
    .wiki-content-header{
      display:flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 8px;
    .wiki-filter {
      height: 58px;
      border-bottom: 1px solid #f2f2f2;
      display: flex;
      flex:1;
      .wiki-tag {
        cursor: pointer;
        color: #606a78;
        font-size: 15px;
        margin: 14px 6px;
        padding: 3px 14px;
        word-break: keep-all;
        &:hover {
          color: #004fc4 !important;
          background-color: rgba(5, 105, 204, .05);
        }
      }
    }
  }
    .active-tag {
      color: #fff !important;
      background-color: #004fc4;
      font-weight: 700;
      border-radius: 3px;
    }
  }
  .loading {
    width: 100%;
    height: 30px;
    line-height: 30px;
    color: @font-color-third;
    text-align: center;
  }
  .action-container {
    position: relative;
    padding: @g-padding * 2;
    margin-bottom: @g-margin;
    background-color: #fff;
    border-radius: @g-radius;
    border: 1px solid #fff;
    .saying-text {
      color: #000;
      word-spacing: 5px;
      text-indent: 30px;
      margin-bottom: 20px;
    }
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      content: "";
      background-image: url("https://cdn.jsdelivr.net/gh/umlink/umlink-figure-bed_1@master/images/1633585808102WechatIMG14.jpeg");
      background-repeat: no-repeat;
      background-size: cover;
      opacity: 0.3;
    }
  }
  .banner {
    width: 100%;
    border-radius: @g-radius;
  }
  .tag-container {
    background-color: #fff;
    margin-bottom: @g-margin;
    padding: @g-padding;
    .tags {
      margin: 0 auto;
      width: @max-width;
      padding: @g-margin 0;
      .tag {
        color: #849484;
        display: inline-block;
        background-color: #fff;
        padding: 3px 10px;
        border-radius: 20px;
        font-size: 14px;
        margin-right: 8px;
        cursor: pointer;
        &:hover {
          color: @g-active-color;
        }
      }
    }
  }
  .page-wiki-empty-container{
    widows: 100%;
    margin: 0 auto;
  }
}
@media screen and (max-width: 1000px) {
  .page-article-container {
    .article-content {
      padding-bottom: 0;
      margin-right:0;
    }
  }
}
</style>
