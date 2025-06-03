<template>
  <g-card class="half-card" title="贡献达人">
    <template #extra>
      <div class="card-header">
        <div class="talent-header">
          <div>
            <a-select v-model="monthValue" style="width: 120px;">
              <a-select-option v-for="(item,index) of months" :key="index" :value="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </div>
          <div class="more" @click="e => handleGoto(`/info?type=talent`)">
            更多 >
            <div />
          </div>
        </div>
      </div>
    </template>
    <template>
      <a-spin :spinning="loading">
        <div v-if="talentList.length > 0" class="talent">
          <a-carousel>
            <div v-for="(item,index) of talentList" :key="index" class="talent-list">
              <div v-for="(k,i) of item.child" :key="i" class="talent-item">
                <div>
                  <img class="img" :src="k.avatar">
                </div>
                <div class="text">
                  <div class="name" :title=" k.nickname || '-' ">
                    {{ k.nickname || '-' }}
                  </div>
                  <div class="info">
                    工号：{{ k.userCode || '-' }}
                  </div>
                  <div class="info">
                    部门：{{ k.deptName|| '-' }}
                  </div>
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
<script lang="js" name="Talent">
import dayjs from 'dayjs'
export default {
  name: 'Talent',
  data () {
    const talentList = []
    const loading = false
    const months = []
    const monthValue = dayjs().subtract(1, 'month').format('YYYY-MM')
    return {
      talentList,
      loading,
      months,
      monthValue
    }
  },
  watch: {
    monthValue (val) {
      this.fetchUserStatistics()
    }
  },
  beforeMount () {
    this.months = this.generateMonth()
    this.fetchUserStatistics()
  },
  methods: {
    generateMonth () {
      const currentMonths = []
      const now = dayjs()

      // 获取去年的同一天（例如，如果今天是 2023-03-15，我们想从 2022-03-15 开始）
      const startOfLastYear = now.subtract(1, 'year').startOf('day')

      // 循环从去年的同一天开始，到今年的同一天结束，每个月添加一次
      for (let m = 0; m < 12; m++) {
        const monthStart = startOfLastYear.add(m, 'month').startOf('month')
        currentMonths.push(monthStart.format('YYYY-MM'))
      }
      return currentMonths
    },
    handleGoto (path) {
      this.$router.push(path)
    },
    fetchUserStatistics () {
      const params = {
        pageSize: 12,
        pageNo: 1,
        filter: {
          countMonth: this.monthValue
        }
      }
      this.$api.getUserStatistics(params).then((res) => {
        if (res.length <= 6) {
          this.talentList = [{
            child: res
          }]
        } else {
          this.talentList = [{
            child: res.splice(0, 6)
          }, {
            child: res.splice(0, 6)
          }]
        }
      })
    }
  }
}
</script>
    <style scoped lang="less">
     .talent-header {
              display: flex;
              column-gap: 8px;
              align-items: center;
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
      height: 116px;
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
        width:80px;
                    white-space: nowrap; /* 防止文本换行 */
                    overflow: hidden; /* 隐藏溢出的内容 */
                    text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
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
    </style>
