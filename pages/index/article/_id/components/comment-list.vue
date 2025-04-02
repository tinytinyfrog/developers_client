<template>
  <div v-if="article" v-infinite-scroll="getCommonList">
    <div id="article-comment" class="library-comment-list">
      <CommentTextarea :article="article" :reload-comment-list="reloadCommentList" />
      <CommentMain
        v-for="(item, index) in commonList"
        :key="index"
        :reload-comment-list="reloadCommentList"
        :article="article"
        :comment="item"
      >
        <template slot-scope="{deleteReply, updateCurrentLock, currentLock}">
          <div v-if="item.replies && item.replies.length" style="margin-top: 12px;">
            <template v-for="(comment, key) in item.replies">
              <CommentItem
                v-if="key < currentLock"
                :key="key"
                :delete-reply="deleteReply"
                :reload-comment-list="reloadCommentList"
                :comment="comment"
                :article="article"
              />
            </template>
            <div v-if="item.replies.length > 5 && currentLock === 5" class="more-reply">
              <span class="more-text g-hover" @click="updateCurrentLock(item.replies.length)">点击查看更多</span>
            </div>
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
import CommentTextarea from './comment-textarea.vue'
export default {
  name: 'CommentListDetail',
  components: {
    CommentTextarea,
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
      pageSize: 15,
      loading: false,
      finished: false,
      commonList: []
    }
  },
  mounted () {
    this.getCommonList()
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
    .more-reply {
      padding: @g-padding * 2;
      text-align: center;
    }
  }
</style>
