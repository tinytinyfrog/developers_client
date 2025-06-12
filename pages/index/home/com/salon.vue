<template>
  <g-card class="half-card" title="沙龙" :go-to="e => handleGoto(`/info?type=salon`)">
    <template>
      <a-spin :spinning="loading">
        <div v-if="salonList.length > 0" class="salon">
          <a-carousel>
            <div v-for="(item,index) of salonList" :key="index" class="salon-list">
              <div v-for="(k,i) of item.child" :key="i" class="salon-item" @click="e => handleGoto(`/info/${k.id}?type=salon`)">
                <div>
                  <img class="img" :src="k.coverImageUrl">
                </div>
                <div class="text">
                  {{ k.summary }}
                </div>
              </div>
            </div>
          <!-- <div class="salon-list">
            <div v-for="(item,index) of salonList" :key="index" class="salon-item">
              <div>
                <img class="img" :src="item.icon">
              </div>
              <div class="text">
                {{ item.summary }}
              </div>
            </div>
          </div> -->
          </a-carousel>
        </div>
        <div v-else class="salon salon-empty">
          <a-empty />
        </div>
      </a-spin>
    </template>
  </g-card>
</template>
<script lang="js" name="salon">
// const salon1Img = require('@/assets/images/home/salon1.png')
// const salon2Img = require('@/assets/images/home/salon2.png')
// const salon3Img = require('@/assets/images/home/salon3.png')
export default {
  name: 'Salon',
  data () {
    const salonList = [
    //   {
    //     text: '铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮但是开房间金额快乐健康是的克利夫兰科技开了就',
    //     icon: salon1Img
    //   },
    //   {
    //     text: '铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮但是开房间金额快乐健康是的克利夫兰科技开了就',
    //     icon: salon2Img
    //   },
    //   {
    //     text: '铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮铁三角持续深耕，24年合同净额840万元，项目群利润率24%，成为行业线第二个粮但是开房间金额快乐健康是的克利夫兰科技开了就',
    //     icon: salon3Img
    //   }
    ]
    const loading = false
    return {
      salonList,
      loading
    }
  },
  beforeMount () {
    this.fetchsalonList()
  },
  methods: {
    handleGoto (path) {
      this.$router.push(path)
    },
    fetchsalonList () {
      const params = {
        pageSize: 6,
        pageNo: 1,
        filter: {
          activityType: '2'
        }
      }
      this.loading = true
      this.$api.getInfoNews(params).then((res) => {
        if (res.list.length <= 3) {
          this.salonList = [{
            child: res.list
          }]
        } else {
          this.salonList = [{
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
    .salon-empty {
       height: 352px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    </style>
