<template>
  <g-card class="half-card" title="荣誉墙" :go-to="e => handleGoto(`/info?type=honor`)">
    <template>
      <a-spin :spinning="loading">
        <div v-if="honorList.length > 0" class="honor">
          <a-carousel>
            <div v-for="(item,index) of honorList" :key="index" class="honor-list" :class="[item.child.length === 3 ? 'honor-around' : 'honor-start']">
              <div v-for="(k,i) of item.child" :key="i" class="honor-item" @click="e => handleGoto(`/info/${k.id}?type=team`)">
                <div>
                  <img class="img" :src="k.imageUrl">
                </div>
                <div class="text">
                  {{ k.title }}
                </div>
              </div>
            </div>
          </a-carousel>
        </div>
        <div v-else class="honor honor-empty">
          <a-empty />
        </div>
      </a-spin>
    </template>
  </g-card>
</template>
<script lang="js" name="Honor">
export default {
  name: 'Honor',
  data () {
    const honorList = []
    const loading = false
    return {
      honorList,
      loading
    }
  },
  beforeMount () {
    this.fetchHonorWallperList()
  },
  methods: {
    handleGoto (path) {
      this.$router.push(path)
    },
    fetchHonorWallperList () {
      const params = {
        honorsType: '2'
      }
      this.$api.getHonorList(params).then((res) => {
        if (res.length <= 3) {
          this.honorList = [{
            child: res
          }]
        } else {
          this.honorList = [{
            child: res.splice(0, 3)
          }, {
            child: res.splice(0, 3)
          }]
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
     .honor {
    padding: 16px;
    padding-bottom: 32px;
    .honor-list {
      display: flex !important;
      width: 100%;
      .honor-item {
        width: 180px;
        height: 300px;
        padding: 16px 0px;
        padding-bottom: 10px;
        cursor: pointer;
        .img {
          width: 180px;
          height: 222px;
        }
        .text {
          text-align: center;
          margin-top:16px;
          color: rgb(40, 40, 40);
          font-size: 14px;
          font-weight: 400;

        }
      }

    }
    .honor-around {
        justify-content: space-around;
       }
       .honor-start {
        justify-content: start;
       }
  }

  .honor-empty {
       height: 348px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    </style>
