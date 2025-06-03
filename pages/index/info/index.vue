<template>
  <div class="info-container">
    <div class="info-menu">
      <div v-for="(item,index) of menuList" :key="index" class="menu-item" :class="activeIndex === index ? 'active-menu':''" @click="e => handleClick(item,index)">
        <img :src="item.icon">
        <div>
          {{ item.label }}
        </div>
      </div>
    </div>
    <div class="info-content">
      <Info v-if="activeIndex === 0" />
      <Expert v-if="activeIndex === 1" />
      <Honor v-if="activeIndex === 2" />
      <Team v-if="activeIndex === 3" />
      <Talent v-if="activeIndex === 4" />
    </div>
  </div>
</template>
<script lang="js" name="InfoPage">
import Info from './components/info.vue'
import Expert from './components/expert.vue'
import Honor from './components/honor.vue'
import Team from './components/team.vue'
import Talent from './components/talent.vue'
const honorImg = require('@/assets/images/info/honor.png')
const expertImg = require('@/assets/images/info/expert.png')
const teamImg = require('@/assets/images/info/team.png')
const demandImg = require('@/assets/images/info/demand.png')
const talentImg = require('@/assets/images/info/talent.png')

const menuList = [{
  label: '活动新闻',
  path: '/info?type=news',
  icon: honorImg,
  id: 'news'
}, {
  label: '专家墙',
  path: '/info?type=expert',
  icon: expertImg,
  id: 'expert'
}, {
  label: '荣誉墙',
  path: '/info?type=honor',
  icon: demandImg,
  id: 'honor'

}, {
  label: '优秀团队',
  path: '/info?type=team',
  icon: teamImg,
  id: 'team'

}, {
  label: '贡献达人',
  path: '/info?type=talent',
  icon: talentImg,
  id: 'talent'
}]
export default {
  name: 'InfoPage',
  components: {
    Info,
    Expert,
    Honor,
    Team,
    Talent
  },
  data () {
    const activeIndex = 0
    const infoList = []
    return {
      menuList,
      activeIndex,
      infoList
    }
  },
  watch: {
    '$route' (to) {
      console.log(to, 'to')
      const { type } = to.query
      if (this.menuList.length > 0) {
        this.activeIndex = this.menuList.findIndex(item => item.id === type)
        console.log(this.activeIndex, 'coming')
      }
    }
  },
  mounted () {
    if (this.menuList.length > 0) {
      this.activeIndex = this.menuList.findIndex(item => item.id === this.$route.query.type)
      console.log(this.activeIndex, 'coming')
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
 }
</style>
