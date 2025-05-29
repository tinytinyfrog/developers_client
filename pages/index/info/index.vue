<template>
  <div class="info-container">
    <div class="info-menu">
      <div v-for="(item,index) of menuList" :key="index" class="menu-item" :class="activeIndex === index ? 'active-menu':''" @click="e => handleClick(index)">
        <img :src="item.icon">
        <div>
          {{ item.label }}
        </div>
      </div>
    </div>
    <div class="info-content">
      <Info v-if="activeIndex === 0" />
    </div>
  </div>
</template>
<script lang="ts" name="InfoPage">
import Info from './components/info.vue'
const honorImg = require('@/assets/images/info/honor.png')
const expertImg = require('@/assets/images/info/expert.png')
const teamImg = require('@/assets/images/info/team.png')
const demandImg = require('@/assets/images/info/demand.png')
const talentImg = require('@/assets/images/info/talent.png')

const menuList = [{
  label: '活动新闻',
  path: '/info?type=news',
  icon: honorImg
}, {
  label: '专家墙',
  path: '/info?type=expert',
  icon: expertImg
}, {
  label: '荣誉墙',
  path: '/info?type=honor',
  icon: demandImg

}, {
  label: '优秀团队',
  path: '/info?type=team',
  icon: teamImg
}, {
  label: '贡献达人',
  path: '/info?type=talent',
  icon: talentImg
}]
export default {
  name: 'InfoPage',
  components: {
    Info
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
  methods: {
    handleClick (index) {
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
