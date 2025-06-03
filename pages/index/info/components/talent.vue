<template>
  <div>
    <div class="talent-header">
      <a-input placeholder="请输入关键字进行搜索" style="width: 320px" />
    </div>
    <div class="talent-list">
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
  </div>
</template>
<script lang="js" name="TeamContent">
export default {
  name: 'TeamContent',
  components: {},
  data () {
    const talentList = []
    return {
      talentList
    }
  },
  mounted () {
    this.fetchUserStatistics()
  },
  methods: {
    fetchUserStatistics () {
      const params = {
        pageSize: 12,
        pageNo: 1,
        filter: {
          countMonth: '2025-05'
        }
      }
      this.$api.getUserStatistics(params).then((res) => {
        console.log(res, 'getuser')
        this.talentList = res
      })
    }
  }
}
</script>
<style lang="less" scoped>
     .talent-header {
          margin-bottom: 10px;
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
</style>
