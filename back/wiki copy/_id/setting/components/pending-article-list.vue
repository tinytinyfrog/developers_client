<template>
  <div class="pending-article-list">
    <div v-for="(item, index) in checkList" :key="index" class="article-link">
      <a-space>
        <GUserPopover :user-id="item.userId">
          <span class="display-align-center" @click.stop.prevent="$utils.openNewWindow(item.userId)">
            <img class="user-header" :src="item.userAvatar" alt="">
            <b>{{ item.userName }}</b>
          </span>
        </GUserPopover>
        <span>
          提交了：
          <span class="g-hover">
            {{ item.content }}
          </span>
        </span>
      </a-space>
      <!--      <a-button type="link" @click="handleCheck(item, index)">-->
      <!--        处理-->
      <!--      </a-button>-->
    </div>
    <g-empty :list="checkList" :finished="finished" :loading="loading" />
  </div>
</template>

<script>
export default {
  name: 'PendingArticleList',
  props: {
    wikiId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      checkList: [],
      finished: false,
      loading: false,
      pageNo: 1,
      pageSize: 100
    }
  },
  mounted () {
    this.getPendingList()
  },
  methods: {
    getPendingList () {
      if (this.finished || this.loading) return
      this.loading = true
      this.$api.getWikiNodeCheckRecordList({
        filter: {
          wikiId: this.wikiId
        },
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }).then((list) => {
        this.loading = false
        this.finished = true
        // list.forEach(item => {
        //   item.
        // })
        this.checkList = list
      })
    },
    handleCheck () {}
  }
}
</script>

<style lang="less">
.pending-article-list {
  .article-link {
    display: flex;
    justify-content: space-between;
    padding: @g-padding * 2;
    border-bottom: 1px solid @border-4-color;
    cursor: pointer;
    .user-header {
      width: 30px;
      height: 30px;
      border-radius: @g-radius;
    }
    .display-align-center {
      display: flex;
      align-items: center;
      .user-header {
        margin-right: @g-margin;
      }
    }
  }
}
</style>
