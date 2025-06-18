<template>
  <div class="page-wiki-container g-margin-top">
    <div v-if="canEdit" class="wiki-title-box">
      <h3 class="wiki-title">
        知识库
      </h3>
      <div class="action">
        <a-space>
          <a-checkbox :checked="myWiki" @change="onChange">
            我的
          </a-checkbox>
          <a-button type="primary" icon="plus" ghost @click="showDrawer = true">
            添加知识库
          </a-button>
        </a-space>
      </div>
    </div>
    <div class="wiki-list-box">
      <CreateWiki :category-list="categoryList" :show-drawer.sync="showDrawer" />
      <WikiList :category-list="categoryList" :wiki-type="myWiki ? 'self' : 'all'" />
    </div>
  </div>
</template>

<script>
import _get from 'lodash/get'
import { RULE_ENUM } from '@/lib/enum'
import EventBus from '../../../lib/event-bus'
import WikiList from './components/wiki-list'
import CreateWiki from './components/create-wiki'
export default {
  name: 'PageWiki',
  components: {
    WikiList,
    CreateWiki
  },
  data () {
    const perm = _get(this, '$store.state.user.userInfo.perm', 0)
    let role = _get(this, '$store.state.user.userInfo.role', '')
    role = role && role !== 'USER'
    return {
      myWiki: false,
      showDrawer: false,
      categoryList: [],
      canEdit: role || ((perm & RULE_ENUM.WIKI) === RULE_ENUM.WIKI)
    }
  },
  mounted () {
    this.getWikiCategoryList()
  },
  methods: {
    onChange () {
      this.myWiki = !this.myWiki
      this.$nextTick(() => {
        EventBus.$emit('on-update-wiki')
      })
    },
    getWikiCategoryList () {
      this.$api.getWikiCategoryList().then((list) => {
        this.categoryList = list
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page-wiki-container {
  width: 100%;
  background-color: #fff;
  min-height: calc(100vh - @title-height - @g-margin * 3);
  padding: @g-padding * 2;
  .wiki-title-box {
    display: flex;
    height: 50px;
    align-items: center;
    justify-content: space-between;
    margin-bottom: @g-margin * 2;
    padding: 0 @g-padding * 2;
    background-color: @g-bg-blue;
  }
  .wiki-list-box {
    position: relative;
    overflow: hidden;
    height: 100%;
  }
  @media screen and (max-width: 1000px) {
    .wiki-title-box {
      display: none;
    }
  }
}
</style>
