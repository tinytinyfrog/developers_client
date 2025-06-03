<template>
  <a-spin :spinning="loading">
    <div>
      <div class="talent-header">
        <a-input-search v-model="inputValue" placeholder="请输入关键字进行搜索" style="width: 320px" />
        <div>
          <a-select v-model="monthValue" style="width: 120px;">
            <a-select-option v-for="(item,index) of months" :key="index" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div v-if="talentList.length > 0" class="talent-list">
        <div v-for="(k,i) of talentList" :key="i" class="talent-item">
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
      <div v-else>
        <a-empty />
      </div>
      <div class="talent-pagination">
        <a-pagination
          v-model="current"
          :page-size.sync="pageSize"
          :total="total"
          show-size-changer
          show-quick-jumper
          :show-total="(total) => `总共${total}条`"
        />
      </div>
    </div>
  </a-spin>
</template>
<script lang="js" name="TeamContent">
import dayjs from 'dayjs'
export default {
  name: 'TeamContent',
  components: {},
  data () {
    const talentList = []
    const pageSize = 10
    const current = 1
    const loading = false
    const inputValue = undefined
    const months = []
    const monthValue = dayjs().subtract(1, 'month').format('YYYY-MM')
    return {
      talentList,
      pageSize,
      current,
      loading,
      inputValue,
      months,
      monthValue
    }
  },
  watch: {
    inputValue (nVal, oVal) {
      this.fetchUserStatistics()
    },
    pageSize (nVal, oVal) {
      if (nVal !== oVal && nVal && oVal) {
        console.log(nVal, oVal)
        this.pageSize = nVal
        this.fetchUserStatistics()
      }
    },
    current (nVal, oVal) {
      if (nVal !== oVal && nVal && oVal) {
        this.current = nVal
        this.fetchUserStatistics()
      }
    },
    monthValue (val) {
      this.fetchUserStatistics()
    }
  },
  mounted () {
    this.fetchUserStatistics()
    this.months = this.generateMonth()
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
    fetchUserStatistics () {
      const params = {
        pageSize: this.pageSize,
        pageNo: this.current,
        filter: {
          countMonth: this.monthValue,
          keyword: this.inputValue
        },
        data: true
      }
      this.loading = true
      this.$api.getUserStatistics(params).then((res) => {
        console.log(res, 'getuser')
        this.talentList = res.list
        this.total = res.total
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
     .talent-header {
      display: flex;
      margin-bottom: 10px;
      width: 100%;
      justify-content: space-between;
    }
    .talent-list {
      background-image: url('~/assets/images/home/talent-bg.png');
      height: 300px;
      display: flex !important;
      flex-wrap: wrap;
      column-gap:14px;
      padding: 26px 16px;
      row-gap: 14px;
     .talent-item {
      width: calc((100% - (14px * 4)) / 5);
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
    .talent-pagination {
          margin-top:24px;
          width: 100%;
          display: flex;
          justify-content: flex-end;
      }
</style>
