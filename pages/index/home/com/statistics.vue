<template>
  <g-card class="half-card" title="数据统计" hide-more>
    <template>
      <a-spin :spinning="loading">
        <div class="statistics">
          <div v-for="(item,index) of statisticList" :key="index">
            <div class="statistics-item">
              <div v-for="(k,v) of item.child" :key="v" class="statistics-card">
                <div class="statistics-card-left">
                  <div class="img-inner-wrap">
                    <img :src="k.icon">
                  </div>
                </div>
                <div class="statistics-card-right">
                  <div class="statistics-card-title">
                    {{ k.label }}
                  </div>
                  <div class="statistics-card-count">
                    {{ k.count }}
                  </div>
                </div>
              </div>
            </div>
            <div class="statistics-item-bg" />
          </div>
        </div>
      </a-spin>
    </template>
  </g-card>
</template>
<script lang="js" name="Statistics">

const memberImg = require('@/assets/images/home/member.png')
const viewImg = require('@/assets/images/home/view.png')
const dayImg = require('@/assets/images/home/today.png')
const postImg = require('@/assets/images/home/post.png')
const devloperImg = require('@/assets/images/home/devlopment.png')
const infoImg = require('@/assets/images/home/info.png')
const wikiImg = require('@/assets/images/home/wiki.png')
export default {
  name: 'Statistics',
  data () {
    const statisticList = []
    const loading = false
    return {
      statisticList,
      loading
    }
  },
  beforeMount () {
    this.fetchStatistics()
  },
  methods: {
    handleGoto (path) {
      this.$router.push(path)
    },
    fetchStatistics () {
      this.loading = true
      this.$api.getStatistics().then((res) => {
        if (res) {
          console.log('getStatistics', res)
          this.statisticList = [{
            child: [
              {
                label: '成员数',
                count: res?.userCount || 0,
                icon: memberImg
              },
              {
                label: '总访问量',
                count: res?.totalViews || 0,
                icon: viewImg
              },
              {
                label: '当日访问量',
                count: res?.todayViews || 0,
                icon: dayImg
              }
            ]
          },
          {
            child: [
              {
                label: '帖子数',
                count: res?.articleCount || 0,
                icon: postImg
              },
              {
                label: '开发平台&通用框架',
                count: res?.platformOpsPostCount || 0,
                icon: devloperImg
              }

            ]
          },
          {
            child: [
              {
                label: '咨询广场',
                count: res?.newsCount || 0,
                icon: infoImg
              },
              {
                label: '知识库',
                count: res?.wikiCount || 0,
                icon: wikiImg
              }

            ]
          }]
          // this.statisticList = res
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style scoped lang="less">
     .statistics {
    margin: 10px 24px;
    padding: 16px 32px;
   margin-bottom:30px;
    height: 308px;
    background-image: url('~/assets/images/home/statistics-bg.png');
    .statistics-item {
      display: flex;
      column-gap: 10px;
      height: 60px;
      .statistics-card {
        display: flex;
        width: calc((100% - (10px * 2)) / 3);
        column-gap: 18px;
        .statistics-card-left {
            height: 60px;
            width:60px;
            border-radius: 4px;
            background: rgb(213, 237, 254);
            padding: 14px;
           .img-inner-wrap {
            border-radius: 4px;
            width: 32px;
            height: 32px;
            background: rgb(0, 112, 255);
            display: flex;
            justify-content: center;
            align-items: center;
            .img {
              width: 16px;
              height: 12px;
            }
           }

        }
        .statistics-card-right {
            .statistics-card-title {
              color: rgb(40, 40, 40);
              font-family: PingFang SC;
              font-size: 14px;
              font-weight: 400;
            }
            .statistics-card-count {
              color: rgb(40, 40, 40);
              font-family: PingFang SC;
              font-size: 28px;
              font-weight: 400;
            }

        }
        .statistics-card-left {

        }
      }
    }
    .statistics-item-bg {
      height: 28px;
      width: 100%;
      margin-bottom: 14px;
      background-image: url('~/assets/images/home/statistics-item-bg.png');
    }
  }
  </style>
