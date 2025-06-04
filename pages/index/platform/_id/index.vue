<template>
  <div class="page-library-detail g-margin-top">
    <div class="page-library-info">
      <ContentDetail :article="article" :directory-list.sync="directoryList" />
      <CommentList :article="article" />
    </div>
    <GSidebar>
      <AuthorInfo :author-info="authorInfo" :has-follow="article.follow" />
      <SliderRecommend :recommend="recommendData" />
      <div class="slider-item-directory">
        <Anchor wrapper-class="directory-list" :offset-top="offsetTop" :target-offset="targetOffset" :wrapper-style="{backgroundColor: 'transparent'}">
          <AnchorLink v-for="(item1, index1) in directoryList" :key="index1" :class="[item1.class]" :href="`#${item1.id}`" :title="`${item1.content}`">
            <AnchorLink v-for="(item2, index2) in item1.children" :key="index2" :href="`#${item2.id}`" :title="item2.content">
              <!--              <AnchorLink v-for="(item3, index3) in item2.children" :key="index3" :href="`#${item3.id}`" :title="item3.content" />-->
            </AnchorLink>
          </AnchorLink>
        </Anchor>
      </div>
    </GSidebar>
  </div>
</template>

<script>
import { Anchor } from 'ant-design-vue'
import SliderRecommend from '@/pages/components/slider-recommend'
import _debounce from 'lodash/debounce'
import information from '../../../../seo-info'
import AuthorInfo from '../../components/author-info'
import { setViewHistoryTop, getViewHistoryTop } from '../../../../lib/utils'
import ContentDetail from './components/content-detail.vue'
import CommentList from './components/comment-list.vue'

const AnchorLink = Anchor.Link
export default {
  name: 'PageLibraryDetail',
  components: {
    ContentDetail,
    CommentList,
    Anchor,
    AnchorLink,
    AuthorInfo,
    SliderRecommend
  },
  provide () {
    return {
      article: this.article
    }
  },
  async asyncData ({ route, $api, $cookies }) {
    let article = null
    const id = route.params.id
    await $api.getArticleDetail(id).then((res) => {
      article = res
    })
    await $api.checkFollowUserById(article.authorId).then((res) => {
      article.follow = !!res?.data
    })
    let authorInfo = null
    await $api.getUserInfoById(article.authorId).then((res) => {
      authorInfo = res
    })
    const recommendData = {
      title: '相关推荐',
      list: []
    }
    const list = await $api.getTopicList({
      filter: {
        category: 'PLATFORM',
        tagIds: article.tags.map(item => item.id)
      },
      pageSize: 6
    })
    recommendData.list = list.filter(item => item.id !== article.id).slice(0, 5)
    const directoryList = JSON.parse(article.directory || '[]').map((item) => {
      item.class = 'anchor-first-title'
      return item
    }) || []
    return {
      id,
      article,
      authorInfo,
      directoryList,
      recommendData
    }
  },
  data () {
    return {
      offsetTop: 70,
      targetOffset: 70,
      article: null,
      updateViewTop: _debounce(this.scrollFun, 100)
    }
  },
  mounted () {
    if (this.recommendData.list.length) {
      this.directoryList.push({
        id: 'article-comment',
        content: '评论区',
        children: []
      })
    }
    this.listenScroll()
    this.setScrollTop()
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.updateViewTop)
  },
  methods: {
    setScrollTop () {
      const h = getViewHistoryTop()
      if (h && h[this.id] > 50) {
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
    const { title, tags, markdownContent, htmlContent } = this.article
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
  .page-library-detail {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    border-radius: @g-radius;
    box-sizing: border-box;
    min-height: 100vh;
    padding-bottom: 80px;
    .page-library-info {
      flex: 1;
      max-width: @content-max-width;
      box-sizing: border-box;
      margin-right: @g-padding * 2;
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
    }
    .ant-anchor-link-title {
      font-size: 13px;
      color: @font-color-second;
    }
    .anchor-first-title {
      >.ant-anchor-link-title {
        font-weight: bold;
        color: @font-color-first;
        font-size: @font-fourth;
      }
    }
    .ant-anchor-link-title-active {
      color: @g-main-color !important;
      font-weight: bold;
    }
    .ant-anchor-ink::before {
      background-color: #fff;
    }
    .ant-anchor-ink-ball {
      border-radius: 0 !important;
      width: 4px !important;
      height: 14px !important;
      background-color: @g-main-color !important;
    }
  }
@media screen and (max-width: 1000px) {
  .page-library-detail {
    .page-library-info {
      margin-right: 0;
    }
  }
}
</style>
