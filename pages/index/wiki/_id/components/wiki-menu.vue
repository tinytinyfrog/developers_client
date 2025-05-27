<template>
  <a-affix :offset-top="0" class="wiki-menu-entry" :class="{'menu-affix-block': showMobileMenu }" @touchmove.stop.prevent="() => {}">
    <div ref="wikiMenu" class="wiki-detail-menu" :class="{'hide-menu': !showMobileMenu}">
      <!-- <a-affix v-if="wikiInfo" :target="() => this.$refs.wikiMenu">
        <div class="base-menu-info">
          <div ref="wikiInfo" class="wiki-info">
            <span class="g-flex-align-center">
              <a-tooltip v-if="!isMobile" placement="bottom" title="返回知识库列表">
                <a-icon class="back-ward g-hover" type="double-left" @click="goBackWikiList" />
              </a-tooltip>
              <a-icon v-else class="back-ward g-hover" type="double-left" @click="goBackWikiList" />
              <span v-if="wikiInfo" class="info-box g-hover" @click="openWikiDetail">
                <img class="wiki-headimg" :src="wikiInfo.headImg + '?imageView2/1/w/60/h/80'" alt="">
                <b class="wiki-name g-hidden-line1">{{ wikiInfo.name }}</b>
              </span>
            </span>
            <a-popover v-model="showEditWiki" placement="rightTop" :get-popup-container="() => $refs.wikiInfo">
              <template slot="content">
                <p class="wiki-popover-item g-bg-hover" @click="addWikiMenu">
                  <a-space>
                    <a-icon type="plus" />
                    <span>添加一级目录</span>
                  </a-space>
                </p>
                <p class="wiki-popover-item g-bg-hover" @click="settingWiki">
                  <a-space>
                    <a-icon type="setting" />
                    <span>设置</span>
                  </a-space>
                </p>
              </template>
              <a-icon v-if="canEdit" class="action-icon" type="ellipsis" @click.prevent />
            </a-popover>
          </div>
        </div>
      </a-affix> -->
      <draggable
        v-model="wikiMenu"
        :disabled="!canEdit"
        :delay="200"
        chosen-class="draggable-active"
        :touch-start-threshold="3"
        force-fallback="true"
        group="menu"
        animation="500"
        @end="onParentEnd"
      >
        <transition-group>
          <MenuParent
            v-for="(wiki, index) in wikiMenu"
            :key="wiki.nodeId"
            :wiki="wiki"
            :can-edit="canEdit"
            :data-id="wiki.nodeId"
            :node-id="nodeId"
            :is-collaborator="isCollaborator"
            :default-open="checkOpen(wiki.children, index)"
            @on-update-menu="$emit('on-update')"
          >
            <template slot-scope="{open}">
              <draggable
                v-model="wiki.children"
                :delay="200"
                :disabled="!canEdit"
                :touch-start-threshold="3"
                chosen-class="draggable-active"
                force-fallback="true"
                group="menu-item"
                animation="500"
                @end="onChildrenEnd"
              >
                <MenuChildren
                  v-for="node in wiki.children"
                  :key="node.nodeId"
                  :wiki="node"
                  :open="open"
                  :data-id="node.nodeId"
                  :node-id="nodeId"
                  :can-edit="canEdit"
                  @on-update-menu="$emit('on-update')"
                />
              </draggable>
            </template>
          </MenuParent>
        </transition-group>
      </draggable>
    </div>
  </a-affix>
</template>

<script>
import draggable from 'vuedraggable'
import EventBus from '@/lib/event-bus'
import MenuParent from './menu-parent-item'
import MenuChildren from './menu-children-item'
export default {
  name: 'WikiMenu',
  components: {
    MenuParent,
    MenuChildren,
    draggable
  },
  props: {
    menuList: {
      type: Array,
      default: () => []
    },
    wikiInfo: {
      type: Object,
      default: () => null
    },
    canEdit: {
      type: Boolean,
      default: false
    },
    showMobileMenu: {
      type: Boolean,
      default: false
    },
    isCollaborator: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const { id, nodeId } = this.$route.params
    const { isMobile } = this.$store.state.globalData
    return {
      isMobile,
      top: 0,
      wikiId: id,
      nodeId,
      hasArticle: false,
      wikiMenu: this.menuList,
      showEditWiki: false
    }
  },
  watch: {
    $route () {
      const { nodeId } = this.$route.params
      this.nodeId = nodeId
    },
    menuList (list) {
      this.wikiMenu = list
      console.log(list.length, 'ddd')
      if (list?.length > 0) {
        console.log(`/wiki/${this.$route.params.id}/${list[0]?.postsId}`)
        this.$router.push(`/wiki/${this.$route.params.id}/${list[0]?.postsId}`)
      }
    }
  },
  mounted () {
    if (this.menuList?.length > 0) {
      console.log(`/wiki/${this.$route.params.id}/${this.menuList[0]?.postsId}`)
      this.$router.push(`/wiki/${this.$route.params.id}/${this.menuList[0]?.postsId}`)
    }
  },
  methods: {
    openWikiDetail () {
      EventBus.$emit('G_UPDATE_MENU', false)
      this.$router.push(`/wiki/${this.wikiId}`)
    },
    handleMarkdownChange (text) {
      this.markdownContent = text
    },
    settingWiki () {
      this.showEditWiki = false
      this.$router.push(`/wiki/${this.wikiId}/setting`)
    },
    addWikiMenu () {
      this.showEditWiki = false
      this.$router.push(`/draft/editor/new?t=wiki&wikiId=${this.wikiId}`)
    },
    goBackWikiList () {
      location.replace('/wiki')
    },
    getChildrenParamsByNodeId (nodeId) {
      const params = {
        nodeId
      }
      for (let i = 0; i < this.wikiMenu.length; i++) {
        const wikiItem = this.wikiMenu[i]
        const children = wikiItem.children
        for (let k = 0; k < children.length; k++) {
          const node = children[k]
          if (+nodeId === node.nodeId) {
            params.parentNodeId = wikiItem.nodeId
            params.prevBrotherNodeId = k > 0 ? children[k - 1].nodeId : null
            break
          }
        }
      }
      return params
    },
    getParentParamsByNodeId (nodeId) {
      const params = {
        nodeId,
        parentNodeId: null
      }
      for (let i = 0; i < this.wikiMenu.length; i++) {
        const wikiItem = this.wikiMenu[i]
        if (+nodeId === wikiItem.nodeId) {
          params.prevBrotherNodeId = i > 0 ? this.wikiMenu[i - 1].nodeId : null
          break
        }
      }
      return params
    },
    onChildrenEnd (e) {
      const nodeId = e.clone.dataset.id
      const params = this.getChildrenParamsByNodeId(nodeId)
      this.$api.wikiMoveNodeById(params)
    },
    onParentEnd (e) {
      const nodeId = e.clone.dataset.id
      const params = this.getParentParamsByNodeId(nodeId)
      this.$api.wikiMoveNodeById(params)
    },
    checkOpen (list) {
      return list.some(item => item.postsId === +this.nodeId)
    }
  }
}
</script>

<style lang="less" scoped>
@menu-height: 40px;
@menu-width: 300px;
.menu-affix-block {
  height: 100% !important;
  width: @menu-width !important;
}
.wiki-menu-entry {
  transition: all 0.3s;
}
.wiki-detail-menu {
  width: 300px;
  height: 100vh;
  overflow-y: auto;
  background-color: #fff;
  padding-bottom: @g-padding * 2;
  overflow: -moz-scrollbars-none;
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  .base-menu-info {
    background-color: #fff;
    border-bottom: 1px solid @border-2-color;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.05);
    border-left: 1px solid @border-4-color;
  }
  .back-ward {
    color: @font-color-third;
    font-size: 16px;
    padding: @g-padding * 2 @g-padding;
    margin-right: 4px;
  }
  .wiki-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: @g-padding @g-padding * 2 @g-padding 0;
    background-color: #F8F8FF;
    .info-box {
      display: flex;
      align-items: center;
    }
    &:hover {
      .wiki-name {
        margin-left: @g-margin;
        max-width: 210px;
      }
    }
    .wiki-headimg {
      width: 30px;
      height: 40px;
      border-radius: @g-radius;
    }
    .wiki-name {
      margin-left: @g-margin;
      max-width: 235px;
    }
    &:hover {
      .action-icon {
        display: inline-block;
        color: @font-color-third;
        padding: 3px;
        font-size: 18px !important;
      }
    }
  }

  .wiki-menu-item {
    height: @menu-height;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    background-color: #fff;
    color: @font-color-first;
    padding: 0 @g-padding * 2;
    justify-content: space-between;
  }
  .create-wiki {
    border-top: 1px solid @border-4-color;
  }
  .action-icon {
    display: none;
  }
  .draggable-active {
    color: @g-main-color !important;
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
@media screen and (max-width: 1000px) {
  .hide-menu {
    display: none;
  }
}
</style>
