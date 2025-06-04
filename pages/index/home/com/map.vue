<template>
  <g-card class="full-card" title="知识地图" hide-more>
    <a-spin :spinning="loading">
      <template>
        <div v-if="mapList.length > 0" class="map">
          <a-carousel>
            <div v-for="(item,index) of mapList" :key="index" class="map-list">
              <div
                v-for="(k,i) of item.child"
                :key="i"
                class="map-item"
                @click="e => {
                  handleGoto(`/wiki?wikiId=${k.id}`)
                }"
              >
                <img class="img" :src="k.headImg">
                <div class="map-title">
                  {{ k.name }}
                </div>
              </div>
            </div>
          </a-carousel>
        </div>
        <div v-else>
          <a-empty />
        </div>
      </template>
    </a-spin>
  </g-card>
</template>
<script lang="js" name="Map">
export default {
  name: 'Map',
  data () {
    const mapList = []
    const loading = false
    return {
      mapList,
      loading
    }
  },
  beforeMount () {
    this.fetchWikiMaps()
  },
  methods: {
    handleClick (e) {
      console.log(e, 'e')
    },
    handleGoto (path) {
      this.$router.push(path)
    },
    fetchWikiMaps () {
      const params = { pageNo: 1, pageSize: 100, filter: { categoryId: '' } }
      this.loading = true
      this.$api.getWikiMaps(params).then((res) => {
        if (Array.isArray(res)) {
          const list = []
          const count = Math.ceil(res.length / 4)
          for (let i = 0; i < count; i++) {
            list.push({ child: res.splice(0, 4) })
          }
          this.mapList = list
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style scoped lang="less">
  .map{
      padding: 36px 0px;
    .map-list{
      display: flex !important;
      column-gap: 30px;
      justify-content: center;
      .map-item {
        max-width: 250px;
        border-radius: 4px;
        box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.12);
        padding: 14px;
        .img {
          width: 218px;
          height: 140px;
        }
        .map-title {
          margin: 26px 0px 6px 0px;
          width: 100%;
          color: rgb(40, 40, 40);

      font-size: 16px;
      font-weight: 400;
          display: flex;
          justify-content: center;
        }
      }
    }
    ::v-deep .ant-carousel .slick-slide {
    height: 260px !important;
    // line-height: 160px;
    // background: #364d79 !important;
    overflow: hidden;
}

  }
</style>
