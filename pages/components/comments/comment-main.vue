<template>
  <div v-if="comment" class="comment-main-container">
    <div class="comment-avator">
      <GUserPopover :user-id="comment.commentator.id">
        <Avatar
          shape="square"
          :src="comment.commentator.avatar"
          :alt="comment.commentator.nickname"
          @click="$utils.openUserCenter(comment.commentator.id)"
        />
      </GUserPopover>
    </div>
    <div class="comment-user-info">
      <div class="base-info">
        <span
          class="user-name g-hover"
          @click="$utils.openUserCenter(comment.commentator.id)"
        >{{ comment.commentator.nickname }}</span>
        <span v-if="comment.commentator.id === article.authorId">[作者]</span>
        <g-space :size="1" />
        <template v-if="comment.commentator.job">
          <span>{{ comment.commentator.job }}</span><g-space />
        </template>
        <span>{{ comment.createAt | dateCountDown }}</span>
        <a-button
          v-if="comment.id !== solutionId && isMyQuestion"
          icon="star"
          class="star-reply"
          size="small"
          type="primary"
          ghost
          @click="setBestSolution"
        >
          采纳该回答
        </a-button>
        <span v-if="comment.id === solutionId" class="comment-audit"><a-icon type="star" /> 被采纳</span>
      </div>
      <div
        ref="commentDetail"
        class="comment-detail"
        :class="{ 'reject-ct': comment.auditState === 'REJECT', 'is-delete': comment.isDelete, 'open-fold': foldType.state === 'OPEN', 'commend-border': showFold}"
      >
        <byte-viewer id="byte-question-comment-container" :markdown-content="comment.content" />
        <div v-if="showFold" class="action-fold g-hover" @click="onFold(foldType.state)">
          <Button type="link">
            {{ foldType[foldType.state].text }}
            <Icon :type=" foldType[foldType.state].iconType" />
          </Button>
        </div>
      </div>
      <div class="comment-action">
        <span class="action-item g-hover" :class="{ 'g-main-color': showReply }">
          <Icon type="message" />
          <span v-auth="{ handler: onReply, stopPrevent: true }">{{ showReply ? '取消回复' : '回复' }}</span>
        </span>
        <template v-if="isSelf && !comment.isDelete ">
          <g-space />
          <span v-auth="{ handler: () => deleteReply(comment.id) }" class="action-item g-hover">
            <Icon type="delete" />
            <span>删除</span>
          </span>
        </template>
      </div>
      <div v-show="showReply" ref="replyCtx" class="comment-textarea">
        <Textarea
          v-model="replyValue"
          auto-focus
          size="large"
          class="comment-content"
          :placeholder="`回复: ${comment.commentator.nickname}`"
          auto-size
        />
        <div class="comment-option" type="primary">
          <Button type="primary" :loading="loading" @click="onSubReply">
            发表评论
          </Button>
        </div>
      </div>
      <div class="comment-children">
        <slot :deleteReply="deleteReply" :currentLock="currentLock" :updateCurrentLock="updateCurrentLock" />
      </div>
    </div>
  </div>
</template>

<script>
import { Avatar, Input, Button, Icon } from 'ant-design-vue'
import ByteViewer from '@/pages/components/byte-viewer/index.vue'
import _get from 'lodash/get'
import EventBus from '@/lib/event-bus'
const Textarea = Input.TextArea

export default {
  name: 'CommentMain',
  components: {
    ByteViewer,
    Avatar,
    Textarea,
    Button,
    Icon
  },
  props: {
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
      replyValue: '',
      currentLock: 5,
      showFold: false,
      foldType: {
        state: 'CLOSE',
        CLOSE: {
          text: '展开更多',
          iconType: 'arrow-down'
        },
        OPEN: {
          text: '收起',
          iconType: 'arrow-up'
        }
      }
    }
  },
  computed: {
    isSelf () {
      return this.article.authorId === _get(this.$store, 'state.user.userInfo.id')
    },
    isMyQuestion () {
      return this.isSelf && _get(this, 'article.category') === 'FAQ'
    },
    solutionId () {
      return this.article?.solution?.id || ''
    }
  },
  beforeDestroy () {
    window.removeEventListener('click', this.ctxClick)
  },
  mounted () {
    window.addEventListener('click', this.ctxClick)
    if (this.$refs.commentDetail) {
      this.showFold = this.$refs.commentDetail.scrollHeight >= 500
    }
  },
  methods: {
    onFold (state) {
      this.foldType.state = state === 'CLOSE' ? 'OPEN' : 'CLOSE'
    },
    updateCurrentLock (val) {
      this.currentLock = val
    },
    setBestSolution () {
      this.$api.setBestSolution({
        faqId: this.article.id,
        commentId: this.comment.id
      }).then((res) => {
        if (res.success) {
          this.$message.success('设置成功')
          EventBus.$emit('G_UPDATE_SOLUTION')
        }
      })
    },
    deleteReply (id) {
      this.$confirm({
        title: '确认要删除当前评论吗',
        content: h => <div style="color: #606a78;">温馨提示：删除后不可恢复！</div>,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.$api.delCommentByCommentId(id).then((res) => {
            if (res.success) {
              this.$message.success('删除成功')
              if (typeof this.reloadCommentList === 'function') this.reloadCommentList()
              return
            }
            this.$message.success(res.message)
          })
        }
      })
    },
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
  .comment-main-container {
    display: flex;
    padding: 12px 0;
    margin: 0 @g-margin * 2;
    border-bottom: 1px solid @border-5-color;
    &:last-child {
      border: 0;
    }
    .comment-avator {
      margin-right: @margin-bottom;
    }
    &:hover {
      .comment-user-info {
        .base-info {
          .star-reply {
            display: inline-block;
            position: absolute;
            right: 0;
          }
        }
      }
    }
    .comment-user-info {
      width: calc(100% - 42px);
      .base-info {
        position: relative;
        color: @font-color-second;
        margin-top: 5px;
        .user-name {
          color: @font-color-first;
          font-weight: bold;
        }
        .star-reply {
          display: none;
        }
        .comment-audit {
          position: absolute;
          right: -@g-padding * 2 + 1;
          top: -@g-padding * 2 - 1;
          cursor: pointer;
          margin-left: @g-margin * 2;
          padding: 2px 8px;
          border-bottom-left-radius: 15px;
          border-top-left-radius: 15px;
          background-color: #fcb90e;
          color: #fff;
        }
      }
      .comment-detail {
        position: relative;
        color: @font-color-first;
        margin-top: @g-margin;
        max-height: 500px;
        overflow-y: hidden;
        transition: all 0.3s;
      }
      .commend-border {
        padding-bottom: 20px;
      }
      .open-fold {
        max-height: none;
      }
      .action-fold {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        color: @font-color-third;
        cursor: pointer;
        min-height: 30px;
        font-size: @font-fifth;
        line-height: 30px;
        padding-right: @g-padding;
        background-color: rgba(#fff, 0.9);
        .ant-btn {
          padding-right: 0;
          color: @g-main-color;
          .anticon {
            margin-left: 2px;
          }
        }
      }
      .reject-ct {
        #byte-question-comment-container {
          color: @font-color-third !important;
        }
      }
      .is-delete {
        /deep/.markdown-body > P {
          color: @font-color-four !important;
          font-size: 13px;
        }
      }
      .comment-action {
        color: @font-color-second;
        margin-top: @margin-bottom;
      }
      .comment-textarea {
        margin-top: @margin-bottom;
        background-color: @g-bg-grey;
        padding: 10px;
        border-radius: @g-radius;
        .comment-content {
          margin-bottom: @margin-bottom;
        }
        .comment-option {
          text-align: right;
        }
      }
      .comment-children {
        background-color: @g-bg-grey;
        border-radius: @g-radius;
        padding: 0 12px;
      }
    }
  }
</style>
