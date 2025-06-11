<template>
  <div class="login-container">
    <div class="login-header">
      <img class="logo" src="~/assets/images/header/logo.png" alt="">
      <a-divider type="vertical" class="a-divider" />
      <img class="intro-logo" src="~/assets/images/header/intro.png" alt="">
    </div>
    <div class="login-content">
      <div class="login-block">
        <div class="login-title">
          嗨，您好！
        </div>
        <div class="login-desc">
          欢迎来到交付中心门户，登录以继续
        </div>
        <div class="login-form">
          <a-form :form="form" :label-col="{ span:24 }" :wrapper-col="{ span: 24 }" @submit="handleSubmit">
            <a-form-item label="账号">
              <a-input
                v-decorator="['email', { rules: [{ required: true, message: '请输入账号' }] }]"
                placeholder="请输入账号"
              />
            </a-form-item>
            <a-form-item label="密码">
              <a-input-password
                v-decorator="['password', { rules: [{ required: true, message: '请输入密码' }] }]"
                placeholder="请输入密码"
              />
            </a-form-item>
          </a-form>
        </div>
        <a-button type="primary" class="login-button" :loading="loading" @click="handleLogin">
          登录
        </a-button>
        <a-button class="login-button" @click="handleOpenAuth">
          拓维认证中心登录
        </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import cookieUtils from '@/lib/cookie-utils'
export default {
  data () {
    const form = this.$form.createForm(this, {
      password: undefined,
      email: undefined
    })
    return {
      errorMessage: '',
      form,
      loading: false
    }
  },
  methods: {
    async handleLogin () {
      this.loading = true
      try {
        const value = await this.form.validateFields()
        this.$api.login({
          ...value
        }).then((data) => {
          if (data.data) {
            cookieUtils.setToken(data.data)
            this.errorMessage = ''
            this.$store.dispatch('user/getUserInfo', this)
            this.$notification.success({
              duration: 2,
              message: '登录成功！'
            })
            location.href = location.origin + '/home'
          } else {
            cookieUtils.clearToken()
            this.errorMessage = data.message
            this.$notification.error({
              duration: 2,
              message: this.errorMessage
            })
          }
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    handleOpenAuth () {
      // location.href = 'http://it.talkweb.com.cn/idaas/login?client_id=1834156237792284674&redirect_uri=http%3A%2F%2F192.168.35.12%3A19102%2F%23%2FloginRedirect&response_type=code'
      location.href = 'https://it.talkweb.com.cn/idaas/login?client_id=1899739142530338818&redirect_uri=https://delivery.paas.talkweb.com.cn/auth&response_type=code'
    }
  }
}
</script>
<style scoped lang="less">
    .login-container {
        width: 100%;
        height: 100vh;
        background: url('@/assets/images/login/bg.png');
        background-size: contain;
       .login-header {
          padding:  44px 52px 0px 52px;
       }
       .a-divider {
        background:rgb(128, 154, 255);
        height: 38px;
        margin: 0 16px;
      }
      .login-content {
        margin-top: 115px;
        height: 600px;
        position: relative;
        .login-block {
            position: absolute;
            right: 13%;
            width: 520px;
            height: 100%;
            border-radius: 10px;
            box-shadow: 0px 4px 36px 0px rgba(89, 120, 149, 0.1);
            background: rgb(255, 255, 255);
            padding: 62px 60px;
            .login-title {
                color: rgb(24, 31, 56);
                font-size: 28px;
                font-weight: 400;
            }
            .login-desc {
                margin-top: 10px;
                color: rgb(24, 31, 56);
                font-size: 16px;
                font-weight: 400;
            }
            .login-form {
                margin-top: 30px;
                margin-bottom: 24px;
            }
            .login-button {
                width: 100%;
                margin-top: 22px
            }
        }
      }
    }
    ::v-deep .ant-form-item-label {
        color: rgb(24, 31, 56);
        font-family: PingFang SC;
        font-size: 18px;
        font-weight: 500;
    }
    ::v-deep .ant-input {
        height: 48px;
        border: 1px solid rgb(225, 229, 232);
        border-radius: 6px;
        background: rgb(249, 249, 249);
    }
    ::v-deep .ant-btn-primary {
        height: 48px;
        border-radius: 6px;
        box-shadow: 0px 12px 24px 0px rgba(0, 112, 255, 0.24);
        background: rgb(0, 112, 255) !important;
    }
    ::v-deep .ant-btn {
        height: 48px;
        border: 1px solid rgb(225, 229, 232);
        border-radius: 6px;
        box-shadow: 0px 12px 24px 0px rgba(0, 112, 255, 0.06);
        background: rgb(255, 255, 255);
        font-size: 16px;
        font-weight: 500;
    }
</style>
