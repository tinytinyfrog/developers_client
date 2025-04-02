<template>
  <div class="g-empty-container">
    <Empty v-if="!list.length && !loading" :description="description" />
    <span v-if="loading">
      <Icon type="loading" /> 加载中...
    </span>
    <span v-if="list.length && finished">没有更多啦~</span>
  </div>
</template>
<script>
import { Empty, Icon } from 'ant-design-vue'

export default {
  name: 'GEmpty',
  components: {
    Empty,
    Icon
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    finished: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    description: {
      type: [String, Boolean],
      default: false
    }
  }
}
</script>
<style lang="less" scoped>
  .g-empty-container {
    width: 100%;
    text-align: center;
    padding: @g-padding * 2;
  }
</style>
