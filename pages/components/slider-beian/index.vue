<template>
  <g-sidebar>
    <div class="slider-record-box">
      <p>
        <a class="record-link" href="https://www.12377.cn/" target="_blank">
          网上有害信息举报专区
        </a>
      </p>
      <p>
        <a class="record-link" href="https://beian.miit.gov.cn/" target="_blank">
          浙ICP备2021032878号-1
        </a>
      </p>
      <p>
        <a class="record-link" href="/about" target="_blank">
          关于我们
        </a>
      </p>
    </div>
  </g-sidebar>
</template>

<script>
export default {
  name: 'SliderBeiAn'
}
</script>

<style lang="less" scoped>
.slider-record-box {
  border-radius: @g-radius;
  margin-bottom: @g-margin;
  overflow: hidden;
  padding: @g-padding;
  p {
    margin-bottom: 8px;
  }
  .record-link {
    font-size: 12px;
    color: @font-color-third;
  }
}
</style>
