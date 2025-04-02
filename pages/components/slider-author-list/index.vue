<template>
  <g-sidebar v-if="$store.state.tag.tags.length" title="作者榜" background-color="#fff">
    <div class="recommend-tags-container">
      <span
        v-for="(tag, key) in $store.state.tag.tags.slice(0, 16)"
        :key="key"
        class="recommend-tag"
        @click="handleTagSearch(tag)"
      >{{ tag.name }}</span>
    </div>
  </g-sidebar>
</template>

<script>
export default {
  name: 'SliderRecommendTags',
  methods: {
    handleTagSearch ({ id, name }) {
      window.open(`/tag/${id}?name=${encodeURIComponent(name)}`, '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
.recommend-tags-container {
  font-size: 14px;
  padding: @g-padding * 2 @g-padding * 2 @g-padding;
  .recommend-tag {
    display: inline-block;
    color: @font-color-second;
    font-size: 13px;
    padding: 3px 6px;
    background-color: @g-bg-blue;
    border-radius: @g-radius;
    box-sizing: border-box;
    width: (@sidebar-width - 20px) / 2 - 20px;
    margin-bottom: 10px;
    text-align: center;
    &:nth-child(2n-1) {
      margin-right: 20px;
    }
    &:hover {
      color: #fff;
      background-color: @g-main-color;
    }
  }
}
</style>
