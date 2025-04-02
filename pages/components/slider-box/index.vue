<template>
  <div v-if="sliderData.list.length" class="slider-common-box">
    <div class="title">
      <span>{{ sliderData.title }}<span v-if="sliderData.total" class="total">（{{ sliderData.total }}）</span></span>
    </div>
    <div class="slider-list">
      <router-link v-for="(item, index) in sliderData.list" :key="index" class="slider-item" :to="{path: item.path}" target="_blank">
        <GUserPopover :user-id="item.id">
          <img class="user-header" :src="item.avatar">
        </GUserPopover>
        <span class="user-name">{{ item.nickname }}</span>
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
.slider-common-box {
  background-color: #fff;
  border-radius: @g-radius;
  margin-bottom: @g-margin * 2;
  overflow: hidden;
  .title {
    display: flex;
    color: @font-color-first;
    height: @tab-height;
    align-items: center;
    justify-content: space-between;
    padding: 0 @g-padding * 2;
    font-weight: bold;
    font-size: @font-second;
    border-bottom: 1px solid @border-5-color;
  }
  .slider-list {
    display: grid;
    grid-template-columns: repeat(4, 60px);
    grid-template-rows: 70px;
    grid-auto-rows: 70px;
    grid-row-gap: @g-margin * 2;
    justify-content: space-between;
    cursor: pointer;
    padding: @g-padding * 2;
    .slider-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: @font-color-first;
      &:nth-child(4n) {
        margin-right: 0;
      }
      &:hover {
        color: @g-active-color;
      }
    }
    .user-header {
      width: 45px;
      height: 45px;
      border-radius: @g-radius;
    }
    .user-name {
      font-size: 12px;
      margin-top: 6px;
      white-space: nowrap;
    }
  }
}
</style>
