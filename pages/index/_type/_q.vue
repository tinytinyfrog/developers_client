<template>
  <div v-infinite-scroll="onScroll" class="common-search-page">
    <div class="base-msg">
      <span class="tips-title">{{ title }}:</span>
      <span ref="keywords" class="keywords g-main-color" :contenteditable="canEdit"> {{ keywords }}</span>
      <Button v-if="type === 'collect'" type="link" icon="edit" @click="onEdit" />
    </div>
    <template v-for="(item, index) in topicList">
      <ArticleItem v-if="item.category === 'ARTICLE'" :key="index" :article="item" />
      <QuestionItem v-else :key="index" :question="item" />
    </template>
    <Empty v-if="!topicList.length" :description="false" />
    <div v-if="topicList.length && finished" class="search-finished">
      <p>没有更多啦~</p>
    </div>
  </div>
</template>

<script>
import EventBus from '@/lib/event-bus'
import { Button, Empty } from 'ant-design-vue'
import ArticleItem from '../components/article-item.vue'
import QuestionItem from '../components/question-item.vue'
import { replaceUrlByQuery } from '../../../lib/utils'

const _titleMap = {
  tag: '标签',
  search: '检索词',
  collect: '收藏集'
}
export default {
  name: 'Q',
  components: {
    ArticleItem,
    QuestionItem,
    Button,
    Empty
  },
  async asyncData ({ store, route, $api }) {
    const { type, q } = route.params
    let topicList = []
    let finished = false
    let pageNo = 1
    let keywords = q
    const pageSize = 15
    // 标签查询
    if (type === 'tag') {
      const { name } = route.query
      topicList = await $api.getTopicList({
        filter: {
          tagIds: [q]
        },
        pageSize
      }) || []
      keywords = name
    }
    // 关键词搜索
    if (type === 'search') {
      topicList = await $api.getSearchList({
        filter: q,
        pageSize
      }).catch(err => console.log(err))
    }
    // 收藏
    if (type === 'collect') {
      const { name } = route.query
      topicList = await $api.getCollectArticles({
        filter: q,
        pageSize
      }).catch(err => console.log(err))
      keywords = name
    }
    if (topicList.length < pageSize) {
      finished = true
    } else {
      pageNo++
    }
    return {
      q,
      pageNo,
      finished,
      pageSize,
      topicList,
      type,
      keywords,
      canEdit: false,
      loading: false,
      title: _titleMap[type]
    }
  },
  beforeDestroy () {
    this.$refs.keywords.removeEventListener('keydown', this.listenKeydown)
    EventBus.$off('G_SEARCH')
  },
  mounted () {
    EventBus.$on('G_SEARCH', (data) => {
      this.clearStatus()
      this.keywords = data.value
      this.loadData(this.getMethod(data.type, data.value))
    })
    this.$refs.keywords.addEventListener('keydown', this.listenKeydown)
  },
  methods: {
    listenKeydown (e) {
      if (e.keyCode === 13) {
        event.preventDefault()
        const name = this.$refs.keywords.textContent.trim()
        if (!name) {
          this.$message.error('请输入收藏夹名称')
        }
        this.$api.editCollect({
          collectId: this.q,
          name
        }).then((res) => {
          if (res.success) {
            this.$message.success('修改成功')
            replaceUrlByQuery({
              name
            })
            this.canEdit = false
          }
        })
      }
    },
    onEdit () {
      this.canEdit = true
      try {
        this.$nextTick(() => {
          this.$refs.keywords.focus()
          if (window.getSelection) {
            const range = window.getSelection()
            range.selectAllChildren(this.$refs.keywords)
            range.collapseToEnd()
          } else if (document.selection) {
            const range = document.selection.createRange()
            range.moveToElementText(this.$refs.keywords)
            range.collapse(false)
            range.select()
          }
        })
      } catch (e) {
        console.log(e)
      }
    },
    clearStatus () {
      this.pageNo = 1
      this.finished = false
      this.loading = false
    },
    getMethod (type = this.type, value = this.keywords) {
      const methodMap = {
        tag: {
          method: 'getTopicList',
          filter: {
            tagIds: [this.$route.params.q]
          }
        },
        search: {
          method: 'getSearchList',
          filter: value
        }
      }
      return methodMap[type]
    },
    onScroll () {
      this.loadData(this.getMethod())
    },
    loadData (data) {
      if (this.loading || this.finished) { return }
      this.loading = true
      this.$api[data.method]({
        filter: data.filter,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }).then((list) => {
        this.topicList = this.pageNo === 1 ? list : [...this.topicList, ...list]
        this.pageNo++
        this.finished = list.length < this.pageSize
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .common-search-page {
    width: 60%;
    .base-msg {
      width: 100%;
      display: flex;
      height: 50px;
      align-items: center;
      justify-content: center;
      font-size: @font-second;
      font-weight: bold;
      margin-bottom: @g-margin;
      .tips-title {
        margin-right: @g-margin;
      }
      .keywords {
        display: inline-block;
        min-width: 80px;
        padding: 0 10px;
        &::selection {
          border: @border-4-color;
        }
      }
    }
    .search-finished {
      height: 50px;
      text-align: center;
      line-height: 50px;
    }
  }
</style>
