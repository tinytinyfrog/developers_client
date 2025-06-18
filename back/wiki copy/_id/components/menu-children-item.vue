<template>
  <div v-if="wiki" ref="wikiMenuChildren" class="wiki-menu-children">
    <p
      class="wiki-menu-item wiki-children g-bg-hover g-hidden-line1"
      :class="{ 'g-selected': +nodeId === wiki.postsId }"
      @click="goWiki(`/wiki/${wikiId}/${wiki.postsId}`)"
    >
      <span class="g-flex-align-center">
        <a-icon class="node-icon" type="profile" />
        <span class="wiki-menu-title g-hidden-line1" :class="{'normal-title': !canEdit}">{{ wiki.postsTitle }}</span>
      </span>
      <a-popover v-if="canEdit" v-model="wiki.visible" placement="rightTop" :get-popup-container="() => $refs.wikiMenuChildren">
        <template slot="content">
          <p class="wiki-popover-item g-bg-hover" @click="editArticle(wiki)">
            <a-space>
              <a-icon type="edit" />
              <span>修改节点名</span>
            </a-space>
          </p>
          <p class="wiki-popover-item g-bg-hover" @click="delNodeById(wiki)">
            <a-space>
              <a-icon type="delete" />
              <span>删除节点</span>
            </a-space>
          </p>
        </template>
        <a-icon class="action-icon" type="ellipsis" />
      </a-popover>
    </p>
    <a-modal
      v-model="showEditNodeModal"
      title="修改节点名称"
      ok-text="确认"
      cancel-text="取消"
      :confirm-loading="upLoading"
      @ok="editNodeName"
    >
      <p style="margin-bottom: 20px;">
        原节点：<b>{{ wiki.postsTitle }}</b>
      </p>
      <a-input v-model="nodeTitle" placeholder="请输入新的节点名称" />
    </a-modal>
  </div>
</template>

<script>
import EventBus from '@/lib/event-bus'
export default {
  name: 'WikiMenuChildren',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    wiki: {
      type: Object,
      default: () => null
    },
    canEdit: {
      type: Boolean,
      default: false
    },
    nodeId: {
      type: String,
      default: ''
    }
  },
  data () {
    const { id } = this.$route.params
    return {
      wikiId: id,
      articleId: '',
      nodeTitle: '',
      active: false,
      upLoading: false,
      showEditNodeModal: false,
      currentNode: null
    }
  },
  methods: {
    goWiki (url) {
      EventBus.$emit('G_UPDATE_MENU', false)
      this.$router.push(url)
    },
    editArticle (node) {
      node.visible = false
      this.showEditNodeModal = true
      this.nodeTitle = this.wiki.postsTitle
      // this.$utils.openNewWindow(`/draft/editor/${node.postsId}?t=article`)
    },
    editNodeName () {
      if (this.upLoading) return
      this.upLoading = true
      this.$api.updateNodeName({
        nodeId: this.wiki.nodeId,
        nodeTitle: this.nodeTitle
      }).then((res) => {
        this.upLoading = false
        if (res.success) {
          this.showEditNodeModal = false
          this.$message.success('更新成功')
          this.nodeTitle = ''
          this.$emit('on-update-menu')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    delNodeById (node) {
      node.visible = false
      this.$confirm({
        title: '确认要删除当前节点吗',
        content: h => <div style="color: #606a78;">节点：{node.postsTitle}</div>,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.$api.delWikiNodeById(node.nodeId).then((res) => {
            if (res.success) {
              this.$message.success('删除成功')
              this.$emit('on-update-menu')
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@menu-height: 40px;
.wiki-menu-children {
  .wiki-menu-item {
    height: @menu-height;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: @font-color-second;
    padding: 0 @g-padding * 2;
    justify-content: space-between;
    .wiki-menu-title {
      display: inline-block;
      width: 232px;
    }
    .normal-title {
      width: 232px;
    }
    &:hover {
      .wiki-menu-title {
        width: 195px;
      }
      .normal-title {
        width: 232px;
      }
      .action-icon {
        display: inline-block;
        color: @font-color-third;
        font-size: 18px !important;
        padding: 5px;
      }
    }
  }
  .wiki-children {
    padding-left: 33px;
  }
  .create-wiki {
    border-top: 1px solid @border-4-color;
  }
  .action-icon {
    display: none;
  }
  .node-icon {
    margin-right: @g-margin;
    padding-top: 4px;
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
}
</style>
