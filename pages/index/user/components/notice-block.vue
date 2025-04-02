<template>
  <div v-if="info" class="cm-page-notice-block g-flex-between" @click="handleNotice(info)">
    <div class="g-flex-between">
      <img class="user-header" :src="info.senderAvatar" alt="">
      <div>
        <p class="user-nickname">
          <span class="nickname g-hover" @click.prevent.stop="$utils.openUserCenter(info.sender)">{{ info.senderName }}</span>
          <span class="notice-action">{{ noticeMap[message.type] }}</span>
          <span v-if="info.type !== 'FOLLOW_USER'" class="nickname g-hover">{{ info.title }}</span>
        </p>
        <p class="msg-time">
          <Icon type="dashboard" />
          <span>{{ info.createAt | formatDate }}</span>
        </p>
      </div>
    </div>
    <Button v-if="info.read === 'NO'" class="read-btn" type="link" @click.stop.prevent="onMarkRead">
      标记为已读
    </Button>
    <span v-if="info.read === 'NO'" class="notice-point" />
  </div>
</template>
<script>
import EventBus from '@/lib/event-bus'
import { Icon, Button } from 'ant-design-vue'
export default {
  name: 'CmPageNoticeBlock',
  components: {
    Icon,
    Button
  },
  props: {
    message: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      info: this.message,
      noticeMap: {
        FOLLOW_USER: '关注了你',
        COMMENT_FAQ: '评论了',
        APPROVAL_FAQ: '点赞了',
        COMMENT_ARTICLE: '评论了',
        APPROVAL_ARTICLE: '点赞了'
      }
    }
  },
  methods: {
    handleNotice (message) {
      this.$emit('mark', message)
      if (['COMMENT_ARTICLE', 'APPROVAL_ARTICLE'].includes(message.type)) {
        window.open(`/article/${message.infoId}`, '_blank')
      }
      if (['COMMENT_FAQ', 'APPROVAL_FAQ'].includes(message.type)) {
        window.open(`/faq/${message.infoId}`, '_blank')
      }
    },
    async onMarkRead () {
      const res = await this.$api.markMessageState(this.info.id)
      if (res.success) {
        this.info.read = 'YES'
        EventBus.$emit('G_UPDATE_MSG_COUNT')
      } else {
        this.$message.error(res.message)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.cm-page-notice-block {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #f2f2f2;
  padding: 10px;
  border-radius: @g-radius;
  margin-bottom: @g-margin * 2;
  cursor: pointer;
  .read-btn {
    display: none;
  }
  &:hover {
    background-color: @g-bg-blue;
    .read-btn {
      display: inline-block;
    }
  }
  .user-header {
    width: 45px;
    height: 45px;
    border-radius: @g-radius;
    margin-right: @g-margin * 2;
  }
  .nickname {
    color: @font-color-second;
    font-weight: bold;
  }
  .notice-action {
    color: @g-main-color;
  }
  p {
    margin: 0;
  }
  .user-nickname {
    margin-bottom: 4px;
  }
  .msg-time {
    font-size:12px;
  }
  .notice-point {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: red;
  }
}
@media screen and (max-width: 1000px) {
  .cm-page-notice-block {
    margin-bottom: 10px;
  }
}
</style>
