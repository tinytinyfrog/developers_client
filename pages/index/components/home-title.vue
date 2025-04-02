<template>
  <div class="home-content-title">
    <span
      v-for="(tag, index) in titleTags"
      :key="index"
      :class="{'active': currentTagIndex === index}"
      class="title-tag"
      @click="$emit('update:currentTagIndex', index)"
    >
      {{ tag.title }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'PageHomeTitle',
  props: {
    currentTagIndex: {
      type: Number,
      default: 0
    },
    titleTags: {
      type: Array,
      default: () => ([])
    }
  }
}
</script>

<style lang="less" scoped>
  .home-content-title {
    display: flex;
    height: @tab-height;
    line-height: @tab-height;
    box-sizing: border-box;
    border-bottom: 1px solid @border-5-color;
    padding-left: @g-padding * 2;
    .title-tag {
      color: #4e5969;
      font-size: @font-third;
      margin-right: 35px;
      cursor: pointer;
    }
    .active {
      color: @g-main-color;
      font-weight: bold;
      border-bottom: 3px solid @g-main-color;
    }
  }
  @media screen and (max-width: 1000px) {
    .home-content-title {
      height: @tab-height - 10px;
      line-height: @tab-height - 10px;
    }
  }
</style>
