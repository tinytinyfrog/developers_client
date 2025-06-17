<template>
  <div class="info-container">
    <template v-if="activeIndex >= 0">
      <div class="info-menu">
        <div v-for="(item,index) of menuList" :key="index" class="menu-item" :class="activeIndex === index ? 'active-menu':''" @click="e => handleClick(item,index)">
          <img :src="item.icon">
          <div>
            {{ item.menuName }}
          </div>
        </div>
      </div>
      <div class="info-content">
        <Info v-if="activeIndex === 0" />
        <Expert v-if="activeIndex === 1" />
        <Honor v-if="activeIndex === 2" />
        <Team v-if="activeIndex === 3" />
        <Talent v-if="activeIndex === 4" />
        <Salon v-if="activeIndex === 5" />
        <Journal v-if="activeIndex === 6" />
      </div>
    </template>
    <div v-else class="info-empty-container">
      <a-result status="403" sub-title="对不起,你没访问权限">
        <template #extra>
          <a-button type="primary" @click="handleBackHome">
            返回首页
          </a-button>
        </template>
      </a-result>
    </div>
  </div>
</template>
<script lang="js" name="InfoPage">
import Info from './components/info.vue'
import Expert from './components/expert.vue'
import Honor from './components/honor.vue'
import Team from './components/team.vue'
import Talent from './components/talent.vue'
import Salon from './components/salon.vue'
import Journal from './components/journal.vue'
// const honorImg = require('@/assets/images/info/honor.png')
// const expertImg = require('@/assets/images/info/expert.png')
// const teamImg = require('@/assets/images/info/team.png')
// const demandImg = require('@/assets/images/info/demand.png')
// const talentImg = require('@/assets/images/info/talent.png')

// const menuList = [{
//   label: '活动新闻',
//   path: '/info?type=news',
//   icon: honorImg,
//   id: 'news'
// }, {
//   label: '专家墙',
//   path: '/info?type=expert',
//   icon: expertImg,
//   id: 'expert'
// }, {
//   label: '荣誉墙',
//   path: '/info?type=honor',
//   icon: demandImg,
//   id: 'honor'

// }, {
//   label: '优秀团队',
//   path: '/info?type=team',
//   icon: teamImg,
//   id: 'team'

// }, {
//   label: '贡献达人',
//   path: '/info?type=talent',
//   icon: talentImg,
//   id: 'talent'
// }, {
//   label: '沙龙',
//   path: '/info?type=salon',
//   icon: talentImg,
//   id: 'salon'
// }, {
//   label: '月刊',
//   path: '/info?type=journal',
//   icon: talentImg,
//   id: 'journal'
// }]
export default {
  name: 'InfoPage',
  components: {
    Info,
    Expert,
    Honor,
    Team,
    Talent,
    Salon,
    Journal
  },
  data () {
    const activeIndex = 999999
    const infoList = []
    const menuList = []
    return {
      menuList,
      activeIndex,
      infoList
    }
  },
  watch: {
    '$route' (to) {
      if (this.menuList.length > 0) {
        this.activeIndex = this.menuList.findIndex(item => item.path === to.fullPath)
        console.log(this.activeIndex, 'coming')
      }
    },
    '$store.state.menu.menuList' (menu) {
      let menuList = []
      const res = menu.filter(i => i.path === '/info')
      if (res?.length > 0 && res[0].children) {
        menuList = res[0].children
      }
      this.menuList = menuList
      if (this.menuList.length > 0) {
        this.activeIndex = this.menuList.findIndex(item => item.path === this.$route.fullPath)
      }
    }
  },
  mounted () {
    const res = this.$store.state.menu.menuList.filter(i => i.path === '/info')
    if (res?.length > 0 && res[0].children) {
      this.menuList = res[0].children
      if (this.menuList.length > 0) {
        this.activeIndex = this.menuList.findIndex(item => item.path === this.$route.fullPath)
      }
    }
  },
  methods: {
    handleClick (item, index) {
      this.$router.push(item.path)
      this.activeIndex = index
    }
  }
}
</script>
<style scoped lang="less">
 .info-container {
    width: 100%;
    height: calc( 100vh - 140px);
    display: flex;
    background: #fff;
    display: flex;
    background:#f7f8fa;
    .info-menu {
        width:265px;
        height: calc( 100vh - 140px);
        background: rgb(246, 246, 246);
        color: rgb(40, 40, 40);
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 400;
        border-right: 1px solid rgb(226, 232, 246);;
        .menu-item {
            padding: 16px 24px;
            display: flex;
            column-gap: 10px;
            cursor: pointer;
            align-items: center;
            img {
                width: 18px;
                height: 18px;
            }
        }
        .active-menu {
            background: #ffff;
            border-left:  6px solid  rgb(0, 112, 255);
        }

    }
    .info-content {
        width: 100%;
     height: calc(100vh - 140px);
     padding: 20px 28px;
     overflow: auto;
    }
    .info-empty-container{
      widows: 100%;
      margin: 0 auto;
    }
 }
</style>
