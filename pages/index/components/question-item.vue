<template>
  <div class="home-question-item">
    <div class="question-item" @click="onNative(`/faq/${question.id}`)">
      <div class="other-msg">
        <p class="vice-title-message">
          <GUserPopover :user-id="question.authorId">
            <Avatar class="user-header g-avatar-border" size="small" :src="question.authorAvatar" alt="Han Solo" @click="$utils.openUserCenter(question.authorId)" />
          </GUserPopover>
          <span class="question-user-name g-hover" @click.stop.prevent="$utils.openUserCenter(question.authorId)">{{ question.authorNickname }}</span><g-space />
          <span class="question-time">{{ question.createAt | dateCountDown }}</span>
          <span class="question-tags-box">
            <g-space />
            <span
              v-for="(item, index) in question.tags"
              :key="index"
              question-content
              g-hidden-line2
              class="g-tag g-hover"
              @click.stop.prevent="handleTagSearch(item)"
            >{{ item.name }}</span>
          </span>
        </p>
      </div>
      <div class="title-line">
        <span v-if="question.solution" class="question-finished show-pc">
          {{ question.solutionDesc }}
        </span>
        <h2 class="title g-hover">
          {{ question.title }}
          <span v-if="question.solution" class="question-finished show-mobile">
            {{ question.solutionDesc }}
          </span>
        </h2>
      </div>
      <p v-dompurify-html="question.introduction.replace(textReg, '').slice(0, 200)" class="question-content g-hidden-line2" />
      <div v-if="question.solution" class="solution-answer">
        <span class="base-answer">最佳回答：</span>
        <p class="solution-content g-hidden-line2">
          {{ question.solution.content }}
        </p>
      </div>
      <div class="question-operation">
        <span class="operation-item">
          <Icon class="operation-icon g-hover" type="eye" /> {{ question.views }}
        </span>
        <g-space />
        <span class="operation-item" @click.stop.prevent="openFaqByComment(question.id)">
          <Icon class="operation-icon g-hover" type="message" />{{ question.comments }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon, Avatar } from 'ant-design-vue'
// import ByteViewer from '@/pages/components/byte-viewer/index.vue'
export default {
  name: 'PageQuestionItem',
  components: {
    Icon, Avatar
  },
  props: {
    question: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      textReg: /[#.*|-|>|[x\]|-]/ig
    }
  },
  computed: {
    headImg () {
      if (!this.question.headImg) {
        return
      }
      return JSON.parse(this.question.headImg)[0].url
    }
  },
  methods: {
    handleTagSearch ({ id, name }) {
      window.open(`/tag/${id}?name=${encodeURIComponent(name)}`, '_blank')
    },
    openFaqByComment (id) {
      window.open(`/faq/${id}#faq-comment`, '_blank')
    },
    onNative (url) {
      this.$utils.openNewWindow(url, this.question.title)
    }
  }
}
</script>

<style lang="less" scoped>
  .home-question-item {
    display: flex;
    align-items: center;
    min-height: 100px;
    cursor: pointer;
    padding: @g-padding * 2;
    border-bottom: 1px solid @border-3-color;
    background-color: #fff;
    .question-content {
      color: @font-color-second;
      font-size: @font-fourth;
      line-height: 28px;
      word-break: break-all;
      margin-bottom: @g-margin;
    }
    &:hover {
      background-color: @g-hover-blue;
      .solution-answer {
        background-color: @g-hover-blue !important;
      }
    }
    &:last-child {
      border: 0;
    }
    .question-item {
      width: 100%;
      color: @font-color-second;
      .title-line {
        display: flex;
        align-items: center;
        margin-bottom: @g-margin;
        .question-finished {
          word-break: keep-all;
          font-weight: bold;
          display: inline-block;
          margin-right: @g-margin;
          font-size: @font-fourth;
          color: @g-main-color;
          border-radius: @g-radius;
          background-color: @g-bg-blue;
          padding: 2px 10px;
          border: 1px solid @border-3-color;
        }
        .show-mobile {
          display: none;
        }
      }
      .other-msg {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
      }
      .title {
        color: @font-color-first;
        margin-bottom: 0;
        font-size: @font-first;
        font-weight: bold;
        margin-right: 15px;
      }
      .user-header {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
      .vice-title-message {
        display: flex;
        align-items: center;
        color: @font-color-second;
        font-size: @font-fifth;
        margin-bottom: 0;
      }
      .question-operation {
        display: flex;
        align-items: center;
        font-size: @font-fifth;
        color: @font-color-third;
        .operation-item {
          display: flex;
          align-items: center;
        }
        .operation-icon {
          margin-right: 4px;
          font-size: @font-third;
        }
      }
      .solution-answer {
        margin: @g-margin 0;
        padding: @g-padding;
        border-radius: @g-radius;
        background-color: #f9fafa;
      }
      .solution-content {
        color: @font-color-second;
        padding-top: 5px;
        margin-bottom: 0;
      }
    }
  }
  @media screen and (max-width: 1000px) {
    .home-question-item {
      padding: 10px 16px;
      .question-item {
        .title {
          color: #1d2129;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 0;
        }
        .other-msg, .question-content {
          margin-bottom: 10px;
        }
        .title-line {
          margin-bottom: 5px;
        }
        .question-operation {
          display: flex;
          align-items: center;
          font-size: 10px;
        }
      }
      .show-pc {
        display: none !important;
      }

      .solution-answer {
        display: none;
      }

      .question-finished {
        margin-left: 10px;
        font-size: 10px;
        padding: 0 6px !important;
      }
      .show-mobile {
        display: inline-block !important;
      }

      .question-tags-box {
        display: none;
      }
    }
  }
</style>
