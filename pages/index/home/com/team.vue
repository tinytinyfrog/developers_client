<template>
  <g-card class="full-card" title="优秀团队" :go-to="e => handleGoto(`/info?type=team`)">
    <template>
      <a-spin :spinning="loading">
        <div v-if="teamList.length>0" class="team team-bg">
          <el-carousel type="card" height="445px" style="width:840px">
            <el-carousel-item v-for="(item,index) of teamList" :key="index">
              <div class="team-item" @click="e => handleGoto(`/info/${item.id}?type=team`)">
                <img :src="item.imageUrl">
                <div class="team-project">
                  {{ item.honorsOwner }}
                </div>
                <div class="team-text" :title="item.summary">
                  {{ item.summary }}
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div v-else class="team team-empty">
          <a-empty />
        </div>
      </a-spin>
    </template>
  </g-card>
</template>
<script lang="js" name="Team">
export default {
  name: 'Team',
  data () {
    const teamList = []
    const loading = false
    return {
      teamList,
      loading
    }
  },
  beforeMount () {
    this.fetchTeamList()
  },
  methods: {
    handleGoto (path) {
      this.$router.push(path)
    },
    fetchTeamList () {
      const params = {
        honorsType: '3'
      }
      this.loading = true
      this.$api.getHonorList(params).then((res) => {
        if (res) {
          this.teamList = res
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
  <style scoped lang="less">
   .team {
    margin: 0px 38px 38px 38px;
    height: 535px;
    display: flex;
    justify-content: center;
    align-items: center;
    .team-item {
      width:100%;
      height: 445px;
      border: 1px solid rgb(206, 223, 244);
      border-radius: 4px;
      box-shadow: 0px 4px 32px 0px rgba(87, 130, 183, 0.2);
      background: rgb(255, 255, 255);
      padding: 18px;
      cursor: pointer;
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
  .team-bg {
    background-image: url('@/assets/images/home/team-bg.png');
  }
  .team-empty {
    display:flex;
    justify-content: center;
    align-items:center;
  }
  </style>
