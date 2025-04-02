<template>
  <div class="page-question-container g-margin-top">
    <div class="question-content">
      <HomeTitle :title-tags="titleTags" :current-tag-index.sync="currentTagIndex" />
      <div class="question-list-box">
        <div v-infinite-scroll="loadData">
          <QuestionItem v-for="(item, index) in questionList" :key="index" :question="item" />
        </div>
        <g-empty :list="questionList" :finished="finished" :loading="loading" />
      </div>
    </div>
    <CommonSlider>
      <slider-sign-in />
      <slider-my-achievement :my-achievement="myAchievement" />
      <SliderRecommend :recommend="randomArticle" />
      <slider-tags />
    </CommonSlider>
  </div>
</template>

<script>
/**
 * 首页
 * */
import CommonSlider from '@/pages/components/common-slider'
import SliderMyAchievement from '@/pages/components/slider-my-achievement'
import SliderTags from '@/pages/components/slider-tags'
import SliderSignIn from '@/pages/components/slider-sign-in'
import SliderRecommend from '@/pages/components/slider-recommend'
import EventBus from '@/lib/event-bus'
import HomeTitle from '../components/home-title.vue'
import QuestionItem from '../components/question-item.vue'
export default {
  name: 'PageCangjingeIssue',
  components: {
    HomeTitle,
    QuestionItem,
    CommonSlider,
    SliderTags,
    SliderSignIn,
    SliderMyAchievement,
    SliderRecommend
  },
  async asyncData ({ $api, store, route }) {
    const { category, tagId, q } = route.query
    let tagIds = tagId ? [tagId] : []
    if (category && !tagId) {
      const tags = store.state.tag.tags
      tagIds = tags.filter(item => item.groupName === category).map(item => item.id)
    }
    const data = {
      q,
      finished: false,
      pageNo: 1,
      pageSize: 20,
      questionList: [],
      myAchievement: null,
      randomArticle: {
        title: '随便看看',
        list: []
      },
      filter: {
        category: 'FAQ',
        tagIds
      }
    }
    await Promise.all([
      $api.getTopicList({
        filter: data.filter,
        pageNo: data.pageNo,
        pageSize: data.pageSize
      }).then((list) => {
        if (list) {
          data.questionList = list
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
      })
    ])
    return data
  },
  data () {
    return {
      currentTagIndex: 0,
      loading: false,
      titleTags: Object.freeze([
        {
          title: '最新',
          type: 1
        },
        {
          title: '未解决',
          type: 2
        },
        {
          title: '已解决',
          type: 3
        }
      ])
    }
  },
  watch: {
    currentTagIndex (nVal, oVal) {
      if (nVal === oVal) { return }
      this.filter.solution = nVal === 0 ? null : nVal
      // EventBus.$emit('G_CLEAR_GROUP')
      this.clearStatus()
      this.loadData()
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
  },
  beforeDestroy () {
    EventBus.$off('G_Tags')
  },
  methods: {
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
          this.questionList = this.pageNo === 1 ? list : [...this.questionList, ...list]
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
.page-question-container {
  display: flex;
  width: 100%;
  justify-content: space-between;
  min-height: 100vh;
  .question-content {
    height: 100%;
    flex: 1;
    background-color: #fff;
    max-width: @content-max-width;
    border-radius: @g-radius;
    padding-bottom: 20px;
    margin-right: @g-padding * 2;
  }
  .question-list-box {
    padding-bottom: 20px;
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
      border-radius: @g-radius;
      opacity: 0.3;
    }
  }
}
@media screen and (max-width: 1000px) {
  .page-question-container {
    .question-content {
      margin-right: 0;
    }
  }
}
</style>
