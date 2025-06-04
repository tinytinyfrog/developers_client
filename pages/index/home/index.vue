<template>
  <div class="home-container">
    <div class="home-container-banner">
      <a-carousel>
        <img v-for="(item,index) of bannerList" :key="index" class="home-container-banner-img" :src="item.imgUrl">
      </a-carousel>
    </div>
    <div class="home-content">
      <div class="item">
        <Post />
        <AiPost />
      </div>
      <div class="item">
        <Map />
      </div>
      <div class="item">
        <Review />
        <Case />
      </div>
      <div class="item">
        <Journal />
        <Salon />
      </div>
      <div class="item">
        <Expert />
        <Honor />
      </div>
      <div class="item">
        <Team />
      </div>
      <div class="item">
        <Talent />
        <Statistics />
      </div>
    </div>
  </div>
</template>
<script>
import Post from './com/post.vue'
import AiPost from './com/ai-post.vue'
import Map from './com/map.vue'
import Case from './com/case.vue'
import Review from './com/review.vue'
import Journal from './com/journal.vue'
import Salon from './com/salon.vue'
import Expert from './com/expert.vue'
import Honor from './com/honor.vue'
import Team from './com/team.vue'
import Talent from './com/talent.vue'
import Statistics from './com/statistics.vue'

const defaultImg = require('@/assets/images/home/default-user.png')
const bannerDefaultImg = require('@/assets/images/banner.png')
export default {
  name: 'PageHome',
  components: {
    Post,
    AiPost,
    Map,
    Case,
    Review,
    Journal,
    Salon,
    Expert,
    Honor,
    Team,
    Talent,
    Statistics
  },
  data () {
    const bannerList = [{
      imgUrl: bannerDefaultImg,
      actionUrl: ''
    }, {
      imgUrl: bannerDefaultImg,
      actionUrl: ''
    }
    ]
    return {
      defaultImg,
      bannerList
    }
  },
  watch: {

  },
  beforeMount () {
    this.fetchBannerList()
  },
  methods: {
    handleClick (index) {
      this.activeIndex = index
    },
    handleGoto (path) {
      this.$router.push(path)
    },

    fetchBannerList () {
      const params = { pageSize: 10, pageNo: 1, filter: { state: null, name: null, type: 'HOME_CAROUSEL' } }
      this.$api.getBannerLists(params).then((res) => {
        console.log(res, 'banner')
        if (res?.list?.length > 0) {
          this.bannerList = res.list.map((i) => {
            return JSON.parse(i.content)
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
    background: #F6F6F6;
    min-height:100vh;
    overflow:auto;
    &-banner {
        &-img {
          width: 100%;
          height:300px;
        }

       ::v-deep .ant-carousel .slick-dots-bottom {
        bottom: 20px !important
      }
    }
    .home-content{
        padding:20px 96px;
        .item {
            margin-bottom:20px;
            display:flex;
            column-gap:20px;
            cursor:pointer;
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

            .full-card {
            width: 100%
        }

        }
    }
}
::v-deep .ant-carousel .slick-slide {
  height: 300px;
  // line-height: 160px;
  // background: #364d79 !important;
  overflow: hidden;
}

::v-deep .ant-carousel .slick-slide h3 {
  color: #fff;
}

::v-deep .ant-carousel .slick-dots li button {
  border-radius: 2px;
  background: rgb(177, 206, 242);
  height: 6px;
}

::v-deep .ant-carousel .slick-dots-bottom {
  bottom: -16px
}

::v-deep .ant-carousel .slick-dots li.slick-active button{
  border-radius: 100px;
  background: rgb(0, 112, 255);
  height: 6px;
}

::v-deep .el-carousel__arrow--left {
  display: block !important;
  background: #fff;
  border: 1px solid rgb(170, 218, 255);
box-shadow: 0px 4px 24px 0px rgba(0, 159, 255, 0.24);
background: rgb(255, 255, 255);
}

::v-deep .el-carousel__arrow--left i {
  color:black !important
}

::v-deep .el-carousel__arrow--right {
  display: block !important;
  background: #fff;
  border: 1px solid rgb(170, 218, 255);
box-shadow: 0px 4px 24px 0px rgba(0, 159, 255, 0.24);
background: rgb(255, 255, 255);
}

::v-deep .el-carousel__arrow--right i {
  color:black !important
}

::v-deep .el-carousel__indicators--outside {
  display: none;
}

// .el-carousel__item .team-item {
//     font-size: 14px;
//     line-height: 200px;
//     margin: 0;
//   }

//   .el-carousel__item:nth-child(2n) {
//     background-color: #99a9bf;
//   }

//   .el-carousel__item:nth-child(2n+1) {
//     background-color: #d3dce6;
//   }

</style>
