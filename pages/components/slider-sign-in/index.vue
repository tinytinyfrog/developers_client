<template>
  <g-sidebar background-color="#fff">
    <div class="slider-sign-in">
      <div class="sign-in-block">
        <span class="greeting">
          <Icon class="calender" type="calendar" theme="filled" />
          <span v-if="nickname" class="nickname">{{ nickname }}&nbsp;</span>
          <span>{{ timeGreeting() }}好!</span>
        </span>
        <Button v-auth="{handler: onSignIn }" type="primary" :ghost="hasSignIn" :loading="loading">
          {{ hasSignIn ? '已签到' :'签到' }}
        </Button>
      </div>
      <div class="good-life">
        认真学习 认真工作 认真生活
      </div>
    </div>
  </g-sidebar>
</template>

<script>
import { Button, Icon } from 'ant-design-vue'
import _get from 'lodash/get'

export default {
  name: 'SliderSignIn',
  components: {
    Button,
    Icon
  },
  data () {
    return {
      loading: false,
      hasSignIn: _get(this, '$store.state.user.userInfo.hasSignIn', false),
      nickname: _get(this, '$store.state.user.userInfo.nickname', '')
    }
  },
  methods: {
    timeGreeting () {
      const hour = new Date().getHours()
      let timeString = '早上'
      if (hour >= 12) {
        timeString = '下午'
      }
      if (hour >= 18) {
        timeString = '晚上'
      }
      return timeString
    },
    onSignIn () {
      if (this.hasSignIn) {
        return
      }
      this.loading = true
      this.$api.userSignIn().then((code) => {
        this.loading = false
        this.hasSignIn = Number(code) === 0
        if (this.hasSignIn) {
          this.$store.dispatch('user/getUserInfo', { $api: this.$api, clear: true })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.slider-sign-in {
  border-radius: @g-radius;
  overflow: hidden;
  padding: @g-padding * 2;
  .sign-in-block {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    .greeting {
      display: flex;
      align-items: center;
    }
    .calender {
      font-size: 24px;
      color: @g-main-color;
      margin-right: @g-margin;
    }
    .nickname {
      font-weight: bold;
    }
  }
  .good-life {
    color: #606a78;
    font-size: 15px;
    font-weight: 300;
  }
}
</style>
