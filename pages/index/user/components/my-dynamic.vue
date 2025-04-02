<template>
  <Tabs class="dynamic-tabs" type="card" :default-active-key="tabIndex" @change="changeTabindex">
    <TabPane key="comment" class="tabs-content" force-render>
      <span slot="tab">
        评论
        <span class="achievement-num">{{ cTotal }}</span>
      </span>
      <div
        v-for="(item, key) in comments"
        :key="key"
        class="comment-item"
        @click="$utils.openNewWindow(`/${item.postsCategory === 'ARTICLE' ? 'article' : 'faq' }/${item.postsId}`)"
      >
        <span>
          <span>我评论了</span>
          <span class="title">{{ item.postsTitle }}</span>
        </span>
        <span class="time">{{ item.createAt | dateCountDown }}</span>
      </div>
      <g-empty :list="comments" :finished="cFinished" :loading="cLoading" />
    </TabPane>
    <TabPane key="like" class="tabs-content" force-render>
      <span slot="tab">
        点赞
        <span class="achievement-num">{{ lTotal }}</span>
      </span>
      <div v-for="(item, key) in likes" :key="key" class="comment-item" @click="$utils.openNewWindow(`/article/${item.postsId}`)">
        <span>
          <span>我点赞了</span>
          <span class="title">{{ item.postsTitle }}</span>
        </span>
        <span class="time">{{ item.createAt | dateCountDown }}</span>
      </div>
      <g-empty :list="likes" :finished="lFinished" :loading="lLoading" />
    </TabPane>
    <TabPane key="follow" class="tabs-content" force-render>
      <span slot="tab">
        关注
        <span class="achievement-num">{{ fTotal }}</span>
      </span>
      <div v-for="(item, key) in focus" :key="key" class="comment-item" @click="$utils.openNewWindow(`/user/${item.id}`)">
        <span>
          <span>我关注了</span>
          <GUserPopover :user-id="item.id">
            <span class="title">{{ item.nickname }}</span>
          </GUserPopover>
        </span>
        <span class="time">{{ item.updateAt | dateCountDown }}</span>
      </div>
      <g-empty :list="focus" :finished="fFinished" :loading="fLoading" />
    </TabPane>
  </Tabs>
</template>

<script>
import { Tabs } from 'ant-design-vue'
import { replaceUrlByQuery } from '@/lib/utils'
import EventBus from '@/lib/event-bus'

const TabPane = Tabs.TabPane

export default {
  name: 'MyDynamic',
  components: {
    Tabs,
    TabPane
  },
  data () {
    return {
      pageSize: 20,
      cLoading: false,
      cFinished: false,
      cPageNo: 1,
      cTotal: 0,
      comments: [],
      lLoading: false,
      lFinished: false,
      lPageNo: 1,
      lTotal: 0,
      likes: [],
      fLoading: false,
      fFinished: false,
      fPageNo: 1,
      focus: [],
      fTotal: 0,
      tabIndex: this.$route.query.dynamicTab || 'comment'
    }
  },
  beforeDestroy () {
    EventBus.$off('G_USER_DYNAMIC')
  },
  mounted () {
    this.getMyComments()
    this.getMyLike()
    this.getMyFocus()
    EventBus.$on('G_USER_DYNAMIC', () => {
      this.handleDynamic(this.tabIndex)
    })
  },
  methods: {
    changeTabindex (tab) {
      replaceUrlByQuery({ dynamicTab: tab })
      this.tabIndex = tab
    },
    handleDynamic (tab) {
      const map = {
        comment: 'getMyComments',
        like: 'getMyLike',
        follow: 'getMyFocus'
      }
      this[map[this.tabIndex]]()
    },
    getMyComments () {
      if (this.cLoading || this.cFinished) return
      this.cLoading = true
      this.$api.getCommentList({
        pageNo: this.cPageNo,
        pageSize: this.pageSize
      }).then((res) => {
        if (res.list) {
          this.cTotal = res.total
          const list = res.list
          this.cPageNo++
          this.comments = [...this.comments, ...list]
          this.cFinished = list.length < this.pageSize
        }
      }).finally(() => {
        this.cLoading = false
      })
    },
    getMyLike () {
      if (this.lLoading || this.lFinished) return
      this.lLoading = true
      this.$api.getLikeList({
        pageNo: this.lPageNo,
        pageSize: this.pageSize
      }).then((res) => {
        if (res.list) {
          this.lTotal = res.total
          const list = res.list
          this.lPageNo++
          this.likes = [...this.likes, ...list]
          this.lFinished = list.length < this.pageSize
        }
      }).finally(() => {
        this.lLoading = false
      })
    },
    getMyFocus () {
      if (this.fLoading || this.fFinished) return
      this.fLoading = true
      this.$api.getFocusList({
        filter: this.$store.state.user.userInfo.id,
        pageNo: this.fPageNo,
        pageSize: this.pageSize
      }).then((res) => {
        if (res.list) {
          this.fTotal = res.total
          const list = res.list
          this.fPageNo++
          this.focus = [...this.focus, ...list]
          this.fFinished = list.length < this.pageSize
        }
      }).finally(() => {
        this.fLoading = false
      })
    }
  }
}

</script>
<style lang="less" scoped>
.dynamic-tabs {
  padding-bottom: @g-padding * 2;
  /deep/.ant-tabs-content {
    padding-top: 0 !important;
  }
  /deep/.ant-tabs-left-content{
    padding-left: @g-padding * 2 !important;
  }
  /deep/.ant-tabs-bar {
    border: 0 !important;
  }
  .achievement-num {
    font-size: @font-fifth;
    color: @font-color-third;
  }
  .comment-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    cursor: pointer;
    padding: 0 @g-padding * 2;
    border-bottom: 1px solid @border-5-color;
    &:hover {
      background-color: @g-bg-blue;
      .title {
        color: @g-main-color;
      }
    }
    .title {
      color: @font-color-first;
      font-weight: bold;
      margin: 0 @g-margin;
    }
  }
}
</style>
