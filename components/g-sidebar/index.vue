<template>
  <div class="g-sidebar-container" :style="{ backgroundColor: backgroundColor }">
    <h2 v-if="title" class="slider-title">
      {{ title }}
    </h2>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'GSidebar',
  props: {
    backgroundColor: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less">
  .g-sidebar-container {
    width: @sidebar-width;
    min-width: @sidebar-width;
    border-radius: @g-radius;
    box-sizing: border-box;
    overflow: hidden;
    margin-bottom: @g-margin * 2;
    .slider-title {
      padding: 0 @g-padding * 2;
      font-size: @font-second;
      color: @font-color-first;
      font-weight: bold;
      height: @title-height - 10;
      line-height: @title-height - 10;
      border-bottom: 1px solid @border-3-color;
      margin-bottom: 0;
    }
  }
  @media screen and (max-width: 1000px) {
    .g-sidebar-container {
      display: none;
    }
  }
</style>
