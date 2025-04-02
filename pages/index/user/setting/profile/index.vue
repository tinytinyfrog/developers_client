<template>
  <div class="page-my-profile-container g-margin-top">
    <div class="content">
      <Tabs tab-position="left">
        <TabPane key="1" tab="基础信息" class="tabs-content" force-render>
          <FormModel
            ref="ruleForm"
            :model="form"
            :rules="rules"
          >
            <FormModeItem label="头像">
              <Upload
                :action="`${this.$global.developerServer}/developers-server/rest/file/image/upload`"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                :headers="headers"
                :before-upload="beforeUpload"
                @change="handleChange"
              >
                <img :style="previewStyle" class="preview-img" :src="imageUrl" alt="avatar">
              </Upload>
            </FormModeItem>
            <FormModeItem ref="nickname" label="昵称" required prop="nickname">
              <Input
                v-model="form.nickname"
                @blur="() => { $refs.nickname.onFieldBlur()}"
              />
            </FormModeItem>
            <FormModeItem label="职业" prop="job">
              <Input v-model="form.job" />
            </FormModeItem>
            <FormModeItem label="个人简介" prop="signature">
              <Input v-model="form.signature" type="textarea" />
            </FormModeItem>
            <div class="action-box">
              <Button @click="handleBack">
                返回
              </Button>
              <Button style="margin-left: 10px;" type="primary" @click="onSubmit">
                保存
              </Button>
            </div>
          </FormModel>
        </TabPane>
        <TabPane key="2" tab="其它信息" class="tabs-content" force-render>
          <FormModel
            ref="ruleFormOther"
            :model="formOther"
          >
            <FormModeItem label="github" prop="github">
              <Input v-model="formOther.github" />
            </FormModeItem>
            <FormModeItem label="个人网站" prop="website">
              <Input v-model="formOther.website" />
            </FormModeItem>
            <FormModeItem label="地址" prop="address">
              <Input v-model="formOther.address" />
            </FormModeItem>
            <div class="action-box">
              <Button @click="handleBack">
                返回
              </Button>
              <Button style="margin-left: 10px;" type="primary" @click="onSubmitOther">
                保存
              </Button>
            </div>
          </FormModel>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
/**
 * 题库主页
 * */
import { FormModel, Upload, Button, Input, Tabs } from 'ant-design-vue'
import cookieUtils from '@/lib/cookie-utils'
const FormModeItem = FormModel.Item
const TabPane = Tabs.TabPane

export default {
  name: 'PageMyProfile',
  components: {
    FormModel,
    FormModeItem,
    Upload,
    Button,
    Input,
    Tabs,
    TabPane
  },
  asyncData ({ store }) {
    const userInfo = store.state.user.userInfo
    return {
      userInfo,
      imageUrl: userInfo.avatar,
      form: {
        avatar: userInfo.avatar,
        nickname: userInfo.nickname,
        job: userInfo.job,
        signature: userInfo.signature
      },
      formOther: {
        github: userInfo.github,
        website: userInfo.website,
        address: userInfo.address
      },
      rules: {
        nickname: [
          { required: true, message: '昵称不能为空' },
          { min: 2, max: 10, message: '昵称必须满足2-10个字' }
        ],
        signature: [{ required: false, trigger: 'blur' }]
      },
      previewStyle: {
        width: '108px',
        height: '108px',
        borderRadius: '3px',
        objectFit: 'cover'
      }
    }
  },
  data () {
    return {
      headers: {
        Token: cookieUtils.getToken(),
        windowWidth: 0
      }
    }
  },
  methods: {
    handleChange ({ file }) {
      if (file.response && file.response.data) {
        const avatarUrl = file.response.data
        this.updateUserAvatar(avatarUrl)
      }
    },
    updateUserAvatar (avatarUrl) {
      this.$api.updateUserAvatar({
        avatarUrl
      }).then((res) => {
        this.imageUrl = avatarUrl
      })
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isJpgOrPng && isLt2M
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    handleBack () {
      history.back()
    },
    onSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$api.updateUserInfo({
            ...this.form
          }).then((res) => {
            if (res.success) {
              this.$notification.success({
                duration: 2,
                message: '更新成功！'
              })
              this.$store.dispatch('user/getUserInfo', {
                $api: this.$api,
                clear: true
              }).then((res) => {
                this.userInfo = this.$store.state.user.userInfo
              })
              this.showEdit = false
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          return false
        }
      })
    },
    onSubmitOther () {
      this.$refs.ruleFormOther.validate((valid) => {
        if (valid) {
          this.$api.updateUserOtherInfo({
            ...this.formOther
          }).then((res) => {
            if (res.success) {
              this.$notification.success({
                duration: 2,
                message: '更新成功！'
              })
              this.$store.dispatch('user/getUserInfo', {
                $api: this.$api,
                clear: true
              }).then((res) => {
                this.userInfo = this.$store.state.user.userInfo
              })
              this.showEdit = false
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less">
.page-my-profile-container {
  width: 100%;
  min-height: 100vh;
  .content {
    width: calc(100% - @sidebar-width - @g-padding * 2);
    padding: @g-padding * 2;
    min-height: 100vh;
    margin: 0 auto;
    background-color: #fff;
    .action-box {
      text-align: right;
      margin-top: @g-margin * 4;
    }
    .ant-form-item-control {
      line-height: 1;
    }
    .ant-form-item {
      margin-bottom: @g-margin;
    }
  }
}
@media screen and (max-width: 1000px) {
  .page-my-profile-container {
    .content {
      width: 100%;
      padding-left: 0;
    }
  }
}
</style>
