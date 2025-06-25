<template>
  <g-card class="half-card" title="荣誉墙" :go-to="(e) => handleGoto(`/info?type=honor`)">
    <template>
      <a-spin :spinning="loading">
        <div v-if="pagedHonorList.length > 0" class="honor">
          <a-carousel>
            <div
              v-for="(page, index) of pagedHonorList"
              :key="index"
              class="honor-list-page"
            >
              <div
                v-for="item of page"
                :key="item.id"
                class="honor-item"
                :style="{ visibility: item.isPlaceholder ? 'hidden' : 'visible' }"
                @click="() => !item.isPlaceholder && handleGoto(`/info/${item.id}?type=team`)"
              >
                <div>
                  <img class="img" :src="item.imageUrl" :alt="item.title">
                </div>
                <div class="text">
                  {{ item.title }}
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
    return {
      pagedHonorList: [],
      loading: false
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
      this.loading = true
      this.$api.getHonorList(params).then((res) => {
        if (res && res.length > 0) {
          const chunkSize = 3
          const result = []
          for (let i = 0; i < res.length; i += chunkSize) {
            result.push(res.slice(i, i + chunkSize))
          }
          // Pad the last page with placeholders to ensure consistent spacing
          const lastPage = result[result.length - 1]
          if (lastPage && lastPage.length < chunkSize) {
            const numPlaceholders = chunkSize - lastPage.length
            for (let i = 0; i < numPlaceholders; i++) {
              lastPage.push({ id: `placeholder-${i}`, isPlaceholder: true })
            }
          }
          this.pagedHonorList = result
        } else {
          this.pagedHonorList = []
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.honor {
  padding: 16px;
  padding-bottom: 32px;

  .honor-list-page {
    display: flex !important; /* Override Ant Design Carousel styles */
    justify-content: space-around;
    align-items: center;
  }

  .honor-item {
    width: 180px;
    margin-bottom: 16px;
    box-sizing: border-box;
    cursor: pointer;

    .img {
      width: 100%;
      height: 222px;
      object-fit: fill;
    }

    .text {
      text-align: center;
      margin-top: 16px;
      color: rgb(40, 40, 40);
      font-size: 14px;
      font-weight: 400;
    }
  }
}

.honor-empty {
  height: 348px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
