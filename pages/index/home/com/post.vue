<template>
  <g-card class="half-card">
    <template #header>
      <div class="card-header">
        <div class="header-left">
          <div v-for="(item,index) of tabList" :key="index" class="tab" :class="[activeIndex === index ?'tab-active' :'']" @click="e => handleClick(index)">
            <div class="tab-item">
              <div>
                <img class="img" :src="item.icon">
              </div>
              <div class="text">
                {{ item.label }}
              </div>
            </div>
            <div v-if="activeIndex === index" class="item-active">
              <div class="block" />
            </div>
          </div>
        </div>
        <div class="header-right">
          <div class="more" @click="e => handleGoto(`/article`)">
            更多 >
            <div />
          </div>
        </div>
      </div>
    </template>
    <template>
      <a-spin :spinning="loading">
        <div class="info-content">
          <template v-if="postList.length > 0">
            <div v-for="(item,index) of postList" :key="index" class="info-item" @click="e => handleGoto(`/article/${item.id}`)">
              <div class="item-left">
                <div style="width:14px">
                  <!-- <img v-if="item.flag" :src="item.flag" class="img"> -->
                  <img :src="item.icon" class="img">
                </div>
                <div class="tag">
                  <a-tag color="blue">
                    {{ item.categoryDesc }}
                  </a-tag>
                </div>
                <div class="content" :title="item.title + item.introduction">
                  {{ item.title }}
                </div>
              </div>
              <div class="item-right">
                <a-avatar class="item-avatar" :src="item.authorAvatar || defaultImg" />
                <div class="name">
                  {{ item.authorNickname }}
                </div>
                <div class="divier" />
                <div>
                  {{ item.createAtString }}
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <a-empty />
          </template>
        </div>
      </a-spin>
      </div>
    </template>
  </g-card>
</template>
<script lang="js" name="PostCom">
const hotImg = require('@/assets/images/home/hot.png')
const newImg = require('@/assets/images/home/new.png')
const recommonImg = require('@/assets/images/home/recommond.png')
export default {
  name: 'Post',
  data () {
    const activeIndex = 0
    const loading = false
    const tabList = [{
      label: '最新',
      icon: newImg
    },
    {
      label: '最火',
      icon: hotImg
    },
    {
      label: '推荐',
      icon: recommonImg
    }]
    const postList = [

    ]
    return {
      activeIndex,
      tabList,
      postList,
      loading
    }
  },
  watch: {
    activeIndex (val) {
      if (typeof val === 'number') {
        this.fetchPostList()
      }
    },
    monthValue (val) {
      this.fetchUserStatistics()
    }
  },
  beforeMount () {
    this.fetchPostList()
  },
  methods: {
    handleClick (index) {
      this.activeIndex = index
    },
    handleGoto (path) {
      this.$router.push(path)
    },
    fetchPostList () {
      const params = {
        pageSize: 8, pageNo: 1, filter: { category: 'ARTICLE', tagIds: [], sortByViews: this.activeIndex === 1 ? true : null, official: this.activeIndex === 2 ? true : null, marrow: null }
      }
      this.loading = true
      this.$api.getPostList(params).then((res) => {
        console.log('cdee', res)
        if (Array.isArray(res)) {
          res = res.map((i) => {
            return { ...i, icon: this.activeIndex === 0 ? newImg : this.activeIndex === 1 ? hotImg : recommonImg }
          })
          this.postList = res
          console.log(this.postList, 'post')
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
            display:flex;
            height:54px;
            justify-content: space-between;
            width:100%;
            border-bottom: 1px solid rgb(226, 232, 246);
            .header-left {
                display:flex;
                padding: 16px 14px 0px 14px;
                column-gap:36px;
                align-items: flex-start;
                .tab {
                    display:flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;
                .tab-item {
                    display:flex;
                    column-gap:4px;
                    cursor:pointer;

                    .img {
                        width:14px;
                        height:14px;
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
                        color :#0060ff;
                        font-weight:600
                    }
                }
                .item-active {
                    width:100%;
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
                    display:flex;
                    column-gap:4px;
                    cursor:pointer;

                    .img {
                        width:14px;
                        height:14px;
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
                    color:#0060ff;
                    cursor:pointer;
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
            margin-bottom: 28px;
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
            display:flex;
            column-gap: 20px;
            justify-content: space-between;
            padding: 18px 12px;
            border-bottom: 1px solid rgb(226, 232, 246);
            cursor: pointer;
            .full-item {
                display:flex;
                column-gap: 8px;
                width: 100%;
                align-items:center;
            }
            .item-left {
                display:flex;
                column-gap: 8px;
                flex:1;
                align-items:center;
                width: 0;
                .review-icon {
                  width:24px;
                  height:24px;
                  border-radius: 2px;
                  background: rgb(250, 100, 1);
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }

                .case-icon {
                  width:24px;
                  height:24px;
                  border-radius: 2px;
                  background: rgb(28, 196, 121);
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
                .img {
                        width:14px;
                        height:14px;
                    }
                .tag {
                    min-width:40px
                }
                .content {
                    flex:1;
                    color: rgb(40, 40, 40);
                    font-size: 14px;
                    font-weight: 400;
                    white-space: nowrap; /* 防止文本换行 */
                    overflow: hidden; /* 隐藏溢出的内容 */
                    text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */

                }
                .content-warning {
                    flex:1;
                    color:rgb(250, 100, 1);
                    font-size: 14px;
                    font-weight: 400;
                    white-space: nowrap; /* 防止文本换行 */
                    overflow: hidden; /* 隐藏溢出的内容 */
                    text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */

                }
            }
            .item-right {
                display:flex;
                column-gap: 8px;
                align-items:center;
                min-width: 38%;
                .item-avatar {
                  width: 24px;
                  height: 24px;
                }
                .name {
                    width:60px;
                    white-space: nowrap; /* 防止文本换行 */
                    overflow: hidden; /* 隐藏溢出的内容 */
                    text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */

                }
                .divier {
                    width :1px;
                    background:rgb(196, 196, 196);
                    height:18px
                }
            }
        }

    }
</style>
