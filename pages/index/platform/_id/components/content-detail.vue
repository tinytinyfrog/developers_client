<template>
  <section v-if="article" class="library-detail-content-detail">
    <h1 class="article-title">
      {{ article.title }}
    </h1>
    <div class="author-info">
      <Avatar
        class="g-avatar-border"
        :src="article.authorAvatar"
        :alt="article.authorNickname"
        @click.stop.prevent="$utils.openNewWindow(`/user/${article.authorId}`)"
      />
      <span class="nick-name g-hover" @click.stop.prevent="$utils.openNewWindow(`/user/${article.authorId}`)">{{ article.authorNickname }}</span><g-space />
      <span><Icon type="eye" /> {{ article.views }}</span><g-space />
      <span><Icon type="dashboard" /> {{ article.createAt | formatDate('YYYY-MM-DD') }}</span>
      <template v-if="canEdit && !isWiki && !isMobile">
        <g-space />
        <router-link class="g-main-color" :to="{path: `/draft/editor/${article.id}?t=article`}">
          编辑
        </router-link>
        <g-space />
        <span class="g-main-color g-hover" @click="onDelArticle">
          删除
        </span>
      </template>
    </div>
    <byte-viewer id="byte-article-viewer-container" :markdown-content="articleCtx" />
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
    <div v-if="!isWiki && article.belongWikis.length" class="wiki-list">
      <div class="wiki-line" />
      <h3>关联知识库</h3>
      <div class="wiki-item-container">
        <div v-for="wiki in article.belongWikis" :key="wiki.wikiId" class="wiki-item g-hover" @click="$router.push(`/wiki/${wiki.wikiId}/${article.id}`)">
          <img class="wiki-headimg" :src="wiki.wikiHeadImg" alt="">
          <span>{{ wiki.wikiName }}</span>
        </div>
      </div>
    </div>
    <div v-if="!isWiki" class="tags-line">
      <span class="tag-title">文章标签：</span>
      <a
        v-for="(tag, index) in article.tags"
        :key="index"
        class="g-tag g-hover"
        :href="`/tag/${tag.id}?name=${encodeURIComponent(tag.name)}`"
        target="_blank"
      >{{ tag.name }}</a>
    </div>
    <div v-if="!isWiki" class="article-difficulty">
      <span class="difficulty-title">推荐指数：</span>
      <Rate :default-value="rateNum" allow-half @change="setArticleScore" />
    </div>
    <div v-if="article.originalTitle" class="reprint-statement">
      <h3 class="reprint-title">
        转载声明：
      </h3>
      <p v-if="article.originalAuthor">
        原作者： <b>{{ article.originalAuthor }}</b>
      </p>
      <p>转载自: <a :href="article.originalUrl" target="_blank">《{{ article.originalTitle }}》</a>，如有侵权，请联系本站删除。 </p>
    </div>
    <div v-if="!(isWiki && article.solution)" class="article-heart" :class="{'has-like': hasLike}">
      <div v-auth="{handler: onApproval}" class="praise-box">
        <Icon type="like" :theme="hasLike ? 'filled' : 'outlined'" />
      </div>
      <p class="approval-tips-line">
        {{ approvalTotal > 0 ? `${approvalTotal}人已点赞` : '真诚点赞 诚不我欺' }}
      </p>
      <div class="approval-box">
        <template v-for="(user, index) in approvalList.slice(0, 6)">
          <GUserPopover :key="index" class="approval-img" :user-id="user.userId">
            <img
              :src="user.userAvatar"
              alt=""
              @click="$utils.openNewWindow(`/user/${user.userId}`)"
            >
          </GUserPopover>
        </template>
        <Popover placement="leftBottom">
          <template slot="content">
            <div ref="approvalBox" style="height: 250px; width: 240px; overflow: auto; scrollbar-width: none; cursor: pointer;" @scroll="onScrollApproval">
              <p v-for="(user, index) in approvalList" :key="index" class="approval-user-item" style="display: flex; align-items: center; height: 30px; justify-content: space-between; margin-bottom: 15px;">
                <span>
                  <GUserPopover :key="index" :user-id="user.userId">
                    <img
                      style="width: 30px; height: 30px; border-radius: 50%; margin-right: 15px;"
                      :src="user.userAvatar"
                      alt=""
                    >
                  </GUserPopover>
                  <span class="g-hover">{{ user.userName }}</span>
                </span>
                <span style="color: #999">{{ user.createAt | formatDate('YYYY-MM-DD') }}</span>
              </p>
            </div>
          </template>
          <span v-if="approvalTotal > 5" class="approval-img">···</span>
        </Popover>
      </div>
    </div>
    <Affix v-if="!showMobileMenu" :offset-bottom="0">
      <div id="collect-mark-box" class="article-action-box">
        <h3 v-if="!isMobile && !hideHeader" class="min-title g-hidden-line1">
          {{ article.title }}
        </h3>
        <span v-auth="{handler: onApproval}" :class="{ 'g-main-color': hasLike }" class="action-box g-hover">
          <Icon class="action-btn" :theme="hasLike ? 'filled' : 'outlined'" type="like" two-tone-color="#004fc4" />
          <span>{{ hasLike ? '已' : '' }}点赞</span>
        </span>
        <template>
          <span v-if="hasCollect || !userInfo" v-auth="{ handler: delArticleForCollect }" :class="{ 'g-main-color': hasCollect }" class="action-box g-hover">
            <Icon class="action-btn" :theme="!userInfo ? 'outlined' : 'filled'" type="star" />
            <span>{{ hasCollect ? '已' : '' }}收藏</span>
          </span>
          <CollectMark v-else :id="article.id" container="collect-mark-box" @on-success="hasCollect = true">
            <span class="action-box g-hover" :class="{ 'g-main-color': hasCollect }">
              <Icon class="action-btn" theme="outlined" type="star" two-tone-color="#004fc4" />
              <span>{{ hasCollect ? '已' : '' }}收藏</span>
            </span>
          </CollectMark>
        </template>
        <span v-auth="{handler: onComment}" class="action-box g-hover">
          <Icon class="action-btn" theme="outlined" type="message" two-tone-color="#004fc4" />
          <span>评论</span>
        </span>
      </div>
    </Affix>
  </section>
</template>

<script>
import { Popover, Icon, Avatar, Rate, Affix } from 'ant-design-vue'
import ByteViewer from '@/pages/components/byte-viewer/index.vue'
import { generateDirectory } from '@/lib/utils'
import EventBus from '@/lib/event-bus'
import CollectMark from '../../../components/collect-mark'

export default {
  name: 'LibraryDetailContent',
  components: {
    ByteViewer,
    Popover,
    Icon,
    Avatar,
    Rate,
    CollectMark,
    Affix
  },
  props: {
    isWiki: {
      type: Boolean,
      default: false
    },
    menuList: {
      type: Array,
      default: () => []
    },
    directoryList: {
      type: Array,
      default: () => []
    },
    article: {
      type: Object,
      default: null
    },
    showMobileMenu: {
      type: Boolean,
      default: false
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
      hideHeader: false,
      approvalTotal: 0,
      loading: false,
      hasLike: false,
      hasCollect: false,
      approvalList: [],
      apPageNo: 1,
      apLoading: false,
      apFinished: false,
      articleContent: '',
      rateNum: this.article?.difficultyScore / 100
    }
  },
  computed: {
    canEdit () {
      if (this.userInfo) {
        if (['ADMIN', 'SUPER_ADMIN'].includes(this.userInfo.role) || this.userInfo.id === this.article.authorId) {
          return true
        }
      }
      return false
    },
    articleCtx () {
      return this.article.markdownContent || this.article.htmlContent
    },
    showCurPage () {
      return this.menus.some(item => item.postsId === this.article.id)
    },
    prePage () {
      return this.currentIndex > 0 ? this.menus[this.currentIndex - 1] : null
    },
    nextPage () {
      return this.currentIndex < this.menus.length - 1 ? this.menus[this.currentIndex + 1] : null
    }
  },
  mounted () {
    this.generateDirectory()
    this.checkApproval()
    this.getApprovalList()
    this.getCollectStatus()
    this.computePage()
    EventBus.$on('G_HEADER_STATE', (state) => {
      this.hideHeader = state
    })
    if (location.hash) {
      setTimeout(() => {
        location.href = location.hash
      })
    }
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
    onNewArticle (page) {
      const { id: wikiId } = this.$route.params
      this.$router.push(`/wiki/${wikiId}/${page.postsId}`)
    },
    onComment () {
      location.href = '#article-comment'
      setTimeout(() => {
        location.href = '#article-comment'
      })
    },
    setArticleScore (score) {
      this.$confirm({
        title: `为该文章设置推荐指数：${score}星 ？`,
        content: '推荐指数：通过对每个人的推荐得分综合算出平均值，供大家参考。',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.updateScore(score)
        },
        onCancel () {}
      })
    },
    updateScore (score) {
      this.$api.setArticleScore({
        postsId: this.article.id,
        difficultyScore: score * 100
      }).then((res) => {
        if (res.success) {
          this.$message.success('评级成功')
          return
        }
        this.$message.error(res.message)
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
      this.$api.checkApprovalByArticle(this.article.id).then((res) => {
        this.hasLike = res
      })
    },
    onDelArticle () {
      const _this = this
      this.$confirm({
        title: '删除文章',
        content: '警告：删除后无法恢复。确认删除？',
        okText: '确认',
        cancelText: '取消',
        onOk () {
          _this.$api.delArticleBy(_this.article.id).then((res) => {
            const msg = res.code === 0 ? '删除成功' : res.message
            _this.$notification.success({
              duration: 2,
              message: msg
            })
            if (res.code === 0) { location.href = '/' }
          })
        }
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
      this.$api.createApprovalByArticle(this.article.id).then((code) => {
        this.hasLike = code === 0
        this.getApprovalList(true)
      })
    },
    cancelApproval () {
      this.$api.cancelApprovalByArticle(this.article.id).then((code) => {
        if (code === 0) {
          this.hasLike = false
          this.getApprovalList(true)
        }
      })
    },
    async getCollectStatus () {
      this.hasCollect = await this.$api.getCollectStatus(this.article.id)
    },
    async delArticleForCollect () {
      const state = await this.$api.delArticleForCollect({
        postsId: this.article.id
      })
      if (state) {
        this.$message.success({
          duration: 2,
          content: '取消成功'
        })
        this.hasCollect = false
      } else {
        this.$message.error({
          duration: 2,
          content: '取消收藏失败'
        })
      }
    },
    generateDirectory () {
      const el = document.getElementById('byte-article-viewer-container')
      const directoryList = generateDirectory(el)
      if (!this.article.directory) {
        this.$emit('update:directoryList', directoryList)
      }
    },
    getApprovalList (reset = false) {
      if (reset) {
        this.apLoading = this.apFinished = false
        this.apPageNo = 1
      }
      if (this.apLoading || this.apFinished) { return }
      this.apLoading = true
      this.$api.getApprovalListByArticle({
        filter: this.article.id,
        pageNo: this.apPageNo
      }).then((res) => {
        this.apLoading = false
        this.approvalTotal = res.total
        this.approvalList = this.apPageNo === 1 ? [...res.list] : [...res.list, ...this.approvalList]
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
.library-detail-content-detail {
  background-color: #fff;
  padding: @g-padding * 2 @side-width 0;
  border-radius: @g-radius;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  margin-bottom: @g-padding * 2;
  .article-title {
    font-size: 32px;
    margin-bottom: 20px;
  }
  .ant-avatar-image {
    margin-right: @g-margin;
  }
  .author-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    color: @font-color-third;
    font-size: @font-fourth;
    .nick-name {
      cursor: pointer;
    }
    .folow-btn {
      width: 80px;
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
  .tags-line, .article-difficulty {
    margin-top: @g-margin * 2;
    .tag-title, .difficulty-title{
      font-weight: bold;
      margin-right: @g-margin;
      font-size: 16px;
    }
  }
  .reprint-statement {
    padding: @g-padding * 2 22px;
    background-color: @g-bg-blue;
    color: @font-color-second;
    margin: 0 -@side-width;
    margin-top: 30px;
    .reprint-title {
      margin-bottom: 10px;
    }
    p {
      margin-bottom: 6px;
      &:last-child {
        margin: 0;
      }
    }
  }
  .article-heart {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
    margin-top: 30px;
    .praise-box {
      font-size: 30px;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      border-radius: 30px;
      cursor: pointer;
      border: 1px solid @font-color-third;
      color: @font-color-third;
      margin-bottom: @g-margin;
    }
    .approval-tips-line {
      position: relative;
      margin-bottom: @g-margin * 2;
      &::before {
        content: "";
        position: absolute;
        top: 10px;
        left: -115px;
        height: 2px;
        width: 105px;
        background: linear-gradient(to left, @g-main-color, #fff);
      }
      &::after {
        content: "";
        position: absolute;
        top: 10px;
        right: -115px;
        height: 2px;
        width: 105px;
        background: linear-gradient(to right, @g-main-color, #fff);
      }
    }
    .approval-img {
      display: inline-block;
      width: 25px;
      height: 25px;
      margin-right: @g-margin;
      border-radius: 50%;
      cursor: pointer;
      text-align: center;
      border: 1px solid @border-5-color;
      &:last-child {
        margin-right: 0;
      }
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
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
  .has-like {
    .praise-box {
      border: 1px solid @g-main-color;
      color: @g-main-color;
    }
  }
  .ant-affix {
    .article-action-box {
      box-shadow: 0 -5px 8px 5px @g-bg-blue;
    }
  }
  .article-action-box {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 @side-width;
    height: @title-height - 6px;
    background-color: #fff;
    z-index: 10;
    margin: 0 -20px;
    border-top: 1px solid @g-bg-blue;
    .min-title {
      flex: 1;
      text-align: left;
      margin-bottom: 0;
      color: @font-color-second;
      margin-right: @g-margin * 2;
    }
    .action-box {
      display: inline-block;
      padding: 6px 12px;
      margin-left: 20px;
      border-radius: @g-radius;
      background-color: @g-bg-blue;
    }
    .action-btn {
      font-size: 16px;
      font-weight: bold;
      margin-right: 4px;
    }
  }
}
@media screen and (max-width: 1000px) {
  .library-detail-content-detail {
    padding: @g-margin * 2 @g-margin * 2 0;
    width: 100vw;
    .article-title {
      font-size: 24px;
      margini-bottom: 16px;
    }
    .article-heart {
      display: none;
    }
    .tags-line, .article-difficulty, .reprint-statement {
      margin-top: 15px;
      .tag-title, .difficulty-title{
        font-size: 16px;
      }
    }
    .ant-affix {
      .article-action-box {
        margin-top: 0;
      }
    }
    .article-action-box {
      width: 100vw;
      height: inherit;
      min-height: 40px;
      padding-top: 10px;
      padding-bottom: 15px;
      margin: 0 -@g-margin * 2;
      margin-top: @g-margin * 2;
      .action-box {
        padding: 3px 8px;
        margin-left: 20px;
      }
      .action-btn {
        font-size: 14px;
      }
    }
    .cut-page-container {
      .cur-title {
        max-width: 150px;
      }
    }
  }
}
</style>
