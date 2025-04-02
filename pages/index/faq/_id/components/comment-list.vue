<template>
  <div v-if="article" v-infinite-scroll="getCommonList">
    <div class="library-comment-list">
      <CommentMain
        v-for="(item, index) in commonList"
        :key="index"
        :reload-comment-list="reloadCommentList"
        :article="article"
        :comment="item"
      >
        <template slot-scope="{deleteReply}">
          <div v-if="item.replies && item.replies.length" style="margin-top: 12px;">
            <CommentItem
              v-for="(comment, key) in item.replies"
              :key="key"
              :delete-reply="deleteReply"
              :reload-comment-list="reloadCommentList"
              :comment="comment"
              :article="article"
            />
          </div>
        </template>
      </CommentMain>
      <g-empty :list="commonList" :finished="finished" :loading="loading" />
    </div>
  </div>
</template>

<script>
import CommentMain from '@/pages/components/comments/comment-main.vue'
import CommentItem from '@/pages/components/comments/comment-item.vue'
import EventBus from '@/lib/event-bus'
export default {
  name: 'CommentListDetail',
  components: {
    CommentItem,
    CommentMain
  },
  props: {
    article: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNo: 1,
      pageSize: 20,
      loading: false,
      finished: false,
      commonList: []
    }
  },
  mounted () {
    this.getCommonList()
    EventBus.$on('G_COMMENT_QUESTION', this.reloadCommentList)
  },
  methods: {
    reloadCommentList () {
      this.loading = false
      this.finished = false
      this.pageNo = 1
      this.getCommonList()
    },
    checkReplies (val) {
      return val.replies && val.replies.length > 0
    },
    getCommonList () {
      if (this.loading || this.finished) { return }
      this.loading = true
      this.$api.getCommentListByArticleId({
        id: this.article.id,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }).then((res) => {
        this.loading = false
        this.commonList = this.pageNo === 1 ? res?.list : [...this.commonList, ...res?.list]
        this.pageNo++
        if (res?.list.length < this.pageSize) {
          this.finished = true
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less">
  .library-comment-list {
    background-color: #fff;
    border-radius: @g-radius;
    .comment-children-items {
      margin-left: 1px;
    }
  }
</style>
