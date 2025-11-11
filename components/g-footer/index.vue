<template>
  <div class="g-footer-container">
    <div>
      <span> 版权所有：拓维信息系统股份有限公司 </span>
    </div>
    <div>
      <span>友情链接：</span>
      <span><a href="https://www.csdn.net">CSDN</a></span>
      <span><a href="https://segmentfault.com/">思否</a></span>
      <span><a href="https://it.talkweb.com.cn">拓维信息</a></span>
    </div>
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
  padding: 20px 0;
}
</style>
