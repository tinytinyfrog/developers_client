<template>
  <div v-if="sliderData.list.length" class="slider-common-list">
    <div class="title">
      <span>{{ sliderData.title }}</span>
      <span v-if="sliderData.more" class="more" @click="onMore">更多</span>
    </div>
    <div class="slider-list">
      <router-link v-for="(item, index) in sliderData.list" :key="index" :to="`/article/${item.id}`" class="slider-item" target="_blank">
        <span class="article-title g-hidden-line1 g-hover">{{ item.title }}</span>
        <span v-if="showTime" class="article-time">{{ item.createAt | formatDate('YYYY/MM') }}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SliderCommonBox', // 1
  props: {
    sliderData: {
      type: Object,
      default: null
    },
    showTime: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onMore () {
      location.href = this.sliderData.path
    }
  }
}
</script>

<style lang="less" scoped>
.slider-common-list {
  background-color: #fff;
  border-radius: @g-radius;
  margin-bottom: @g-margin * 2;
  overflow: hidden;
  .title {
    display: flex;
    height: @tab-height;
    align-items: center;
    justify-content: space-between;
    font-weight: bold;
    padding: 0 @g-padding * 2;
    color: @font-color-first;
    font-size: @font-second;
    .more {
      color: @g-active-color;
      cursor: pointer;
    }
    border-bottom: 1px solid @border-5-color;
  }
  .slider-list {
    padding: @g-padding * 2;
    cursor: pointer;
    .slider-item {
      display: flex;
      height: 36px;
      align-items: center;
      margin: 0;
      justify-content: space-between;
      .article-title {
        display: inline-block;
        color: @font-color-first;
        max-width: 200px;
      }
      .article-time {
        color: @font-color-third;
      }
    }
  }
}
</style>
