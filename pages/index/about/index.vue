<template>
  <div class="page-about-detail">
    <div>
      <ByteViewer :markdown-content="article.markdownContent || article.htmlContent" />
    </div>
  </div>
</template>

<script>
import ByteViewer from '@/pages/components/byte-viewer/index.vue'
export default {
  name: 'PageAbout',
  components: {
    ByteViewer
  },
  provide () {
    return {
      article: this.article
    }
  },
  async asyncData ({ $api }) {
    let article = null
    await $api.getArticleDetail('163').then((res) => {
      article = res
    })
    return {
      article
    }
  }
}
</script>

<style lang="less">
  @import '~/pages/components/byte-markdown-editor/theme.less';
  .page-about-detail {
    border-radius: @g-radius;
    align-self: center;
    padding: 20px 20px 80px;
    background-color: #fff;
    margin-bottom: 20px;
  }
</style>
