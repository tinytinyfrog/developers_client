<template>
  <g-sidebar v-if="honor && honor.list.length" :title="honor.title" background-color="#fff">
    <router-link
      v-for="(item, index) in honor.list"
      :key="index"
      :to="{path: `/user/${item.id}`}"
      class="user-honor-list g-bg-hover"
      target="_blank"
    >
      <Avatar :src="item.avatar" shape="square" size="large" />
      <div class="honor-info-box">
        <div class="honor-user">
          <span class="title">{{ item.nickname }}</span>
          <span class="honor-level"> · V{{ item.level }}</span>
        </div>
        <span class="honor-job">{{ item.job || '划水专员~' }}</span>
      </div>
    </router-link>
  </g-sidebar>
</template>

<script>
import { Avatar } from 'ant-design-vue'
export default {
  name: 'SliderHonorList',
  components: {
    Avatar
  },
  props: {
    honor: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="less" scoped>
.user-honor-list {
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: @g-padding * 2 @g-padding * 2 @g-padding;
  width: 100%;
  color: @font-color-second;
  &:last-child {
    padding-bottom: @g-padding * 2;
  }
  &:hover {
    .title {
      color: @g-main-color !important;
    }
  }
  .honor-info-box {
    margin-left: @g-margin * 2;
    .honor-user {
      line-height: 1;
      .title {
        color: @font-color-first;
        font-size: @font-third;
      }
      .honor-level {
        font-size: @font-fifth;
        font-weight: 400;
      }
    }
    .honor-job {
      display: inline-block;
      margin-top: 7px;
      font-size: @font-fifth;
    }
  }
}
</style>
