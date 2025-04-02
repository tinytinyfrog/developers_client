<template>
  <div v-if="comment" class="comment-item-container">
    <div class="comment-avator">
      <GUserPopover :user-id="comment.commentator.id">
        <Avatar size="small" :src="comment.commentator.avatar" :alt="comment.commentator.nickname" @click="$utils.openUserCenter(comment.commentator.id)" />
      </GUserPopover>
    </div>
    <div class="comment-user-info">
      <div class="base-info">
        <b
          class="user-name g-hover"
          @click="$utils.openUserCenter(comment.commentator.id)"
        >{{ comment.commentator.nickname }}</b>
        <span v-if="comment.commentator.id === article.authorId" class="author-tag">[作者]</span>
        <span v-if="comment.respondent.id">
          <Icon type="caret-right" class="replay-icon" />
          <span class="respondent-user g-hover" @click="$utils.openUserCenter(comment.respondent.id)">
            <b>{{ comment.respondent.nickname }}</b>
            <span v-if="comment.respondent.id === article.authorId" class="author-tag">[作者]</span>
          </span>
        </span>
        <g-space :size="1" />
        <span>{{ comment.createAt | dateCountDown }}</span>
      </div>
      <div v-dompurify-html="comment.content" class="comment-detail" :class="{'is-delete': comment.isDelete}" />
      <p v-if="comment.respondent.repliedContent" class="respondent-content">
        "{{ comment.respondent.repliedContent }}"
      </p>
      <div class="comment-action">
        <span v-auth="{ handler: onReply, stopPrevent: true }" class="action-item g-hover" :class="{ 'g-main-color': showReply }">
          <Icon ref="msgFocus" type="message" />
          <span>{{ showReply ? '取消回复' : '回复' }}</span>
        </span>
        <template v-if="isSelf && !comment.isDelete ">
          <g-space />
          <span v-auth="{ handler: () => deleteReply(comment.id) }" class="action-item g-hover">
            <Icon type="delete" />
            <span>删除</span>
          </span>
        </template>
      </div>
      <div v-if="showReply" ref="replyCtx" class="comment-textarea">
        <Textarea
          v-model="replyValue"
          auto-focus
          size="large"
          class="comment-content"
          :placeholder="`回复: ${comment.commentator.nickname}`"
          auto-size
        />
        <div class="comment-option">
          <Button type="primary" :loading="loading" @click="onSubReply">
            发表评论
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _get from 'lodash/get'
import { Avatar, Input, Button, Icon } from 'ant-design-vue'
const Textarea = Input.TextArea

export default {
  name: 'CommentMain',
  components: {
    Avatar,
    Textarea,
    Button,
    Icon
  },
  props: {
    deleteReply: {
      type: Function,
      default: () => ({})
    },
    reloadCommentList: {
      type: Function,
      default: () => {}
    },
    comment: {
      type: Object,
      default: () => null
    },
    article: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      loading: false,
      showReply: false,
      replyValue: ''
    }
  },
  computed: {
    isSelf () {
      return _get(this, 'comment.commentator.id') === _get(this, '$store.state.user.userInfo.id')
    }
  },
  beforeDestroy () {
    window.removeEventListener('click', this.ctxClick)
  },
  mounted () {
    window.addEventListener('click', this.ctxClick)
  },
  methods: {
    ctxClick (e) {
      const target = e.target || e.srcElement
      const self = this.$refs.replyCtx
      if (!self) return
      try {
        if (!(target === self) && !self.contains(target)) {
          this.showReply = false
        }
      } catch (e) {}
    },
    onReply (e) {
      this.showReply = !this.showReply
      this.$nextTick(() => {
        if (!this.$refs.replyCtx) return
        this.$refs.replyCtx.click()
      })
    },
    async onSubReply () {
      this.loading = true
      await this.$api.createCommentByArticle({
        postsId: this.article.id,
        content: this.replyValue,
        replyId: this.comment.id
      }).then((res) => {
        if (res.success) {
          this.replyValue = ''
          if (typeof this.reloadCommentList === 'function') this.reloadCommentList()
          this.showReply = false
        } else {
          this.$message.error(res.message)
        }
      })
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
  @margin-bottom: 10px;
  .comment-item-container {
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid @border-3-color;
    &:last-child {
      border: 0;
    }
    .comment-avator {
      margin-right: @margin-bottom;
    }
    .comment-user-info {
      flex: 1;
      .base-info {
        color: @font-color-second;
        margin-top: 3px;
        .replay-icon {
          color: @font-color-four;
        }
        .user-name, .respondent-user {
          color: @font-color-first;
        }
        .author-tag {
          color: @font-color-four !important;
        }
      }
      .comment-detail {
        color: @font-color-first;
        margin-top: @margin-bottom;
      }
      .respondent-content {
        background-color: @g-bg-blue;
        padding: @g-padding;
        margin-top: @g-margin;
      }
      .is-delete {
        color: @font-color-four;
      }
      .comment-action {
        color: @font-color-second;
        margin-top: @margin-bottom;
      }
      .comment-textarea {
        margin-bottom: @margin-bottom;
        background-color: #fff;
        padding: 10px;
        border-radius: @g-radius;
        margin-top: 12px;
        .comment-content {
          margin-bottom: @margin-bottom;
        }
        .comment-option {
          text-align: right;
        }
      }
    }
  }
</style>
