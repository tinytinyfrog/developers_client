<template>
  <div class="page-my-account-container">
    <div class="content">
      <h1 class="title">
        {{ title }}
      </h1>
    </div>
    <GSidebar>
      <div>{{ title }}-自定义Slidbar</div>
      <div>用户信息</div>
      <div>作者信息</div>
      <div>题目相关</div>
      <div>等等等</div>
      <div>单独定义组件即可</div>
    </GSidebar>
  </div>
</template>

<script>
/**
 * 题库主页
 * */
export default {
  name: 'PageMyAccount',
  asyncData () {
    return {
      title: '用户主页-账号设置'
    }
  }
}
</script>

<style lang="less">
.page-my-account-container {
  display: flex;
  width: 100%;
  justify-content: space-between;
  min-height: 100vh;
}
.content {
  width: 700px;
  background-color: #fff;
}
</style>
