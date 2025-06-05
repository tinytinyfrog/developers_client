<template>
  <a-spin :spinning="loading">
    <div>
      <div class="team-header">
        <a-input-search v-model="inputValue" placeholder="请输入关键字进行搜索" style="width: 320px" />
      </div>
      <div v-if="teamList.length > 0" class="team-list">
        <div v-for="(item,index) of teamList" :key="index" class="team-item" @click="e =>handleGoto(`/info/${item.id}?type=team`)">
          <img :src="item.imageUrl">
          <div class="team-project">
            {{ item.honorsOwner }}
          </div>
          <div class="team-text" :title="item.summary">
            {{ item.summary }}
          </div>
        </div>
      </div>
      <div v-else>
        <a-empty />
      </div>
      <div class="team-pagination">
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
export default {
  name: 'TeamContent',
  components: {},
  data () {
    const teamList = []
    const pageSize = 10
    const current = 1
    const loading = false
    const inputValue = undefined
    return {
      teamList,
      pageSize,
      current,
      loading,
      inputValue
    }
  },
  watch: {
    inputValue (nVal, oVal) {
      this.fetchTeamList()
    },
    pageSize (nVal, oVal) {
      if (nVal !== oVal && nVal && oVal) {
        console.log(nVal, oVal)
        this.pageSize = nVal
        this.fetchTeamList()
      }
    },
    current (nVal, oVal) {
      if (nVal !== oVal && nVal && oVal) {
        this.current = nVal
        this.fetchTeamList()
      }
    }
  },
  mounted () {
    this.fetchTeamList()
  },
  methods: {
    handleGoto (path) {
      this.$router.push(path)
    },
    fetchTeamList () {
      const params = {
        pageSize: this.pageSize,
        pageNo: this.current,
        filter: {
          keyword: this.inputValue,
          honorsType: '3'
        }
      }
      this.loading = true
      this.$api.getInfoHonorList(params).then((res) => {
        if (res) {
          this.teamList = res.list
          this.total = res.total
        }
      }).finally(() => {
        this.loading = false
      })
    }

  }
}
</script>
  <style lang="less" scoped>
    .team-header {
            margin-bottom: 10px;
      }
      .team-list {
        display:flex;
        column-gap:20px;
        row-gap:20px;
      .team-item {
      cursor:pointer;
      width: calc((100% - (20px * 3)) / 4);;
      height: 445px;
      border: 1px solid rgb(206, 223, 244);
      border-radius: 4px;
      box-shadow: 0px 4px 32px 0px rgba(87, 130, 183, 0.2);
      background: rgb(255, 255, 255);
      padding: 18px;
        img {
          width: 100%;
          height: 278px;
        }
        .team-project {
          color: rgb(40, 40, 40);
          font-size: 18px;
          font-weight: 400;
          margin: 8px 0 8px 0px;
        }
        .team-text {
          color: rgb(40, 40, 40);
          font-size: 14px;
          font-weight: 400;
          display: -webkit-box;
          overflow: hidden; /* 隐藏溢出的内容 */
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
        }
      }
    }
    .team-pagination {
          margin-top:24px;
          width: 100%;
          display: flex;
          justify-content: flex-end;
      }

  </style>
