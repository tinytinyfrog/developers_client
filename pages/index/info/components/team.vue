<template>
  <div>
    <div class="team-header">
      <a-input placeholder="请输入关键字进行搜索" style="width: 320px" />
    </div>
    <div class="team-list">
      <div v-for="(item,index) of teamList" :key="index" class="team-item">
        <img :src="item.imageUrl">
        <div class="team-project">
          {{ item.honorsOwner }}
        </div>
        <div class="team-text" :title="item.summary">
          {{ item.summary }}
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
    const teamList = []
    return {
      teamList
    }
  },
  mounted () {
    this.fetchTeamList()
  },
  methods: {
    fetchTeamList () {
      const params = {
        honorsType: '3'
      }
      this.$api.getHonorList(params).then((res) => {
        if (res) {
          this.teamList = res
        }
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
      width:100%;
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

  </style>
