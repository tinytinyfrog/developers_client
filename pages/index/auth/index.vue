<template>
  <div>
    login callback pages
  </div>
</template>
<script lang="tsx">
import cookieUtils from '@/lib/cookie-utils'
export default {
  name: 'Oauth',
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

        })
    }
  }
}
</script>
<style scoped>

</style>
