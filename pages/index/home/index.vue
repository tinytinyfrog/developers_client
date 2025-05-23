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
                    <div class="expert-img">
                      <img class="img" :src="item.icon">
                      <img class="medal" src="~/assets/images/home/medal.png">
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
        <g-card class="full-card" title="优秀团队">
          <template>
            <div class="team">
              <el-carousel type="card" height="445px" style="width:840px">
                <el-carousel-item v-for="item in teamList" :key="item">
                  <div class="team-item">
                    <img :src="item.icon">
                    <div class="team-project">
                      {{ item.project }}
                    </div>
                    <div class="team-text">
                      {{ item.text }}
                    </div>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </template>
        </g-card>
      </div>
      <div class="item">
        <g-card class="half-card" title="贡献达人">
          <template>
            <div class="talent">
              <a-carousel>
                <div class="talent-list">
                  <div v-for="(item,index) of expertList" :key="index" class="talent-item">
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
                <div class="talent-list">
                  <div v-for="(item,index) of expertList" :key="index" class="talent-item">
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
        <g-card class="half-card" title="数据统计">
          <template>
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
          </template>
        </g-card>
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
const memberImg = require('@/assets/images/home/member.png')
const viewImg = require('@/assets/images/home/view.png')
const dayImg = require('@/assets/images/home/today.png')
const postImg = require('@/assets/images/home/post.png')
const devloperImg = require('@/assets/images/home/devlopment.png')
const infoImg = require('@/assets/images/home/info.png')
const wikiImg = require('@/assets/images/home/wiki.png')
const team1Img = require('@/assets/images/home/team1.png')
const team2Img = require('@/assets/images/home/team2.png')
const team3Img = require('@/assets/images/home/team3.png')
const team4Img = require('@/assets/images/home/team4.png')
const team5Img = require('@/assets/images/home/team5.png')
export default {
  name: 'PageHome',
  components: {

  },
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

    const statisticList = [
      {
        child: [
          {
            label: '成员数',
            count: '3980',
            icon: memberImg
          },
          {
            label: '总访问量',
            count: '3980',
            icon: viewImg
          },
          {
            label: '当日访问量',
            count: '3980',
            icon: dayImg
          }
        ]
      },
      {
        child: [
          {
            label: '帖子数',
            count: '2080',
            icon: postImg
          },
          {
            label: '开发平台&通用框架',
            count: '36',
            icon: devloperImg
          }

        ]
      },
      {
        child: [
          {
            label: '咨询广场',
            count: '782',
            icon: infoImg
          },
          {
            label: '知识库',
            count: '990',
            icon: wikiImg
          }

        ]
      }
    ]

    const teamList = [
      {
        project: '河北高速项目',
        text: '铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮但是开房间金额快乐健康是的克利夫兰科技开了就',
        icon: team1Img
      },
      {
        project: '湖南高速项目',
        text: '铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮但是开房间金额快乐健康是的克利夫兰科技开了就',
        icon: team2Img
      },
      {
        project: '北京联通项目',
        text: '铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮但是开房间金额快乐健康是的克利夫兰科技开了就',
        icon: team3Img
      },
      {
        project: '联通法务项目',
        text: '铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮但是开房间金额快乐健康是的克利夫兰科技开了就',
        icon: team4Img
      },
      {
        project: 'rpa',
        text: '铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮但是开房间金额快乐健康是的克利夫兰科技开了就',
        icon: team5Img
      }
    ]

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
      expertList,
      statisticList,
      teamList
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
       .expert-img {
         position: relative;
            .img {
            width: 70px;
            height: 70px;
            border-radius: 70px;
            object-fit: cover;
          }
          .medal{
            width: 60px;
            height: 30px;
            position: absolute;
            bottom: 4px;
            right: 5px;
          }

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

  .talent {
    padding: 16px 22px;
    width: 100%;
    padding-bottom: 32px;
    .talent-list {
      background-image: url('~/assets/images/home/talent-bg.png');
      height: 300px;
      display: flex !important;
      flex-wrap: wrap;
      column-gap:14px;
      padding: 26px 16px;
      row-gap: 14px;
     .talent-item {
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
  .team {
    margin: 0px 38px 38px 38px;
    height: 535px;
    background-image: url('@/assets/images/home/team-bg.png');
    display: flex;
    justify-content: center;
    align-items: center;
    .team-item {
      width:100%;
      height: 445px;
      border: 1px solid rgb(206, 223, 244);
      border-radius: 4px;
      box-shadow: 0px 4px 32px 0px rgba(87, 130, 183, 0.2);
      background: rgb(255, 255, 255);
      padding: 18px;
        img {
          width: 100%;
          height: 278px;
        }
        .team-project {
          color: rgb(40, 40, 40);
          font-size: 18px;
          font-weight: 400;
          margin: 8px 0 8px 0px;
        }
        .team-text {
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
