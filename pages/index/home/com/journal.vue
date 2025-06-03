<template>
  <g-card class="half-card" title="月刊">
    <template>
      <a-spin :spinning="loading">
        <div v-if="journalList.length > 0" class="journal">
          <a-carousel>
            <div class="journal-list">
              <div v-for="(item,index) of journalList" :key="index" class="journal-item">
                <div>
                  <img class="img" :src="item.icon">
                </div>
                <div class="text">
                  {{ item.text }}
                </div>
              </div>
            </div>
            <div class="journal-list">
              <div v-for="(item,index) of journalList" :key="index" class="journal-item">
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
        <div v-else>
          <a-empty />
        </div>
      </a-spin>
    </template>
  </g-card>
</template>
<script lang="js" name="Journal">
const month1Img = require('@/assets/images/home/month1.png')
const month2Img = require('@/assets/images/home/month2.png')
const month3Img = require('@/assets/images/home/month3.png')

export default {
  name: 'Journal',
  data () {
    const journalList = [
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
    const loading = false
    return {
      journalList,
      loading
    }
  },
  beforeMount () {
    this.fetchjournalList()
  },
  methods: {
    handleGoto (path) {
      this.$router.push(path)
    },
    fetchjournalList () {
    //   this.loading = true
    //   this.$api.getjournalList().then((res) => {
    //     console.log(res, 'res')
    //     if (res?.nodeList.length > 0)
    //       this.journalList = res.nodeList
    //   }).finally(() => {
    //     this.loading = false
    //   })
    }
  }
}
</script>
  <style scoped lang="less">
 .journal {
    padding: 20px;
    padding-bottom: 32px;
    .journal-list {
      display: flex !important;
      column-gap:14px;
      .journal-item {
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
  </style>
