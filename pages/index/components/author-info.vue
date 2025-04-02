<template>
  <g-sidebar title="关于作者" background-color="#fff">
    <div v-if="authorInfo" class="author-info">
      <div class="infos">
        <Avatar
          size="large"
          shape="square"
          class="user-header"
          :src="authorInfo.avatar"
          :alt="authorInfo.nickname"
          @click.stop.prevent="$utils.openNewWindow(`/user/${authorInfo.id}`)"
        />
        <div class="detail-info">
          <span class="nickname" @click.stop.prevent="$utils.openNewWindow(`/user/${articleInfo.authorId}`)">{{ authorInfo.nickname }} </span>
          <Button
            v-auth="{handler: onFocus}"
            type="primary"
            :loading="loading"
            :ghost="follow"
          >
            {{ follow ? '已关注' : '关注' }}
          </Button>
        </div>
      </div>
      <p class="signature g-hidden-line2">
        <Tooltip :title="authorInfo.signature">
          {{ authorInfo.signature || '这个人很懒~' }}
        </Tooltip>
      </p>
      <div class="achievement-infos">
        <div>
          <p class="acht-item">
            <span class="level">等级 </span>
            <span class="level-number"> LV{{ authorInfo.level }}</span>
          </p>
          <p class="acht-item btm-acht">
            <span class="level">粉丝 </span>
            <span class="level-number"> {{ authorInfo.fasNumb }}</span>
          </p>
        </div>
        <div>
          <p class="acht-item ">
            <span class="level">获赞 </span>
            <span class="level-number">{{ authorInfo.approvalNumb }}</span>
          </p>
          <p class="acht-item btm-acht">
            <span class="level">经验 </span>
            <span class="level-number">{{ authorInfo.experience }}</span>
          </p>
        </div>
      </div>
    </div>
  </g-sidebar>
</template>

<script>
import { Avatar, Button, Tooltip } from 'ant-design-vue'
export default {
  name: 'AuthorInfo',
  components: {
    Avatar,
    Button,
    Tooltip
  },
  props: {
    hasFollow: {
      type: Boolean,
      default: false
    },
    authorInfo: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      loading: false,
      follow: this.hasFollow
    }
  },
  methods: {
    onFocus () {
      this.loading = true
      const authorId = this.authorInfo.id
      try {
        if (this.follow) {
          this.$api.unFollowUserById(authorId).then((res) => {
            this.follow = this.loading = false
          })
          return
        }
        this.$api.followUserById(authorId).then((res) => {
          if (res.code === 0) {
            this.follow = true
            this.loading = false
          }
        })
      } catch (e) {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.author-info {
  background-color: #fff;
  border-radius: @g-radius;
  padding: @g-padding * 2;
  .infos {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    .user-header {
      cursor: pointer;
      margin-right: 10px;
    }
    .nickname {
      cursor: pointer;
      font-size: @font-third;
      display: inline-block;
      color: @font-color-first;
      font-weight: bold;
      margin-bottom: 4px;
    }
    .level {
      font-size: @font-fifth;
      color: @font-color-second;
    }
    .detail-info {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0;
      .level-number {
        font-size: @font-fifth;
        color: @g-main-color;
      }
    }
    .other-msg {
      font-size: @font-fifth;
      color: @font-color-second;
    }
  }
  .signature {
    cursor: pointer;
    color: @font-color-third;
    font-size: @font-fifth;
    width: @sidebar-width - 40px;
    margin-bottom: 15px;
  }
  .achievement-infos {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: @font-fourth;
    color: @font-color-second;
    .acht-item {
      text-align: left;
      line-height: 1;
      margin-bottom: @g-margin * 2;
      width: (@sidebar-width - 20px) / 2;
    }
    .experience-fire {
      font-size: 20px;
      color: @g-main-color;
    }
    .btm-acht {
      margin-bottom: 0;
    }
  }
}
</style>
