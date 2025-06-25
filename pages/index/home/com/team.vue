<template>
  <g-card class="full-card" title="优秀团队" :go-to="(e) => handleGoto(`/info?type=team`)">
    <template>
      <a-spin :spinning="loading">
        <div v-if="teamList.length > 0" class="team team-bg">
          <marquee :items="teamList" @active-item-click="(item) => handleGoto(`/info/${item.id}?type=team`)">
            <template v-slot:default="{ item }">
              <div class="team-item">
                <img :src="item.imageUrl">
                <div class="team-content">
                  <div class="team-project">
                    {{ item.honorsOwner }}
                  </div>
                  <div class="team-text" :title="item.summary">
                    {{ item.summary }}
                  </div>
                </div>
              </div>
            </template>
          </marquee>
        </div>
        <div v-else class="team team-empty">
          <a-empty />
        </div>
      </a-spin>
    </template>
  </g-card>
</template>
<script lang="js" name="Team">
import Marquee from '@/components/Marquee.vue'

export default {
  name: 'Team',
  components: {
    Marquee
  },
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
  margin: 0 auto 38px;
  height: 535px;
  padding: 0 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  .team-item {
    width: 20vw; /* Fluid width */
    max-width: 380px; /* Upper bound for large screens */
    min-width: 180px; /* Lower bound for mobile screens */
    height: 420px;
    border: 1px solid rgb(206, 223, 244);
    border-radius: 4px;
    box-shadow: 0px 4px 32px 0px rgba(87, 130, 183, 0.2);
    background: rgb(255, 255, 255);
    padding: 20px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    img {
      width: 100%;
      height: 280px;
      object-fit: cover;
      flex-shrink: 0;
    }
    .team-content {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .team-project {
      color: rgb(40, 40, 40);
      font-size: 18px;
      font-weight: 400;
      margin: 12px 0;
      flex-shrink: 0;
    }
    .team-text {
      color: rgb(40, 40, 40);
      font-size: 14px;
      font-weight: 400;
      display: -webkit-box;
      overflow: hidden; /* 隐藏溢出的内容 */
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}

@media (max-width: 1600px) {
  .team {
    padding: 0 8%;
  }
  .team-item {
    height: 400px;
  }
  .team-item img {
    height: 260px;
  }
}

@media (max-width: 1440px) {
  .team {
    padding: 0 5%;
  }
  .team-item {
    height: 360px;
  }
  .team-item img {
    height: 230px;
  }
}

@media (max-width: 1200px) {
  .team {
    padding: 0 2%;
    height: 480px;
  }
  .team-item {
    height: 340px;
  }
  .team-item img {
    height: 210px;
  }
}

@media (max-width: 992px) {
  .team-item {
    height: 300px;
  }
  .team-item img {
    height: 170px;
  }
  .team-project {
    font-size: 16px;
  }
  .team-text {
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .team {
    height: 420px;
  }
  .team-item {
    height: 280px;
  }
  .team-item img {
    height: 150px;
  }
  .team-project {
    font-size: 14px;
    margin: 8px 0;
  }
  .team-text {
    font-size: 12px;
  }
}
.team-bg {
  background-image: url('@/assets/images/home/team-bg.png');
}
.team-empty {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
