<template>
  <div class="page-home-container">
    <!-- <div class="home-content">
      <nuxt-link to="/home">
        hhha
      </nuxt-link>
    </div> -->
    <!-- <CommonSlider>
      <slider-sign-in />
      <slider-list :slider-data="noticeData" />
      <slider-my-faq />
      <slider-honor-list :honor="honor" />
      <slider-tags />
    </CommonSlider> -->
  </div>
</template>

<script>
/**
 * 首页
 * */
// import CommonSlider from '@/pages/components/common-slider'
// import SliderList from '@/pages/components/slider-list'
// import SliderMyFaq from '@/pages/components/slider-my-achievement'
// import SliderSignIn from '@/pages/components/slider-sign-in'
// import SliderTags from '@/pages/components/slider-tags'
// import SliderHonorList from '@/pages/components/slider-honor-list'
// import HomeTitle from './components/home-title.vue'
// import ArticleItem from './components/article-item.vue'
// import QuestionItem from './components/question-item.vue'
import EventBus from '@/lib/event-bus'

export default {
  name: 'PageHome',
  components: {
    // HomeTitle,
    // ArticleItem,
    // CommonSlider,
    // QuestionItem,
    // SliderMyFaq,
    // SliderSignIn,
    // SliderTags,
    // SliderList,
    // SliderHonorList
  },
  asyncData ({ redirect, store }) {
    const userInfo = store.state.user.userInfo
    if (userInfo) {
      redirect('/home')
    } else {
      redirect('https://it.talkweb.com.cn/idaas/login?client_id=1899739142530338818&redirect_uri=https://delivery.paas.talkweb.com.cn/auth&response_type=code')
      // location.href = 'https://it.talkweb.com.cn/idaas/login?client_id=1899739142530338818&redirect_uri=https://delivery.paas.talkweb.com.cn/auth&response_type=code'
    }
    // const { q } = route.query
    // const userInfo = store.state.user.userInfo
    // const data = {
    //   userInfo,
    //   contentList: [],
    //   authorList: [],
    //   honor: {
    //     title: '作者榜',
    //     list: []
    //   },
    //   noticeData: {
    //     title: '公告',
    //     list: []
    //   },
    //   finished: false,
    //   pageNo: 1,
    //   pageSize: 20
    // }
    // await $api.getTopicList({
    //   filter: { q },
    //   pageNo: data.pageNo,
    //   pageSize: data.pageSize
    // }).then((list) => {
    //   if (list) {
    //     data.contentList = list
    //     data.pageNo++
    //     data.finished = list.length < data.pageSize
    //   }
    // })
    // await Promise.all([
    //   $api.getUserHonorList().then((list) => {
    //     data.honor.list = list
    //   }),
    //   $api.getNoticeList().then((list) => {
    //     data.noticeData.list = list
    //   })
    // ])
    // return {
    //   q,
    //   ...data
    // }
    return {}
  },
  data () {
    return {
      filter: {},
      title: 'home',
      loading: false,
      currentTagIndex: 0,
      titleTags: Object.freeze([
        {
          title: '最新',
          type: 1
        },
        {
          title: '关注',
          type: 2
        }
      ])
    }
  },
  watch: {
    currentTagIndex (val) {
      this.onInfiniteScroll(true)
    }
  },
  mounted () {
    this.loadData()
    // this.$api.getEnableConfig(['HOME_CAROUSEL'])
    // 到达过首页则清除简历缓存
    EventBus.$on('G_Tags', (tagIds) => {
      this.filter = Object.assign(this.filter, {
        tagIds
      })
      this.clearStatus()
      this.loadData()
    })
  },
  methods: {
    clearStatus () {
      this.pageNo = 1
      this.finished = false
      this.loading = false
    },
    onInfiniteScroll (clear = false) {
      if (clear) {
        this.clearStatus()
      }
      this.currentTagIndex === 0 ? this.loadData() : this.loadFollowData()
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
          this.contentList = this.pageNo === 1 ? list : [...this.contentList, ...list]
          this.pageNo++
          this.finished = list.length < this.pageSize
        }
      }).finally(() => {
        this.loading = false
      })
    },
    loadFollowData () {
      if (this.loading || this.finished) { return }
      this.loading = true
      this.$api.getFollowArticleList(this.pageSize, this.pageNo).then((list) => {
        if (list) {
          this.contentList = this.pageNo === 1 ? list : [...this.contentList, ...list]
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
.page-home-container {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  min-height: 100vh;
  .home-content {
    width: @content-max-width;
    height: 100%;
    background-color: #fff;
    border-radius: @g-radius;
    padding-bottom: 20px;
    margin-right: @g-padding * 2;
  }
  .banner-container {
    margin-bottom: @g-margin;
    background-color: #fff;
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
  .page-home-container {
    min-width: auto;
    .home-content {
      width: 100%;
      margin-right: 0;
    }
  }
}
</style>
