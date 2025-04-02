<template>
  <div id="g-login-model" class="g-login-model">
    <Modal
      v-model="showLogin"
      :width="400"
      :footer="null"
      title="请使用微信扫描二维码登录"
      :get-container="getContainer"
      :cancel-text="false"
      :closable="true"
      :z-index="99999"
      @cancel.stop.prevent="clearTimer()"
    >
      <div class="qrcode-box">
        <img v-if="loginQrCode" class="wx-login-qrcode" :src="loginQrCode" alt="">
        <Spin v-else />
        <span v-if="tips" class="mask">
          <span class="time-out" @click="refreshCode">{{ tips }}</span>
        </span>
      </div>
      <p class="email-login-btn">
        <span v-if="showEimail" class="g-hover" @click="onEmailLogin">邮箱登录</span>
      </p>
    </Modal>
  </div>
</template>
<script>
import { Modal, Spin } from 'ant-design-vue'
import cookieUtils from '@/lib/cookie-utils'
import EventBus from '@/lib/event-bus'
export default {
  components: {
    Modal,
    Spin
  },
  props: {
    showEimail: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      qrcodeStatus: 0,
      timer: 0,
      scene: '',
      loginQrCode: '',
      email: '',
      password: '',
      errorMessage: '',
      showLogin: this.show
    }
  },
  computed: {
    tips () {
      let tips = ''
      switch (this.qrcodeStatus) {
        case 1: tips = '扫码成功 请确认登录'; break
        case 3: tips = '二维码已过期 点击刷新'; break
      }
      return tips
    }
  },
  watch: {
    showLogin (val) {
      this.$emit('update:show', val)
    },
    show: {
      immediate: true,
      async handler (val) {
        if (val !== this.showLogin) {
          this.showLogin = val
        }
        if (val) {
          try {
            this.loginQrCode = ''
            const res = await this.$api.getWxLogoQrcode()
            this.scene = res.scene
            this.loginQrCode = `data:image/jpg;base64,${res.qrCode}`
            this.getWxLoginToken()
          } catch (e) {
            console.log(e)
          }
        }
      }
    }
  },
  beforeDestroy () {
    this.clearTimer()
    window.removeEventListener('keydown', this.onKeyDown)
  },
  mounted () {
    EventBus.$on('GLOGIN', () => {
      this.$emit('update:show', true)
    })
  },
  methods: {
    clearTimer () {
      clearInterval(this.timer)
      this.qrcodeStatus = 0
      this.loginQrCode = ''
    },
    async getQrcode () {
      const res = await this.$api.getWxLogoQrcode()
      this.scene = res.scene
      this.loginQrCode = `data:image/jpg;base64,${res.qrCode}`
      this.getWxLoginToken()
    },
    onEmailLogin () {
      this.clearTimer()
      this.$emit('update:show', false)
      this.$emit('email-login')
    },
    getContainer () {
      return document.getElementById('g-login-model')
    },
    refreshCode () {
      this.clearTimer()
      this.getQrcode()
    },
    getWxLoginToken () {
      let times = 0
      this.timer = setInterval(() => {
        if (times >= 180) {
          this.qrcodeStatus = 3
          clearInterval(this.timer)
          return
        }
        times++
        this.$api.getWxQrcodeToken(this.scene).then((data) => {
          // 0: 初始值，1： 已扫码 2：确认登录
          if (data) {
            this.qrcodeStatus = data.status
            if (data.status === 2) {
              this.clearTimer()
              this.loginSuccess(data.token)
            }
          }
        })
      }, 1500)
    },
    loginSuccess (token) {
      cookieUtils.setToken(token)
      this.$emit('update:show', false)
      this.errorMessage = ''
      this.$store.dispatch('user/getUserInfo', this)
      this.$notification.success({
        duration: 2,
        message: '登录成功！',
        description: '恭喜你可以为所欲为了~'
      })
      location.reload()
    },
    handleOk () {
      this.$api.login({
        email: this.email,
        password: this.password
      }).then((data) => {
        if (data.data) {
          this.loginSuccess(data.data)
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
    .qrcode-box {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 250px;
      height: 250px;
      margin: 0 auto;
      .wx-login-qrcode {
        width: 100%;
        height: 100%;
      }
      .mask {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        color: #fff;
        font-size: 14px;
        border-radius: @g-radius * 2;
        background-color: rgba(0, 0, 0, 0.6);
        .time-out {
          cursor: pointer;
        }
      }
    }
    .email-login-btn {
      text-align: right;
      margin-top: 10px;
      padding: 0 40px;
      color: @font-color-third;
    }
   /deep/.ant-modal-body {
     text-align: center;
     padding-top: 40px;
     padding-bottom: 40px;
    }
  }
</style>
