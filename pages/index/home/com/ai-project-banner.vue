<template>
  <div class="ai-project-banner">
    <div class="banner-content">
      <div class="banner-icon">
        <img :src="require('@/assets/images/ai-robot.png')" alt="AI">
      </div>
      <div class="banner-text">
        <h3 class="banner-title">
          AI 作业交付平台
        </h3>
        <p class="banner-desc">
          一站式完成 AI 应用开发、调试与交付!
        </p>
      </div>
      <a-button v-if="isLogin" class="enter-btn" type="primary" ghost @click="handleOpen">
        立即进入
      </a-button>
    </div>
  </div>
</template>

<script>
import cookieUtils from '@/lib/cookie-utils'

export default {
  name: 'AiProjectBanner',
  computed: {
    isLogin () {
      return cookieUtils.getToken()
    }
  },
  methods: {
    handleOpen () {
      if (cookieUtils.getToken()) {
        window.open(
          'https://it.talkweb.com.cn/idaas/login?client_id=1819198879570042881&response_type=code&redirect_uri=https://aidp.talkweb.com.cn/#/loginRedirect?appId=1104dc4a0e2542cd9183d02abe94ff55&preview=true'
        )
      } else {
        this.$message.warning('请先登录')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.ai-project-banner {
  width: 100%;
  height: 88px;
  background: linear-gradient(90deg, #6a85e3 0%, #9c6ee1 100%);
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
  color: #fff;
  position: relative;
  overflow: hidden;

  .banner-content {
    display: flex;
    align-items: center;
    height: 100%;
    position: relative;
    z-index: 2;
  }

  .banner-icon {
    width: 64px;
    height: 64px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;

    img {
      width: 40px;
      height: 40px;
    }
  }

  .banner-text {
    flex: 1;
    padding-right: 20px;
  }

  .banner-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 4px 0;
    color: #fff;
  }

  .banner-desc {
    font-size: 14px;
    opacity: 0.9;
    margin: 0;
    color: rgba(255, 255, 255, 0.9);
  }

  .enter-btn {
    white-space: nowrap;
    border-color: rgba(255, 255, 255, 0.5);
    color: #fff;
    transition: all 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: #fff;
    }
  }

  // 添加一些装饰性元素
  &::before {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    width: 120px;
    height: 100%;
    background-size: contain;
    opacity: 0.3;
  }
}
</style>
