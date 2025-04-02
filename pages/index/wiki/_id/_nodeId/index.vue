<template>
  <div class="page-wiki-node-detail">
    <div v-if="loading" class="loading-box">
      <a-spin spinning />
    </div>
    <div v-if="article && ctxType && !loading" class="node-detail">
      <template v-if="ctxType === 'ARTICLE'">
        <ContentDetail :show-mobile-menu="showMobileMenu" is-wiki :article="article" :menu-list="menuList" />
        <CommentList :article="article" />
      </template>
      <template v-if="ctxType === 'FAQ'">
        <QuestionDetail :show-mobile-menu="showMobileMenu" is-wiki :question="article" :menu-list="menuList" />
        <FaqCommentList :article="article" />
      </template>
    </div>
  </div>
</template>

<script>
import ContentDetail from '@/pages/index/article/_id/components/content-detail.vue'
import QuestionDetail from '@/pages/index/faq/_id/components/content-detail.vue'
import CommentList from '@/pages/index/article/_id/components/comment-list.vue'
import FaqCommentList from '@/pages/index/faq/_id/components/comment-list.vue'
export default {
  name: 'WikiDetail',
  components: {
    ContentDetail,
    QuestionDetail,
    CommentList,
    FaqCommentList
  },
  props: {
    menuList: {
      type: Array,
      default: () => []
    },
    showMobileMenu: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      menus: [],
      currentIndex: 0,
      loading: true,
      article: null,
      ctxType: this.ctxType || 'ARTICLE',
      nodeId: this.$route.params.nodeId || ''
    }
  },
  provide () {
    return {
      article: this.article
    }
  },
  watch: {
    '$route' () {
      const nodeId = this.$route.params.nodeId
      if (nodeId && nodeId !== this.nodeId) {
        this.nodeId = nodeId
        this.article = null
        this.loading = true
        this.getArticleDetail()
      }
    }
  },
  mounted () {
    this.getArticleDetail()
    console.log('mounted...')
  },
  methods: {
    async getArticleDetail () {
      this.loading = true
      let article = {}
      let list = []
      this.menuList.forEach((item) => {
        list = [...list, ...item.children]
      })
      list.forEach((item) => {
        if (+this.nodeId === item.postsId) {
          this.ctxType = item.postsCategory
        }
      })
      const method = this.ctxType === 'ARTICLE' ? this.$api.getArticleDetail : this.$api.getQuestionDetail
      await method(this.nodeId).then((res) => {
        article = res
      })
      await this.$api.checkFollowUserById(this.nodeId).then((res) => {
        article.follow = !!res?.data
        this.article = article
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less">
@import '~/pages/components/byte-markdown-editor/theme.less';
.page-wiki-node-detail {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 100px;
  .loading-box {
    padding-top: 50px;
    text-align: center;
  }
  .node-detail {
    position: relative;
  }
}
</style>
