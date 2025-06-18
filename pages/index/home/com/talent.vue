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
                <div class="name" :title="k.nickname || '-' " @click="e => handleOpen(k)">
                  {{ k.nickname || '-' }}
                </div>
                <!-- <div class="info">
                  工号：{{ k.userCode || '-' }}
                </div> -->
                <div class="info" :title="k.deptName|| '-'">
                  {{ k.deptName|| '-' }}
                </div>
                <!-- <div class="text">
                  <div class="name" :title="k.nickname || '-' " @click="e => handleOpen(k)">
                    {{ k.nickname || '-' }}
                  </div>
                  <div class="info">
                    工号：{{ k.userCode || '-' }}
                  </div>
                  <div class="info">
                    部门：{{ k.deptName|| '-' }}
                  </div>
                </div> -->
              </div>
            </div>
          </a-carousel>
        </div>
        <div v-else class="talent-empty">
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
    handleOpen (item) {
      if (!item.userId) {
        this.$message.warning('用户不存在！')
        return
      }
      this.$utils.openNewWindow(`/user/${item.userId}`)
    },
    fetchUserStatistics () {
      const params = {
        pageSize: 20,
        pageNo: 1,
        filter: {
          countMonth: this.monthValue
        }
      }
      this.$api.getUserStatistics(params).then((res) => {
        console.log(res, 'talent list')
        if (!res || res.length === 0) {
          this.talentList = []
          return
        }
        if (res.length <= 10) {
          this.talentList = [{
            child: res
          }]
        } else {
          this.talentList = [{
            child: res.splice(0, 10)
          }, {
            child: res.splice(0, 10)
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
      height: 336px !important;
      display: flex !important;
      flex-wrap: wrap;
      column-gap:14px;
      padding: 26px 16px;
      row-gap: 14px;
     .talent-item {
      width: calc((100% - (14px * 4)) / 5);
      // display: flex;
      border: 1px solid rgb(255, 255, 255);
      border-radius: 8px;
      box-shadow: 0px 4px 24px 0px rgba(0, 159, 255, 0.12);
      background: rgba(255, 255, 255, 0.6);
      padding: 12px;
      column-gap:20px;
      height: 136px;
       .img {
         width: 60px;
         height: 60px;
         border-radius: 60px;
         object-fit: cover;
       }
       .name {
        color: rgb(40, 40, 40);
        margin-top: 4px;
        font-size: 16px;
        font-weight: 400;
        width:80px;
        white-space: nowrap; /* 防止文本换行 */
        overflow: hidden; /* 隐藏溢出的内容 */
        text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
        cursor:pointer;
       }
       .info {
        color: rgb(89, 89, 89);
        font-size: 14px;
        font-weight: 400;
        margin-top: 4px;
        width:120px;
        white-space: nowrap; /* 防止文本换行 */
        overflow: hidden; /* 隐藏溢出的内容 */
        text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
        cursor:pointer;
       }
     }
    }

    ::v-deep .ant-carousel .slick-slide {
      height: 336px;
      // line-height: 160px;
      // background: #364d79 !important;
      overflow: hidden;
    }
  }
  .talent-empty {
    height:  348px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
    </style>
