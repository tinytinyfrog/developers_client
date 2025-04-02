<template>
  <div v-if="userInfo" v-infinite-scroll="handleInfiniteScroll" class="page-user-container g-margin-top">
    <div class="page-user-info">
      <UserInfoBg />
      <div class="user-info-content">
        <div class="user-header-box">
          <img class="user-header g-avatar-border" :src="userInfo.avatar" :alt="userInfo.nickname">
        </div>
        <div class="user-info-detail">
          <div class="g-display-flex user-info-intro">
            <h2 class="user-nickname">
              {{ userInfo.nickname }} <span class="level-sup">LV{{ userInfo.level }}</span>
            </h2>
            <div class="user-info-item-box">
              <p class="user-info-item">
                <span class="info-item-line">
                  <span class="user-info-item-label">
                    <span>加</span>
                    <span>入</span>
                    <span>时</span>
                    <span>间</span>
                  </span>：
                  <span>{{ userInfo.createAt | formatDate('YYYY年MM月DD日') }}</span>
                </span>
                <span class="info-item-line">
                  <span class="user-info-item-label">
                    <span>职</span>
                    <span>业</span>
                  </span>：
                  <span>{{ userInfo.job || '划水专员' }}</span>
                </span>
              </p>
              <p class="user-info-item">
                <span class="info-item-line signature-line">
                  <span class="user-info-item-label">
                    <span>个</span>
                    <span>人</span>
                    <span>简</span>
                    <span>介</span>
                  </span>：
                  <span class="user-signature">{{ userInfo.signature ? userInfo.signature : '这个人太懒了~' }}</span>
                </span>
              </p>
            </div>
          </div>
          <template>
            <Button
              v-if="oneSelf && !isMobile"
              class="user-info-edit-btn"
              type="primary"
              icon="edit"
              ghost
              @click="$router.push('/user/setting/profile')"
            >
              编辑
            </Button>
            <Button
              v-else
              v-auth="{handler: onFollowUser }"
              class="user-info-edit-btn"
              type="primary"
              :ghost="hasFollow"
              :loading="followLoading"
            >
              {{ hasFollow ? '已关注' : '关注' }}
            </Button>
          </template>
        </div>
      </div>
    </div>
    <div class="page-user-dynamic">
      <div class="dynamic-content">
        <Tabs :default-active-key="tabIndex" @change="taCallback">
          <TabPane key="article" class="tabs-content" force-render>
            <span slot="tab">
              <span>文章</span>
              <span class="achievement-num">{{ userInfo.articleNumb }}</span>
            </span>
            <ArticleItem v-for="(item, index) in articleList" :key="index" :article="item" />
            <g-empty :list="articleList" :finished="articleFinished" :loading="articleLoading" />
          </TabPane>
          <TabPane key="qa">
            <span slot="tab">
              <span>QA</span>
              <span class="achievement-num">{{ userInfo.faqNumb }}</span>
            </span>
            <QuestionItem v-for="(item, index) in questionList" :key="index" :question="item" />
            <g-empty :list="questionList" :finished="qFinished" :loading="qLoading" />
          </TabPane>
          <TabPane v-if="oneSelf" key="message" tab="通知">
            <notice-block v-for="(item, index) in messageList" :key="index" :message.sync="item" @mark="handleMark" />
            <g-empty :list="messageList" :finished="mFinished" :loading="mLoading" />
          </TabPane>
          <TabPane v-if="oneSelf" key="collect" tab="收藏">
            <div class="collection-list">
              <div
                v-for="(item, index) in collections"
                :key="index"
                class="collection-item g-bg-hover"
                @click="goCollection(item)"
              >
                <span>
                  <span>{{ item.name }}</span>
                  <span class="collection-num"> · {{ item.refCount }}篇</span>
                </span>
                <span>
                  <!--                  <Button class="collect-btn" type="link" icon="edit" @click.stop.prevent="isCollectEdit = true" />-->
                  <Button
                    class="collect-btn"
                    type="link"
                    icon="delete"
                    @click.stop.prevent="delCollect(item.collectId)"
                  />
                </span>
              </div>
            </div>
            <Empty v-if="!collections.length" :description="false" />
          </TabPane>
          <TabPane v-if="oneSelf" key="dynamic" tab="动态">
            <MyDynamic />
          </TabPane>
        </Tabs>
      </div>
      <GSidebar>
        <GSidebar title="Ta的成就" background-color="#fff">
          <div class="my-achievement">
            <p class="achievement-box">
              <Icon class="item-msg-icon" type="crown" />
              <span class="achievement-item">等级</span>：
              <span class="text-num">LV{{ userInfo.level }}</span>
            </p>
            <p class="achievement-box">
              <Icon class="item-msg-icon" type="heart" />
              <span class="achievement-item">获赞</span>：
              <span class="text-num">{{ userInfo.approvalNumb }}</span>
            </p>
            <p class="achievement-box">
              <Icon class="item-msg-icon" type="fire" />
              <span class="achievement-item">经验值</span>：
              <span class="text-num">{{ userInfo.experience }}</span>
            </p>
          </div>
        </GSidebar>
        <slider-box :slider-data="follower" />
        <slider-box :slider-data="fans" />
      </GSidebar>
    </div>
  </div>
</template>

<script>
import { Button, Tabs, Empty, Icon } from 'ant-design-vue'
import SliderBox from '@/pages/components/slider-box'
import EventBus from '@/lib/event-bus'
import ArticleItem from '../components/article-item.vue'
import QuestionItem from '../components/question-item.vue'
import { replaceUrlByQuery } from '../../../lib/utils'
import MyDynamic from './components/my-dynamic'
import NoticeBlock from './components/notice-block.vue'
import UserInfoBg from './components/user-info-bg'

const TabPane = Tabs.TabPane

export default {
  name: 'PageUserCenter',
  components: {
    SliderBox,
    ArticleItem,
    QuestionItem,
    NoticeBlock,
    Button,
    Tabs,
    Icon,
    TabPane,
    Empty,
    MyDynamic,
    UserInfoBg
  },
  async asyncData ({ store, route, redirect, $api }) {
    let userInfo = store.state.user.userInfo
    const userId = +route.params.id
    const tabIndex = route.query.tab || 'article'
    try {
      // 是否为自己
      const oneSelf = !userId || userId === userInfo?.id
      if (userId && userId !== userInfo?.id) {
        userInfo = await $api.getUserInfoById(userId)
      }
      if (!userInfo) {
        return redirect('/')
      }
      const res1 = await $api.getFollowUsers(userInfo.id)
      const fList = res1?.list || []
      const followerNum = res1?.total || 0
      fList.forEach((item) => {
        item.path = `/user/${item.id}`
      })
      const res2 = await $api.getUserFans(userInfo.id)
      const fansList = res2?.list || []
      const fansNum = res2?.total || 0
      fansList.forEach((item) => {
        item.path = `/user/${item.id}`
      })

      let hasFollow = false
      await $api.checkFollowUserById(userInfo.id).then((res) => {
        hasFollow = !!res?.data
      })
      return {
        title: '用户主页',
        oneSelf,
        tabIndex,
        hasFollow,
        isCollectEdit: false,
        currentTabKey: tabIndex,
        follower: {
          title: 'Ta关注的人',
          path: '/a/b',
          total: followerNum,
          list: fList
        },
        fans: {
          title: '关注Ta的人',
          path: '/a/b',
          total: fansNum,
          list: fansList
        },
        userId,
        userInfo
      }
    } catch (e) {
      return redirect('/')
    }
  },
  data () {
    const { isMobile } = this.$store.state.globalData
    return {
      isMobile,
      followLoading: false,
      articleLoading: false,
      articleFinished: false,
      articlePageNo: 1,
      articlePageSize: 15,
      qLoading: false,
      qFinished: false,
      qPageNo: 1,
      qPageSize: 15,
      mLoading: false,
      mFinished: false,
      mPageNo: 1,
      mPageSize: 15,
      eLoading: false,
      eFinished: false,
      ePageNo: 1,
      ePageSize: 15,
      evaluationList: [],
      userInfo: this.$store.state.user.userInfo,
      articleList: [],
      questionList: [],
      messageList: [],
      fileList: [],
      collections: []
    }
  },
  mounted () {
    this.getArticleList()
    this.getQuestionList()
    this.getMessageList()
    this.getCollectList()
    EventBus.$on('G_MSG_ITEM_COUNT', () => {
      this.mPageNo = 1
      this.mFinished = false
      this.messageList = []
      this.getMessageList()
    })
  },
  beforeDestroy () {
    EventBus.$off('G_MSG_ITEM_COUNT')
  },
  activated () {
    if (this.userId) return
    this.$store.dispatch('user/getUserInfo', {
      $api: this.$api,
      clear: true
    }).then((res) => {
      this.userInfo = this.$store.state.user.userInfo
    })
  },
  methods: {
    goCollection (item) {
      if (this.isCollectEdit) return
      this.$utils.openNewWindow(`/collect/${item.collectId}?name=${item.name}`)
    },
    handleMark (message) {
      this.$api.markMessageState(message.id).then((res) => {
        if (res.success) {
          message.read = 'YES'
          EventBus.$emit('G_UPDATE_MSG_COUNT')
        }
      })
    },
    onFollowUser () {
      this.followLoading = true
      const authorId = this.userInfo.id
      try {
        if (this.hasFollow) {
          this.$api.unFollowUserById(authorId).then((res) => {
            if (res.code === 0) {
              this.hasFollow = this.followLoading = false
            }
          })
          return
        }
        this.$api.followUserById(authorId).then((res) => {
          if (res.code === 0) {
            this.hasFollow = true
            this.followLoading = false
          }
        })
      } catch (e) {
        this.followLoading = false
      }
    },
    taCallback (tab) {
      replaceUrlByQuery({ tab })
      this.currentTabKey = tab
    },
    handleInfiniteScroll () {
      if (['dynamic'].includes(this.currentTabKey)) {
        EventBus.$emit('G_USER_DYNAMIC')
        return
      }
      const loadMap = {
        article: 'getArticleList',
        qa: 'getQuestionList',
        message: 'getMessageList',
        collect: 'getCollectList'
      }
      this[loadMap[this.currentTabKey]]()
    },
    getArticleList () {
      if (this.articleLoading || this.articleFinished) { return }
      this.articleLoading = true
      this.$api.getTopicList({
        filter: {
          category: 'ARTICLE',
          userId: this.userInfo.id
        },
        pageNo: this.articlePageNo,
        pageSize: this.articlePageSize
      }).then((list) => {
        if (list) {
          this.articleList = [...this.articleList, ...list]
          this.articlePageNo++
          this.articleFinished = list.length < this.articlePageSize
        }
      }).finally(() => {
        this.articleLoading = false
      })
    },
    getQuestionList () {
      if (this.qLoading || this.qFinished) { return }
      this.qLoading = true
      this.$api.getTopicList({
        pageNo: this.qPageNo,
        pageSize: this.qPageSize,
        filter: {
          userId: this.userInfo.id,
          category: 'FAQ'
        }
      }).then((list) => {
        this.questionList = [...this.questionList, ...list]
        this.qPageNo++
        this.qFinished = list.length < this.qPageSize
      }).finally(() => {
        this.qLoading = false
      })
    },
    getMessageList () {
      if (!this.oneSelf) { return }
      if (this.mLoading || this.mFinished) { return }
      this.mLoading = true
      this.$api.getMessageList({
        userId: this.userInfo.id,
        pageNo: this.mPageNo,
        pageSize: this.mPageSize
      }).then((list) => {
        this.mPageNo++
        this.messageList = this.mPageNo === 1 ? [...list] : [...this.messageList, ...list]
        this.mFinished = list.length < this.mPageSize
      }).finally(() => {
        this.mLoading = false
      })
    },
    delCollect (collectId) {
      this.$confirm({
        title: '确认要删除该收藏夹吗？',
        content: h => <div style="color:red;">删除后无法恢复</div>,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.$api.delCollect(collectId).then((res) => {
            if (res.success) {
              this.$message.success('删除成功')
              this.getCollectList()
              return
            }
            this.$message.error(res.message)
          })
        }
      })
    },
    async getCollectList () {
      this.collections = await this.$api.getCollects()
    }
  }
}
</script>

<style lang="less" scoped>
.page-user-container {
  width: 100%;
  min-height: 100vh;
  .page-user-info {
    min-height: 280px;
    background-color: #fff;
    margin-bottom: @g-margin * 2;
    border-radius: @g-radius;
    box-shadow: -2px 4px 16px -1px #f2f2f2;
    .user-info-content {
      position: relative;
      height: 80px;
    }
    .user-header-box {
      position: absolute;
      top: -100px;
      left: 20px;
      width: 160px;
      height: 160px;
      padding: 4px;
      border-radius: 4px;
      background-color: #f2f2f2;
      box-shadow: -2px 4px 16px -1px #909399;
    }
    .user-header {
      width: 100%;
      height: 100%;
      border-radius: 3px;
      object-fit: cover;
      border: 1px solid @border-4-color;
    }
    .user-info-detail {
      display: flex;
      height: 100%;
      padding-left: 200px;
      justify-content: space-between;
      box-sizing: border-box;
    }
    .user-info-edit-btn {
      margin-top: 12px;
      margin-right: 12px;
    }
    .user-nickname {
      padding-top: 10px;
      .level-sup {
        display: none;
        font-size: 14px;
        font-weight: bold;
        color: #fc7d0e;
      }
    }
    .user-info-item-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 40px;
    }
    .user-info-item {
      margin-bottom: 10px;
      font-size: @font-fourth;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .info-item-line {
      display: inline-block;
      width: 240px;
    }
    .signature-line {
      width: auto;
    }
    .user-info-item-label {
      display: inline-block;
      width: 80px;
      text-align: right;
      color: @font-color-first;
      font-weight: bold;
    }
  }
  .page-user-dynamic {
    display: flex;
    width: 100%;
    justify-content: space-between;
    border-radius: @g-radius;
  }
  .dynamic-content {
    width: @content-max-width;
    background-color: #fff;
    border-radius: @g-radius;
    overflow: hidden;
    padding: 0 16px;
    min-height: calc(100vh - 280px);
    margin-right: @g-margin * 2;
    .achievement-num {
      font-size: @font-fifth;
      color: @font-color-third;
    }
  }
  .gold-list-box {
    height: 150px;
    margin-bottom: @g-margin;
    background-color: #fff;
    border-radius: @g-radius;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .loading-box {
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .collection-list {
    display: grid;
    grid-template-columns: 50% 50%;
    .collection-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      border: 1px solid @border-3-color;
      margin-bottom: @g-margin * 2;
      border-radius: @g-radius;
      padding: 0 @g-padding * 2;
      font-size: @font-fourth;
      font-weight: bold;
      &:nth-child(2n + 1) {
        margin-right: @g-margin * 2;
      }
      .collect-btn {
        display: none;
      }
      &:hover {
        .collect-btn {
          display: inline-block;
        }
      }
      .collection-num {
        color: @font-color-third;
        padding: 2px 6px;
        line-height: 1;
        font-weight: 400;
      }
    }
  }
  .tabs-item-box {
    position: relative;
  }
  .tabs-sup {
    position: absolute;
    top: -10px;
    left: 30px;
    height: 16px;
    line-height: 1;
    font-size: 10px;
    display: inline-block;
    color: #fff;
    background-color: red;
    border-radius: 10px;
    border-bottom-left-radius: 0;
    padding: 2px 4px;
    z-index: 100;
  }
  .my-achievement {
    padding: @g-padding * 2;
    .achievement-box {
      margin-bottom: @g-margin * 2;
    }
    .achievement-item {
      display: inline-block;
      width: 50px;
      text-align: justify;
      font-weight: bold;
      font-size: 16px;
      text-align-last: justify;
    }
    .item-msg-icon {
      color: @g-main-color;
      font-weight: bold;
      font-size: 18px;
      margin-right: 8px;
    }
    .text-num {
      font-size: @font-third;
    }
    p:last-child {
      margin-bottom: 0;
    }
  }
  /deep/.ant-tabs-content {
    padding-top: 16px;
  }
  /deep/.ant-tabs-tab {
    font-weight: bold;
    padding: 10px;
  }
  /deep/.ant-tabs-top-bar {
    margin-bottom: 0;
  }
  /deep/.ant-tabs-bar {
    border-bottom: 1px solid @border-3-color;
  }
}
@media screen and (max-width: 1000px) {
  .page-user-container {
    .page-user-info {
      height: 200px;
      margin-bottom: @g-margin;
      .user-header-box {
        width: 80px;
        height: 80px;
        top: -50px;
        left: 16px;
        padding: 2px;
      }
      .user-info-content {
        padding-top: 0;
        height: 50px;
        .user-info-detail {
          display: flex;
          justify-content: space-between;
          padding-left: 16px;
          .g-display-flex {
            flex-direction: column;
            .user-nickname {
              padding-left: 100px;
              padding-top: 6px;
              font-size: 18px;
              word-break: keep-all;
              margin-bottom: 14px;
              .level-sup {
                display: inline-block;
                font-size: 12px;
                font-weight: bold;
                color: #ff4910;
              }
            }
            .user-info-item-box {
              margin-left: 0;
              .user-info-item {
                margin-bottom: 4px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .info-item-line {
                  display: flex;
                  width: auto;
                  &:first-child {
                    margin-bottom: 4px;
                  }
                  .user-info-item-label {
                    width: 60px;
                    display: flex;
                    justify-content: space-between;
                  }
                  .user-signature {
                    white-space: nowrap;
                    word-break: keep-all;
                  }
                }
              }
            }
          }
        }
      }
    }
    .dynamic-content {
      margin-right: 0;
      /deep/.home-article-item-container, /deep/.home-question-item {
        padding-left: 0;
        padding-right: 0;
      }
    }
    /deep/.ant-tabs-content {
      padding-top: 10px !important;
    }
    .collection-list {
      grid-template-columns: 100%;
      .collection-item {
        height: 40px;
        margin-bottom: 10px;
        padding: 0 @g-padding * 2;
        font-size: @font-fourth;
        &:nth-child(2n + 1) {
          margin-right: 0;
        }
        .collection-num {
          background-color: rgba(5, 105, 204, 0.1);
          padding: 2px 6px;
          line-height: 1;
          font-weight: 400;
          font-size: @font-fifth;
          border-radius: @g-radius;
          margin-left: @g-margin;
        }
      }
    }
  }
}
</style>
