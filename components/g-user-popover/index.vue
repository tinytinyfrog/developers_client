<template>
  <span class="g-user-popover" @mouseover="onMouseover">
    <Popover v-model="showUserInfo" placement="topLeft">
      <template slot="content">
        <div v-if="userInfo && !loading" style="width: 280px;">
          <div class="base-info" :style="baseInfoStyle">
            <Avatar
              shape="square"
              :src="userInfo.avatar"
              :size="87"
              @click="$utils.openUserCenter(userId)"
            />
            <div style="flex: 1; margin-left: 12px;">
              <p style="display: flex; align-items: center;justify-content: space-between; height: 36px; padding-right: 6px;">
                <span class="g-hover" style="font-weight: bold; " @click="$utils.openUserCenter(userId)">{{ userInfo.nickname }}</span>
                <Button
                  v-if="userInfo.hasOwnProperty('follow')"
                  v-auth="{handler: onFocus}"
                  type="primary"
                  size="small"
                  :ghost="userInfo.follow"
                  :loading="fLoading"
                >{{ userInfo.follow ? '已关注' : '关注' }}</Button>
              </p>
              <p>
                <span :style="signatureStyle">{{ userInfo.job || '搬砖工~' }}</span>
              </p>
              <p class="honour-icon" style="font-size: 16px; margin-top: 5px;">
                <Tooltip v-if="userInfo.github" placement="top">
                  <template slot="title">
                    {{ userInfo.github }}
                  </template>
                  <Icon type="github" class="g-hover" @click="$utils.openNewWindow(userInfo.github)" />
                </Tooltip>
                <Icon v-else type="github" class="g-disabled" />
                <g-space :size="0" />
                <Tooltip v-if="userInfo.website" placement="top">
                  <template slot="title">
                    {{ userInfo.website }}
                  </template>
                  <Icon type="link" class="g-hover" @click="$utils.openNewWindow(userInfo.website)" />
                </Tooltip>
                <Icon v-else type="link" class="g-disabled" />
                <g-space :size="0" />
                <Tooltip v-if="userInfo.address" placement="top">
                  <template slot="title">
                    {{ userInfo.address }}
                  </template>
                  <Icon type="home" class="g-hover" />
                </Tooltip>
                <Icon v-else type="home" class="g-disabled" />
              </p>
            </div>
          </div>
          <p v-if="userInfo.signature" class="g-hidden-line2" :style="signatureStyle">{{ userInfo.signature }}</p>
          <div class="other-honr" style="margin-top: 15px; display: flex; justify-content: space-between;">
            <span :style="infoItemStyle">
              <span style="font-weight: bold;">{{ userInfo.fasNumb }}</span>
              <span :style="fontSize">关注Ta</span>
            </span>
            <span :style="infoItemStyle">
              <span style="font-weight: bold;">{{ userInfo.articleNumb }}</span>
              <span :style="fontSize">文章</span>
            </span>
            <span :style="infoItemStyle">
              <span style="font-weight: bold;">{{ userInfo.experience }}</span>
              <span :style="fontSize">经验值</span>
            </span>
            <span :style="infoItemStyle">
              <span style="font-weight: bold;">{{ userInfo.approvalNumb }}</span>
              <span :style="fontSize">获赞</span>
            </span>
          </div>
        </div>
        <Spin v-else />
      </template>
      <slot />
    </Popover>
  </span>
</template>

<script>
import { Popover, Avatar, Button, Spin, Icon, Tooltip } from 'ant-design-vue'

export default {
  name: 'GUserPopover',
  components: {
    Popover,
    Avatar,
    Button,
    Spin,
    Icon,
    Tooltip
  },
  props: {
    userId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      users: {},
      userInfo: null,
      loading: false,
      fLoading: false,
      showUserInfo: false,
      baseInfoStyle: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
        borderRadius: '3px',
        backgroundColor: 'rgba(5, 105, 204, 0.05)',
        border: '1px solid rgba(5, 105, 204, 0.05)'
      },
      infoItemStyle: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
      },
      fontSize: {
        color: '#939aa3',
        fontSize: '12px'
      },
      signatureStyle: {
        fontWeight: 400,
        fontSize: '13px',
        color: '#939aa3',
        marginTop: '15px'
      }
    }
  },
  methods: {
    upCache (id, userInfo) {
      this.$store.commit('userProfile/insertUserInfo', {
        id,
        userInfo
      })
    },
    onFocus () {
      this.fLoading = true
      try {
        if (this.userInfo.follow) {
          this.$api.unFollowUserById(this.userId).then((res) => {
            if (res.success) {
              this.userInfo.follow = this.fLoading = this.follow = false
              this.upCache(this.userId, this.userInfo)
              return
            }
            this.$message.error(res.message)
          })
          return
        }
        this.$api.followUserById(this.userId).then((res) => {
          if (res.success) {
            this.userInfo.follow = this.follow = true
            this.fLoading = false
            this.upCache(this.userId, this.userInfo)
            return
          }
          this.$message.error(res.message)
        })
      } catch (e) {
        this.fLoading = false
      }
    },
    onMouseover () {
      if (this.showUserInfo || this.loading) { return }
      this.getUserInfo()
    },
    async getUserInfo () {
      const id = this.userId
      let userInfo = this.$store.state.userProfile.users[id]
      if (userInfo) {
        this.userInfo = userInfo
        this.showUserInfo = true
        return
      }
      this.loading = true
      userInfo = {}
      await Promise.all([
        this.$api.getUserInfoById(id).then((info) => {
          userInfo = {
            ...info,
            ...userInfo
          }
        }),
        this.$api.checkFollowUserById(id).then((res) => {
          userInfo = {
            follow: !!res?.data,
            ...userInfo
          }
        })
      ])
      this.upCache(id, userInfo)
      this.userInfo = userInfo
      this.showUserInfo = true
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.g-user-popover {
  .base-info {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
}
</style>
