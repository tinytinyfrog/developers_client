<template>
  <div class="page-question-detail g-margin-top">
    <div class="page-question-info">
      <ContentDetail :question="question" :directory-list.sync="directoryList" />
      <CommentList :article="question" />
    </div>
    <CommonSlider>
      <template slot="header">
        <AuthorInfo :author-info="authorInfo" :has-follow="question.follow" />
      </template>
      <SliderRecommend :recommend="recommendData" />
    </CommonSlider>
  </div>
</template>

<script>
import EventBus from '@/lib/event-bus'
import CommonSlider from '@/pages/components/common-slider'
import SliderRecommend from '@/pages/components/slider-recommend'
import _debounce from 'lodash/debounce'
import AuthorInfo from '../../components/author-info'
import information from '../../../../seo-info'
import { getViewHistoryTop, setViewHistoryTop } from '../../../../lib/utils'
import ContentDetail from './components/content-detail.vue'
import CommentList from './components/comment-list.vue'
export default {
  name: 'PageQuestionDetail',
  components: {
    ContentDetail,
    CommentList,
    CommonSlider,
    AuthorInfo,
    SliderRecommend
  },
  provide () {
    return {
      article: this.question
    }
  },
  async asyncData ({ route, $api }) {
    let question = null
    const id = route.params.id
    await $api.getQuestionDetail(id).then((res) => {
      question = res
      question.category = 'FAQ'
    })
    if (question) { question.follow = 0 }
    await $api.checkFollowUserById(question?.authorId).then((res) => {
      question.follow = !!res?.data
    })
    let authorInfo = null
    await $api.getUserInfoById(question.authorId).then((res) => {
      authorInfo = res
    })
    const recommendData = {
      title: '相关推荐',
      list: []
    }
    const list = await $api.getTopicList({
      filter: {
        category: 'FAQ',
        tagIds: question.tags.map(item => item.id)
      },
      pageSize: 6
    })
    recommendData.list = list.filter(item => item.id !== question.id)
    return {
      id,
      question,
      authorInfo,
      recommendData
    }
  },
  data () {
    return {
      offsetTop: 70,
      targetOffset: 60,
      question: null,
      directoryList: [],
      updateViewTop: _debounce(this.scrollFun, 100)
    }
  },
  mounted () {
    this.listenScroll()
    this.setScrollTop()
    EventBus.$on('G_UPDATE_SOLUTION', this.getQuestion)
  },
  beforeDestroy () {
    EventBus.$off('G_UPDATE_SOLUTION', this.getQuestion)
    window.removeEventListener('scroll', this.updateViewTop)
  },
  methods: {
    getQuestion () {
      this.$api.getQuestionDetail(this.id).then((res) => {
        this.question = Object.assign({}, this.question, res)
      })
    },
    setScrollTop () {
      const h = getViewHistoryTop()
      if (h) {
        document.documentElement.scrollTop = h[this.id]
        document.body.scrollTop = h[this.id]
      }
    },
    scrollFun () {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      setViewHistoryTop({ [this.id]: scrollTop })
    },
    listenScroll () {
      window.addEventListener('scroll', this.updateViewTop)
    }
  },
  head () {
    const { title, tags, markdownContent, htmlContent } = this.question
    const keywords = `,${information.keywords}`
    let description = markdownContent || htmlContent
    description = description.replace(/[#|\n|-|>|[x\]]/ig, '').slice(0, 300)
    let directory = ''
    this.directoryList.forEach((item) => {
      directory += `${item.content},`
      item.children.forEach((t) => {
        directory += `${t.content},`
      })
    })
    return {
      title: title + '-开发者客栈',
      meta: [
        {
          hid: 'keywords',
          name: 'keywords',
          content: tags.map(item => item.name).join(',') + keywords
        },
        {
          hid: 'description',
          name: 'description',
          content: directory || description
        },
        {
          hid: 'csdn-baidu-search',
          name: 'csdn-baidu-search',
          content: title
        }
      ]
    }
  }
}
</script>

<style lang="less">
@import '~/pages/components/byte-markdown-editor/theme.less';
  .page-question-detail {
    display: flex;
    width: 100vw;
    justify-content: space-between;
    border-radius: @g-radius;
    box-sizing: border-box;
    min-height: 100vh;
    .page-question-info {
      flex: 1;
      margin-right: @g-margin * 2;
      max-width: @content-max-width;
      box-sizing: border-box;
    }
    .slider-item {
      margin-bottom: @g-margin;
      border-radius: @g-radius;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .directory-list {
      position: sticky;
      left: 0;
      top: 0;
      padding: 12px 12px 12px 5px;
      font-weight: bold;
    }
    .ant-anchor-ink::before {
      background-color: #fff;
    }
  }
@media screen and (max-width: 1000px) {
  .page-question-detail {
    .page-question-info {
      width: 100vw;
      margin-right: 0;
    }
  }
}
</style>
