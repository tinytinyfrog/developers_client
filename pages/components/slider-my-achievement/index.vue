<template>
  <g-sidebar v-if="myAchievement" title="我的成就" background-color="#fff">
    <div class="my-faq-container">
      <p class="item">
        <span class="label">{{ myAchievement.articleNumb }}</span>
        <span class="text-title">文章</span>
      </p>
      <p class="item">
        <span class="label">{{ myAchievement.faqNumb }}</span>
        <span class="text-title">提问</span>
      </p>
      <p class="item">
        <span class="label">{{ myAchievement.commentNumb }}</span>
        <span class="text-title">回答</span>
      </p>
      <p class="item">
        <span class="label">{{ myAchievement.approvalNumb }}</span>
        <span class="text-title">获赞</span>
      </p>
    </div>
  </g-sidebar>
</template>

<script>
export default {
  name: 'SliderMyAchievement',
  props: {
    myAchievement: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="less" scoped>
.my-faq-container {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding: @g-padding * 2;
  .item {
    margin: 0;
    span {
      text-align: center;
      display: block;
    }
  }
  .label {
    font-size: 16px;
    font-weight: bold;
  }
  .text-title {
    color: @font-color-third;
    font-size: 12px;
    margin-top: 8px;
  }
}
</style>
