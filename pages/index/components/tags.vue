<template>
  <div class="category-tags-container">
    <div v-if="tags.length" class="tags-container">
      <div class="tags">
        <span class="tag" :class="{'tag-active': activeTagId === 0}" @click="handlerTag(null)">全部</span>
        <span
          v-for="(item, index) in tags"
          :key="index"
          class="tag"
          :class="{'tag-active': +activeTagId === item.id}"
          @click="handlerTag(item)"
        >{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '@/lib/event-bus'
import { replaceUrlByQuery } from '@/lib/utils'
export default {
  name: 'CategoryTags',
  props: {
    activeCategory: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tags: [],
      tagIds: [],
      activeTagId: 0
    }
  },
  watch: {
    '$route.query': {
      deep: true,
      handler (val) {
        this.activeTagId = 0
      }
    }
  },
  mounted () {
    EventBus.$on('G_CATEGORY', this.handleTagGroup)
    this.checkCategory()
  },
  beforeDestroy () {
    EventBus.$off('G_CATEGORY', this.handleTagGroup)
  },
  methods: {
    handlerTag (item) {
      const ids = item ? [item.id] : this.tagIds
      this.tagId = item ? item.id : ''
      this.activeTagId = item ? item.id : 0
      replaceUrlByQuery({ tagId: this.tagId })
      EventBus.$emit('G_Tags', ids)
    },
    // 同步url参数
    checkCategory () {
      const { category, tagId } = this.$route.query
      if (category) {
        this.handleTagGroup(category, tagId)
      }
    },
    handleTagGroup (groupName, tagId = 0) {
      const tags = this.$store.state.tag.tags
      this.tags = tags.filter(item => item.groupName === groupName)
      const ids = this.tags.map(item => item.id)
      this.tagIds = ids
      this.activeTagId = tagId || 0
      // 手动切换时才更新
      if (!tagId) {
        EventBus.$emit('G_Tags', ids)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .category-tags-container {
    width: 100%;
    max-width: @max-width;
    .categories {
      width: 100%;
      padding: 10px 0;
      margin: 0 auto;
      .tag-category {
        margin-right: 20px;
        font-weight: bold;
        cursor: pointer;
      }
    }
    .tags-container {
      width: 100%;
    }
    .tags {
      margin: 0 auto;
      .tag {
        color: @font-color-third;
        display: inline-block;
        background-color: #fff;
        padding: 3px 10px;
        border-radius: @g-radius;
        font-size: 13px;
        margin-right: 8px;
        cursor: pointer;
        margin-top: @g-margin;
        box-shadow: 0 5px 8px 2px #f2f2f2;
        &:hover {
          color: @g-active-color;
        }
      }
      .tag-active {
        color: @g-main-color;
        background-color: @g-bg-blue;
        box-shadow: 0 5px 8px 2px #fff;
      }
    }
  }
  @media screen and (max-width: 1000px) {
    .category-tags-container {
      padding: 0 16px;
      overflow: auto;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
      .tags {
        white-space: nowrap;
      }
    }
  }
</style>
