<template>
  <g-sidebar :title="recommend.title" background-color="#fff">
    {{ recommend.title }}
    <div v-for="(item, index) in recommend.list" :key="index" class="recommend-ctx-container">
      <h3 class="recommend-title g-hidden-line1">
        {{ item.title }}
      </h3>
      <div class="recommend-infos">
        <span>
          <Avatar :src="item.authorAvatar" size="small" />
          <span>{{ item.authorNickname }}</span>
        </span>
        <span>
          <span>
            <Icon class="operation-icon g-hover" type="eye" />
            &nbsp;{{ item.views }}
          </span>
          <span>
            <Icon class="operation-icon g-hover" type="like" />
            &nbsp;{{ item.approvals }}
          </span>
        </span>
      </div>
    </div>
  </g-sidebar>
</template>

<script>
import { Avatar, Icon } from 'ant-design-vue'
export default {
  name: 'SliderRecommend',
  components: {
    Icon,
    Avatar
  },
  props: {
    recommend: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="less" scoped>
.recommend-ctx-container {
  font-size: 14px;
  padding: @g-padding * 2 @g-padding * 2 @g-padding;
  .recommend-infos {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
