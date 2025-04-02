<template>
  <div class="g-footer-container">
    footer - 后期是否使用
  </div>
</template>

<script>
export default {
  name: 'GFooter'
}
</script>

<style lang="less">
  @fill-height: 60px;
  .g-footer-container {
    height: 100px;
    max-width: @max-width;
    margin: 0 auto;
    color: #fff;
    border-radius: @g-radius;
    background-color: #fff;
  }
</style>
