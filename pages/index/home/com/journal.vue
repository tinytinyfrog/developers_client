<template>
  <g-card class="half-card" title="月刊" :go-to="e => handleGoto(`/info?type=journal`)">
    <template>
      <a-spin :spinning="loading">
        <div v-if="journalList.length > 0" class="journal">
          <a-carousel>
            <div v-for="(item,index) of journalList" :key="index" class="journal-list">
              <div v-for="(k,i) of item.child" :key="i" class="journal-item" @click="e => handleGoto(`/info/${k.id}?type=journal`)">
                <div>
                  <img class="img" :src="k.coverImageUrl">
                </div>
                <div class="text">
                  {{ k.summary }}
                </div>
              </div>
            </div>
            <!-- <div class="journal-list">
              <div v-for="(item,index) of journalList" :key="index" class="journal-item">
                <div>
                  <img class="img" :src="item.icon">
                </div>
                <div class="text">
                  {{ item.text }}
                </div>
              </div>
            </div> -->
          </a-carousel>
        </div>
        <div v-else class="journal journal-empty">
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
      const params = {
        pageSize: 12,
        pageNo: 1,
        filter: {
          activityType: 1
        }
      }
      this.loading = true
      this.$api.getInfoNews(params).then((res) => {
        if (res.list.length <= 3) {
          this.journalList = [{
            child: res.list
          }]
        } else {
          this.journalList = [{
            child: res.list.splice(0, 3)
          }, {
            child: res.list.splice(0, 3)
          }]
        }
      }).finally(() => {
        this.loading = false
      })
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
          width: 100%;
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
  .journal-empty {
       height: 352px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
  </style>
