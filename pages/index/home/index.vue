<template>
  <div class="home-container">
    <div class="home-container-banner">
      <img class="home-container-banner-img" src="~/assets/images/banner.png">
    </div>
    <div class="home-content">
      <div class="item">
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
                <div class="more">
                  更多 >
                  <div />
                </div>
              </div>
            </div>
          </template>
          <template>
            <div class="info-content">
              <div v-for="(item,index) of infoList" :key="index" class="info-item">
                <div class="item-left">
                  <div style="width:14px">
                    <img v-if="item.flag" :src="item.flag" class="img">
                  </div>
                  <div class="tag">
                    <a-tag color="blue">
                      {{ item.label }}
                    </a-tag>
                  </div>
                  <div class="content" :title="item.content">
                    {{ item.content }}
                  </div>
                </div>
                <div class="item-right">
                  <a-avatar style="width:14px;height:14px" />
                  <div class="name">
                    {{ item.name }}
                  </div>
                  <div class="divier" />
                  <div>
                    {{ item.time }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </g-card>
        <g-card class="half-card" title="AI学习天地">
          <template>
            <div class="info-content">
              <div class="block">
                <div class="block-item">
                  <div>
                    <img class="img" src="~/assets/images/home/bg1.png">
                  </div>
                  <div class="content">
                    铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮但是开房间金额快乐健康是的克利夫兰科技开了就
                  </div>
                </div>
                <div class="block-item">
                  <div>
                    <img class="img" src="~/assets/images/home/bg2.png">
                  </div>
                  <div class="content">
                    铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮但是开房间金额快乐健康是的克利夫兰科技开了就
                  </div>
                </div>
              </div>
              <div v-for="(item,index) of aiList" :key="index" class="info-item">
                <div class="full-item">
                  <div class="tag">
                    <a-tag color="blue">
                      {{ item.label }}
                    </a-tag>
                  </div>
                  <div class="content" :title="item.content">
                    {{ item.content }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </g-card>
      </div>
      <div class="item">
        <g-card class="full-card" title="知识地图">
          <template>
            <div class="map">
              <div v-for="(item,index) of mapList" :key="index" class="map-item">
                <img class="img" :src="item.icon">
                <div class="map-title">
                  {{ item.label }}
                </div>
              </div>
            </div>
          </template>
        </g-card>
      </div>
      <div class="item">
        <g-card class="half-card" title="事故复盘">
          <template>
            <div class="info-content">
              <div v-for="(item,index) of reviewList" :key="index" class="info-item">
                <div class="item-left">
                  <div class="review-icon">
                    <img src="~/assets/images/home/warning.png" class="img">
                  </div>
                  <div class="content-warning" :title="item.content">
                    {{ item.content }}
                  </div>
                </div>
                <div class="item-right">
                  <a-avatar style="width:14px;height:14px" />
                  <div class="name">
                    {{ item.name }}
                  </div>
                  <div class="divier" />
                  <div>
                    {{ item.time }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </g-card>
        <g-card class="half-card" title="优秀案例">
          <template>
            <div class="info-content">
              <div v-for="(item,index) of caseList" :key="index" class="info-item">
                <div class="item-left">
                  <div class="case-icon">
                    <img src="~/assets/images/home/like.png" class="img">
                  </div>
                  <div class="content" :title="item.content">
                    {{ item.content }}
                  </div>
                </div>
                <div class="item-right">
                  <a-avatar style="width:14px;height:14px" />
                  <div class="name">
                    {{ item.name }}
                  </div>
                  <div class="divier" />
                  <div>
                    {{ item.time }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </g-card>
      </div>
      <div class="item">
        <g-card class="half-card" title="月刊">
          <template>
            <div class="month">
              <a-carousel>
                <div class="month-list">
                  <div v-for="(item,index) of monthList" :key="index" class="month-item">
                    <div>
                      <img class="img" :src="item.icon">
                    </div>
                    <div class="text">
                      {{ item.text }}
                    </div>
                  </div>
                </div>
                <div class="month-list">
                  <div v-for="(item,index) of monthList" :key="index" class="month-item">
                    <div>
                      <img class="img" :src="item.icon">
                    </div>
                    <div class="text">
                      {{ item.text }}
                    </div>
                  </div>
                </div>
              </a-carousel>
            </div>
          </template>
        </g-card>
        <g-card class="half-card" title="沙龙">
          <template>
            <div class="salon">
              <a-carousel>
                <div class="salon-list">
                  <div v-for="(item,index) of salonList" :key="index" class="salon-item">
                    <div>
                      <img class="img" :src="item.icon">
                    </div>
                    <div class="text">
                      {{ item.text }}
                    </div>
                  </div>
                </div>
                <div class="salon-list">
                  <div v-for="(item,index) of salonList" :key="index" class="salon-item">
                    <div>
                      <img class="img" :src="item.icon">
                    </div>
                    <div class="text">
                      {{ item.text }}
                    </div>
                  </div>
                </div>
              </a-carousel>
            </div>
          </template>
        </g-card>
      </div>
      <div class="item">
        <g-card class="half-card" title="专家墙">
          <template>
            <div class="expert">
              <a-carousel>
                <div class="expert-list">
                  <div v-for="(item,index) of expertList" :key="index" class="expert-item">
                    <div>
                      <img class="img" :src="item.icon">
                    </div>
                    <div class="text">
                      <div class="name">
                        {{ item.name }}
                      </div>
                      <div class="info">
                        工号：{{ item.number }}
                      </div>
                      <div class="info">
                        部门：{{ item.dept }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="expert-list">
                  <div v-for="(item,index) of expertList" :key="index" class="expert-item">
                    <div>
                      <img class="img" :src="item.icon">
                    </div>
                    <div>
                      <div class="name">
                        {{ item.name }}
                      </div>
                      <div class="info">
                        工号：{{ item.number }}
                      </div>
                      <div class="info">
                        部门：{{ item.dept }}
                      </div>
                    </div>
                  </div>
                </div>
              </a-carousel>
            </div>
          </template>
        </g-card>
        <g-card class="half-card" title="荣誉墙">
          <template>
            <div class="hornor">
              <a-carousel>
                <div class="hornor-list">
                  <div v-for="(item,index) of hornorList" :key="index" class="hornor-item">
                    <div>
                      <img class="img" :src="item.icon">
                    </div>
                    <div class="text">
                      {{ item.text }}
                    </div>
                  </div>
                </div>
                <div class="hornor-list">
                  <div v-for="(item,index) of hornorList" :key="index" class="hornor-item">
                    <div>
                      <img class="img" :src="item.icon">
                    </div>
                    <div class="text">
                      {{ item.text }}
                    </div>
                  </div>
                </div>
              </a-carousel>
            </div>
          </template>
        </g-card>
      </div>
      <div class="item">
        <g-card class="full-card" title="优秀团队" />
      </div>
      <div class="item">
        <g-card class="half-card" title="贡献达人" />
        <g-card class="half-card" title="数据统计" />
      </div>
    </div>
  </div>
</template>
<script>
const hotImg = require('@/assets/images/home/hot.png')
const newImg = require('@/assets/images/home/new.png')
const recommonImg = require('@/assets/images/home/recommond.png')
const projectImg = require('@/assets/images/home/project.png')
const demandImg = require('@/assets/images/home/demand.png')
const qualityImg = require('@/assets/images/home/quality.png')
const techImg = require('@/assets/images/home/tech.png')
const month1Img = require('@/assets/images/home/month1.png')
const month2Img = require('@/assets/images/home/month2.png')
const month3Img = require('@/assets/images/home/month3.png')
const salon1Img = require('@/assets/images/home/salon1.png')
const salon2Img = require('@/assets/images/home/salon2.png')
const salon3Img = require('@/assets/images/home/salon3.png')
const cert1Img = require('@/assets/images/home/cert1.png')
const cert2Img = require('@/assets/images/home/cert2.png')
const cert3Img = require('@/assets/images/home/cert3.png')
const user1Img = require('@/assets/images/home/user1.png')
const user2Img = require('@/assets/images/home/user2.png')
export default {
  name: 'PageHome',
  data () {
    const activeIndex = 0
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
    const infoList = [
      {
        label: '项目管理',
        content: '年度重磅，拓维云2021 应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40',
        flag: newImg
      },
      {
        label: '项目管理',
        content: '年度重磅，拓维云2021 应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40',
        flag: hotImg
      },
      {
        label: '项目管理',
        content: '年度重磅，拓维云2021 应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40',
        flag: recommonImg
      }, {
        label: '项目管理',
        content: '年度重磅，拓维云2021 应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40'
      },
      {
        label: '项目管理',
        content: '年度重磅，拓维云2021 应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40'
      },
      {
        label: '项目管理',
        content: '年度重磅，拓维云2021 应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40'
      }, {
        label: '项目管理',
        content: '年度重磅，拓维云2021 应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40'
      },
      {
        label: '项目管理',
        content: '年度重磅，拓维云2021 应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40'
      }
    ]
    const reviewList = [
      {
        label: '项目管理',
        content: 'xx系统升级故障，应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40',
        flag: newImg
      },
      {
        label: '项目管理',
        content: 'xx系统升级故障， 应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40',
        flag: hotImg
      },
      {
        label: '项目管理',
        content: 'xx系统升级故障， 应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40',
        flag: recommonImg
      }, {
        label: '项目管理',
        content: 'xx系统升级故障， 应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40'
      },
      {
        label: '项目管理',
        content: 'xx系统升级故障， 应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40'
      }
    ]
    const caseList = [
      {
        label: '项目管理',
        content: '智慧法务系统，应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40',
        flag: newImg
      },
      {
        label: '项目管理',
        content: '智慧法务系统，七大领域400 应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40',
        flag: hotImg
      },
      {
        label: '项目管理',
        content: '智慧法务系统， 应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40',
        flag: recommonImg
      }, {
        label: '项目管理',
        content: '智慧法务系统， 应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40'
      },
      {
        label: 'AI',
        content: '智慧法务系统， 应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40'
      }
    ]
    const aiList = [
      {
        label: '项目管理',
        content: '智慧法务系统，应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40',
        flag: newImg
      },
      {
        label: '项目管理',
        content: '智慧法务系统，七大领域400 应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40',
        flag: hotImg
      },
      {
        label: 'AI',
        content: '智慧法务系统， 应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40',
        flag: recommonImg
      }, {
        label: 'AI',
        content: '智慧法务系统， 应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40'
      },
      {
        label: 'AI',
        content: '智慧法务系统， 应用构建技术实践精选，七大领域400 页➕内容可选',
        avatar: '',
        name: '张三丰',
        time: '2024-02-21 19:30:40'
      }
    ]
    const mapList = [
      {
        label: '项目管理领域',
        path: '/projcet',
        icon: projectImg
      },
      {
        label: '需求领域',
        path: '/demand',
        icon: demandImg
      },
      {
        label: '技术领域',
        path: '/tech',
        icon: techImg
      },
      {
        label: '质量领域',
        path: '/quality',
        icon: qualityImg
      }
    ]
    const monthList = [
      {
        text: '铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮但是开房间金额快乐健康是的克利夫兰科技开了就',
        icon: month1Img
      },
      {
        text: '铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮但是开房间金额快乐健康是的克利夫兰科技开了就',
        icon: month2Img
      },
      {
        text: '铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮但是开房间金额快乐健康是的克利夫兰科技开了就',
        icon: month3Img
      }
    ]
    const salonList = [
      {
        text: '铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮但是开房间金额快乐健康是的克利夫兰科技开了就',
        icon: salon1Img
      },
      {
        text: '铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮但是开房间金额快乐健康是的克利夫兰科技开了就',
        icon: salon2Img
      },
      {
        text: '铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮但是开房间金额快乐健康是的克利夫兰科技开了就',
        icon: salon3Img
      }
    ]
    const hornorList = [
      {
        text: '荣誉证书',
        icon: cert1Img
      },
      {
        text: '环境管理体系证书',
        icon: cert2Img
      },
      {
        text: '项目管理领域证书',
        icon: cert3Img
      }
    ]
    const expertList = [{
      name: '郑学长',
      number: '24883',
      dept: '交付部',
      icon: user1Img
    },
    {
      name: '郑学长',
      number: '24883',
      dept: '交付部',
      icon: user2Img
    }, {
      name: '郑学长',
      number: '24883',
      dept: '交付部',
      icon: user1Img
    }, {
      name: '郑学长',
      number: '24883',
      dept: '交付部',
      icon: user2Img
    }, {
      name: '郑学长',
      number: '24883',
      dept: '交付部',
      icon: user1Img
    }, {
      name: '郑学长',
      number: '24883',
      dept: '交付部',
      icon: user2Img
    }]
    return {
      aiList,
      tabList,
      activeIndex,
      infoList,
      reviewList,
      caseList,
      mapList,
      monthList,
      salonList,
      hornorList,
      expertList
    }
  },
  methods: {
    handleClick (index) {
      this.activeIndex = index
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
    .info-content {
        padding: 22px 20px;
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
            margin-bottom: 27px;
            .content {
              flex: 1;
              color: rgb(40, 40, 40);
              font-size: 14px;
              font-weight: 400;
              display: -webkit-box;
              overflow: hidden; /* 隐藏溢出的内容 */
              -webkit-line-clamp: 5;
              -webkit-box-orient: vertical;
            }
          }
        }
        .info-item {
            display:flex;
            column-gap: 20px;
            justify-content: space-between;
            padding: 18px 12px;
            border-bottom: 1px solid rgb(226, 232, 246);
            .full-item {
                display:flex;
                column-gap: 8px;
                width: 100%;
                align-items:center;
            }
            .item-left {
                display:flex;
                column-gap: 8px;
                width: 62%;
                align-items:center;
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
                .name {
                    width:46px;
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
    .map {
      padding: 36px 0px;
      display: flex;
      column-gap: 30px;
      justify-content: center;
      .map-item {
        max-width: 250px;
        border-radius: 4px;
        box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.12);
        padding: 14px;
        .img {
          width: 218px;
          height: 140px;
        }
        .map-title {
          margin: 26px 0px 6px 0px;
          width: 100%;
          color: rgb(40, 40, 40);

      font-size: 16px;
      font-weight: 400;
          display: flex;
          justify-content: center;
        }
      }
    }
  .month {
    padding: 20px;
    padding-bottom: 32px;
    .month-list {
      display: flex !important;
      column-gap:14px;
      .month-item {
        width: calc((100% - (14px * 2)) / 3);
        border-radius: 4px;
        background: rgb(241, 247, 254);
        height: 300px;
        padding: 16px;
        .img {
          width: 194px;
          height: 145px;
        }
        .text {
          margin-top:16px;
          color: rgb(40, 40, 40);
          font-size: 14px;
          font-weight: 400;
          display: -webkit-box;
              overflow: hidden; /* 隐藏溢出的内容 */
              -webkit-line-clamp: 5;
              -webkit-box-orient: vertical;
        }
      }

    }
  }
  .salon {
    padding: 20px;
    padding-bottom: 32px;
    .salon-list {
      display: flex !important;
      column-gap:14px;
      .salon-item {
        width: calc((100% - (14px * 2)) / 3);
        border-radius: 4px;
        background: rgb(241, 247, 254);
        height: 300px;
        padding: 16px;
        .img {
          width: 194px;
          height: 145px;
        }
        .text {
          margin-top:16px;
          color: rgb(40, 40, 40);
          font-size: 14px;
          font-weight: 400;
          display: -webkit-box;
              overflow: hidden; /* 隐藏溢出的内容 */
              -webkit-line-clamp: 5;
              -webkit-box-orient: vertical;
        }
      }

    }
  }
  .hornor {
    padding: 16px;
    padding-bottom: 32px;
    .hornor-list {
      display: flex !important;
      column-gap:14px;
      .hornor-item {
        width: calc((100% - (14px * 2)) / 3);
        height: 300px;
        padding: 16px 24px;
        padding-bottom: 10px;
        .img {
          width: 180px;
          height: 222px;
        }
        .text {
          text-align: center;
          margin-top:16px;
          color: rgb(40, 40, 40);
          font-size: 14px;
          font-weight: 400;

        }
      }

    }
  }

  .expert {
    padding: 16px 22px;
    width: 100%;
    padding-bottom: 32px;
    .expert-list {
      background-image: url('~/assets/images/home/expert-bg.png');
      height: 300px;
      display: flex !important;
      flex-wrap: wrap;
      column-gap:14px;
      padding: 26px 16px;
      row-gap: 14px;
     .expert-item {
      width: calc((100% - (14px * 2)) / 3);
      display: flex;
      border: 1px solid rgb(255, 255, 255);
      border-radius: 8px;
      box-shadow: 0px 4px 24px 0px rgba(0, 159, 255, 0.12);
      background: rgba(255, 255, 255, 0.6);
      padding: 16px;
      column-gap:20px;
       .img {
         width: 70px;
         height: 70px;
         border-radius: 70px;
         object-fit: cover;
       }
       .name {
        color: rgb(40, 40, 40);
        font-size: 18px;
        font-weight: 400;
       }
       .info {
        color: rgb(89, 89, 89);
        font-size: 14px;
        font-weight: 400;
        margin-top: 4px;
       }
     }
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

</style>
