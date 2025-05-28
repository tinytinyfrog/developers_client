<template>
  <div class="g-footer-container">
    湘ICP证2-2-2025007 拓维信息系统股份有限公司版权所有
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
    height: 84px;
    width: 100%;
    color: rgb(40, 40, 40);
    font-size: 14px;
    font-weight: 400;
    border-radius: @g-radius;
    background-color: #fff;
    text-align: center;
    line-height: 84px;
  }
</style>
