<template>
  <div class="category-tags-container">
    <div class="categories">
      <span
        v-for="(item, index) in tagGroup"
        :key="index"
        class="tag-category"
        :class="{'active-category': activeCategory === item}"
        @click="handleCategory(item)"
      >{{ item }}</span>
    </div>
  </div>
</template>

<script>
import EventBus from '@/lib/event-bus'
import { replaceUrlByQuery } from '@/lib/utils'

export default {
  name: 'CategoryTags',
  data () {
    return {
      activeCategory: '全部',
      currentIndex: 0,
      tagGroup: this.$store.state.tag.tagGroup
    }
  },
  watch: {
    '$route.query': {
      deep: true,
      handler (val) {
        this.currentIndex = 0
        this.activeCategory = '全部'
      }
    }
  },
  mounted () {
    EventBus.$on('G_CLEAR_GROUP', () => {
      this.handleCategory('全部')
    })
    this.checkCategory()
  },
  methods: {
    scrollToTop () {
      const c = document.documentElement.scrollTop || document.body.scrollTop
      if (c > 0) {
        window.requestAnimationFrame(this.scrollToTop)
        window.scrollTo(0, c - c / 8)
      }
    },
    handleCategory (category) {
      this.activeCategory = category
      replaceUrlByQuery({ category, tagId: '' })
      EventBus.$emit('G_CATEGORY', category)
      this.scrollToTop()
    },
    checkCategory () {
      const categoryName = this.$route.query.category
      if (categoryName) {
        this.tagGroup.forEach((category, index) => {
          if (decodeURIComponent(categoryName) === category) {
            this.currentIndex = index
            this.activeCategory = category
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @category-width: 120px;
  .category-tags-container {
    background-color: #fff;
    font-size: @font-fourth;
    width: 100%;
    border-bottom: 1px solid @border-4-color;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.05);
    .categories {
      display: flex;
      align-items: center;
      margin: 0 auto;
      max-width: @max-width;
      height: @title-height - 16px;
      .tag-category {
        cursor: pointer;
        color: @font-color-second;
        font-size: 15px;
        margin: 14px 6px;
        padding: 3px 14px;
        word-break: keep-all;
        &:first-child {
          margin-left: 0;
        }
        &:last-child {
          border-bottom-width: 0
        }
        &:hover {
          color: @g-active-color;
          background-color: @g-bg-blue;
        }
      }
      .active-category {
        color: #fff;
        background-color: @g-main-color;
        font-weight: bold;
        border-radius: @g-radius;
        &:hover {
          background-color: @g-bg-blue;
        }
      }
    }
  }
  @media screen and (max-width: 1000px) {
    .category-tags-container {
      padding: 0 16px;
      box-sizing: border-box;
      overflow: auto;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
      .categories {
        height: 45px !important;
      }
    }
  }
</style>
