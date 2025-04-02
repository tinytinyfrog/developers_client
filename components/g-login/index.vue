<template>
  <div id="g-login-model" class="g-login-model">
    <Modal
      v-model="showLogin"
      :width="400"
      title="登录"
      :get-container="getContainer"
      :cancel-text="false"
      :closable="false"
    >
      <div class="login-item">
        <Input ref="userNameInput" v-model="email" size="large" placeholder="请输入昵称/邮箱" autocomplete="off">
          <Icon slot="prefix" type="mail" />
        </Input>
      </div>
      <div class="login-item">
        <InputPassword
          ref="userNameInput"
          v-model="password"
          type="password"
          size="large"
          placeholder="请输入密码"
          autocomplete="new-password"
        >
          <Icon slot="prefix" type="lock" />
        </InputPassword>
      </div>
      <Alert v-if="errorMessage" class="error-message" type="error" :message="errorMessage" banner />
      <div class="login-action">
        <span class="action g-hover" @click="onQrcodeLogin">微信扫码登录</span>
      </div>
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
import { Modal, Input, Button, Alert, Icon } from 'ant-design-vue'
import cookieUtils from '@/lib/cookie-utils'
const InputPassword = Input.Password
export default {
  components: {
    Modal, Button, Alert, InputPassword, Icon, Input
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
      password: '',
      errorMessage: '',
      showLogin: this.show
    }
  },
  watch: {
    showLogin (val) {
      this.$emit('update:show', val)
    },
    show (val) {
      if (val !== this.showLogin) {
        this.showLogin = val
      }
    }
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.onKeyDown)
  },
  mounted () {
    window.addEventListener('keydown', this.onKeyDown)
  },
  methods: {
    onQrcodeLogin () {
      this.$emit('update:show', false)
      this.$emit('qrcode-login')
    },
    onKeyDown (e) {
      const keyNum = window.event ? e.keyCode : e.which
      if (keyNum === 13 && this.show) {
        this.handleOk()
      }
    },
    getContainer () {
      return document.getElementById('g-login-model')
    },
    handleOk () {
      this.$api.login({
        email: this.email,
        password: this.password
      }).then((data) => {
        if (data.data) {
          cookieUtils.setToken(data.data)
          this.$emit('update:show', false)
          this.errorMessage = ''
          this.$store.dispatch('user/getUserInfo', this)
          this.$notification.success({
            duration: 2,
            message: '登录成功！',
            description: '恭喜你可以为所欲为了~'
          })
          location.reload()
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
  .g-login-model {
    background-color: #fff;
    .login-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      width: 100%;
      text-align: left;
      .auth-code {
        width: 230px;
      }
    }
    .error-message {
      margin-bottom: 20px;
    }
    .login-action {
      text-align: right;
      .action {
        cursor: pointer;
      }
    }
   /deep/.ant-modal-footer, /deep/.ant-modal-header  {
      border-color: #f2f2f2 !important;
    }
  }
</style>
