<template>
  <div class="page-article-container ">
    <div class="info-menu">
      <div v-for="(item,index) of tagList" :key="index" class="menu-item" :class="tagIndex === index ? 'active-menu':''" @click="e => handleGoto(item)">
        <div>
          {{ item.name }}
        </div>
      </div>
    </div>
    <!-- <div class="tag-list">
      <div v-for="(item,index) of tagList" :key="index" class="tag-item" :class="[tagIndex === index ?'active-tag':'']" @click="e => handleGoto(item)">
        {{ item.name }}
      </div>
    </div> -->
    <div class="article-content">
      <div class="article-header">
        <HomeTitle :title-tags="titleTags" :current-tag-index.sync="currentTagIndex" />
        <a-button v-if="userInfo" type="primary" @click="handleWrite">
          写文章
        </a-button>
      </div>
      <div v-infinite-scroll="loadData" class="home-list-box">
        <ArticleItem v-for="(item, index) in articleList" :key="index" :article="item" />
      </div>
      <g-empty :list="articleList" :finished="finished" :loading="loading" />
    </div>
    <!-- <CommonSlider>
      <slider-sign-in />
      <SliderBanner />
      <slider-my-achievement :my-achievement="myAchievement" />
      <slider-list :slider-data="noticeData" />
      <slider-honor-list :honor="honor" />
      <SliderRecommend :recommend="randomArticle" />
      <slider-tags />
    </CommonSlider> -->
  </div>
</template>

<script>
/**
 * 首页
 * */
// import CommonSlider from '@/pages/components/common-slider'
// import SliderSignIn from '@/pages/components/slider-sign-in'
// import SliderList from '@/pages/components/slider-list'
// import SliderMyAchievement from '@/pages/components/slider-my-achievement'
// import SliderRecommend from '@/pages/components/slider-recommend'
// import SliderHonorList from '@/pages/components/slider-honor-list'
// import SliderBanner from '@/pages/components/slider-banner'
import EventBus from '@/lib/event-bus'
import HomeTitle from '../components/home-title.vue'
import ArticleItem from '../components/article-item.vue'

export default {
  name: 'PageHome',
  components: {
    HomeTitle,
    ArticleItem
    // CommonSlider,
    // SliderList,
    // SliderSignIn,
    // SliderRecommend,
    // SliderMyAchievement,
    // SliderHonorList,
    // SliderBanner
  },
  async asyncData ({ $api, store, route }) {
    const { tagId } = route.query
    const tagIds = tagId ? [tagId] : []
    // if (category && !tagId) {
    //   const tags = store.state.tag.tags
    //   tagIds = tags.filter(item => item.groupName === category).map(item => item.id)
    // }
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
      filter: {
        category: 'ARTICLE',
        tagIds
      },
      tagList: []
    }
    await Promise.all([
      $api.getTopicList({
        filter: data.filter,
        pageNo: data.pageNo,
        pageSize: data.pageSize
      }).then((list) => {
        if (list) {
          data.articleList = list
          data.pageNo++
          data.finished = list.length < data.pageSize
        }
      }).catch((e) => {
        console.log(e)
      }),
      $api.getUserActionRecord().then((res) => {
        data.myAchievement = res.data
      }).catch(console.log),
      $api.getRandomArticle().then((list) => {
        data.randomArticle.list = list
      }),
      $api.getUserHonorList().then((list) => {
        data.honor.list = list
      }),
      $api.getNoticeList().then((list) => {
        data.noticeData.list = list
      }),
      $api.getTagsByRef().then((list) => {
        data.tagList = list
      })
    ])
    return data
  },
  data () {
    const userInfo = this.$store.state.user.userInfo
    return {
      userInfo,
      loading: false,
      currentTagIndex: 0,
      tagIndex: -1,
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
    currentTagIndex (nVal, oVal) {
      console.log(nVal, oVal)
      if (nVal === oVal) { return }
      const filter = this.titleTags[nVal]
      this.filter.sortByViews = null
      this.filter.official = null
      this.filter.marrow = null
      if (filter.prop) {
        this.filter[filter.prop] = true
      }
      this.clearStatus()
      this.loadData()
    },
    '$route' (to) {
      const { tagId } = to.query
      this.filter.tagIds = [tagId]
      this.filter.sortByViews = null
      this.filter.official = null
      this.filter.marrow = null

      this.clearStatus()
      this.loadData()
      if (this.tagList.length > 0) {
        this.tagIndex = this.tagList.findIndex(item => item.id === Number(tagId))
        console.log('tagIndex', this.tagList, typeof tagId, this.tagIndex)
      }
    }
  },
  mounted () {
    this.loadData()
    EventBus.$on('G_Tags', (tagIds) => {
      this.filter = Object.assign(this.filter, {
        tagIds
      })
      this.clearStatus()
      this.loadData()
    })
    if (this.tagList.length > 0) {
      this.tagIndex = this.tagList.findIndex(item => item.id === Number(this.$route.query.tagId))
      console.log('tagIndex', this.tagList, this.$route.tagId, this.tagIndex)
    }
  },
  beforeDestroy () {
    EventBus.$off('G_Tags')
  },
  methods: {
    handleWrite () {
      // this.$utils.openNewWindow('/draft/editor/new?t=wiki')
      this.$utils.openNewWindow('/draft/editor/new?t=article')
      // this.$router.push('/draft/editor/new?t=article')
    },
    handleGoto (item) {
      this.$router.push(`/article?tagId=${item.id}`)
    },
    clearStatus () {
      this.pageNo = 1
      this.finished = false
      this.loading = false
    },
    loadData () {
      if (this.loading || this.finished) { return }
      this.loading = true
      this.$api.getTopicList({
        filter: this.filter,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }).then((list) => {
        if (list) {
          this.articleList = this.pageNo === 1 ? list : [...this.articleList, ...list]
          this.pageNo++
          this.finished = list.length < this.pageSize
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page-article-container {
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
  .article-content {
    // width: @content-max-width;
    width:0;
    flex:1;
    height: 100%;
    background-color: #fff;
    border-radius: @g-radius;
    padding-bottom: 20px;
    .article-header {
      display:flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 8px;
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
