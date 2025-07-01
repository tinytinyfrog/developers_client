<template>
  <g-card
    class="half-card"
    title="AI学习天地"
    :go-to="() => debouncedHandleGoto('/article?tagId=1042840')"
    hide-more
  >
    <template>
      <div class="info-content">
        <ai-project-banner />
        <div style="margin-top: 12px">
          <a-tabs v-model="activeKey" @change="callback">
            <a-tab-pane key="1" tab="AI赋能工程">
              <a-spin :spinning="loading">
                <template v-if="aiList.length > 0">
                  <div
                    v-for="(item, index) of aiList"
                    :key="index"
                    class="info-item"
                    @click="(e) => debouncedHandleGoto(`/article/${item.id}`)"
                  >
                    <div class="full-item">
                      <div class="tag">
                        <a-tag color="blue">
                          {{ item.categoryDesc }}
                        </a-tag>
                      </div>
                      <div class="content" :title="item.introduction">
                        {{ item.title }}
                      </div>
                    </div>
                  </div>
                </template>
                <div v-else class="info-empty">
                  <a-empty />
                </div>
              </a-spin>
            </a-tab-pane>
            <a-tab-pane key="2" tab="专题培训课" force-render>
              <a-spin :spinning="loading">
                <template v-if="aiList.length > 0">
                  <div
                    v-for="(item, index) of aiList"
                    :key="index"
                    class="info-item"
                    @click="(e) => debouncedHandleGoto(`/article/${item.id}`)"
                  >
                    <div class="full-item">
                      <div class="tag">
                        <a-tag color="blue">
                          {{ item.categoryDesc }}
                        </a-tag>
                      </div>
                      <div class="content" :title="item.introduction">
                        {{ item.title }}
                      </div>
                    </div>
                  </div>
                </template>
                <div v-else class="info-empty">
                  <a-empty />
                </div>
              </a-spin>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </template>
  </g-card>
</template>
<script lang="js" name="AiPOST">
import AiProjectBanner from './ai-project-banner.vue'
const default1Img = require('@/assets/images/home/bg1.png')
const default2Img = require('@/assets/images/home/bg2.png')
export default {
  name: 'AiPost',
  components: {
    AiProjectBanner
  },
  data () {
    const aiList = []
    const loading = false
    return {
      aiList,
      loading,
      default1Img,
      default2Img,
      activeKey: '1'
    }
  },
  watch: {
    activeKey (nVal, oVal) {
      if (nVal !== oVal) {
        this.fetchAiPostList()
      }
    }
  },
  created () {
    this.debouncedHandleGoto = this.debounce(this.handleGoto, 300)
  },
  beforeMount () {
    this.fetchAiPostList()
  },
  methods: {
    debounce (func, wait) {
      let timeout
      return function (...args) {
        const context = this
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          func.apply(context, args)
        }, wait)
      }
    },
    handleGoto (path) {
      // 添加防抖
      this.$router.push(path)
    },
    getImgUrl (urlList) {
      console.log(urlList, 'getImgUrl')
      if (!(typeof urlList === 'string')) {
        return ''
      }
      const urls = JSON.parse(urlList)
      if (urls.length > 0) {
        return urls[0]?.url
      } else {
        return ''
      }
    },
    fetchAiPostList () {
      const params = {
        pageSize: 5, pageNo: 1, filter: { category: 'ARTICLE', tagIds: [this.activeKey === '1' ? 1042840 : 1042847] }
      }
      this.loading = true
      this.$api.getPostList(params).then((res) => {
        if (res?.length > 0) {
          this.aiList = res
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style scoped lang="less">
.card-header {
  display: flex;
  height: 54px;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px solid rgb(226, 232, 246);
  .header-left {
    display: flex;
    padding: 16px 14px 0px 14px;
    column-gap: 36px;
    align-items: flex-start;
    .tab {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      .tab-item {
        display: flex;
        column-gap: 4px;
        cursor: pointer;

        .img {
          width: 14px;
          height: 14px;
        }

        .text {
          color: rgb(40, 40, 40);
          font-family: PingFang SC;
          font-size: 16px;
          font-weight: 400;
        }
      }
      .tab-item:hover {
        .text {
          color: #0060ff;
          font-weight: 600;
        }
      }
      .item-active {
        width: 100%;
        height: 4px;
        .block {
          width: 40%;
          margin: 0 auto;
          height: 4px;
          border-radius: 100px;
          background: rgb(0, 112, 255);
        }
      }
    }
    .tab-active {
      .tab-item {
        display: flex;
        column-gap: 4px;
        cursor: pointer;

        .img {
          width: 14px;
          height: 14px;
        }

        .text {
          color: #0070ff;
          font-family: PingFang SC;
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
  }
  .talent-header {
    display: flex;
    column-gap: 8px;
  }
  .header-right {
    padding: 16px 14px 16px 0;
  }
  .header-right {
    .more {
      color: #0060ff;
      cursor: pointer;
    }
  }
}
.half-card {
  width: calc((100% - (20px * 1)) / 2);
}

.info-content {
  padding: 22px 20px;
  height: 542px;
  .block {
    display: flex;
    column-gap: 20px;
    margin: 10px 0px 28px 0px;
    .block-item {
      width: calc((100% - (20px * 1)) / 2);
      border-radius: 4px;
      background: rgb(241, 247, 254);
      height: 150px;
      display: flex;
      column-gap: 20px;
      padding: 16px;
      .img {
        width: 118px;
        height: 118px;
      }
      .content {
        flex: 1;
        color: rgb(40, 40, 40);
        font-size: 14px;
        font-weight: 400;
        display: -webkit-box;
        overflow: hidden; /* 隐藏溢出的内容 */
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
        height: 108px;
      }
    }
  }
  .info-item {
    display: flex;
    column-gap: 20px;
    justify-content: space-between;
    padding: 18px 12px;
    border-bottom: 1px solid rgb(226, 232, 246);
    cursor: pointer;
    .full-item {
      display: flex;
      column-gap: 8px;
      width: 100%;
      align-items: center;
    }
    .item-left {
      display: flex;
      column-gap: 8px;
      flex: 1;
      align-items: center;
      width: 0;
      .review-icon {
        width: 24px;
        height: 24px;
        border-radius: 2px;
        background: rgb(250, 100, 1);
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .case-icon {
        width: 24px;
        height: 24px;
        border-radius: 2px;
        background: rgb(28, 196, 121);
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .img {
        width: 14px;
        height: 14px;
      }
      .tag {
        min-width: 40px;
      }
      .content {
        flex: 1;
        color: rgb(40, 40, 40);
        font-size: 14px;
        font-weight: 400;
        white-space: nowrap; /* 防止文本换行 */
        overflow: hidden; /* 隐藏溢出的内容 */
        text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
      }
      .content-warning {
        flex: 1;
        color: rgb(250, 100, 1);
        font-size: 14px;
        font-weight: 400;
        white-space: nowrap; /* 防止文本换行 */
        overflow: hidden; /* 隐藏溢出的内容 */
        text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
      }
    }
    .item-right {
      display: flex;
      column-gap: 8px;
      align-items: center;
      min-width: 38%;
      .item-avatar {
        width: 24px;
        height: 24px;
      }
      .name {
        width: 60px;
        white-space: nowrap; /* 防止文本换行 */
        overflow: hidden; /* 隐藏溢出的内容 */
        text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
      }
      .divier {
        width: 1px;
        background: rgb(196, 196, 196);
        height: 18px;
      }
    }
  }
}
.info-empty {
  height: 322px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
