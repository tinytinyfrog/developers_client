<template>
  <section v-if="question" ref="question" class="question-detail-content-detail">
    <div class="question-main-content">
      <h1 class="question-title">
        {{ question.title }}
      </h1>
      <div class="author-info">
        <Avatar class="question-user-header g-avatar-border" :src="question.authorAvatar" alt="Han Solo" />
        <span class="nick-name g-hover">{{ question.authorNickname }}</span>
        <g-space />
        <span><Icon type="eye" /> {{ question.views }}</span>
        <g-space />
        <span><Icon type="dashboard" /> {{ question.createAt | dateCountDown }}</span>
        <template v-if="canEdit">
          <g-space />
          <router-link class="g-main-color" :to="{path: `/draft/editor/${question.id}?t=qa`}">
            编辑
          </router-link>
          <g-space />
          <span class="g-main-color g-hover" @click="onDelFaq">
            删除
          </span>
        </template>
      </div>
      <byte-viewer
        id="byte-question-viewer-container"
        :markdown-content="question.markdownContent || question.htmlContent"
      />
      <div v-if="!isWiki && question.belongWikis.length" class="wiki-list">
        <div class="wiki-line" />
        <h3>关联知识库</h3>
        <div class="wiki-item-container">
          <div v-for="wiki in question.belongWikis" :key="wiki.wikiId" class="wiki-item g-hover" @click="$router.push(`/wiki/${wiki.wikiId}/${question.id}`)">
            <img class="wiki-headimg" :src="wiki.wikiHeadImg" alt="">
            <span>{{ wiki.wikiName }}</span>
          </div>
        </div>
      </div>
      <p class="question-tags">
        <span class="title">问题标签：</span>
        <span class="tags-line">
          <a
            v-for="(tag, index) in question.tags"
            :key="index"
            class="g-tag g-hover"
            :href="`/tag/${tag.id}?name=${encodeURIComponent(tag.name)}`"
            target="_blank"
          >{{ tag.name }}</a>
        </span>
      </p>
      <div v-if="showCurPage" class="cut-page-container">
        <span>
          <a-button v-if="prePage" type="link" @click="onNewArticle(prePage)">
            <a-icon type="left" /><span class="cur-title g-hidden-line1">{{ prePage.postsTitle }}</span>
          </a-button>
        </span>
        <span>
          <a-button v-if="nextPage" type="link" @click="onNewArticle(nextPage)">
            <span class="cur-title g-hidden-line1">{{ nextPage.postsTitle }}</span><a-icon type="right" />
          </a-button>
        </span>
      </div>
      <div class="action-container">
        <Button v-auth="{handler: onApproval}" type="primary" icon="star" :ghost="hasLike">
          {{ hasLike ? '已关注' : '关注问题' }}
        </Button>
        <Button v-auth="{handler: () => showDrawer = true}" type="primary" icon="edit">
          写回答
        </Button>
      </div>
    </div>
    <Drawer
      height="60%"
      :get-container="() => this.$refs.question"
      :drawer-style="{backgroundColor: '#f7f8fa'}"
      :header-style="{ padding: 0 }"
      :body-style="{ paddingTop: 0, height: 'calc(100% - 70px)' }"
      :visible="showDrawer"
      placement="bottom"
      @close="showDrawer = false"
    >
      <div style="max-width: 1100px; margin: 0 auto; height: 100%">
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0">
          <h3>{{ question.title }}</h3>
          <ASwitch
            checked-children="markdown"
            un-checked-children="富文本"
            :default-checked="isMarkDown"
            @change="isMarkDown = !isMarkDown"
          />
        </div>
        <RichEditor v-show="!isMarkDown" :html-content="htmlContent" @change="handleRichTextChange" />
        <ByteMarkdownEditor v-show="isMarkDown" :markdown-content="markdownContent" @change="handleMarkdownChange" />
        <div style="text-align: right;">
          <Button type="primary" :loading="cmLoading" @click="handleSubmit">
            提交回答
          </Button>
        </div>
      </div>
    </Drawer>
  </section>
</template>

<script>
import { Button, Icon, Drawer, Switch, Avatar } from 'ant-design-vue'
import ByteViewer from '@/pages/components/byte-viewer/index.vue'
import EventBus from '@/lib/event-bus'
import RichEditor from '~/pages/components/rich-editor/index.vue'
import ByteMarkdownEditor from '~/pages/components/byte-markdown-editor/index.vue'

const ASwitch = Switch

export default {
  name: 'QuestionDetailContent',
  components: {
    RichEditor,
    ByteViewer,
    Button,
    Icon,
    ASwitch,
    Avatar,
    ByteMarkdownEditor,
    Drawer
  },
  props: {
    isWiki: {
      type: Boolean,
      default: false
    },
    directoryList: {
      type: Array,
      default: () => []
    },
    question: {
      type: Object,
      default: null
    },
    menuList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    const userInfo = this.$store.state.user.userInfo
    const { isMobile } = this.$store.state.globalData
    return {
      userInfo,
      isMobile,
      menus: [],
      currentIndex: 0,
      showAdopt: false,
      approvalTotal: 0,
      hasLike: false,
      approvalList: [],
      apPageNo: 1,
      apLoading: false,
      apFinished: false,
      cmLoading: false,
      loading: false,
      showDrawer: false,
      isMarkDown: true,
      htmlContent: '<p data-we-empty-p=""><br></p>',
      errorMsg: '',
      markdownContent: '',
      articleContent: ''
    }
  },
  computed: {
    canEdit () {
      if (this.userInfo) {
        if (['ADMIN', 'SUPER_ADMIN'].includes(this.userInfo.role) || this.userInfo.id === this.question.authorId) {
          return !this.isMobile
        }
      }
      return false
    },
    showCurPage () {
      return this.menus.some(item => item.postsId === this.question.id)
    },
    prePage () {
      return this.currentIndex > 0 ? this.menus[this.currentIndex - 1] : null
    },
    nextPage () {
      return this.currentIndex < this.menus.length - 1 ? this.menus[this.currentIndex + 1] : null
    }
  },
  mounted () {
    this.getApprovalList()
    this.checkApproval()
    this.computePage()
    // this.checkAdoptHeight()
  },
  methods: {
    computePage () {
      let list = []
      this.menuList.forEach((item) => {
        list = [...list, ...item.children]
      })
      this.menus = [...list]
      list.forEach((item, index) => {
        if (item.postsId === +this.$route.params.nodeId) {
          this.currentIndex = index
        }
      })
    },
    checkAdoptHeight () {
      if (this.question.solution && this.question.solution.userId) {
        const adoptHeight = document.getElementById('best-answer-viewer-container').offsetHeight
        this.showAdopt = adoptHeight > 500
      }
    },
    handleRichTextChange (val) {
      this.htmlContent = val
    },
    handleMarkdownChange (val) {
      this.markdownContent = val
    },
    handleSubmit () {
      const commentValue = this.isMarkDown ? this.markdownContent : this.htmlContent
      if (!commentValue) {
        this.errorMsg = '评论内容不能为空哦~'
        return
      }
      this.errorMsg = ''
      this.cmLoading = true
      this.$api.createCommentByArticle({
        postsId: this.question.id,
        content: commentValue,
        replyId: ''
      }).then((res) => {
        if (res.success) {
          this.$notification.success({
            duration: 2,
            message: '提交成功'
          })
          this.showDrawer = false
          this.markdownContent = this.htmlContent = ''
          this.cmLoading = false
          EventBus.$emit('G_COMMENT_QUESTION')
          return
        }
        this.$notification.error({
          duration: 2,
          message: '提交失败：' + res.message
        })
      }).catch(() => {
        this.markdownContent = this.htmlContent = ''
        this.cmLoading = false
      })
    },
    onDelFaq () {
      const _this = this
      this.$confirm({
        title: '删除问题',
        content: '警告：删除后无法恢复。确认删除？',
        okText: '确认',
        cancelText: '取消',
        onOk () {
          _this.$api.delArticleBy(_this.question.id).then((res) => {
            const msg = res.code === 0 ? '删除成功' : '删除失败'
            _this.$notification.success({
              duration: 2,
              message: msg
            })
            if (res.code === 0) {
              location.href = '/'
            }
          })
        }
      })
    },
    onScrollApproval () {
      const a = this.$refs.approvalBox.scrollHeight
      const b = this.$refs.approvalBox.clientHeight
      const c = this.$refs.approvalBox.scrollTop
      if (a - c <= b + 10) {
        this.getApprovalList()
      }
    },
    checkApproval () {
      this.$api.checkApprovalByArticle(this.question.id).then((res) => {
        this.hasLike = res
      })
    },
    onApproval () {
      if (this.hasLike) {
        this.cancelApproval()
        return
      }
      this.createApproval()
    },
    createApproval () {
      this.$api.createApprovalByArticle(this.question.id).then((code) => {
        this.hasLike = code === 0
        this.getApprovalList(true)
      })
    },
    cancelApproval () {
      this.$api.cancelApprovalByArticle(this.question.id).then((code) => {
        if (code === 0) {
          this.hasLike = false
          this.getApprovalList(true)
        }
      })
    },
    handleDirectory (obj, directoryList) {
      const reg = /\./ig
      const pointObjLen = obj.id.match(reg).length
      directoryList.forEach((item) => {
        const pointItem = item.id.match(reg)
        const pointItemLen = pointItem ? pointItem.length : 0
        if (obj.id.includes(item.id)) {
          if (pointObjLen - pointItemLen === 1) {
            item.children.push(obj)
          } else {
            this.handleDirectory(obj, item.children)
          }
        }
      })
    },
    getApprovalList (reset = false) {
      if (reset) {
        this.apLoading = this.apFinished = false
        this.apPageNo = 1
      }
      if (this.apLoading || this.apFinished) {
        return
      }
      this.$api.getApprovalListByArticle({
        filter: this.question.id,
        pageNo: this.apPageNo
      }).then((res) => {
        this.apLoading = false
        this.approvalTotal = res.total
        this.approvalList = this.apPageNo === 1 ? res.list : [...this.approvalList, ...res.list]
        this.apFinished = res.total === this.approvalList.length
        this.apPageNo++
      }).catch(() => {
        this.apLoading = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
.question-detail-content-detail {
  /deep/.byte-markdown-editor-container {
    height: 100%;
    &>div {
      height: calc(100% - 15px);
      .bytemd {
        border: 0;
        height: 100% !important;
        z-index: 101;
      }
    }
  }
  /deep/.common-rich-editor {
    height: 100%;
    .rick-container {
      height: 100%;
      .w-e-text-container {
        height: calc(100% - 50px) !important;
        min-height: calc(100% - 50px) !important;;
      }
    }
  }
  .question-main-content {
    background-color: #fff;
    padding: @g-padding * 2 20px;
    border-radius: @g-radius;
    margin-bottom: @g-margin;
    .question-title {
      font-size: 32px;
      margin-bottom: 20px;
    }
  }
  .cut-page-container {
    display: flex;
    justify-content: space-between;
    padding-bottom: @g-padding * 3 0;
    .ant-btn-link {
      display: flex;
      align-items: center;
      padding: 0 !important;
    }
    .cur-title {
      display: inline-block;
      max-width: 320px;
    }
  }
  .wiki-list {
    border-radius: @g-radius;
    .wiki-line {
      border-top: 1px dashed @border-1-color;
      margin: 0 -@side-width;
      margin-bottom: @g-margin * 2;
    }
    .wiki-item-container {
      display: flex;
    }
    .wiki-item {
      cursor: pointer;
      margin-top: @g-margin * 2;
      background-color: @g-bg-blue;
      padding: @g-padding @g-padding * 2 @g-padding @g-padding;
      margin-right: @g-margin * 2;
      .wiki-headimg {
        width: 40px;
        height: 50px;
        border-radius: @g-radius;
      }
    }
  }
  .solution-content {
    margin: 20px 0;
    background-color: #fff;
    .solution-title {
      font-size: @font-first;
      color: @font-color-first;
      height: 60px;
      line-height: 60px;
      padding: 0 @g-padding * 2;
      border-bottom: 1px solid @border-3-color;
    }
    .solution {
      padding: @g-padding * 2;
    }
    .solution-container {
      position: relative;
      .user-info {
        margin-bottom: @g-margin * 2;
      }
    }
    .solution-user-header {
      width: 24px;
      height: 24px;
      margin-right: 10px;
    }
    .have-been-adopted {
      max-height: 500px;
      overflow: hidden;
      transition: all 1s;
    }
    .open-fold {
      max-height: none;
    }
    .action-fold {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      color: @font-color-third;
      cursor: pointer;
      height: 40px;
      font-size: @font-fifth;
      line-height: 30px;
      border-top: 1px solid @border-5-color;
      background-color: rgba(#fff, 0.9);
      .ant-btn {
        padding-right: 0;
        color: #999;
        .anticon {
          margin-left: 2px;
        }
      }
    }
  }

  .byte-viewer-container {
    margin-bottom: 20px;
    color: #000;
  }

  .author-info {
    display: flex;
    align-items: center;
    font-size: 12px;
    margin-bottom: @g-margin * 2;
    .question-user-header {
      margin-right: 10px;
    }
  }

  .question-tags {
    margin: @g-margin * 2 0;
    .title {
      font-weight: bold;
      margin-right: @g-margin;
      font-size: 16px;
    }
  }
  .action-container {
    text-align: right;
    border-top: 1px solid #f2f2f2;
    padding-top: @g-padding * 2;
  }
}
@media screen and (max-width: 1000px) {
  .question-detail-content-detail {
    padding: 0;
    .question-main-content {
      .question-title {
        font-size: 24px;
        margin-bottom: 16px;
      }
    }
    /deep/.ant-comment-nested {
      margin-left: 0 !important;
    }
    .cut-page-container {
      .cur-title {
        max-width: 150px;
      }
    }
  }
}
</style>
