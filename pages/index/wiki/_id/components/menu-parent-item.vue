<template>
  <div ref="wikiParent" class="wiki-menu-parent">
    <div
      v-if="wiki"
      class="wiki-menu-item g-bg-hover g-hidden-line1"
      :class="{ 'g-selected': +nodeId === wiki.postsId }"
      @click="goWiki(`/wiki/${wikiId}/${wiki.postsId}`)"
    >
      <span>
        <a-space :size="4">
          <template>
            <a-icon v-if="wiki.children.length" class="parent-icon" :type="open ? 'caret-down' : 'caret-right'" @click.stop.prevent="open = !open" />
            <span v-else style="display: inline-block; width: 16px;" />
          </template>
          <span class="wiki-menu-title g-hidden-line1">{{ wiki.postsTitle }}</span>
        </a-space>
      </span>
      <a-popover v-if="canEdit || isCollaborator" v-model="wiki.visible" placement="rightTop" :get-popup-container="() => $refs.wikiParent">
        <template slot="content">
          <p v-if="canEdit" class="wiki-popover-item g-bg-hover" @click="editWikiMenu(wiki)">
            <a-space>
              <a-icon type="edit" />
              <span>修改</span>
            </a-space>
          </p>
          <p v-if="canEdit" class="wiki-popover-item g-bg-hover" @click="delNodeById(wiki)">
            <a-space>
              <a-icon type="delete" />
              <span>删除</span>
            </a-space>
          </p>
          <p v-if="canEdit || isCollaborator" class="wiki-popover-item g-bg-hover" @click="addNode(wiki)">
            <a-space>
              <b><a-icon type="plus" /></b>
              <span>添加子文章</span>
            </a-space>
          </p>
        </template>
        <a-icon class="action-icon" type="ellipsis" @click.prevent />
      </a-popover>
    </div>
    <div v-show="open" class="menu-children-list">
      <slot :open="open" />
    </div>
    <a-modal v-model="showAddNodeModal" title="输入文章 id 添加子节点" ok-text="确认" cancel-text="取消" @ok="addArticleToNode">
      <a-input v-model="articleId" placeholder="请输入文章id" style="margin-bottom: 20px;" />
      <a-input v-model="nodeTitle" placeholder="请输入节点标题，不设置则取文章标题" />
    </a-modal>
  </div>
</template>

<script>
import EventBus from '@/lib/event-bus'
export default {
  name: 'WikiMenuParent',
  props: {
    wiki: {
      type: Object,
      default: () => null
    },
    canEdit: {
      type: Boolean,
      default: false
    },
    isCollaborator: {
      type: Boolean,
      default: false
    },
    nodeId: {
      type: String,
      default: ''
    },
    defaultOpen: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const { id } = this.$route.params
    return {
      showAddNodeModal: false,
      open: this.defaultOpen,
      wikiId: id,
      articleId: '',
      nodeTitle: ''
    }
  },
  methods: {
    goWiki (url) {
      EventBus.$emit('G_UPDATE_MENU', false)
      this.$router.push(url)
    },
    addNode (wiki) {
      wiki.visible = false
      this.$nextTick(() => {
        this.showAddNodeModal = true
      })
    },
    editWikiMenu (wiki) {
      wiki.visible = false
      this.$router.push(`/draft/editor/${wiki.postsId}?t=wiki`)
    },
    delNodeById (wiki) {
      wiki.visible = false
      this.$confirm({
        title: '确认要删除当前节点吗',
        content: h => <div style="color: #606a78;">节点：{wiki.postsTitle}</div>,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.$api.delWikiNodeById(wiki.nodeId).then((res) => {
            if (res.success) {
              this.$message.success('删除成功')
              this.$emit('on-update-menu')
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    addArticleToNode () {
      const lastChildren = this.wiki.children.slice(-1)
      this.$api.addWikiNode({
        postsId: this.articleId,
        parentNodeId: this.wiki.nodeId,
        nodeTitle: this.nodeTitle,
        prevBrotherNodeId: lastChildren.length ? lastChildren[0].nodeId : null
      }).then((res) => {
        this.showAddNodeModal = false
        if (res.success) {
          this.articleId = this.nodeTitle = ''
          this.$message.success('添加成功')
          this.$emit('on-update-menu')
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.showAddNodeModal = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
@menu-height: 40px;
.wiki-menu-parent {
  .wiki-menu-item {
    height: @menu-height;
    display: flex;
    align-items: center;
    font-size: 15px;
    color: @font-color-first;
    padding: 0 @g-padding * 2;
    font-weight: bold;
    justify-content: space-between;
    /deep/.ant-space-item {
      line-height: 1;
    }
    .parent-icon {
      color: @font-color-third;
      font-size: 14px;
    }
    .wiki-menu-title {
      display: inline-block;
      width: 200px;
      vertical-align: bottom;
      margin-right: @g-margin;
    }
    &:hover {
      .action-icon {
        display: inline-block;
        color: @font-color-third;
        font-size: 18px !important;
        padding: 5px;
      }
    }
  }
  .create-wiki {
    border-top: 1px solid @border-4-color;
  }
  .action-icon {
    display: none;
  }
  /deep/.ant-popover-inner-content {
    padding: 0 !important;
  }
  .wiki-popover-item {
    width: 180px;
    height: 40px;
    line-height: 40px;
    padding: 0 @g-padding * 2;
    &:last-child {
      border: 0;
    }
  }
  @media screen and (max-width: 1000px) {
    .wiki-menu-item {
      .parent-icon {
        padding: 3px;
      }
    }
  }
}
</style>
