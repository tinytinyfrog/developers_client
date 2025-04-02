<template>
  <g-sidebar v-if="banners.length">
    <a-carousel effect="fade" autoplay>
      <div v-for="(item, index) in banners" :key="index" style="vertical-align: middle;">
        <img style="width: 100%; cursor: pointer; height: 255px" :src="item.imgUrl" @click="$utils.openNewWindow(item.actionUrl)">
      </div>
    </a-carousel>
  </g-sidebar>
</template>

<script>
export default {
  name: 'SliderBanner',
  data () {
    return {
      banners: []
    }
  },
  mounted () {
    this.getAdBanner()
  },
  methods: {
    getAdBanner () {
      this.$api.getBannerList(['SIDEBAR_CAROUSEL']).then((res) => {
        console.log(res)
        if (res.success) {
          this.banners = res.data
        }
      })
    }
  }
}
</script>
