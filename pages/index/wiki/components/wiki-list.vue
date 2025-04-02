<template>
  <div class="page-wiki-list">
    <div class="category-tags-container">
      <div class="categories">
        <span
          v-for="(item, index) in selfCategoryList"
          :key="index"
          class="tag-category"
          :class="{'active-category': activeCategoryIndex === index}"
          @click="getWikiListByCategory(index)"
        >{{ item.name }}</span>
      </div>
    </div>
    <div class="wiki-list">
      <a-card
        v-for="(wiki, key) in wikiList"
        :key="key"
        hoverable
        style="min-width: 120px"
        @click="$utils.openNewWindow(`/wiki/${wiki.id}`)"
      >
        <img
          slot="cover"
          class="wiki-head-cover"
          alt="example"
          :src="wiki.headImg + '?imageView2/1/w/208/h/260'"
        >
        <a-card-meta :title="wiki.name" />
        <a-icon class="book-icon" type="book" />
        <a-icon v-if="!wiki.show" class="book-hide" type="eye-invisible" />
      </a-card>
      <p class="loading-box">
        <span v-if="loading">
          <a-icon type="loading" /> 加载中...
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import EventBus from '@/lib/event-bus'
export default {
  name: 'WikiList',
  props: {
    wikiType: {
      type: String,
      default: 'show'
    },
    categoryList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      pageNo: 1,
      pageSize: 100,
      loading: false,
      finished: false,
      activeCategoryIndex: 0,
      wikiList: [],
      selfCategoryList: [
        {
          id: '',
          name: '全部'
        }
      ]
    }
  },
  watch: {
    categoryList (list) {
      this.selfCategoryList = [
        {
          id: '',
          name: '全部'
        }
      ].concat(list.filter(item => item.refCount > 0))
    }
  },
  mounted () {
    this.getWikiList()
    EventBus.$on('on-update-wiki', () => {
      this.finished = false
      this.getWikiList()
    })
  },
  beforeDestroy () {
    EventBus.$off('on-update-wiki')
  },
  methods: {
    getWikiListByCategory (index) {
      this.activeCategoryIndex = index
      this.finished = false
      this.getWikiList()
    },
    getWikiList () {
      if (this.finished || this.loading) return
      this.loading = true
      const { pageNo, pageSize, selfCategoryList, activeCategoryIndex } = this
      const method = this.wikiType === 'all' ? 'getWikiList' : 'getMySelfWikiList'
      this.$api[method]({
        pageNo,
        pageSize,
        filter: {
          categoryId: selfCategoryList[activeCategoryIndex].id
        }
      }).then((list) => {
        this.loading = false
        this.wikiList = pageNo === 1 ? list : [...this.wikiList, ...list]
        this.finished = list.length < pageSize
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page-wiki-list {
  .category-tags-container {
    background-color: #fff;
    font-size: @font-fourth;
    width: 100%;
    padding: 0 @g-padding;
    .categories {
      display: flex;
      align-items: center;
      margin: 0 auto;
      max-width: @max-width;
      padding: @g-padding 0;
      .tag-category {
        cursor: pointer;
        color: @font-color-first;
        font-size: 16px;
        margin: 0 6px;
        padding: 4px 15px;
        word-break: keep-all;
        box-shadow: 0 0 8px 2px #f2f2f2;
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
  .wiki-list {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: @g-margin * 3;
    padding: @g-padding * 2 @g-padding;
    /deep/.ant-card-meta {
      margin: 0;
    }
    /deep/.ant-card-body {
      padding: 0;
    }
    /deep/.ant-card-meta-detail {
      padding: 10px;
    }
    /deep/.ant-card-bordered {
      position: relative;
      overflow: hidden;
      border-radius: 5px;
      &:hover {
        box-shadow: 0 0 8px 5px rgba(0, 0, 0, 0.2);
      }
      .book-icon {
        position: absolute;
        right: @g-margin;
        top: 0;
        font-size: 30px;
        color: #f2f2f2;
      }
      .book-hide {
        font-size: 18px;
        position: absolute;
        right: 13px;
        top: 5px;
        color: red;
      }
    }
    .loading-box {
      padding-top: 30px;
      text-align: center;
    }
  }
  @media screen and (max-width: 1000px) {
    .wiki-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: @g-margin * 2;
      padding: @g-padding * 2 @g-padding;
    }
  }
}
</style>
