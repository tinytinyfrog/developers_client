<template>
  <div id="g-register-model" class="g-register-model">
    <Modal
      v-model="showLogin"
      :width="400"
      title="注册"
      :get-container="getContainer"
      :cancel-text="false"
      :closable="false"
    >
      <div class="login-item">
        <Input ref="nicknameInput" v-model="nickname" size="large" placeholder="请输入昵称">
          <Icon slot="prefix" type="user" />
        </Input>
      </div>
      <div class="login-item">
        <Input ref="nicknameInput" v-model="email" size="large" placeholder="请输入邮箱">
          <Icon slot="prefix" type="mail" />
        </Input>
      </div>
      <div class="login-item">
        <InputPassword ref="nicknameInput" v-model="password" type="password" size="large" placeholder="请输入密码">
          <Icon slot="prefix" type="lock" />
        </InputPassword>
      </div>
      <div class="login-item">
        <InputPassword ref="nicknameInput" v-model="crmPassword" type="password" size="large" placeholder="请确认输入密码">
          <Icon slot="prefix" type="lock" />
        </InputPassword>
      </div>
      <Alert v-if="errorMessage" class="error-message" type="error" :message="errorMessage" banner />
      <div slot="footer" class="login-footer-box">
        <Button type="dashed" @click="$emit('update:show', false)">
          取消
        </Button>
        <Button type="primary" @click="handleOk">
          确认
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { Modal, Input, Icon, Button, Alert } from 'ant-design-vue'
import cookieUtils from '@/lib/cookie-utils'
const InputPassword = Input.Password
export default {
  components: {
    Modal, Input, Icon, Button, Alert, InputPassword
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      email: '',
      nickname: '',
      password: '',
      crmPassword: '',
      showLogin: this.show,
      errorMessage: '',
      mentionsList: ['163.com', 'qq.com', 'gmail.com', 'fixmail.com', 'outlook.com', 'icloud.com']
    }
  },
  watch: {
    show (val) {
      this.showLogin = val
    }
  },
  methods: {
    getContainer () {
      return document.getElementById('g-register-model')
    },
    handleOk () {
      if (!this.nickname) {
        this.errorMessage = '请输入一个有趣的昵称~'
        return
      }
      if (!this.password) {
        this.errorMessage = '请输入密码~'
        return
      }
      if (this.crmPassword !== this.password) {
        this.errorMessage = '前后输入的密码不一致哦~'
        return
      }
      this.$api.register({
        nickname: this.nickname,
        email: this.email,
        password: this.password
      }).then((data) => {
        if (data.data) {
          cookieUtils.setToken(data.data)
          this.$emit('update:show', false)
          this.errorMessage = ''
          this.$store.dispatch('user/getUserInfo', this)
          this.$notification.success({
            message: '注册成功！',
            description: '恭喜您成为开发者客栈的一份子，希望大家一起维护充实这个客栈，一起成长~'
          })
        } else {
          cookieUtils.clearToken()
          this.errorMessage = data.message
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .g-register-model {
    background-color: #fff;
    .login-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      .auth-code {
        width: 230px;
      }
    }
  }
</style>
