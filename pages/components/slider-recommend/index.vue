<template>
  <g-sidebar v-if="recommend.list.length" :title="recommend.title" background-color="#fff">
    <router-link
      v-for="(item, index) in recommend.list"
      :key="index"
      :to="{path: `/${item.category === 'ARTICLE' ? 'article' : 'faq'}/${item.id}`}"
      class="recommend-ctx-container"
      target="_blank"
    >
      <h3 class="recommend-title g-hidden-line1 g-hover">
        {{ item.title }}
      </h3>
      <div class="recommend-infos">
        <span class="g-flex-between">
          <GUserPopover :user-id="item.authorId">
            <a-space @click.stop.prevent="$utils.openUserCenter(item.authorId)">
              <Avatar :src="item.authorAvatar" :size="18" />
              <span class="g-hover">{{ item.authorNickname }}</span>
            </a-space>
          </GUserPopover>
        </span>
        <span>
          <span>
            <Icon class="operation-icon g-hover" type="eye" />
            &nbsp;{{ item.views }}
          </span>&nbsp;
          <span>
            <Icon class="operation-icon g-hover" type="like" />
            &nbsp;{{ item.approvals }}
          </span>
        </span>
      </div>
    </router-link>
  </g-sidebar>
</template>

<script>
import { Icon, Avatar } from 'ant-design-vue'
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
  display: inline-block;
  font-size: 14px;
  padding: 12px @g-padding * 2;
  width: 100%;
  .recommend-title {
      font-size: @font-third;
      cursor: pointer;
      margin-bottom: @g-margin * 2;
    }
  .recommend-infos {
    display: flex;
    align-items: center;
    color: @font-color-third;
    font-size: @font-fifth;
    justify-content: space-between;
  }
  &:last-child {
    padding-bottom: 20px;
  }
}
</style>
