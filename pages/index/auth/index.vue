<template>
  <a-spin :spinning="true" tip="登录中...">
    <div class="auth-container" />
  </a-spin>
</template>
<script lang="tsx">
import cookieUtils from '@/lib/cookie-utils'
export default {
  name: 'Oauth',
  data () {
    return {
      loading: false
    }
  },
  watch: {
    $route (to) {
      console.log('路由监听进来了')
      // if (to.query.code) {
      //   this.callBack(to.query.code);
      // }
    }
  },
  mounted () {
    console.log('ounted执行了')
    this.callBack()
  },
  methods: {
    callBack () {
      // console.log('动态路由参数');
      // console.log(this.$route.params);
      // console.log(this.$route.params.tenanId);
      // console.log(this.$route.params.provider);
      const param = {
        code: this.$route.query.code

      }
      this.loading = true
      this.$api.oauth2LoginCallback(param)
        .then((res) => {
          let userInfo
          if (res.data) {
            userInfo = JSON.parse(res.data)
          }
          if (!userInfo.token) {
            this.$message.error('无效token')
            return
          }
          console.log(userInfo)
          //   this.lockStore.resetLockInfo()
          //   this.userStore.setToken(res.Authorization)
          // localStorage.setItem('TOKEN', userInfo.token)
          cookieUtils.setToken(userInfo.token)
          this.$store.dispatch('user/getUserInfo', this)
          //   localStorage.setItem('JWT_TOKEN', res.Authorization)
          this.$router.push('/')
          if (userInfo) {
            this.$message.success('登录成功')
            setTimeout(() => {}, 3000)
          }
        }).catch((e) => {
          this.$message.error(e)
          this.$router.push('/login')
        }).finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style scope lang="less">
  .auth-container {
    width: 100%;
    height: 100vh;
  }
</style>
